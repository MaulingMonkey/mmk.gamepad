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
	type RemapXform<RemapType> = (src: FlatPremapGamepadValue, remap: metadata.RemapSrc<RemapType>) => { value: number, pressed: boolean, touched: boolean };

	/** @hidden */
	function remapXformHat(condition: (i: number) => boolean): RemapXform<metadata.RemapButtonType> {
		return (src, remap) => {
			let i = src ? Math.round((src.value+1)/2*7) : 8;
			let v = condition(i);
			return { value: v ? 1.0 : 0.0, pressed: v, touched: v };
		};
	}

	/** @hidden */
	const axisXforms : {[P in metadata.RemapAxisType]: RemapXform<metadata.RemapAxisType>} = {
		"01-11": (src, remap) => {
			let value = src ? (src.value*2)-1 : 0;
			return { value, pressed: false, touched: false };
		}
	};

	/** @hidden */
	const buttonXforms : {[P in metadata.RemapButtonType]: RemapXform<metadata.RemapButtonType>} = {
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

		let remapGamepad = metadata.findRemap(gamepad);
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
