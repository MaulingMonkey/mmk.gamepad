﻿/* Copyright 2017 MaulingMonkey

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

namespace mmk.gamepad {
	export function cloneGamepad(original: Gamepad): Gamepad {
		let clone : Gamepad = {
			id:        original.id,
			mapping:   original.mapping,
			index:     original.index,
			timestamp: original.timestamp,
			connected: original.connected,
			axes:      new Array(original.axes   .length),
			buttons:   new Array(original.buttons.length)
		};
		for (let i=0; i<original.axes   .length; ++i) clone.axes   [i] = original.axes[i];
		for (let i=0; i<original.buttons.length; ++i) clone.buttons[i] = { pressed: original.buttons[i].pressed, value: original.buttons[i].value };
		return clone;
	}

	export function cloneGamepads(original: Gamepad[]): Gamepad[] {
		let clone : Gamepad[] = new Array(original.length);
		for (let i=0; i<original.length; ++i) clone[i] = cloneGamepad(original[i]);
		return clone;
	}
}
