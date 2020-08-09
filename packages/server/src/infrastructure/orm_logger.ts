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

import { Logger } from 'winston';
import { Logger as ORMLogger, QueryRunner } from 'typeorm';

/**
 * My own custom implementation of typeorm logger to use the winston logging system.
 */
export class MyORMLogger implements ORMLogger {

  logger?: Logger;

  /**
   * Creates a instance of MyORMLogger
   *
   * @param logger The winston logger to use
   */
  public constructor(logger?: Logger) {
    this.logger = logger;
  }

  /**
   * Logs a typeorm message.
   *
   * @param query The sql query.
   * @param parameters Not used.
   * @param queryRunner The query runner.
   */
  logQuery(query: string, parameters?: Array<any>, queryRunner?: QueryRunner) {
    this.logger?.log({
      level: 'info',
      message: 'Executing query: ' + query,
      query: query,
      parameters: parameters,
    });
  }

  /**
   * Logs a typeorm message.
   *
   * @param error The error message.
   * @param query The sql query.
   * @param parameters Not used.
   * @param queryRunner The query runner.
   */
  logQueryError(error: string, query: string, parameters?: Array<any>, queryRunner?: QueryRunner) {
    this.logger?.log({
      level: 'error',
      message: error,
      query: query,
      parameters: parameters,
    });
  }

  /**
   * Logs a typeorm message.
   *
   * @param time The time it took to execute it
   * @param query The sql query.
   * @param parameters Not used.
   * @param queryRunner The query runner.
   */
  logQuerySlow(time: number, query: string, parameters?: Array<any>, queryRunner?: QueryRunner ) {
    this.logger?.log({
      level: 'warn',
      message: 'This query is slow!',
      time: time,
      query: query,
      parameters: parameters,
    });
  }

  /**
   * Logs a typeorm message.
   *
   * @param message The message text.
   * @param queryRunner The query runner.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner ) {
    this.logger?.log({
      level: 'error',
      message: message,
    });
  }

  /**
   * Never used.
   */
  logMigration() { }

  /**
   * Logs a typeorm message.
   *
   * @param level The level of the message.
   * @param message The message text.
   * @param queryRunner The query runner.
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner ) {
    this.logger?.log({
      level: level,
      message: message,
    });
  }
}
