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

import { BaseException } from './base_exception';

/**
 * Represents a file not found exception.
 */
export class FileNotFound implements BaseException {
  name: string;
  message: string;

  /**
   * Creates an instance of FileNotFound.
   *
   * @param message The error message
   */
  constructor( message?: string ) {
    this.name = 'FileNotFound';
    this.message = message ?? 'The given file was not found';
  }

}
