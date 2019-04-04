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
	export interface FlatPremapGamepadValue {
		value:   number;  // Very axis dependant.  Usually - but not always - 1 | 0 for buttons.
		pressed: boolean; // Always false for axises
		touched: boolean; // Always false for axises
	}

	/** @hidden */
	export type FlatPremapGamepad = {[no: string]: FlatPremapGamepadValue};

	/** @hidden */
	export function flattenPremapGamepad(gamepad: Gamepad): FlatPremapGamepad {
		let map : FlatPremapGamepad = {};

		for (let i=0; i<gamepad.axes.length; ++i) {
			let a = gamepad.axes[i];
			let id = "a"+i;
			map[id] = { value: a, pressed: false, touched: false };
		}

		for (let i=0; i<gamepad.buttons.length; ++i) {
			let b = gamepad.buttons[i];
			let id = "b"+i;
			map[id] = { value: b.value, pressed: b.pressed, touched: b.touched };
		}

		return map;
	}
}
