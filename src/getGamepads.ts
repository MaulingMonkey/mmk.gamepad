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
	export interface GetGamepadsOptions {
		deadZone:         number;
		standardize:      boolean;
		keepNonstandard:  boolean;
		keepInactive:     boolean;
		keepNull:         boolean;
	}

	/** @hidden */
	function v<T>(value: T | undefined, fallback: T): T {
		return (value === undefined) ? fallback : value;
	}

	/** @hidden */
	function stickDeadZone (x: number, y: number, dz: number): [number, number] {
		if (dz <= 0) return [x,y];
		if (dz >= 1) return [0,0];
		var m2 = x*x + y*y;
		if (m2 <= dz*dz) return [0,0];
		var m = Math.sqrt(m2); // current magnitude
		var t = (m - dz) / (1 - dz); // target magnitude
		if (t < 0) t = 0;
		var s = t / m; // scale
		return [x * s, y * s];
	}

	/** @hidden */
	function cloneDeadZone (original: Gamepad, dz: number): Gamepad {
		const clone = cloneGamepad(original);
		if (clone.mapping === "standard") {
			var leftX = clone.axes[0];
			var leftY = clone.axes[1];
			var rightX = clone.axes[2];
			var rightY = clone.axes[3];
			var leftThumbDZ  = stickDeadZone(leftX, leftY, dz);
			var rightThumbDZ = stickDeadZone(rightX, rightY, dz);
			clone.axes[0] = leftThumbDZ[0];
			clone.axes[1] = leftThumbDZ[1];
			clone.axes[2] = rightThumbDZ[0];
			clone.axes[3] = rightThumbDZ[1];
		}
		return clone;
	}

	/** @hidden */
	function isActive (g: Gamepad): boolean {
		return g.axes.some(a => a !== 0) || g.buttons.some(b => b.pressed || b.touched);
	}

	export function getGamepads(options: GetGamepadsOptions & { keepNull: false }): Gamepad[];
	export function getGamepads(options: GetGamepadsOptions): (Gamepad | null)[];
	export function getGamepads(options: GetGamepadsOptions): (Gamepad | null)[] {
		let gamepads = getRawGamepads();
		if (!options.keepNull)        gamepads = gamepads.filter(g => g !== null);
		if (options.standardize)      gamepads = gamepads.map(g => tryRemapStdLayout(g) || g);
		if (!options.keepNonstandard) gamepads = gamepads.filter(g => g ? g.mapping === "standard" : g);
		if (options.deadZone)         gamepads = gamepads.map(g => g ? cloneDeadZone(g, options.deadZone) : g);
		if (!options.keepInactive)    gamepads = gamepads.filter(g => g ? isActive(g) : false);
		return gamepads;
	}
}
