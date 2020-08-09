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

import { Actor, ActorDestroy, ActorInitialize, Context } from '../../framework';

/**
 * This actor starts the monitoring server.
 */
export class MonitoringActor extends Actor implements ActorDestroy, ActorInitialize {

  /**
   * Called when the actor is destroyed.
   *
   * @param selfActor This actor.
   */
  destroy(selfActor: ActorRef): void {

  }

  /**
   * Called when this actor is initialized.
   *
   * @param selfActor This actor.
   */
  initialize(selfActor: ActorRef): void {

  }

  /**
   * Runs this actor and starts the monitoring server.
   *
   * @param context The context object.
   */
  run(context: Context): void {

  }

  /**
   * Shutdowns this actor.
   *
   * @param context The context object.
   */
  shutdown(context: Context): void {

  }

}
