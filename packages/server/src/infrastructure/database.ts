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
import { RxEmitter } from 'rxemitter';
import { Connection, createConnection } from 'typeorm';

import { Context, Events } from '../framework';
import { MyORMLogger } from './orm_logger';

/**
 * Initializes the database connection.
 */
export class DatabaseListener {

  private _conn?: Connection;

  /**
   * Creates an instance of DatabaseListener.
   */
  constructor() {
    RxEmitter.on(Events.BEFORE_START_RUNNABLES, this.initialize.bind(this));
    RxEmitter.on(Events.AFTER_SHUTDOWN_RUNNABLES, this.deinitialize.bind(this));
  }

  /**
   * Initializes the database on the event before start runnables.
   *
   * @param context The context object.
   */
  async initialize(context: Context) {
    this._conn = await createConnection({
      type: 'postgres',
      //entities: types,
      logging: 'all',
      logger: new MyORMLogger(context.Logger),
      maxQueryExecutionTime: 2000, //Log queries that took more than 2 seconds to execute
      host: context.Config.database.host,
      port: context.Config.database.port,
      username: context.Config.database.username,
      password: context.Config.database.password,
      database: context.Config.database.name,
    });
    context.set('connection', this._conn);
  }

  /**
   * Deinitializes the database connection in the event after shutdown runnables.
   */
  async deinitialize() {
    await this._conn?.close();
  }
}
