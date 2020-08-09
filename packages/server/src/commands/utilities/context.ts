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

import { Output } from '@oclif/parser';
import { Connection } from 'typeorm';
import { Logger } from 'winston';

import { Configuration, Context } from '../../framework';

/**
 * The default context impleentation.
 */
export class ContextImpl extends Map<string, any> implements Context {

  /**
   * Returns the parse configuration.
   *
   * @returns The parsed configuration.
   */
  get Config(): Configuration {
    return this.get('configuration');
  }

  /**
   * Returns the parsed parameters.
   *
   * @returns The parsed parameters.
   */
  get Flags(): Output<{ [x: string]: any; }, { [name: string]: any; }> {
    return this.get('parameters');
  }

  /**
   * Returns the current logger.
   *
   * @returns The current logger.
   */
  get Logger(): Logger {
    return this.get('logger');
  }

  /**
   * Returns the current database connection.
   *
   * @returns The current database connection;
   */
  get connection(): Connection {
    return this.get('connection');
  }

}
