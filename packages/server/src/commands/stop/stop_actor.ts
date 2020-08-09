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
import fs = require('fs-extra');
import { kill } from 'process';

import { Actor, Context } from '../../framework';

/**
 * This actor stops the server.
 */
export class StopActor extends Actor {

  /**
   * Runs this actor and starts the main server.
   *
   * @param context The context object.
   */
  run(context: Context): void {
    context.Logger.info(`Attempting to shutdown the server at ${context.Config.server.address}:${context.Config.server.port}`);

    //read the pid file
    let pid: string = '';
    try {
      pid = fs.readFileSync('./server.pid').toString();
    } catch (err) {
      context.Logger.log({
        level: 'error',
        message: err,
      });
      return;
    }

    const pidNum = parseInt(pid);
    if (isNaN(pidNum)) {
      context.Logger.error(`Unable to parse the pid ( ${pid} ) of the server process`);
    } else {
      context.Logger.info(`Process with pid ${pid} stopped.`);
      kill(pidNum, 'SIGTERM');
      setTimeout(() => {
        try {
          kill(pidNum, 'SIGKILL');
          fs.removeSync('./server.pid'); //Remove the pid file
        } catch (err) {
          //Process has already stopped
        }
      }, 120000);
    }
  }

  /**
   * Shutdowns this actor.
   *
   * @param context The context object.
   */
  shutdown(context: Context): void {

  }

}
