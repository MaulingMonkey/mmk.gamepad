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
	var assert = console.assert;
	//var assert = (...args) => {};

	interface RemapSrc {
		src:    string; // e.g. "a0", "b0", etc.
		xform?: string; // "threshhold", "hat-x-y", "01_11", "11-01", etc.
		param?: number; // Optional param corresponding to xform
	}
	interface Remap {
		tested?:  string[];
		matches?: string[];
		axes:     RemapSrc[];
		buttons:  RemapSrc[];
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
		"01-11": (src, remap) => {
			let v = src ? (src.value*2)-1 : 0;
			return { value: v, pressed: false };
		}
	};
	const buttonXforms : {[id: string]: RemapXform} = {
		"11-01": (src, remap) => {
			let v = src ? (src.value+1)/2 : 0;
			return { value: v, pressed: !remap.param ? src.pressed : (v > remap.param) };
		},
		"axis-negative-01": (src, remap) => {
			let v = (src && src.value < 0.0) ? -src.value : 0.0;
			return { value: v, pressed: v > (remap.param ? remap.param : 0.0) };
		},
		"axis-positive-01": (src, remap) => {
			let v = (src && src.value > 0.0) ? +src.value : 0.0;
			return { value: v, pressed: v > (remap.param ? remap.param : 0.0) };
		},
		"hat-up-bit":    remapXformHat(i => (i === 7) || (i === 0) || (i === 1)),
		"hat-right-bit": remapXformHat(i => (1 <= i) && (i <= 3)),
		"hat-down-bit":  remapXformHat(i => (3 <= i) && (i <= 5)),
		"hat-left-bit":  remapXformHat(i => (5 <= i) && (i <= 7))
	};

	// http://www.linux-usb.org/usb.ids
	const vendorProductToName : {[vendor_product: string]: string} = {
		// Microsoft
		"045e-0202": "Xbox Controller",
		"045e-0285": "Xbox Controller S",
		"045e-0289": "Xbox Controller S",

		"045e-028e": "Xbox 360 Controller",
		"045e-028f": "Xbox 360 Wireless Controller",
		"045e-0291": "Xbox 360 Wireless Receiver for Windows",
		"045e-02a1": "Xbox 360 Wireless Receiver for Windows",

		"045e-02d1": "Xbox One Controller",
		"045e-02dd": "Xbox One Controller", // Firmware 2015
		"045e-02e3": "Xbox One Elite Controller",
		"045e-02e6": "Wireless XBox Controller Dongle",
		"045e-02ea": "Xbox One S Controller",
		"045e-02fd": "Xbox One S Controller (Bluetooth)",

		// Sony
		"054c-0268": "DualShock 3 Controller", // aka "Sixaxis" / "PlayStation 3 Controller"
		"054c-054c": "DualShock 4 Controller",
		"054c-09cc": "DualShock 4 Controller (2nd Gen)",
		"054c-0ba0": "DualShock 4 Wireless Adapter",
	};

	//const stdRemaps : {[vendProdHintAxesButtons: string]: Remap} = {
	const remaps : Remap[] = [{
		tested: ["Windows 7 / Opera 52.0.2871.99"],
		matches: [
			"054c-054c-blink-10-14", // DualShock 4
			"054c-09cc-blink-10-14", // DualShock 4 (2nd Gen)
			"054c-0ba0-blink-10-14", // DualShock 4 Wireless Adapter
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
		buttons: [
			{src:"b1"}, {src:"b2"}, {src:"b0"}, {src:"b3"}, // ABXY
			{src:"b4"}, {src:"b5"}, {src:"a3", xform:"11-01", param: 0.125}, {src:"a4", xform:"11-01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
			{src:"b8"}, {src:"b9"}, {src:"b10"}, {src:"b11"}, // Back, Start, Left Thumb, Right Thumb
			{src:"a9", xform:"hat-up-bit"}, {src:"a9", xform:"hat-down-bit"}, {src:"a9", xform:"hat-left-bit"}, {src:"a9", xform:"hat-right-bit"}, // DPad (Up Down Left Right)
			// -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
			{src:"b12"}, // Guide button
			{src:"b13"}  // Touchpad click (unavailable on FireFox)
		]
		// Note: Axis 6-8 are ignored (dead)
		// Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
	},{
		tested: ["Windows 7 / Firefox 62.0a1 (2018-05-09) - DPad busted"],
		matches: [
			"054c-054c-gecko-8-18", // DualShock 4
			"054c-09cc-gecko-8-18", // DualShock 4 (2nd Gen)
			"054c-0ba0-gecko-8-18", // DualShock 4 Wireless Adapter
			"054c-054c-gecko-6-18", // DualShock 4                   - optimistic prepatch in case 2 dead axises are ever dropped 
			"054c-09cc-gecko-6-18", // DualShock 4 (2nd Gen)         - optimistic prepatch in case 2 dead axises are ever dropped
			"054c-0ba0-gecko-6-18", // DualShock 4 Wireless Adapter  - optimistic prepatch in case 2 dead axises are ever dropped
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
		buttons: [
			{src:"b1"}, {src:"b2"}, {src:"b0"}, {src:"b3"}, // ABXY
			{src:"b4"}, {src:"b5"}, {src:"a3", xform:"11-01", param: 0.125}, {src:"a4", xform:"11-01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
			{src:"b8"}, {src:"b9"}, {src:"b10"}, {src:"b11"}, // Back, Start, Left Thumb, Right Thumb
			{src:"b14"}, {src:"b15"}, {src:"b16"}, {src:"b17"}, // DPad - note that these are dead in current FireFox builds
			// -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
			{src:"b12"}, // Guide button
			{src:"b13"}  // Touchpad click (unavailable on FireFox)
		]
		// Note: Axis 6-7 are ignored (dead)
		// Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
	},{
		tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
		matches: [
			"054c-054c-gecko-8-13", // DualShock 4 Controller
			"054c-09cc-gecko-8-13", // DualShock 4 Controller (2nd Gen)
			"054c-0ba0-gecko-8-13", // DualShock 4 Wireless Adapter
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"a3"}, {src:"a4"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
		buttons: [
			{src:"b0"}, {src:"b1"}, {src:"b3"}, {src:"b2"}, // ABXY
			{src:"b4"}, {src:"b5"}, {src:"a2", xform:"11-01", param: 0.125}, {src:"a5", xform:"11-01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
			{src:"b8"}, {src:"b9"}, {src:"b11"}, {src:"b12"}, // Back, Start, Left Thumb, Right Thumb
			{src:"a7", xform:"axis-negative-01"}, {src:"a7", xform:"axis-positive-01"}, {src:"a6", xform:"axis-negative-01"}, {src:"a6", xform:"axis-positive-01"}, // DPad (Up Down Left Right)
			// -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
			{src:"b10"}, // Guide button
			// No touchpad click - Firefox on Linux remaps the touchpad to the mouse!
		]
	},{
		tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
		matches: [
			"054c-0268-gecko-6-17", // DualShock 3 / "Sony PLAYSTATION(R)3 Controller"
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"a3"}, {src:"a4"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
		buttons: [
			{src:"b0"}, {src:"b1"}, {src:"b3"}, {src:"b2"}, // ABXY
			{src:"b4"}, {src:"b5"}, {src:"a2", xform:"11-01", param: 0.125}, {src:"a5", xform:"11-01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
			{src:"b8"}, {src:"b9"}, {src:"b11"}, {src:"b12"}, // Select, Start, Left Thumb, Right Thumb
			{src:"b13"}, {src:"b14"}, {src:"b15"}, {src:"b16"},
			// -- end of standard layout
			{src:"b10"}, // PS Logo Button
		]
	},{
		tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
		matches: [
			"045e-028e-gecko-8-11", // Microsoft X-Box 360 Pad
			"045e-02d1-gecko-8-11", // Microsoft X-Box "One" Pad
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"a3"}, {src:"a4"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
		buttons: [
			{src:"b0"}, {src:"b1"}, {src:"b2"}, {src:"b3"}, // ABXY
			{src:"b4"}, {src:"b5"}, {src:"a2", xform:"11-01", param: 0.125}, {src:"a5", xform:"11-01", param: 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
			{src:"b6"}, {src:"b7"}, {src:"b9"}, {src:"b10"}, // Back, Start, Left Thumb, Right Thumb
			{src:"a7", xform:"axis-negative-01"}, {src:"a7", xform:"axis-positive-01"}, {src:"a6", xform:"axis-negative-01"}, {src:"a6", xform:"axis-positive-01"}, // DPad (Up Down Left Right)
			// -- end of standard layout
			{src:"b8"}, // Xbox Guide Button
		]
	},{
		// Did version_number get bumped again maybe?  These are mappings for a "standard" layout
		// https://cs.chromium.org/chromium/src/device/gamepad/gamepad_standard_mappings_linux.cc?l=573-580
		tested: ["Ubuntu 18.04 LTS / Chrome 66.0.3359.139"],
		matches: [
			"054c-054c-blink-4-18", // DualShock 4 Controller
			"054c-09cc-blink-4-18", // DualShock 4 Controller (2nd Gen)
			"054c-0ba0-blink-4-18", // DualShock 4 Wireless Adapter
		],
		axes: [{src:"a0"}, {src:"a1"}, {src:"b6", xform:"01-11"}, {src:"b7", xform:"01-11"}],
		buttons: [
			{src:"b2"}, {src:"b0"}, {src:"b3"}, {src:"b1"},
			{src:"b4"}, {src:"b5"}, {src:"a2", xform:"11-01", param: 0.125}, {src:"a3", xform:"11-01", param: 0.125},
			{src:"b8"}, {src:"b9"}, {src:"b11"}, {src:"b16"},
			{src:"b12"}, {src:"b13"}, {src:"b14"}, {src:"b15"},
			// -- end of standard layout
			{src:"b10"},
		],
	}];

	// Avoid where possible.
	const xxxIsLinux        = /\blinux\b/i.test(navigator.userAgent);
	const xxxIsChromeBased  = /\bChrome\/\d{2,3}\b/i.test(navigator.userAgent);
	const xxxIsChromium     = /\bChromium\/\d{2,3}\b/i.test(navigator.userAgent);
	const xxxIsChrome       = xxxIsChromeBased && !xxxIsChromium;

	const liesAboutStandardMapping = xxxIsLinux && xxxIsChromeBased;

	const remapsByKey : { [id: string]: Remap } = {};
	remaps.forEach(remap => {
		remap.matches.forEach(id => {
			console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
			remapsByKey[id] = remap;
		});
	});

	function getRemapKey(gamepad: Gamepad): string {
		let id = parseGamepadId(gamepad.id);
		let key = id.vendor+"-"+id.product+"-"+id.hint+"-"+gamepad.axes.length+"-"+gamepad.buttons.length;
		return key;
	}

	function findStdRemap(gamepad: Gamepad): Remap {
		let key = getRemapKey(gamepad);
		let value = remapsByKey[key];
		return value;
	}

	export function tryRemapStdLayout(gamepad: Gamepad): Gamepad {
		if (!gamepad) return gamepad;
		if (!liesAboutStandardMapping && gamepad.mapping === "standard") return gamepad; // Already remapped

		let remapGamepad = findStdRemap(gamepad);
		if (!remapGamepad) {
			return undefined;
		}

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
