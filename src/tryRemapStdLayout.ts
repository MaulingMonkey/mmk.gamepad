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
	var assert = console.assert;
	//var assert = (...args : any[]) => {};

	/** @hidden */
	type RemapXformType = "constant" | "01-11" | "11-01" | "axis-negative-01" | "axis-positive-01" | "hat-up-bit" | "hat-right-bit" | "hat-down-bit" | "hat-left-bit";

	/** @hidden */
	interface RemapSrc {
		src:    string; // e.g. "a0", "b0", etc.
		xform?: RemapXformType;
		param?: number; // Optional param corresponding to xform
	}

	/** @hidden */
	interface Remap {
		mapping:  GamepadMappingType;
		tested?:  string[];
		matches:  string[];
		axes:     RemapSrc[];
		buttons:  RemapSrc[];
	}

	/** @hidden */
	type RemapXform = (src: FlatPremapGamepadValue, remap: RemapSrc) => { value: number, pressed: boolean, touched: boolean };

	/** @hidden */
	function remapXformHat(condition: (i: number) => boolean): RemapXform {
		return (src, remap) => {
			let i = src ? Math.round((src.value+1)/2*7) : 8;
			let v = condition(i);
			return { value: v ? 1.0 : 0.0, pressed: v, touched: v };
		};
	}

	/** @hidden */
	const axisXforms : {[id: string]: RemapXform} = {
		"01-11": (src, remap) => {
			let value = src ? (src.value*2)-1 : 0;
			return { value, pressed: false, touched: false };
		}
	};

	/** @hidden */
	const buttonXforms : {[id: string]: RemapXform} = {
		"constant": (src, remap) => {
			let value = remap.param || 0;
			let pressed = false;
			return { value, pressed, touched: pressed };
		},
		"11-01": (src, remap) => {
			let value = src ? (src.value+1)/2 : 0;
			let pressed = !remap.param ? src.pressed : (value > remap.param);
			return { value, pressed, touched: pressed };
		},
		"axis-negative-01": (src, remap) => {
			let value = (src && src.value < 0.0) ? -src.value : 0.0;
			let pressed = value > (remap.param ? remap.param : 0.0);
			return { value, pressed, touched: pressed };
		},
		"axis-positive-01": (src, remap) => {
			let value = (src && src.value > 0.0) ? +src.value : 0.0;
			let pressed = value > (remap.param ? remap.param : 0.0);
			return { value, pressed, touched: pressed };
		},
		"hat-up-bit":    remapXformHat(i => (i === 7) || (i === 0) || (i === 1)),
		"hat-right-bit": remapXformHat(i => (1 <= i) && (i <= 3)),
		"hat-down-bit":  remapXformHat(i => (3 <= i) && (i <= 5)),
		"hat-left-bit":  remapXformHat(i => (5 <= i) && (i <= 7))
	};

	//const stdRemaps : {[vendProdHintAxesButtons: string]: Remap} = {
	/** @hidden */
	const remaps : Remap[] = [{
		mapping: "standard",
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
		mapping: "standard",
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
		mapping: "standard",
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
		mapping: "standard",
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
		mapping: "standard",
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
		mapping: "standard",
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
	},{
		mapping: "-custom",
		tested: ["Windows 10 / Chrome 74.0.3729.131"],
		matches: [
			"06a3-075c-blink-10-32", // Saitek X52 Flight Control System
		],
		axes: [
			// identity mapped
			{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a3"}, {src:"a4"}, {src:"a5"}, {src:"a6"}, {src:"a8"}, {src:"a7"}
			// dropped: axis 9 (HAT)
		],
		buttons: [
			// identity mapped
			{src:"b0"}, {src:"b1"}, {src:"b2"}, {src:"b3"}, {src:"b4"},
			{src:"b5"}, {src:"b6"}, {src:"b7"}, {src:"b8"}, {src:"b9"},
			{src:"b10"}, {src:"b11"}, {src:"b12"}, {src:"b13"}, {src:"b14"},
			{src:"b15"}, {src:"b16"}, {src:"b17"}, {src:"b18"}, {src:"b19"},
			{src:"b20"}, {src:"b21"}, {src:"b22"}, {src:"b23"}, {src:"b24"},
			{src:"b25"}, {src:"b26"}, {src:"b27"}, {src:"b28"}, {src:"b29"},
			{src:"b30"}, {src:"b31"},
			// Chrome is lacking buttons for mouse wheel
			{src:"b0", xform:"constant", param: 0},
			{src:"b0", xform:"constant", param: 0},
			// Synthetic buttons for missing dpad buttons on Chrome
			{src:"a9", xform:"hat-up-bit"},
			{src:"a9", xform:"hat-right-bit"},
			{src:"a9", xform:"hat-down-bit"},
			{src:"a9", xform:"hat-left-bit"},
		],
	},{
		mapping: "-custom",
		tested: ["Windows 10 / FireFox 66.0.5"],
		matches: [
			"06a3-075c-gecko-9-38", // Saitek X52 Flight Control System
		],
		axes: [
			// identity mapped
			{src:"a0"}, {src:"a1"}, {src:"a2"}, {src:"a3"}, {src:"a4"}, {src:"a5"}, {src:"a6"}, {src:"a8"}, {src:"a7"}
		],
		buttons: [
			// identity mapped
			{src:"b0"}, {src:"b1"}, {src:"b2"}, {src:"b3"}, {src:"b4"},
			{src:"b5"}, {src:"b6"}, {src:"b7"}, {src:"b8"}, {src:"b9"},
			{src:"b10"}, {src:"b11"}, {src:"b12"}, {src:"b13"}, {src:"b14"},
			{src:"b15"}, {src:"b16"}, {src:"b17"}, {src:"b18"}, {src:"b19"},
			{src:"b20"}, {src:"b21"}, {src:"b22"}, {src:"b23"}, {src:"b24"},
			{src:"b25"}, {src:"b26"}, {src:"b27"}, {src:"b28"}, {src:"b29"},
			{src:"b30"}, {src:"b31"}, {src:"b32"}, {src:"b33"},
			{src:"b34"}, {src:"b35"}, {src:"b36"}, {src:"b37"}, // NOTE: Last 4 buttons are meant to be the HAT, but they're nonfunctional on FireFox.
		],
	}];

	// Avoid where possible.
	/** @hidden */
	const xxxIsLinux        = /\blinux\b/i.test(navigator.userAgent);
	/** @hidden */
	const xxxIsChromeBased  = /\bChrome\/\d{2,3}\b/i.test(navigator.userAgent);
	/** @hidden */
	const xxxIsChromium     = /\bChromium\/\d{2,3}\b/i.test(navigator.userAgent);
	/** @hidden */
	const xxxIsChrome       = xxxIsChromeBased && !xxxIsChromium;

	/** @hidden */
	const liesAboutStandardMapping = xxxIsLinux && xxxIsChromeBased;

	/** @hidden */
	const remapsByKey : { [id: string]: Remap } = {};
	remaps.forEach(remap => {
		remap.matches.forEach(id => {
			console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
			remapsByKey[id] = remap;
		});
	});

	/** @hidden */
	function getRemapKey(gamepad: Gamepad): string {
		let id = parseGamepadId(gamepad.id);
		let key = id.vendor+"-"+id.product+"-"+id.hint+"-"+gamepad.axes.length+"-"+gamepad.buttons.length;
		return key;
	}

	/** @hidden */
	function findStdRemap(gamepad: Gamepad): Remap {
		let key = getRemapKey(gamepad);
		let value = remapsByKey[key];
		return value;
	}

	/** Given a [[Gamepad]] where `gamepad.mapping !== "standard"`, or a gamepad where `gamepad.mapping === "standard"`
	 * but the browser is suspected of incorrectly implementing the standard mapping, rearrange the axes and buttons of
	 * the [[Gamepad]] to properly match the `"standard"` mapping.  As for what the `"standard"` mapping is, see
	 * 
	 * See also:  (W3C Gamepad Editor's Draft)[https://w3c.github.io/gamepad/#remapping] for information about the
	 * standard gamepad mapping.
	 */
	export function tryRemapStdLayout(gamepad: Gamepad): Gamepad;
	export function tryRemapStdLayout(gamepad: Gamepad | null): Gamepad | null;
	export function tryRemapStdLayout(gamepad: Gamepad | null): Gamepad | null {
		if (!gamepad) return gamepad;
		if (!liesAboutStandardMapping && gamepad.mapping === "standard") return gamepad; // Already remapped
		if (gamepad.mapping === "-custom") return gamepad; // Already remapped

		let remapGamepad = findStdRemap(gamepad);
		if (!remapGamepad) return gamepad;

		let flatGamepad = flattenPremapGamepad(gamepad);
		let fakey : ClonedGamepad = {
			id:        gamepad.id,
			displayId: gamepad.displayId,
			index:     gamepad.index,
			timestamp: gamepad.timestamp,
			connected: gamepad.connected,
			mapping:   remapGamepad.mapping,
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
				fakey.buttons[i] = { value: 0.0, pressed: false, touched: false };
			} else if (remapButton.xform === undefined) {
				let flatButton = flatGamepad[remapButton.src];
				assert(!!flatButton);
				fakey.buttons[i] = flatButton ? flatButton : { value: 0.0, pressed: false, touched: false };
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
}
