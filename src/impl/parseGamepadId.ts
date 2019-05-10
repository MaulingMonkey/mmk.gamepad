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
	 * A parsed [[Gamepad.id]], used for selecting browser/gamepad specific workarounds/mappings to apply.
	 */
	export interface ParsedGamepadId {
		/** Should always be defined, if only to "unknown" */
		name:    string;

		/** May be blank, otherwise this should be a USB Vendor ID hex code like "054c", probably. */
		vendor:  string;

		/** May be blank, otherwise this should be a USB Device ID hex code like "0ba0", probably. */
		product: string;

		/** Browser implementation hint */
		hint:    "blink" | "gecko" | "unknown";
	}

	/** @hidden */
	function parseGamepadId_Blink(id: string): ParsedGamepadId | undefined { // e.g. Chrome, Opera
		let mNameParen = /^(.+?)(?: \((.*)\))$/i.exec(id);
		if (!mNameParen) return undefined;

		let parsed : ParsedGamepadId = { name: mNameParen[1], vendor: "", product: "", hint: "blink" };
		let mVendorProduct = /(?:^| )Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})$/i.exec(mNameParen[2]);
		if (mVendorProduct) {
			parsed.vendor  = mVendorProduct[1];
			parsed.product = mVendorProduct[2];
		}

		return parsed;
	}

	/** @hidden */
	function parseGamepadId_Gecko(id: string): ParsedGamepadId | undefined { // e.g. Firefox
		if (id === "xinput") return { name: "xinput", vendor: "", product: "", hint: "gecko" };
		let m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
		if (m) return { name: m[3], vendor: m[1], product: m[2], hint: "gecko" };
		return undefined;
	}

	/** @hidden */
	function parseGamepadId_Unknown(id: string): ParsedGamepadId { // e.g. IE, Safari, Edge, ???
		// TODO: Scan for other 4-byte hex strings?
		return { name: id, vendor: "", product: "", hint: "unknown" };
	}

	/**
	 * Attempt to decompose a [[Gamepad.id]].  The exact layout of the [[Gamepad.id]] is hideously browser specific,
	 * non-portable, brittle, and generally badwrong to rely upon... but it's also my least bad option for identifying
	 * specific gamepads and applying gamepad/browser/OS specific workarounds and fixes for the raw
	 * `navigator.getGamepad()` results.  Some examples:
	 * 
	 * ```ts
	 * parseGamepadId(undefined) => { name: "unknown", vendor: "", product: "", hint: "unknown" }
	 * parseGamepadId(""       ) => { name: "unknown", vendor: "", product: "", hint: "unknown" }
	 * parseGamepadId("asdf"   ) => { name: "asdf",    vendor: "", product: "", hint: "unknown" }
	 * parseGamepadId("xinput" ) => { name: "xinput",  vendor: "", product: "", hint: "gecko"   }
	 * 
	 * parseGamepadId("054c-0ba0-DUALSHOCK®4 USB Wireless Adaptor") => {
	 *     name:    "DUALSHOCK®4 USB Wireless Adaptor",
	 *     vendor:  "054c",
	 *     product: "0ba0",
	 *     hint:    "gecko"
	 * }
	 * 
	 * parseGamepadId("DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)") => {
	 *     name:    "DUALSHOCK®4 USB Wireless Adaptor",
	 *     vendor:  "054c",
	 *     product: "0ba0",
	 *     hint:    "blink"
	 * }
	 * ```
	 * 
	 * If you encounter new and exciting [[Gamepad.id]] schemas, please send them my way!
	 * 
	 * See also:
	 * - [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/id) on [[Gamepad.id]]
	 * - [W3C Editor's Draft](https://w3c.github.io/gamepad/#dom-gamepad-id) on [[Gamepad.id]]
	 * 
	 * @param id The [[Gamepad.id]] to try and parse.
	 */
	export function parseGamepadId(id: string | undefined): ParsedGamepadId {
		if (!id) return parseGamepadId_Unknown("unknown");
		let parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
		return parsed;
	}

	/** @hidden */
	const parsedIdExamples : [string | undefined, ParsedGamepadId][] = [
		// Chrome / Opera
		[ "Xbox 360 Controller (XInput STANDARD GAMEPAD)",                     { name: "Xbox 360 Controller",              vendor: "",     product: "",     hint: "blink" } ], // 360, XB1
		[ "DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)",     { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "blink" } ],
		[ "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", { name: "Wireless Controller",              vendor: "054c", product: "09cc", hint: "blink" } ], // DualShock 4 connected via Micro-USB
		// Firefox
		[ "xinput",                                                            { name: "xinput",                           vendor: "",     product: "",     hint: "gecko" } ], // 360, XB1
		[ "054c-0ba0-DUALSHOCK®4 USB Wireless Adaptor",                        { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "gecko" } ],
		[ "054c-09cc-Wireless Controller",                                     { name: "Wireless Controller",              vendor: "054c", product: "09cc", hint: "gecko" } ], // DualShock 4 connected via Micro-USB
		// Not actually seen
		[ undefined,                                                           { name: "unknown",                          vendor: "",     product: "",     hint: "unknown" } ],
		[ "asdf",                                                              { name: "asdf",                             vendor: "",     product: "",     hint: "unknown" } ],
		[ "",                                                                  { name: "unknown",                          vendor: "",     product: "",     hint: "unknown" } ],
	];
	parsedIdExamples.forEach(example => {
		let parsed   = JSON.stringify(parseGamepadId(example[0]));
		let expected = JSON.stringify(example[1]);
		console.assert(parsed === expected, "Expected parsed:",parsed,"equal to expected:",expected);
	});
}
