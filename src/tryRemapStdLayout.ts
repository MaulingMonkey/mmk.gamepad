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
	var assert = console.assert;
	//var assert = (...args) => {};

	interface RemapSrc {
		src:    string; // e.g. "a0", "b0", etc.
		xform?: string; // "threshhold", "hat-x-y", "01_11", "11_01", etc.
		param?: number; // Optional param corresponding to xform
	}
	interface Remap {
		axes:    RemapSrc[];
		buttons: RemapSrc[];
		// TODO: Hats?
	}

	type RemapXform = (src: FlatPremapGamepadValue, remap: RemapSrc) => { value: number, pressed: boolean };

	function remapXformHat(condition: (i: number) => boolean): RemapXform {
		return (src, remap) => {
			let i = src ? Math.round((src.value+1)/2*7) : 8;
			let v = condition(i);
			return { value: v ? 1.0 : 0.0, pressed: v };
		};
	}

	const axisXforms : {[id: string]: RemapXform} = {
		// TODO
	};
	const buttonXforms : {[id: string]: RemapXform} = {
		"11_01": (src, remap) => {
			let v = src ? (src.value+1)/2 : 0;
			return { value: v, pressed: !remap.param ? src.pressed : (v > remap.param) };
		},
		"hat-up-bit":    remapXformHat(i => (i === 7) || (i === 0) || (i === 1)),
		"hat-right-bit": remapXformHat(i => (1 <= i) && (i <= 3)),
		"hat-down-bit":  remapXformHat(i => (3 <= i) && (i <= 5)),
		"hat-left-bit":  remapXformHat(i => (5 <= i) && (i <= 7))
	};



	const stdRemaps : {[vendProdHintAxesButtons: string]: Remap} = {
		// DualShock 4 Wireless Controller
		"054c-0ba0-blink-10-14": {
			axes: [{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
			buttons: [
				{src:"b1"}, {src:"b2"}, {src:"b0"}, {src:"b3"}, // ABXY
				{src:"b4"}, {src:"b5"}, {src:"a3", xform:"11_01", param: 0.125}, {src:"a4", xform:"11_01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
				{src:"b8"}, {src:"b9"}, {src:"b10"}, {src:"b11"}, // Back, Start, Left Thumb, Right Thumb
				{src:"a9", xform:"hat-up-bit"}, {src:"a9", xform:"hat-down-bit"}, {src:"a9", xform:"hat-left-bit"}, {src:"a9", xform:"hat-right-bit"}, // DPad (Up Down Left Right)
				// -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
				{src:"b12"}, // Guide button
				{src:"b13"}  // Touchpad click (unavailable on FireFox)
			]
			// Note: Axis 6-8 are ignored (dead)
			// Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
		},
		"054c-0ba0-gecko-8-18": {
			axes: [{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
			buttons: [
				{src:"b1"}, {src:"b2"}, {src:"b0"}, {src:"b3"}, // ABXY
				{src:"b4"}, {src:"b5"}, {src:"a3", xform:"11_01", param: 0.125}, {src:"a4", xform:"11_01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
				{src:"b8"}, {src:"b9"}, {src:"b10"}, {src:"b11"}, // Back, Start, Left Thumb, Right Thumb
				{src:"b14"}, {src:"b15"}, {src:"b16"}, {src:"b17"}, // DPad - note that these are dead in current FireFox builds
				// -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
				{src:"b12"}, // Guide button
				{src:"b13"}  // Touchpad click (unavailable on FireFox)
			]
			// Note: Axis 6-7 are ignored (dead)
			// Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
		}
	};



	const stdRemapRepeats : {[id: string]: string} = {
		// existant           :  repeat
		"054c-0ba0-gecko-6-18": "054c-0ba0-gecko-8-18", // DualShock 4 Wireless  ->   DualShock 4 Wireless   (in case dead axises ever ditched)
		"054c-054c-gecko-8-18": "054c-0ba0-gecko-8-18", // DualShock 4 USB       ->   DualShock 4 Wireless
		"054c-054c-gecko-6-18": "054c-0ba0-gecko-8-18", // DualShock 4 USB       ->   DualShock 4 Wireless   (in case dead axises ever ditched)
		"054c-09cc-gecko-8-18": "054c-0ba0-gecko-8-18", // DualShock 4 USB (v2?) ->   DualShock 4 Wireless
		"054c-09cc-gecko-6-18": "054c-0ba0-gecko-8-18"  // DualShock 4 USB (v2?) ->   DualShock 4 Wireless   (in case dead axises ever ditched)
	};
	Object.keys(stdRemapRepeats).forEach(newRemap => {
		let existingRemap = stdRemapRepeats[newRemap];
		console.assert(!!stdRemaps[existingRemap], "remap:", newRemap, "references nonexistant remap:", existingRemap);
		stdRemaps[newRemap] = stdRemaps[existingRemap];
	});



	function getRemapKey(gamepad: Gamepad): string {
		let id = parseGamepadId(gamepad.id);
		let key = id.vendor+"-"+id.product+"-"+id.hint+"-"+gamepad.axes.length+"-"+gamepad.buttons.length;
		return key;
	}

	function findStdRemap(gamepad: Gamepad): Remap {
		let key = getRemapKey(gamepad);
		let value = stdRemaps[key];
		return value;
	}

	export function tryRemapStdLayout(gamepad: Gamepad): Gamepad {
		if (!gamepad)                       return gamepad;
		if (gamepad.mapping === "standard") return gamepad; // Already remapped

		let remapGamepad = findStdRemap(gamepad);
		if (!remapGamepad) return undefined;

		let flatGamepad = flattenPremapGamepad(gamepad);
		let fakey : Gamepad = {
			id:        gamepad.id,
			index:     gamepad.index,
			timestamp: gamepad.timestamp,
			connected: gamepad.connected,
			mapping:   "standard",
			axes:      new Array(remapGamepad.axes.length),
			buttons:   new Array(remapGamepad.buttons.length)
		};

		for (let i=0; i<remapGamepad.axes.length; ++i) {
			let remapAxis = remapGamepad.axes[i];
			if (remapAxis === undefined) {
				fakey.axes[i] = 0.0;
			} else if (remapAxis.xform === undefined) {
				let flatAxis = flatGamepad[remapAxis.src];
				assert(!!flatAxis);
				fakey.axes[i] = flatAxis ? flatAxis.value : 0.0;
			} else { // remap
				let flatAxis = flatGamepad[remapAxis.src];
				let remapXform = axisXforms[remapAxis.xform];
				assert(!!flatAxis);
				assert(!!remapXform);
				fakey.axes[i] = remapXform(flatAxis, remapAxis).value;
			}
		}

		for (let i=0; i<remapGamepad.buttons.length; ++i) {
			let remapButton = remapGamepad.buttons[i];
			if (remapButton === undefined) {
				fakey.buttons[i] = { value: 0.0, pressed: false };
			} else if (remapButton.xform === undefined) {
				let flatButton = flatGamepad[remapButton.src];
				assert(!!flatButton);
				fakey.buttons[i] = flatButton ? flatButton : { value: 0.0, pressed: false };
			} else { // remap
				let flatButton = flatGamepad[remapButton.src];
				let remapXform = buttonXforms[remapButton.xform];
				assert(!!flatButton);
				assert(!!remapXform);
				fakey.buttons[i] = remapXform(flatButton, remapButton);
			}
		}

		return fakey;
	}

	function telemetryReportGamepad(gamepad: Gamepad) {
		if (!gamepad) return;

		if ((gamepad.mapping !== "standard") && !findStdRemap(gamepad)) {
			console.warn("No remap for gamepad:  ", getRemapKey(gamepad), "   "+gamepad.id);
			if (("Raven" in window) && Raven.isSetup()) {
				let clone = cloneGamepad(gamepad);

				let cloneNoData = {};
				Object.keys(clone).forEach(key => {
					if ("axes buttons".split(' ').indexOf(key) === -1) cloneNoData[key] = clone[key];
				});

				Raven.captureMessage("No remap for gamepad", {
					level: "warning",
					tags: {
						remapKey:  getRemapKey(gamepad),
						gamepadId: gamepad.id
					}, extra: {
						axes:      clone.axes,
						buttons:   clone.buttons.map(b => JSON.stringify(b)),
						gamepad:   cloneNoData,
						remapKey:  getRemapKey(gamepad)
					}
				});
			}
		}
	}

	if ("addEventListener" in window) addEventListener("load", function(){
		addRawConnectedListener(telemetryReportGamepad);
	});
}