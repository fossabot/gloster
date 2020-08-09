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

/**
 * This is the basic exception used by gloster.
 */
export class BaseException extends Error {

  public id?: number;

  public status?: number;

  public title?: string;

  public message: string;

  /**
   * Creates an instance of BaseError.
   *
   * @param fields The fields to set this error to.
   */
  public constructor(fields: Partial<BaseException> & { message: string; }) {
    super(fields.message);
    this.message = fields.message;
    this.title = fields.title;
    this.status = fields.status;
    this.id = fields.id;
  }
}
