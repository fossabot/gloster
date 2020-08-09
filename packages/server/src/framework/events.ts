// Copyright (C) 2020 carddamom
//
// This program is free software = you can redistribute it and/or modify
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
// along with this program.  If not, see <http =//www.gnu.org/licenses/>.
import 'reflect-metadata';

/**
 * The list of events available for listening:
 *
 * BeforeStart => Before starting the program (Nothing is passed);
 * AfterLoggingInitialized => After starting the logging system (Logger is passed);
 * BeforeParseArguments => Before parsing the arguments (The argument string is passed);
 * AfterParseArguments => After parsing the arguments (The argument object is passed);
 * BeforeParseConfiguration => Before parsing the configuration (Nothing is passed);
 * AfterParseConfiguration => After parsing the configuration (The configuration object is passed);
 * BeforeStartRunnables => Before starting the runnables (The list of runnables to start is passed);
 * AfterStartRunnables => After starting the runnables (Nothing is passed);
 * BeforeShutdownRunnables => Before shuting down the runnables (Nothing is passed);
 * AfterShutdownRunnables => After shuting down the runnables (Nothing is passed);
 * BeforeShutdownEventSystem => Before shuting down the event system (Nothing is passed);
 */
export enum Events {
  BEFORE_START = 'BeforeStart',
  AFTER_LOGGING_INITIALIZED = 'AfterLoggingInitialized',
  BEFORE_PARSE_ARGUMENTS = 'BeforeParseArguments',
  AFTER_PARSE_ARGUMENTS = 'AfterParseArguments',
  BEFORE_PARSE_CONFIGURATION = 'BeforeParseConfiguration',
  AFTER_PARSE_CONFIGURATION = 'AfterParseConfiguration',
  BEFORE_START_RUNNABLES = 'BeforeStartRunnables',
  AFTER_START_RUNNABLES = 'AfterStartRunnables',
  BEFORE_SHUTDOWN_RUNNABLES = 'BeforeShutdownRunnables',
  AFTER_SHUTDOWN_RUNNABLES = 'AfterShutdownRunnables',
  BEFORE_SHUTDOWN_EVENT_SYSTEM = 'BeforeShutdownEventSystem',
}
