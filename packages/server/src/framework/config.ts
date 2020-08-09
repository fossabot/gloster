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

import { parse as tparse } from '@ltd/j-toml';
import ajv = require('ajv');
import fs = require('fs-extra');
import * as Joi from 'joi';
import { isUndefined } from 'lodash';
import { parse as yparse } from 'yaml';

import { FileNotFound, FormatNotSuported } from '../utilities/exceptions';
import {
  Configuration,
  Database,
  Discovery,
  Limits,
  Loggly,
  Mail,
  Management,
  Redis,
  Server,
  Session,
  Type,
} from './interfaces';

/**
 * Schema for the configuration file
 */
export class ConfigurationImpl implements Configuration {

  private static _schema = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'Schema for the configuration file',
    'type': 'object',
    'additionalProperties': false,
    'properties': {
      '$schema': {
        'description': 'the configuration schema always a reference to this document',
        'type': 'string',
      },
      'server': {
        'description': 'Server related properties',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'address': {
            'description': 'The address the server should listen to it must be an ip address',
            'default': '127.0.0.1',
            'type': 'string',
          },
          'port': {
            'description': 'The port the server should listen to (default is a random available port)',
            'type': 'number',
            'minimum': 0,
            'maximum': 65535,
          },
          'background': {
            'description': 'True if the server should be a daemon',
            'type': 'boolean',
            'default': true,
          },
          'logToFile': {
            'type': 'boolean',
            'description': 'Enable logging to a file',
            'default': true,
          },
          'certificate': {
            'description': 'The certificate (public key) to use by the server (activates tls)',
            'type': 'string',
          },
          'key': {
            'description': 'The private key to use by the server',
            'type': 'string',
          },
          'upload': {
            'description': 'The directory where to place uploaded files',
            'type': 'string',
            'default': './upload',
          },
          'session': {
            'description': 'Configuration related to the session',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'key': {
                'type': 'string',
                'description': 'The name of the session id in storage',
                'default': 'KSESSION',
              },
              'maxAge': {
                'type': 'integer',
                'description': 'The number of miliseconds that the session is active.',
                'default': 1800000,
              },
            },
          },
          'limits': {
            'description': 'Several server limit configurations',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'timeBetweenRequests': {
                'type': 'integer',
                'description': 'Minimum time between consecutive requests by the same browser (in miliseconds)',
                'default': 10000,
              },
              'maximumRequestSize': {
                'type': 'integer',
                'description': 'Maximum size of a request body (in bytes)',
                'default': 52428800,
              },
              'fieldNameSize': {
                'type': 'integer',
                'description': 'Max multipart field name size (in bytes)',
                'default': 100,
              },
              'fieldSize': {
                'description': 'Max multipart field value size (in bytes)',
                'type': 'integer',
                'default': 1048576,
              },
              'fileSize': {
                'description': 'The max file size (in bytes)',
                'type': 'integer',
                'default': 20971520,
              },
            },
          },
        },
        'dependencies': {
          'certificate': { 'required': ['key'] },
          'key': { 'required': ['certificate'] },
        },
      },
      'loggly': {
        'description': 'Definitions related to the loggly log server',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'enabled': {
            'type': 'boolean',
            'description': 'If the loggly logger is enabled',
            'default': false,
          },
          'subdomain': {
            'type': 'string',
            'description': 'The subdomain of your Loggly account',
          },
          'token': {
            'type': 'string',
            'description': 'The access token',
          },
          'auth': {
            'type': 'string',
            'description': 'The authentication information for your Loggly account',
          },
        },
        'dependencies': {
          'enabled': {
            'required': ['subdomain', 'token'],
          },
        },
      },
      'database': {
        'description': 'Definitions related to the database',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'type': {
            'description': 'The database type',
            'type': 'string',
            'enum': ['postgres'],
            'default': 'postgres',
          },
          'host': {
            'description': 'The database server location',
            'type': 'string',
            'default': '127.0.0.1',
          },
          'port': {
            'description': 'The database port',
            'type': 'number',
            'minimum': 1,
            'maximum': 65535,
            'default': 5432,
          },
          'username': {
            'description': 'The database username',
            'type': 'string',
            'default': 'projects',
          },
          'password': {
            'description': 'The database username password',
            'type': 'string',
            'default': 'projects123',
          },
          'name': {
            'description': 'The name of the database to use',
            'type': 'string',
            'default': 'projects',
          },
        },
      },
      'discovery': {
        'description': 'Definitions related to the registration in a consul server',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'enabled': {
            'description': 'Enable the consul registration',
            'type': 'boolean',
            'default': false,
          },
          'host': {
            'description': 'The location of the consul server',
            'type': 'string',
            'default': '127.0.0.1',
          },
          'port': {
            'description': 'The consul server port',
            'type': 'integer',
            'minimum': 1,
            'maximum': 65535,
            'default': 8500,
          },
          'secure': {
            'description': 'If a secure connection is needed',
            'type': 'boolean',
            'default': false,
          },
          'datacenter': {
            'description': 'The datacenter to use (defaults to local for agent)',
            'type': 'string',
          },
          'token': {
            'description': 'The token to use (defaults to none)',
            'type': 'string',
          },
          'ca': {
            'description': 'The certificates to use in pem format (defaults to none)',
            'type': 'array',
            'additionalItems': false,
            'items': {
              'type': 'string',
            },
          },
        },
      },
      'redis': {
        'description': 'Definitions related to the redis server used for cache',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'host': {
            'description': 'The redis server location',
            'type': 'string',
            'default': '127.0.0.1',
          },
          'port': {
            'description': 'The redis server port',
            'type': 'number',
            'minimum': 1,
            'maximum': 65535,
            'default': 6379,
          },
          'password': {
            'description': 'The redis username password',
            'type': 'string',
          },
          'certificate': {
            'description': 'The certificate (public key) to use for tls connection (activates tls)',
            'type': 'string',
          },
          'key': {
            'description': 'The private key to use by the tls connection',
            'type': 'string',
          },
        },
        'dependencies': {
          'certificate': {
            'required': ['key'],
          },
          'key': {
            'required': ['certificate'],
          },
        },
      },
      'management': {
        'description': 'Describes the management configuration used to control the server',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'address': {
            'description': 'The address the management server should listen to it must be an ip address',
            'default': '127.0.0.1',
            'type': 'string',
          },
          'port': {
            'description': 'The port the management server should listen to (default is a random available port)',
            'type': 'number',
            'minimum': 0,
            'maximum': 65535,
          },
          'username': {
            'description': 'The management server username',
            'type': 'string',
            'default': 'admin',
          },
          'password': {
            'description': 'The management server username password',
            'type': 'string',
            'default': 'admin123',
          },
        },
      },
      'mail': {
        'description': 'Information about the smtp server to use',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'address': {
            'description': 'The smtp server address',
            'default': '127.0.0.1',
            'type': 'string',
          },
          'port': {
            'description': 'The port the smtp server',
            'type': 'number',
            'minimum': 1,
            'maximum': 65535,
            'default': 654,
          },
          'username': {
            'description': 'The smtp server username',
            'type': 'string',
          },
          'password': {
            'description': 'The smtp server username password',
            'type': 'string',
          },
          'secure': {
            'description': 'If a secure connection should be made',
            'type': 'boolean',
            'default': false,
          },
          'from': {
            'description': 'The email address that we should sent emails from',
            'type': 'string',
            'default': 'admin@example.com',
            'format': 'email',
          },
        },
      },
    },
  };

  /**
   * the configuration schema always a reference to this document
   */
  schema: string | null = null;

  /**
   * Definitions related to the database
   */
  database: Database = new DatabaseImpl();

  /**
   * Definitions related to the registration in a consul server
   */
  discovery: Discovery = new DiscoveryImpl();

  /**
   * Definitions related to the loggly log server
   */
  loggly: Loggly = new LogglyImpl();

  /**
   * Information about the smtp server to use
   */
  mail: Mail = new MailImpl();

  /**
   * Describes the management configuration used to control the server
   */
  management: Management = new ManagementImpl();

  /**
   * Definitions related to the redis server used for cache
   */
  redis: Redis = new RedisImpl();

  /**
   * Server related properties
   */
  server: Server = new ServerImpl();

  /**
   * Creates an instance of Configuration.
   *
   * @param configuration Object to copy from.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(configuration?: Readonly<Partial<Configuration>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(configuration)) {
      ConfigurationImpl.validate(configuration);
      this.redis = new RedisImpl(configuration.redis);
      this.server = new ServerImpl(configuration.server);
      this.management = new ManagementImpl(configuration.management);
      this.mail = new MailImpl(configuration.mail);
      this.loggly = new LogglyImpl(configuration.loggly);
      this.discovery = new DiscoveryImpl(configuration.discovery);
      this.database = new DatabaseImpl(configuration.database);
    }
    if(fromEnvironment) {
      this.database = new DatabaseImpl(undefined, true);
      this.discovery = new DiscoveryImpl(undefined, true);
      this.loggly = new LogglyImpl(undefined, true);
      this.mail = new MailImpl(undefined, true);
      this.management = new ManagementImpl(undefined, true);
      this.redis = new RedisImpl(undefined, true);
      this.server = new ServerImpl(undefined, true);
    }
  }

  /**
   * Creates a configuration from environment variables.
   *
   * @returns The created configuration.
   */
  static fromEnvironmentVariables(): Configuration {
    return new ConfigurationImpl(undefined, true);
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Configuration>> ) {
    const schema = Joi.object().keys({
      '$schema': Joi.string(),
      server: Joi.object(),
      loggly: Joi.object(),
      database: Joi.object(),
      discovery: Joi.object(),
      redis: Joi.object(),
      management: Joi.object(),
      mail: Joi.object(),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given configuration is invalid'));
  }

  /**
   * Creates a new configuration given a filename.
   *
   * @param filename The file containing the configuration to read from.
   * @returns Configuration The generated configuration.
   * @throws FormatNotSupported If the given file is in an unknown format.
   */
  static fromFile( filename: string ): Configuration {
    if(fs.existsSync(filename)) {
      let contents = fs.readFileSync(filename, {encoding: 'utf-8'});
      let result: Configuration;
      if( filename.endsWith('yaml') || filename.endsWith('yml') ) {
        //We are reading a yaml file
        result = new ConfigurationImpl(yparse(contents) ?? {});
      } else if( filename.endsWith('json') ) {
        let validator = new ajv({
          allErrors: true,
          logger: false,
          format: 'full',
        });
        if (validator.validate(ConfigurationImpl._schema, JSON.parse(contents))) {
          //We are reading a json file
          result = new ConfigurationImpl(JSON.parse(contents));
        } else {
          throw new FormatNotSuported('There are errors in the configuration file.');
        }
      } else if( filename.endsWith('toml') ) {
        //We are reading a toml file
        result = new ConfigurationImpl(tparse(contents, 0.5, '\n', false) as any);
      } else {
        //We are reading an unsuported file
        throw new FormatNotSuported('The format of the configuration file is not supported');
      }
      return result;
    } else {
      throw new FileNotFound('The given configuration file was not found');
    }
  }
}

/**
 * Definitions related to the database
 */
export class DatabaseImpl implements Database {

  /**
   * The database server location
   */
  host: string = '127.0.0.1';

  /**
   * The name of the database to use
   */
  name: string = 'projects';

  /**
   * The database username password
   */
  password: string = 'projects123';

  /**
   * The database port
   */
  port: number = 5432;

  /**
   * The database type
   */
  type: Type = Type.Postgres;

  /**
   * The database username
   */
  username: string = 'projects';

  /**
   * Creates an instance of Database.
   *
   * @param database Object to copy from.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(database?: Readonly<Partial<Database>>, fromEnvironment: boolean = false) {
    if(!isUndefined(database)) {
      DatabaseImpl.validate(database);
      this.username = database.username ?? this.username;
      this.type = database.type ?? this.type;
      this.port = database.port ?? this.port;
      this.password = database.password ?? this.password;
      this.name = database.name ?? this.name;
      this.host = database.host ?? this.host;
    }
    if( fromEnvironment ) {
      this.host = process.env.DATABASE_HOST ?? this.host;
      this.type = Type.Postgres;
      this.port = parseInt(process.env.DATABASE_PORT ?? this.port.toString());
      this.name = process.env.DATABASE_NAME ?? this.name;
      this.password = process.env.DATABASE_PASSWORD ?? this.password;
      this.username = process.env.DATABASE_USERNAME ?? this.username;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Database>>) {
    const schema = Joi.object().keys({
      type: Joi.string().allow('postgres').default('postgres'),
      host: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port().default(5432),
      username: Joi.string().default('projects'),
      password: Joi.string().default('projects123'),
      name: Joi.string().default('projects'),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given database configuration is invalid'));
  }
}

/**
 * Definitions related to the registration in a consul server
 */
export class DiscoveryImpl implements Discovery {

  /**
   * The certificates to use in pem format (defaults to none)
   */
  ca: Array<string> = new Array<string>();

  /**
   * The datacenter to use (defaults to local for agent)
   */
  datacenter: string | null = null;

  /**
   * Enable the consul registration
   */
  enabled: boolean = false;

  /**
   * The location of the consul server
   */
  host: string = '127.0.0.1';

  /**
   * The consul server port
   */
  port: number = 8500;

  /**
   * If a secure connection is needed
   */
  secure: boolean = false;

  /**
   * The token to use (defaults to none)
   */
  token: string | null = null;

  /**
   * Creates an instance of Discovery.
   *
   * @param discovery Object to copy from.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(discovery?: Readonly<Partial<Discovery>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(discovery)) {
      DiscoveryImpl.validate(discovery);
      this.token = discovery.token ?? this.token;
      this.secure = discovery.secure ?? this.secure;
      this.port = discovery.port ?? this.port;
      this.host = discovery.host ?? this.host;
      this.enabled = discovery.enabled ?? this.enabled;
      this.datacenter = discovery.datacenter ?? this.datacenter;
      this.ca = discovery.ca ?? this.ca;
    }
    if( fromEnvironment ) {
      if (!isUndefined(process.env.DISCOVERY_CA) ) {
        this.ca = [];
        this.ca.push(process.env.DISCOVERY_CA);
      }
      this.datacenter = process.env.DISCOVERY_DATACENTER ?? this.datacenter;
      this.enabled = process.env.DISCOVERY_ENABLED === 'true';
      this.host = process.env.DISCOVERY_HOST ?? this.host;
      this.port = parseInt(process.env.DISCOVERY_PORT ?? this.port.toString());
      this.secure = process.env.DISCOVERY_SECURE === 'true';
      this.token = process.env.DISCOVERY_TOKEN ?? this.token;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Discovery>>) {
    const schema = Joi.object().keys({
      enabled: Joi.boolean().default(false),
      host: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port().default(8500),
      secure: Joi.boolean().default(false),
      datacenter: Joi.string(),
      token: Joi.string(),
      ca: Joi.array().items(Joi.string()),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given discovery configuration is invalid'));
  }
}

/**
 * Definitions related to the loggly log server
 */
export class LogglyImpl implements Loggly {

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
  enabled: boolean = false;

  /**
   * The subdomain of your Loggly account
   */
  subdomain?: string;

  /**
   * The access token
   */
  token?: string;

  /**
   * Creates an instance of Loggly.
   *
   * @param loggly Object to copy from.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(loggly?: Readonly<Partial<Loggly>>, fromEnvironment: boolean = false) {
    if(!isUndefined(loggly)) {
      LogglyImpl.validate(loggly);
      this.token = loggly.token ?? this.token;
      this.subdomain = loggly.subdomain ?? this.subdomain;
      this.enabled = loggly.enabled ?? this.enabled;
      this.username = loggly.username ?? this.username;
      this.password = loggly.password ?? this.password;
    }
    if( fromEnvironment ) {
      this.enabled = process.env.LOGGLY_ENABLED === 'true';
      this.password = process.env.LOGGLY_PASSWORD ?? this.password;
      this.subdomain = process.env.LOGGLY_SUBDOMAIN ?? this.subdomain;
      this.token = process.env.LOGGLY_TOKEN ?? this.token;
      this.username = process.env.LOGGLY_USERNAME ?? this.username;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Loggly>>) {
    const schema = Joi.object().keys({
      enabled: Joi.boolean().default(false),
      subdomain: Joi.string(),
      token: Joi.string(),
      username: Joi.string(),
      password: Joi.string(),
    }).unknown(false).and('enabled', 'subdomain', 'token').and('username', 'password');
    Joi.attempt(configuration, schema, new FormatNotSuported('The given loggly configuration is invalid'));
  }
}

/**
 * Information about the smtp server to use
 */
export class MailImpl implements Mail {

  /**
   * The smtp server address
   */
  address: string = '127.0.0.1';

  /**
   * The email address that we should sent emails from
   */
  from: string = 'admin@example.com';

  /**
   * The smtp server username password
   */
  password?: string;

  /**
   * The port the smtp server
   */
  port: number = 654;

  /**
   * If a secure connection should be made
   */
  secure: boolean = false;

  /**
   * The smtp server username
   */
  username?: string;

  /**
   * Creates an instance of Mail.
   *
   * @param mail Mail object to copy.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(mail?: Readonly<Partial<Mail>>, fromEnvironment: boolean = false) {
    if(!isUndefined(mail)) {
      MailImpl.validate(mail);
      this.username = mail.username ?? this.username;
      this.secure = mail.secure ?? this.secure;
      this.port = mail.port ?? this.port;
      this.password = mail.password ?? this.password;
      this.from = mail.from ?? this.from;
      this.address = mail.address ?? this.address;
    }
    if( fromEnvironment ) {
      this.address = process.env.MAIL_SERVER_ADDRESS ?? this.address;
      this.from = process.env.MAIL_ADDRESS ?? this.from;
      this.password = process.env.MAIL_PASSWORD ?? this.password;
      this.port = parseInt(process.env.MAIL_PORT ?? this.port.toString());
      this.secure = process.env.MAIL_SECURE === 'true';
      this.username = process.env.MAIL_USERNAME ?? this.username;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Mail>>) {
    const schema = Joi.object().keys({
      address: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port().default(654),
      username: Joi.string(),
      password: Joi.string(),
      secure: Joi.boolean().default(false),
      from: Joi.string().email().default('admin@example.com'),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given mail configuration is invalid'));
  }
}

/**
 * Describes the management configuration used to control the server
 */
export class ManagementImpl implements Management {

  /**
   * The address the management server should listen to it must be an ip address
   */
  address: string = '127.0.0.1';

  /**
   * The management server username password
   */
  password: string = 'admin123';

  /**
   * The port the management server should listen to (default is a random available port)
   */
  port: number = 0;

  /**
   * The management server username
   */
  username: string = 'admin';

  /**
   * Creates an instance of Management.
   *
   * @param management Management object to copy.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(management?: Readonly<Partial<Management>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(management)) {
      ManagementImpl.validate(management);
      this.username = management.username ?? this.username;
      this.port = management.port ?? this.port;
      this.password = management.password ?? this.password;
      this.address = management.address ?? this.address;
    }
    if( fromEnvironment ) {
      this.address = process.env.MANAGEMENT_ADDRESS ?? this.address;
      this.password = process.env.MANAGEMENT_PASSWORD ?? this.password;
      this.port = parseInt(process.env.MANAGEMENT_PORT ?? this.port.toString());
      this.username = process.env.MANAGEMENT_USERNAME ?? this.username;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Management>>) {
    const schema = Joi.object().keys({
      address: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port(),
      username: Joi.string().default('admin'),
      password: Joi.string().default('admin123'),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given management configuration is invalid'));
  }
}

/**
 * Definitions related to the redis server used for cache
 */
export class RedisImpl implements Redis {

  /**
   * The certificate (public key) to use for tls connection (activates tls)
   */
  certificate?: string;

  /**
   * The redis server location
   */
  host: string = '127.0.0.1';

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
  port: number = 6379;

  /**
   * Creates an instance of Redis.
   *
   * @param redis Copy of the redis object to use.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(redis?: Readonly<Partial<Redis>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(redis)) {
      RedisImpl.validate(redis);
      this.port = redis.port ?? this.port;
      this.certificate = redis.certificate ?? this.certificate;
      this.host = redis.host ?? this.host;
      this.key = redis.key ?? this.key;
      this.password = redis.password ?? this.password;
    }
    if( fromEnvironment ) {
      this.certificate = process.env.REDIS_CERTIFICATE ?? this.certificate;
      this.host = process.env.REDIS_HOST ?? this.host;
      this.key = process.env.REDIS_KEY ?? this.key;
      this.password = process.env.REDIS_PASSWORD ?? this.password;
      this.port = parseInt(process.env.REDIS_PORT ?? this.port.toString());
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param redis Configuration to validate
   */
  static validate(redis: Readonly<Partial<Redis>>) {
    const schema = Joi.object().keys({
      host: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port().default(6379),
      password: Joi.string(),
      certificate: Joi.string(),
      key: Joi.string(),
    }).unknown(false).and('certificate', 'key');
    Joi.attempt(redis, schema, new FormatNotSuported('The given redis configuration is invalid'));
  }
}

/**
 * Server related properties
 */
export class ServerImpl implements Server {

  /**
   * The address the server should listen to it must be an ip address
   */
  address: string = '127.0.0.1';

  /**
   * True if the server should be a daemon
   */
  background: boolean = true;

  /**
   * The certificate (public key) to use by the server (activates tls)
   */
  certificate?: string;

  /**
   * The private key to use by the server
   */
  key?: string;

  /**
   * Several server limit configurations
   */
  limits: Limits = new LimitsImpl();

  /**
   * The port the server should listen to (default is a random available port)
   */
  port: number = 0;

  /**
   * Configuration related to the session
   */
  session: Session = new SessionImpl();

  /**
   * Enable logging to a file
   */
  logToFile: boolean = false;

  /**
   * The directory where to place uploaded files
   */
  upload: string = './upload';

  /**
   * Creates an instance of Server.
   *
   * @param server The server to copy.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(server?: Readonly<Partial<Server>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(server)) {
      ServerImpl.validate(server);
      this.address = server.address ?? this.address;
      this.background = server.background ?? this.background;
      this.certificate = server.certificate ?? this.certificate;
      this.key = server.key ?? this.key;
      this.limits = new LimitsImpl(server.limits);
      this.port = server.port ?? this.port;
      this.session = new SessionImpl(server.session);
      this.upload = server.upload ?? this.upload;
      this.logToFile = server.logToFile ?? this.logToFile;
    }
    if( fromEnvironment ) {
      this.address = process.env.SERVER_ADDRESS ?? this.address;
      this.background = process.env.SERVER_BACKGROUND === 'true';
      this.certificate = process.env.SERVER_CERTIFICATE ?? this.certificate;
      this.key = process.env.SERVER_KEY ?? this.key;
      this.limits = new LimitsImpl(undefined, true);
      this.logToFile = process.env.SERVER_LOGFILE === 'true';
      this.port = parseInt(process.env.SERVER_PORT ?? this.port.toString());
      this.session = new SessionImpl(undefined, true);
      this.upload = process.env.SERVER_UPLOAD_DIR ?? this.upload;
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Server>>) {
    const schema = Joi.object().keys({
      address: Joi.string().default('127.0.0.1'),
      port: Joi.number().integer().port().default(0),
      background: Joi.boolean().default(true),
      certificate: Joi.string(),
      key: Joi.string(),
      upload: Joi.string(),
      session: Joi.object(),
      limits: Joi.object(),
      logToFile: Joi.boolean().default(true),
    }).unknown(false).and('certificate','key');
    Joi.attempt(configuration, schema, new FormatNotSuported('The given server configuration is invalid'));
  }
}

/**
 * Several server limit configurations
 */
export class LimitsImpl implements Limits {

  /**
   * Max multipart field name size (in bytes)
   */
  fieldNameSize: number = 100;

  /**
   * Max multipart field value size (in bytes)
   */
  fieldSize: number = 1048576;

  /**
   * The max file size (in bytes)
   */
  fileSize: number = 20971520;

  /**
   * Maximum size of a request body (in bytes)
   */
  maximumRequestSize: number = 52428800;

  /**
   * Minimum time between consecutive requests by the same browser (in miliseconds)
   */
  timeBetweenRequests: number = 10000;

  /**
   * Creates an instance of Limits.
   *
   * @param limits The limits object to copy.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(limits?: Readonly<Partial<Limits>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(limits)) {
      LimitsImpl.validate(limits);
      this.fieldNameSize = limits.fieldNameSize ?? this.fieldNameSize;
      this.fieldSize = limits.fieldSize ?? this.fieldSize;
      this.fileSize = limits.fileSize ?? this.fileSize;
      this.maximumRequestSize = limits.maximumRequestSize ?? this.maximumRequestSize;
      this.timeBetweenRequests = limits.timeBetweenRequests ?? this.timeBetweenRequests;
    }
    if( fromEnvironment ) {
      this.fieldNameSize = parseInt(process.env.SERVER_LIMIT_FIELD_NAME_SIZE ?? this.fieldNameSize.toString());
      this.fieldSize = parseInt(process.env.SERVER_LIMIT_FIELD_SIZE ?? this.fieldSize.toString());
      this.fileSize = parseInt(process.env.SERVER_LIMIT_FILE_SIZE ?? this.fileSize.toString());
      this.maximumRequestSize = parseInt(process.env.SERVER_LIMIT_MAXIMUM_REQUEST_SIZE ?? this.maximumRequestSize.toString());
      this.timeBetweenRequests = parseInt(process.env.SERVER_LIMIT_TIME_BETWEEN_REQUESTS ?? this.timeBetweenRequests.toString());
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Limits>>) {
    const schema = Joi.object().keys({
      timeBetweenRequests: Joi.number().integer().greater(-1).default(10000),
      maximumRequestSize: Joi.number().integer().greater(-1).default(52428800),
      fieldNameSize: Joi.number().integer().greater(-1).default(100),
      fieldSize: Joi.number().integer().greater(-1).default(1048576),
      fileSize: Joi.number().integer().greater(-1).default(20971520),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given limits configuration is invalid'));
  }
}

/**
 * Configuration related to the session
 */
export class SessionImpl implements Session {

  /**
   * The name of the session id in storage
   */
  key: string = 'KSESSION';

  /**
   * The number of miliseconds that the session is active.
   */
  maxAge: number = 1800000;

  /**
   * Creates an instance of Session.
   *
   * @param session The session to copy.
   * @param fromEnvironment If the configuration is to be retrieved from the environment.
   */
  constructor(session?: Readonly<Partial<Session>>, fromEnvironment: boolean = false ) {
    if(!isUndefined(session)) {
      SessionImpl.validate(session);
      this.key = session.key ?? this.key;
      this.maxAge = session.maxAge ?? this.maxAge;
    }
    if( fromEnvironment ) {
      this.key = process.env.SERVER_SESSION_KEY ?? this.key;
      this.maxAge = parseInt(process.env.SERVER_SESSION_MAXAGE ?? this.maxAge.toString());
    }
  }

  /**
   * Validates the given configuration object.
   *
   * @param configuration Configuration to validate
   */
  static validate(configuration: Readonly<Partial<Session>>) {
    const schema = Joi.object().keys({
      key: Joi.string().default('KSESSION'),
      maxAge: Joi.number().integer().greater(-1).default(1800000),
    }).unknown(false);
    Joi.attempt(configuration, schema, new FormatNotSuported('The given session configuration is invalid'));
  }
}
