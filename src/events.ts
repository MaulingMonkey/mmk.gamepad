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
	export namespace settings {
		/// Microsoft Edge now responds to gamepad input in a way that is *very* likely to conflict with your own
		/// gamepad handling.  For example, hitting (B) will focus... the address bar?  Home button?  Something in
		/// the browser header that isn't what you want.  By enabling this (default behavior), we mark all Edge's
		/// gamepad key events as handled, disabling the conflicting Edge behavior.
		///
		/// If you want the default  Microsoft Edge gamepad navigation behavior, disable this option. You might
		/// consider disabling this during your title screen, or alternatively making a quit option that navigates
		/// back in history, or otherwise provide some kind of mechanism to allow users to return gamepad control
		/// to it's browser navigation role.
		///
		/// In the future, disabling this may also add some navigation behavior to Chrome/Firefox to match IE11's
		/// behavior.  Or this option might go away entirely in favor of a better approach.
		export var captureGamepadEvents = true;
	}

	export interface GamepadEvent extends CustomEvent<undefined> {
		readonly gamepadIndex: number;
	}

	export interface GamepadConnectivityEvent extends GamepadEvent {
		readonly connected: boolean;
	}

	export interface GamepadButtonEvent extends GamepadEvent {
		readonly held:        boolean;
		readonly buttonIndex: number;
		readonly buttonValue: number;
	}

	export interface GamepadAxisEvent extends GamepadEvent {
		readonly axisIndex:  number;
		readonly axisValue:  number;
	}

	export type PollGamepadOptions = GetGamepadsOptions & { keepInactive: true, keepNull: true, standardize: true };
	const defaultOptions : PollGamepadOptions = { deadZone: 0.15, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true };

	type NewFields<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
	function dispatchGamepadEvent<K extends keyof GlobalEventHandlersEventMap>(type: K, data: NewFields<GlobalEventHandlersEventMap[K], CustomEvent<undefined>>, initHandled: boolean = false): boolean {
		let e = document.createEvent("CustomEvent") as any;
		e.initCustomEvent(type, true, true, undefined);
		Object.keys(data).forEach(key => {
			e[key] = (data as any)[key];
		});
		if (initHandled) {
			e.preventDefault();
		}
		return (document.activeElement || document.body).dispatchEvent(e);
	}

	var dispatchAnyEvents = true;
	var oldPads : (Gamepad | null)[] = [];
	function implPollEvents (options: PollGamepadOptions) {
		if (!dispatchAnyEvents) return;
		let newPads = getGamepads({ deadZone: 0, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true });
		let nPads = Math.max(oldPads.length, newPads.length);
		for (let iPad = 0; iPad < nPads; ++iPad) {
			let oldPad = oldPads[iPad];
			let newPad = newPads[iPad];

			if (oldPad && (!newPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
				dispatchGamepadEvent("mmk-gamepad-disconnected", { gamepadIndex: oldPad.index, connected: false });
			}
			if (newPad && (!oldPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
				dispatchGamepadEvent("mmk-gamepad-connected", { gamepadIndex: newPad.index, connected: true });
			}
			let eventPad = newPad || oldPad;
			if (!eventPad) continue;
			let gamepadIndex = eventPad.index;

			let nButtons = Math.max(newPad ? newPad.buttons.length : 0, oldPad ? oldPad.buttons.length : 0);
			for (let buttonIndex = 0; buttonIndex < nButtons; ++buttonIndex) {
				let oldButtonPressed = (oldPad && buttonIndex < oldPad.buttons.length && oldPad.buttons[buttonIndex].pressed) || false;
				let newButtonPressed = (newPad && buttonIndex < newPad.buttons.length && newPad.buttons[buttonIndex].pressed) || false;
				let oldButtonValue   = (oldPad && buttonIndex < oldPad.buttons.length) ? oldPad.buttons[buttonIndex].value : 0;
				let newButtonValue   = (newPad && buttonIndex < newPad.buttons.length) ? newPad.buttons[buttonIndex].value : 0;
				let held        = newButtonPressed;
				let buttonValue = newButtonValue;

				let handled = false;
				if (newButtonPressed && !oldButtonPressed) {
					handled = dispatchGamepadEvent("mmk-gamepad-button-down", { gamepadIndex, buttonIndex, buttonValue, held });
				}
				else if (!newButtonPressed && oldButtonPressed) {
					handled = dispatchGamepadEvent("mmk-gamepad-button-up", { gamepadIndex, buttonIndex, buttonValue, held });
				}
  
				if ((newButtonValue !== oldButtonValue) || (newButtonPressed !== oldButtonPressed)) {
					dispatchGamepadEvent("mmk-gamepad-button-value", { gamepadIndex, buttonIndex, buttonValue, held }, handled);
				}
			}

			let nAxises = Math.max(newPad ? newPad.axes.length : 0, oldPad ? oldPad.axes.length : 0);
			for (let axisIndex = 0; axisIndex < nAxises; ++axisIndex) {
				let oldAxisValue = (oldPad && axisIndex < oldPad.axes.length) ? oldPad.axes[axisIndex] : 0;
				let axisValue = (newPad && axisIndex < newPad.axes.length) ? newPad.axes[axisIndex] : 0;
				if (oldAxisValue === axisValue) continue;
				dispatchGamepadEvent("mmk-gamepad-axis-value", { gamepadIndex, axisIndex, axisValue });
			}
		}
		oldPads = mmk.gamepad.cloneGamepads(newPads);
	}

	var autoDispatchEvents = true;
	if (!("addEventListener" in window)) {
		dispatchAnyEvents = false;
		console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
	}
	else addEventListener("load", function(){
		poll(function () {
			if (autoDispatchEvents) {
				implPollEvents(defaultOptions);
			}
		});
	});

	/// Poll gamepad state, and dispatch events based on that state.
	/// Note that mmk.gamepad will automatically dispatch by default based on one of:
	/// 	requestAnimationFrame(...)
	/// 	setInterval(..., 10)
	/// And that calling this method will disable that automatic dispatch mechanism.
	export function pollEvents (options?: PollGamepadOptions) {
		autoDispatchEvents = false;
		implPollEvents(options || defaultOptions);
	}
}

interface GlobalEventHandlersEventMap {
	"mmk-gamepad-connected":    mmk.gamepad.GamepadConnectivityEvent;
	"mmk-gamepad-disconnected": mmk.gamepad.GamepadConnectivityEvent;

	"mmk-gamepad-button-down":  mmk.gamepad.GamepadButtonEvent;
	"mmk-gamepad-button-up":    mmk.gamepad.GamepadButtonEvent;
	"mmk-gamepad-button-value":	mmk.gamepad.GamepadButtonEvent; // Triggered whenever the button value changes.  For triggers this might be every frame due to jitter if outside the deadzone.

	"mmk-gamepad-axis-value":   mmk.gamepad.GamepadAxisEvent; // Triggered whenever the axis value changes.  This might be every frame due to jitter if outside the deadzone.
}

// https://docs.microsoft.com/en-us/windows/uwp/xbox-apps/how-to-disable-mouse-mode
navigator.gamepadInputEmulation = "gamepad";

// See mmk.gamepad.settings.captureGamepadEvents doc comments
if ('addEventListener' in window) {
	// We might consider bypassing polling for button events on Microsoft Edge in favor of keydown/up events.
	// This would let us have "mmk-gamepad-button-down" being .preventDefault()ed cause the actual keydown event
	// to also be .preventDefault()ed, instead of relying on global boolean state.  Open questions include how
	// to handle thumbstick/trigger events...
	addEventListener("keydown", function (ev) {
		switch (ev.key) {
			case "GamepadA":
			case "GamepadB":
			case "GamepadX":
			case "GamepadY":

			case "GamepadLeftThumbstick": // Click
			case "GamepadLeftThumbstickUp":
			case "GamepadLeftThumbstickDown":
			case "GamepadLeftThumbstickLeft":
			case "GamepadLeftThumbstickRight":

			case "GamepadRightThumbstick": // Click
			case "GamepadRightThumbstickUp":
			case "GamepadRightThumbstickDown":
			case "GamepadRightThumbstickLeft":
			case "GamepadRightThumbstickRight":

			case "GamepadDPadUp":
			case "GamepadDPadDown":
			case "GamepadDPadLeft":
			case "GamepadDPadRight":

			case "GamepadLeftShoulder":
			case "GamepadRightShoulder":
			case "GamepadLeftTrigger":
			case "GamepadRightTrigger":

			// We have no way to handle the guide button on Windows 10 + Microsoft Edge
			case "GamepadView": // Back
			case "GamepadMenu": // Start
				if (mmk.gamepad.settings.captureGamepadEvents) {
					ev.preventDefault();
				}
				break;
		}
	}, true);
}
