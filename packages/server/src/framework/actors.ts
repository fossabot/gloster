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

import { ActorRef } from 'comedy';

import { Context } from './interfaces';

/**
 * The base actor for the actor system.
 */
export abstract class Actor {

  /**
   * Creates an instance of Actor.
   *
   * @param context The context map.
   */
  constructor(context: Context) { }

  /**
   * The main method of the actor.
   *
   * @param context The context map.
   */
  abstract run(context: Context): void;

  /**
   * The method called when shuting down the actor.
   *
   * @param context The context map.
   */
  abstract shutdown(context: Context): void;
}

/**
 * Interface that specifies that the actor wishes to listen for the initialize event from comedy.
 */
export interface ActorInitialize {
  /**
   * Called when the actor is initialized by comedy.
   *
   * @param selfActor This actor instance.
   */
  initialize(selfActor: ActorRef): void;
}

/**
 * Interface that specifies that the actor wishes to listen for the destroy event from comedy.
 */
export interface ActorDestroy {
  /**
   * Called when the actor is destroyed by comedy.
   *
   * @param selfActor This actor instance.
   */
  destroy(selfActor: ActorRef): void;
}
