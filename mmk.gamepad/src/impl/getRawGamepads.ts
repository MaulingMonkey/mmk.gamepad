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
	//var log = console.log;
	var log = (...args) => {};

	type RawGamepadCallback = (gamepad: Gamepad) => void;

	var rawConnectedCallbacks : RawGamepadCallback[] = [];
	var rawDisconnectedCallbacks : RawGamepadCallback[] = [];

	export function addRawConnectedListener   (callback: RawGamepadCallback) {
		oldPads.forEach(gp => { if (gp !== undefined) callback(gp); });
		rawConnectedCallbacks.push(callback);
	}
	export function addRawDisconnectedListener(callback: RawGamepadCallback) {
		rawDisconnectedCallbacks.push(callback);
	}

	export function getRawGamepads(): Gamepad[] {
		if ('getGamepads' in navigator) {
			let gp = navigator.getGamepads();
			let a : Gamepad[] = [];
			for (let i=0; i<gp.length; ++i) a.push(gp[i]);
			return a;
		} else {
			return [];
		}
	}

	var oldPads : Gamepad[] = [];

	if (!("addEventListener" in window)) console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
	else addEventListener("load", function(){
		poll(function(){
			let newPads = getRawGamepads();
			let n = Math.max(oldPads.length, newPads.length);
			for (let i=0; i<n; ++i) {
				let oldPad = oldPads[i];
				let newPad = newPads[i];
				oldPads[i] = newPads[i];

				if (oldPad === newPad) {
					continue;
				} else if (!oldPad && !newPad) {
					continue;
				} else if (!oldPad) {
					log("fake connectedgamepad:",newPad);
					rawConnectedCallbacks   .forEach(cb => cb(newPad));
				} else if (!newPad) {
					log("fake disconnectedgamepad:",oldPad);
					rawDisconnectedCallbacks.forEach(cb => cb(oldPad));
				} else if ((oldPad.id !== newPad.id) || (oldPad.index !== newPad.index)) { // index should always be equal...?
					log("fake disconnectedgamepad:",oldPad);
					log("fake connectedgamepad:",newPad);
					rawDisconnectedCallbacks.forEach(cb => cb(oldPad));
					rawConnectedCallbacks   .forEach(cb => cb(newPad));
				} else {
					// id === id, index === index, but instance !== instance?  Hmm.
				}
			}
		});
	});
}
