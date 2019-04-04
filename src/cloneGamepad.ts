/* Copyright 2017 MaulingMonkey

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
	/**
	 * Create a deep clone of a gamepad.
	*/
	export function cloneGamepad(original: Gamepad): ClonedGamepad;
	export function cloneGamepad(original: Gamepad | null): ClonedGamepad | null;
	export function cloneGamepad(original: Gamepad | undefined): ClonedGamepad | undefined;
	export function cloneGamepad(original: Gamepad | undefined | null): ClonedGamepad | undefined | null;
	export function cloneGamepad(original: Gamepad | undefined | null): ClonedGamepad | undefined | null {
		if (!original) return original;
		let clone : ClonedGamepad = {
			id:              original.id,
			displayId:       original.displayId,
			mapping:         original.mapping,
			index:           original.index,
			timestamp:       original.timestamp,
			connected:       original.connected,
			axes:            new Array(original.axes.length),
			buttons:         new Array(original.buttons.length),
		};
		for (let i=0; i<original.axes.length; ++i) {
			clone.axes[i] = original.axes[i];
		}
		for (let i=0; i<original.buttons.length; ++i) {
			let { pressed, value, touched } = original.buttons[i];
			touched = touched || false;
			clone.buttons[i] = { pressed, value, touched };
		}
		return clone;
	}

	/**
	 * Create a deep clone of a set of gamepads.  Also works on array-like objects, such as the "array" returned from
	 * `navigator.getGamepads()`.
	 */
	export function cloneGamepads(original: Gamepad[]): ClonedGamepad[];
	export function cloneGamepads(original: (Gamepad | null)[]): (ClonedGamepad | null)[];
	export function cloneGamepads(original: (Gamepad | undefined)[]): (ClonedGamepad | undefined)[];
	export function cloneGamepads(original: (Gamepad | undefined | null)[]): (ClonedGamepad | undefined | null)[];
	export function cloneGamepads(original: (Gamepad | undefined | null)[]): (ClonedGamepad | undefined | null)[] {
		let clone : (ClonedGamepad | undefined | null)[] = new Array(original.length);
		for (let i=0; i<original.length; ++i) clone[i] = cloneGamepad(original[i]);
		return clone;
	}
}
