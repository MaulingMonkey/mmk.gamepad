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
	/** @hidden */
	function ro<T>(value: T): Readonly<T> { return value as Readonly<T>; }

	/** @hidden */
	export function getRawGamepads (): (Gamepad | null)[] {
		if ('getGamepads' in navigator) {
			let gp = navigator.getGamepads();
			let a : (Gamepad | null)[] = [];
			for (var gamepad of gp) {
				if (!gamepad) {
					a.push(gamepad);
				}
				else {
					a.push(ro(gamepad));
				}
			}
			return a;
		} else {
			return [];
		}
	}
}
