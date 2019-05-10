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
	export namespace config {
		/**
		 * Microsoft Edge now responds to gamepad input in a way that is *very* likely to conflict with your own
		 * gamepad handling.  For example, hitting (B) will focus... the address bar?  Home button?  Something in
		 * the browser header that isn't what you want.  By enabling this (default behavior), we mark all Edge's
		 * gamepad key events as handled, disabling the conflicting Edge behavior.
		 *
		 * If you want the default  Microsoft Edge gamepad navigation behavior, disable this option. You might
		 * consider disabling this during your title screen, or alternatively making a quit option that navigates
		 * back in history, or otherwise provide some kind of mechanism to allow users to return gamepad control
		 * to it's browser navigation role.
		 *
		 * In the future, disabling this may also add some navigation behavior to Chrome/Firefox to match IE11's
		 * behavior.  Or this option might go away entirely in favor of a better approach.
		 */
		export var captureGamepadEvents = true;
	}

	/**
	 * A generic `"mmk-gamepad-*"` event.
	 */
	export interface GamepadEvent {
		readonly gamepadType: metadata.DeviceType;
		readonly gamepadIndex: number;
	}

	/**
	 * A `"mmk-gamepad-connected"` or `"mmk-gamepad-disconnected"` event, indicating that gamepads were physically
	 * connected, disconnected, or became unmasked/visible to websites due to the user interacting with one.
	 */
	export interface GamepadConnectivityEvent extends GamepadEvent {
		readonly connected: boolean;
	}

	/**
	 * A `"mmk-gamepad-button-down"`, `"mmk-gamepad-button-up"`, or `"mmk-gamepad-button-value"` event, indicating that
	 * one of the gamepad buttons changed value.
	 */
	export interface GamepadButtonEvent extends GamepadEvent {
		readonly held:        boolean;
		readonly buttonIndex: number;
		readonly buttonValue: number;
	}

	/**
	 * A `"mmk-gamepad-axis-value"` event, indicating that one of the gamepad axises changed value.
	 */
	export interface GamepadAxisEvent extends GamepadEvent {
		readonly axisIndex:  number;
		readonly axisValue:  number;
	}

	export type PollGamepadOptions = GetGamepadsOptions & { keepInactive: true, keepNull: true, standardize: true };
	/** @hidden */
	const defaultOptions : PollGamepadOptions = { deadZone: 0.15, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true };

	/** @hidden */
	type NewFields<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
	/** @hidden */
	function dispatchGamepadEvent<K extends keyof GlobalEventHandlersEventMap>(type: K, data: NewFields<GlobalEventHandlersEventMap[K], CustomEvent<undefined>>, initHandled: boolean = false): boolean {
		const e = document.createEvent("CustomEvent") as any;
		e.initCustomEvent(type, true, true, undefined);
		Object.keys(data).forEach(key => {
			e[key] = (data as any)[key];
		});
		if (initHandled) {
			e.preventDefault();
		}
		return (document.activeElement || document.body).dispatchEvent(e);
	}

	/** @hidden */
	var dispatchAnyEvents = true;
	/** @hidden */
	var oldPads : (Gamepad | null)[] = [];
	/** @hidden */
	function implPollEvents (options: PollGamepadOptions) {
		if (!dispatchAnyEvents) return;
		const newPads = getGamepads({ deadZone: 0, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true });
		const nPads = Math.max(oldPads.length, newPads.length);
		for (let iPad = 0; iPad < nPads; ++iPad) {
			const oldPad = oldPads[iPad];
			const newPad = newPads[iPad];

			if (oldPad && (!newPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
				dispatchGamepadEvent("mmk-gamepad-disconnected", { gamepadType: metadata.getDeviceType(oldPad), gamepadIndex: oldPad.index, connected: false });
			}
			if (newPad && (!oldPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
				dispatchGamepadEvent("mmk-gamepad-connected", { gamepadType: metadata.getDeviceType(newPad), gamepadIndex: newPad.index, connected: true });
			}
			const eventPad = newPad || oldPad;
			if (!eventPad) continue;
			const gamepadType = metadata.getDeviceType(eventPad);
			const gamepadIndex = eventPad.index;

			const nButtons = Math.max(newPad ? newPad.buttons.length : 0, oldPad ? oldPad.buttons.length : 0);
			for (let buttonIndex = 0; buttonIndex < nButtons; ++buttonIndex) {
				const oldButtonPressed = (oldPad && buttonIndex < oldPad.buttons.length && oldPad.buttons[buttonIndex].pressed) || false;
				const newButtonPressed = (newPad && buttonIndex < newPad.buttons.length && newPad.buttons[buttonIndex].pressed) || false;
				const oldButtonValue   = (oldPad && buttonIndex < oldPad.buttons.length) ? oldPad.buttons[buttonIndex].value : 0;
				const newButtonValue   = (newPad && buttonIndex < newPad.buttons.length) ? newPad.buttons[buttonIndex].value : 0;
				const held        = newButtonPressed;
				const buttonValue = newButtonValue;

				let handled = false;
				if (newButtonPressed && !oldButtonPressed) {
					handled = dispatchGamepadEvent("mmk-gamepad-button-down", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held });
				}
				else if (!newButtonPressed && oldButtonPressed) {
					handled = dispatchGamepadEvent("mmk-gamepad-button-up", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held });
				}
  
				if ((newButtonValue !== oldButtonValue) || (newButtonPressed !== oldButtonPressed)) {
					dispatchGamepadEvent("mmk-gamepad-button-value", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held }, handled);
				}
			}

			const nAxises = Math.max(newPad ? newPad.axes.length : 0, oldPad ? oldPad.axes.length : 0);
			for (let axisIndex = 0; axisIndex < nAxises; ++axisIndex) {
				const oldAxisValue = (oldPad && axisIndex < oldPad.axes.length) ? oldPad.axes[axisIndex] : 0;
				const axisValue = (newPad && axisIndex < newPad.axes.length) ? newPad.axes[axisIndex] : 0;
				if (oldAxisValue === axisValue) continue;
				dispatchGamepadEvent("mmk-gamepad-axis-value", { gamepadType, gamepadIndex, axisIndex, axisValue });
			}
		}
		oldPads = mmk.gamepad.cloneGamepads(newPads);
	}

	/** @hidden */
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

	/**
	 * Poll gamepad state, and dispatch events based on that state.
	 * Note that mmk.gamepad will automatically dispatch by default based on one of:
	 * ```ts
	 *     requestAnimationFrame(...)
	 *     setInterval(..., 10)
	 * ```
	 * And that calling this method will disable that automatic dispatch mechanism.
	 * 
	 * @param options Allows some customization of if e.g. deadzones are applied to generated events or not.
	 */
	export function pollEvents (options?: PollGamepadOptions) {
		autoDispatchEvents = false;
		implPollEvents(options || defaultOptions);
	}

	export interface GamepadEventsMap {
		"mmk-gamepad-connected":    mmk.gamepad.GamepadConnectivityEvent;
		"mmk-gamepad-disconnected": mmk.gamepad.GamepadConnectivityEvent;
		
		"mmk-gamepad-button-down":  mmk.gamepad.GamepadButtonEvent;
		"mmk-gamepad-button-up":    mmk.gamepad.GamepadButtonEvent;
		"mmk-gamepad-button-value":	mmk.gamepad.GamepadButtonEvent; // Triggered whenever the button value changes.  For triggers this might be every frame due to jitter if outside the deadzone.
		
		"mmk-gamepad-axis-value":   mmk.gamepad.GamepadAxisEvent; // Triggered whenever the axis value changes.  This might be every frame due to jitter if outside the deadzone.
	}

	/** @hidden */
	export type GamepadEventsMap_and_CustomEvent = {
		[P in keyof mmk.gamepad.GamepadEventsMap]: mmk.gamepad.GamepadEventsMap[P] & CustomEvent<undefined>;
	};
}

/** @hidden */
interface GlobalEventHandlersEventMap extends mmk.gamepad.GamepadEventsMap_and_CustomEvent {}

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
				if (mmk.gamepad.config.captureGamepadEvents) {
					ev.preventDefault();
				}
				break;
		}
	}, true);
}
