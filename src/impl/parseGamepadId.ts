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
	export interface ParsedGamepadId {
		name:    string; // should always be defined, if only to "unknown"
		vendor:  string; // may be blank
		product: string; // may be blank
		hint:    "blink" | "gecko" | "unknown";
	}

	//const nameHintOverrides : {[nameHint: string]: string} = {
	//	"xinput-gecko": "Xbox 360 Controller"
	//};
	//
	//const vendProdNames : {[vendProd: string]: string} = {
	//	"054c-0ba0": "DUALSHOCK®4 Controller (Wireless)",
	//	"054c-09cc": "DUALSHOCK®4 Controller (USB)",
	//	"054c-0268": "PLAYSTATION(R)3 Controller"
	//};

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

	function parseGamepadId_Gecko(id: string): ParsedGamepadId | undefined { // e.g. Firefox
		if (id === "xinput") return { name: "xinput", vendor: "", product: "", hint: "gecko" };
		let m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
		if (m) return { name: m[3], vendor: m[1], product: m[2], hint: "gecko" };
		return undefined;
	}

	function parseGamepadId_Unknown(id: string): ParsedGamepadId { // e.g. IE, Safari, Edge, ???
		// TODO: Scan for other 4-byte hex strings?
		return { name: id, vendor: "", product: "", hint: "unknown" };
	}

	export function parseGamepadId(id: string | undefined): ParsedGamepadId {
		if (!id) return parseGamepadId_Unknown("unknown");
		let parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
		return parsed;
	}

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
