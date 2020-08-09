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

/**
 * This interface represents a database migration.
 */
export interface Migration {
  /**
   * The name of the migration.
   */
  readonly name: string;

  /**
   * The type of database this migration applies to.
   */
  readonly type: Type;

  /**
   * Performs the migration.
   *
   * @param context The context object.
   * @returns Nothing if everything went right.
   */
  up(context: Context): Promise<void>;

  /**
   * Performs the downgrade.
   *
   * @param context The context object.
   * @returns Nothing if everything went right.
   */
  down(context: Context): Promise<void>;
}

/**
 * Interface that represents an error response.
 */
export interface ErrorResponse {
  version: string;
  timestamp: Date;
  status: number;
  links?: Array<string>;
  error: {
    id: number;
    title: string;
    description: string;
    stack?: string;
  },
  hash: string;
}

/**
 * The definition of the context object.
 */
export interface Context extends Map<string, any> {
  readonly Logger: Logger;

  readonly Flags: Output<{
    [x: string]: any;
  }, {
    [name: string]: any;
  }>;

  readonly Config: Configuration;

  readonly connection: Connection;
}

/**
 * Schema for the configuration file
 */
export interface Configuration {
  /**
   * the configuration schema always a reference to this document
   */
  schema: string | null;

  /**
   * Definitions related to the database
   */
  database: Database;

  /**
   * Definitions related to the registration in a consul server
   */
  discovery: Discovery;

  /**
   * Definitions related to the loggly log server
   */
  loggly: Loggly;

  /**
   * Information about the smtp server to use
   */
  mail: Mail;

  /**
   * Describes the management configuration used to control the server
   */
  management: Management;

  /**
   * Definitions related to the redis server used for cache
   */
  redis: Redis;

  /**
   * Server related properties
   */
  server: Server;
}

/**
 * Definitions related to the database
 */
export interface Database {

  /**
   * The database server location
   */
  host: string;

  /**
   * The name of the database to use
   */
  name: string;

  /**
   * The database username password
   */
  password: string;

  /**
   * The database port
   */
  port: number;

  /**
   * The database type
   */
  type: Type;

  /**
   * The database username
   */
  username: string;
}

/**
 * The database type
 */
export enum Type {
  Postgres = 'postgres',
  MariaDb = 'mariadb',
}

/**
 * Definitions related to the registration in a consul server
 */
export interface Discovery {
  /**
   * The certificates to use in pem format (defaults to none)
   */
  ca: Array<string>;

  /**
   * The datacenter to use (defaults to local for agent)
   */
  datacenter: string | null;

  /**
   * Enable the consul registration
   */
  enabled: boolean;

  /**
   * The location of the consul server
   */
  host: string;

  /**
   * The consul server port
   */
  port: number;

  /**
   * If a secure connection is needed
   */
  secure: boolean;

  /**
   * The token to use (defaults to none)
   */
  token: string | null;
}

/**
 * Definitions related to the loggly log server
 */
export interface Loggly {

  /**
   * The authentication information for your Loggly account (password)
   */
  password?: string;

  /**
   * The authentication information for your Loggly account (username)
   */
  username?: string;

  /**
   * If the loggly logger is enabled
   */
  enabled: boolean;

  /**
   * The subdomain of your Loggly account
   */
  subdomain?: string;

  /**
   * The access token
   */
  token?: string;
}

/**
 * Information about the smtp server to use
 */
export interface Mail {

  /**
   * The smtp server address
   */
  address: string;

  /**
   * The email address that we should sent emails from
   */
  from: string;

  /**
   * The smtp server username password
   */
  password?: string;

  /**
   * The port the smtp server
   */
  port: number;

  /**
   * If a secure connection should be made
   */
  secure: boolean;

  /**
   * The smtp server username
   */
  username?: string;

}

/**
 * Describes the management configuration used to control the server
 */
export interface Management {

  /**
   * The address the management server should listen to it must be an ip address
   */
  address: string;

  /**
   * The management server username password
   */
  password: string;

  /**
   * The port the management server should listen to (default is a random available port)
   */
  port: number;

  /**
   * The management server username
   */
  username: string;
}

/**
 * Definitions related to the redis server used for cache
 */
export interface Redis {

  /**
   * The certificate (public key) to use for tls connection (activates tls)
   */
  certificate?: string;

  /**
   * The redis server location
   */
  host: string;

  /**
   * The private key to use by the tls connection
   */
  key?: string;

  /**
   * The redis username password
   */
  password?: string;

  /**
   * The redis server port
   */
  port: number;
}

/**
 * Server related properties
 */
export interface Server {

  /**
   * The address the server should listen to it must be an ip address
   */
  address: string;

  /**
   * True if the server should be a daemon
   */
  background: boolean;

  /**
   * The certificate (public key) to use by the server (activates tls)
   */
  certificate?: string;

  /**
   * Enable logging to a file
   */
  logToFile: boolean;

  /**
   * The private key to use by the server
   */
  key?: string;

  /**
   * Several server limit configurations
   */
  limits: Limits;

  /**
   * The port the server should listen to (default is a random available port)
   */
  port: number;

  /**
   * Configuration related to the session
   */
  session: Session;

  /**
   * The directory where to place uploaded files
   */
  upload: string;
}

/**
 * Several server limit configurations
 */
export interface Limits {

  /**
   * Max multipart field name size (in bytes)
   */
  fieldNameSize: number;

  /**
   * Max multipart field value size (in bytes)
   */
  fieldSize: number;

  /**
   * The max file size (in bytes)
   */
  fileSize: number;

  /**
   * Maximum size of a request body (in bytes)
   */
  maximumRequestSize: number;

  /**
   * Minimum time between consecutive requests by the same browser (in miliseconds)
   */
  timeBetweenRequests: number;
}

/**
 * Configuration related to the session
 */
export interface Session {

  /**
   * The name of the session id in storage
   */
  key: string;

  /**
   * The number of miliseconds that the session is active.
   */
  maxAge: number;
}
