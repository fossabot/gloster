// Copyright (C) 2020 carddamom
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
import 'reflect-metadata';

import { Command, flags } from '@oclif/command';
import { ActorRef, createSystem } from 'comedy';
import envPaths from 'env-paths';
import fs = require('fs-extra');
import { isEmpty, isNil, isString } from 'lodash';
import path = require('path');
import { on, pid } from 'process';
import { RxEmitter } from 'rxemitter';
import sudoBlock = require('sudo-block');
import { createLogger, format, Logger, transports } from 'winston';
import { Loggly, LogglyOptions } from 'winston-loggly-bulk';

import { Configuration, ConfigurationImpl, Context, Events } from '../../framework';
import { ContextImpl } from '../utilities';
import { MonitoringActor } from './monitoring_actor';
import { ServerActor } from './server_actor';

/**
 * Command to start the server
 */
export default class Start extends Command {
  static description = 'Starts the server';

  static flags: flags.Input<any> = {
    help: flags.help({
      char: 'h',
      description: 'Shows help information',
    }),
    config: flags.string({
      char: 'c',
      description: 'The configuration file to use for the server',
    }),
    version: flags.version({
      description: 'Shows versioning information',
    }),
    verbose: flags.boolean({
      char: 'c',
      description: 'Enables verbose mode',
    }),
  };

  private _logger: Logger = createLogger({ silent: true });

  private _context: Context = new ContextImpl();

  private _configuration: Configuration = new ConfigurationImpl();

  /**
   * Executes this command
   */
  async run(): Promise<void> {
    sudoBlock();

    //Write the process pid to a file
    fs.writeFileSync('./server.pid', pid.toString());

    RxEmitter.emit(Events.BEFORE_START, this._context);

    //Parse arguments
    let params = new Array<string>(...process.argv);
    RxEmitter.emit(Events.BEFORE_PARSE_ARGUMENTS, this._context as any, params);
    const res = this.parse(Start, params);
    this._context.set('parameters', res);
    RxEmitter.emit(Events.AFTER_PARSE_ARGUMENTS, this._context as any, res);

    //Parse configuration
    RxEmitter.emit(Events.BEFORE_PARSE_CONFIGURATION, this._context);
    this._setupConfig(res);
    this._context.set('configuration', this._configuration);
    RxEmitter.emit(Events.AFTER_PARSE_CONFIGURATION, this._context as any, this._configuration);

    //Initialize logging
    this._setupLogging();
    this._context.set('logger', this._logger);
    RxEmitter.emit(Events.AFTER_LOGGING_INITIALIZED, this._context as any, this._logger);

    //Get actors to run
    let actorModules = [MonitoringActor, ServerActor];
    RxEmitter.emit(Events.BEFORE_START_RUNNABLES, this._context as any, actorModules);

    //Run actors
    let actors = createSystem({});
    let runningActors = new Array<ActorRef>();

    for (let index = 0; index < actorModules.length; index++) {
      const actor = actorModules[index];
      const act1 = await actors.rootActor().then(async root => root.createChild(actor)).then(async act => {
        await act.send('run', this._context);
        return act;
      });
      runningActors.push(act1);
    }
    RxEmitter.emit(Events.AFTER_START_RUNNABLES, this._context);

    on('SIGTERM', async () => {
      RxEmitter.emit(Events.BEFORE_SHUTDOWN_RUNNABLES, this._context);
      for (let index = 0; index < runningActors.length; index++) {
        const actor = runningActors[index];
        actor.emit('shutdown', this._context);
        await actor.destroy();
      }
      RxEmitter.emit(Events.AFTER_SHUTDOWN_RUNNABLES, this._context);
      RxEmitter.emit(Events.BEFORE_SHUTDOWN_EVENT_SYSTEM);
      RxEmitter.offAll();
    });
  }

  /**
   * Setups the logging system
   *
   * @returns the configured logger
   */
  private _setupLogging() {
    let level = 'http';
    const logger = createLogger({
      level: level,
    });
    if (this._configuration.server.logToFile) {
      logger.add(new transports.File({
        format: format.combine(format.metadata(), format.timestamp(), format.errors({ stack: true }), format.json()),
        dirname: './logs',
        eol: '\n',
        filename: 'server.log',
        maxsize: 10 * 1024 * 1024,
        zippedArchive: true,
        maxFiles: 30,
        tailable: true,
      }));
      logger.add(new transports.File({
        format: format.combine(format.metadata(), format.timestamp(), format.errors({ stack: true }), format.json()),
        dirname: './logs',
        eol: '\n',
        filename: 'errors.log',
        maxsize: 10 * 1024 * 1024,
        zippedArchive: true,
        maxFiles: 30,
        tailable: true,
        level: 'error',
      }));
    }
    if (this._configuration.loggly.enabled) {
      let logglyConfiguration = {
        token: this._configuration.loggly.token ?? '',
        subdomain: this._configuration.loggly.subdomain ?? '',
        json: true,
        handleExceptions: true,
        stripColors: true,
        tags: ['Gloster'],
      } as LogglyOptions;
      if (!isNil(this._configuration.loggly.password) && !isNil(this._configuration.loggly.username)) {
        logglyConfiguration.auth = {
          username: this._configuration.loggly.username,
          password: this._configuration.loggly.password,
        };
      }
      logger.add(new Loggly(logglyConfiguration));
    }
    logger.add(new transports.Console({
      level: 'info',
      format: format.combine(format.metadata(), format.timestamp(), format.colorize(), format.errors({ stack: true }), format.simple()),
    }));
    this._logger = logger;
  }

  /**
   * Setups the configuration file
   *
   * @param res The parsed arguments
   */
  private _setupConfig(res: { [x: string]: any; }) {
    let config: string = '';
    if (isString(res['config']) && fs.existsSync(res['config'])) {
      config = res['config'];
    } else {
      if (fs.existsSync('./config.json')) {
        config = './config.json';
      } else {
        const confPath = envPaths('gloster').config;
        if (fs.existsSync(path.resolve(confPath, 'config.json'))) {
          config = path.resolve(confPath, 'config.json');
        }
      }
    }

    let conf: Configuration = new ConfigurationImpl();
    if (!isEmpty(config)) {
      conf = ConfigurationImpl.fromFile(config);
    } else {
      conf = ConfigurationImpl.fromEnvironmentVariables();
    }

    this._configuration = conf;
  }
}
