"use strict";
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        var settings;
        (function (settings) {
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
            settings.captureGamepadEvents = true;
        })(settings = gamepad.settings || (gamepad.settings = {}));
        var defaultOptions = { deadZone: 0.15, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true };
        function dispatchGamepadEvent(type, data, initHandled) {
            if (initHandled === void 0) { initHandled = false; }
            var e = document.createEvent("CustomEvent");
            e.initCustomEvent(type, true, true, undefined);
            Object.keys(data).forEach(function (key) {
                e[key] = data[key];
            });
            if (initHandled) {
                e.preventDefault();
            }
            return (document.activeElement || document.body).dispatchEvent(e);
        }
        var dispatchAnyEvents = true;
        var oldPads = [];
        function implPollEvents(options) {
            if (!dispatchAnyEvents)
                return;
            var newPads = gamepad.getGamepads({ deadZone: 0, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true });
            var nPads = Math.max(oldPads.length, newPads.length);
            for (var iPad = 0; iPad < nPads; ++iPad) {
                var oldPad = oldPads[iPad];
                var newPad = newPads[iPad];
                if (oldPad && (!newPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
                    dispatchGamepadEvent("mmk-gamepad-disconnected", { gamepadIndex: oldPad.index, connected: false });
                }
                if (newPad && (!oldPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
                    dispatchGamepadEvent("mmk-gamepad-connected", { gamepadIndex: newPad.index, connected: true });
                }
                var eventPad = newPad || oldPad;
                if (!eventPad)
                    continue;
                var gamepadIndex = eventPad.index;
                var nButtons = Math.max(newPad ? newPad.buttons.length : 0, oldPad ? oldPad.buttons.length : 0);
                for (var buttonIndex = 0; buttonIndex < nButtons; ++buttonIndex) {
                    var oldButtonPressed = (oldPad && buttonIndex < oldPad.buttons.length && oldPad.buttons[buttonIndex].pressed) || false;
                    var newButtonPressed = (newPad && buttonIndex < newPad.buttons.length && newPad.buttons[buttonIndex].pressed) || false;
                    var oldButtonValue = (oldPad && buttonIndex < oldPad.buttons.length) ? oldPad.buttons[buttonIndex].value : 0;
                    var newButtonValue = (newPad && buttonIndex < newPad.buttons.length) ? newPad.buttons[buttonIndex].value : 0;
                    var held = newButtonPressed;
                    var buttonValue = newButtonValue;
                    var handled = false;
                    if (newButtonPressed && !oldButtonPressed) {
                        handled = dispatchGamepadEvent("mmk-gamepad-button-down", { gamepadIndex: gamepadIndex, buttonIndex: buttonIndex, buttonValue: buttonValue, held: held });
                    }
                    else if (!newButtonPressed && oldButtonPressed) {
                        handled = dispatchGamepadEvent("mmk-gamepad-button-up", { gamepadIndex: gamepadIndex, buttonIndex: buttonIndex, buttonValue: buttonValue, held: held });
                    }
                    if ((newButtonValue !== oldButtonValue) || (newButtonPressed !== oldButtonPressed)) {
                        dispatchGamepadEvent("mmk-gamepad-button-value", { gamepadIndex: gamepadIndex, buttonIndex: buttonIndex, buttonValue: buttonValue, held: held }, handled);
                    }
                }
                var nAxises = Math.max(newPad ? newPad.axes.length : 0, oldPad ? oldPad.axes.length : 0);
                for (var axisIndex = 0; axisIndex < nAxises; ++axisIndex) {
                    var oldAxisValue = (oldPad && axisIndex < oldPad.axes.length) ? oldPad.axes[axisIndex] : 0;
                    var axisValue = (newPad && axisIndex < newPad.axes.length) ? newPad.axes[axisIndex] : 0;
                    if (oldAxisValue === axisValue)
                        continue;
                    dispatchGamepadEvent("mmk-gamepad-axis-value", { gamepadIndex: gamepadIndex, axisIndex: axisIndex, axisValue: axisValue });
                }
            }
            oldPads = mmk.gamepad.cloneGamepads(newPads);
        }
        var autoDispatchEvents = true;
        if (!("addEventListener" in window)) {
            dispatchAnyEvents = false;
            console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
        }
        else
            addEventListener("load", function () {
                gamepad.poll(function () {
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
        function pollEvents(options) {
            autoDispatchEvents = false;
            implPollEvents(options || defaultOptions);
        }
        gamepad.pollEvents = pollEvents;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function v(value, fallback) {
            return (value === undefined) ? fallback : value;
        }
        function stickDeadZone(x, y, dz) {
            if (dz <= 0)
                return [x, y];
            if (dz >= 1)
                return [0, 0];
            var m2 = x * x + y * y;
            if (m2 <= dz * dz)
                return [0, 0];
            var m = Math.sqrt(m2); // current magnitude
            var t = (m - dz) / (1 - dz); // target magnitude
            var s = t / m; // scale
            return [x * s, y * s];
        }
        function cloneDeadZone(g, dz) {
            g = gamepad.cloneGamepad(g);
            if (g.mapping === "standard") {
                var leftX = g.axes[0];
                var leftY = g.axes[1];
                var rightX = g.axes[2];
                var rightY = g.axes[3];
                var leftThumbDZ = stickDeadZone(leftX, leftY, dz);
                var rightThumbDZ = stickDeadZone(rightX, rightY, dz);
                g.axes[0] = leftThumbDZ[0];
                g.axes[1] = leftThumbDZ[1];
                g.axes[2] = rightThumbDZ[0];
                g.axes[3] = rightThumbDZ[1];
            }
            return g;
        }
        function isActive(g) {
            return g.axes.some(function (a) { return a !== 0; }) || g.buttons.some(function (b) { return b.pressed || b.touched; });
        }
        function getGamepads(options) {
            var gamepads = gamepad.getRawGamepads();
            if (!options.keepNull)
                gamepads = gamepads.filter(function (g) { return g !== null; });
            if (options.standardize)
                gamepads = gamepads.map(function (g) { return gamepad.tryRemapStdLayout(g) || g; });
            if (!options.keepNonstandard)
                gamepads = gamepads.filter(function (g) { return g ? g.mapping === "standard" : g; });
            if (options.deadZone)
                gamepads = gamepads.map(function (g) { return g ? cloneDeadZone(g, options.deadZone) : g; });
            if (!options.keepInactive)
                gamepads = gamepads.filter(function (g) { return g ? isActive(g) : false; });
            return gamepads;
        }
        gamepad.getGamepads = getGamepads;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function isSupported() {
            if ('getGamepads' in navigator)
                return true;
            if ('onconnectedgamepad' in window)
                return true;
            return false;
        }
        gamepad.isSupported = isSupported;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_1) {
        var assert = console.assert;
        function remapXformHat(condition) {
            return function (src, remap) {
                var i = src ? Math.round((src.value + 1) / 2 * 7) : 8;
                var v = condition(i);
                return { value: v ? 1.0 : 0.0, pressed: v, touched: v };
            };
        }
        var axisXforms = {
            "01-11": function (src, remap) {
                var value = src ? (src.value * 2) - 1 : 0;
                return { value: value, pressed: false, touched: false };
            }
        };
        var buttonXforms = {
            "11-01": function (src, remap) {
                var value = src ? (src.value + 1) / 2 : 0;
                var pressed = !remap.param ? src.pressed : (value > remap.param);
                return { value: value, pressed: pressed, touched: pressed };
            },
            "axis-negative-01": function (src, remap) {
                var value = (src && src.value < 0.0) ? -src.value : 0.0;
                var pressed = value > (remap.param ? remap.param : 0.0);
                return { value: value, pressed: pressed, touched: pressed };
            },
            "axis-positive-01": function (src, remap) {
                var value = (src && src.value > 0.0) ? +src.value : 0.0;
                var pressed = value > (remap.param ? remap.param : 0.0);
                return { value: value, pressed: pressed, touched: pressed };
            },
            "hat-up-bit": remapXformHat(function (i) { return (i === 7) || (i === 0) || (i === 1); }),
            "hat-right-bit": remapXformHat(function (i) { return (1 <= i) && (i <= 3); }),
            "hat-down-bit": remapXformHat(function (i) { return (3 <= i) && (i <= 5); }),
            "hat-left-bit": remapXformHat(function (i) { return (5 <= i) && (i <= 7); })
        };
        // http://www.linux-usb.org/usb.ids
        var vendorProductToName = {
            // Microsoft
            "045e-0202": "Xbox Controller",
            "045e-0285": "Xbox Controller S",
            "045e-0289": "Xbox Controller S",
            "045e-028e": "Xbox 360 Controller",
            "045e-028f": "Xbox 360 Wireless Controller",
            "045e-0291": "Xbox 360 Wireless Receiver for Windows",
            "045e-02a1": "Xbox 360 Wireless Receiver for Windows",
            "045e-02d1": "Xbox One Controller",
            "045e-02dd": "Xbox One Controller",
            "045e-02e3": "Xbox One Elite Controller",
            "045e-02e6": "Wireless XBox Controller Dongle",
            "045e-02ea": "Xbox One S Controller",
            "045e-02fd": "Xbox One S Controller (Bluetooth)",
            // Sony
            "054c-0268": "DualShock 3 Controller",
            "054c-054c": "DualShock 4 Controller",
            "054c-09cc": "DualShock 4 Controller (2nd Gen)",
            "054c-0ba0": "DualShock 4 Wireless Adapter"
        };
        //const stdRemaps : {[vendProdHintAxesButtons: string]: Remap} = {
        var remaps = [{
                tested: ["Windows 7 / Opera 52.0.2871.99"],
                matches: [
                    "054c-054c-blink-10-14",
                    "054c-09cc-blink-10-14",
                    "054c-0ba0-blink-10-14",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a2" }, { src: "a5" }],
                buttons: [
                    { src: "b1" }, { src: "b2" }, { src: "b0" }, { src: "b3" },
                    { src: "b4" }, { src: "b5" }, { src: "a3", xform: "11-01", param: 0.125 }, { src: "a4", xform: "11-01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b10" }, { src: "b11" },
                    { src: "a9", xform: "hat-up-bit" }, { src: "a9", xform: "hat-down-bit" }, { src: "a9", xform: "hat-left-bit" }, { src: "a9", xform: "hat-right-bit" },
                    // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
                    { src: "b12" },
                    { src: "b13" } // Touchpad click (unavailable on FireFox)
                ]
                // Note: Axis 6-8 are ignored (dead)
                // Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
            }, {
                tested: ["Windows 7 / Firefox 62.0a1 (2018-05-09) - DPad busted"],
                matches: [
                    "054c-054c-gecko-8-18",
                    "054c-09cc-gecko-8-18",
                    "054c-0ba0-gecko-8-18",
                    "054c-054c-gecko-6-18",
                    "054c-09cc-gecko-6-18",
                    "054c-0ba0-gecko-6-18",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a2" }, { src: "a5" }],
                buttons: [
                    { src: "b1" }, { src: "b2" }, { src: "b0" }, { src: "b3" },
                    { src: "b4" }, { src: "b5" }, { src: "a3", xform: "11-01", param: 0.125 }, { src: "a4", xform: "11-01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b10" }, { src: "b11" },
                    { src: "b14" }, { src: "b15" }, { src: "b16" }, { src: "b17" },
                    // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
                    { src: "b12" },
                    { src: "b13" } // Touchpad click (unavailable on FireFox)
                ]
                // Note: Axis 6-7 are ignored (dead)
                // Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
            }, {
                tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                matches: [
                    "054c-054c-gecko-8-13",
                    "054c-09cc-gecko-8-13",
                    "054c-0ba0-gecko-8-13",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a3" }, { src: "a4" }],
                buttons: [
                    { src: "b0" }, { src: "b1" }, { src: "b3" }, { src: "b2" },
                    { src: "b4" }, { src: "b5" }, { src: "a2", xform: "11-01", param: 0.125 }, { src: "a5", xform: "11-01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b11" }, { src: "b12" },
                    { src: "a7", xform: "axis-negative-01" }, { src: "a7", xform: "axis-positive-01" }, { src: "a6", xform: "axis-negative-01" }, { src: "a6", xform: "axis-positive-01" },
                    // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
                    { src: "b10" },
                ]
            }, {
                tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                matches: [
                    "054c-0268-gecko-6-17",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a3" }, { src: "a4" }],
                buttons: [
                    { src: "b0" }, { src: "b1" }, { src: "b3" }, { src: "b2" },
                    { src: "b4" }, { src: "b5" }, { src: "a2", xform: "11-01", param: 0.125 }, { src: "a5", xform: "11-01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b11" }, { src: "b12" },
                    { src: "b13" }, { src: "b14" }, { src: "b15" }, { src: "b16" },
                    // -- end of standard layout
                    { src: "b10" },
                ]
            }, {
                tested: ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                matches: [
                    "045e-028e-gecko-8-11",
                    "045e-02d1-gecko-8-11",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a3" }, { src: "a4" }],
                buttons: [
                    { src: "b0" }, { src: "b1" }, { src: "b2" }, { src: "b3" },
                    { src: "b4" }, { src: "b5" }, { src: "a2", xform: "11-01", param: 0.125 }, { src: "a5", xform: "11-01", param: 0.125 },
                    { src: "b6" }, { src: "b7" }, { src: "b9" }, { src: "b10" },
                    { src: "a7", xform: "axis-negative-01" }, { src: "a7", xform: "axis-positive-01" }, { src: "a6", xform: "axis-negative-01" }, { src: "a6", xform: "axis-positive-01" },
                    // -- end of standard layout
                    { src: "b8" },
                ]
            }, {
                // Did version_number get bumped again maybe?  These are mappings for a "standard" layout
                // https://cs.chromium.org/chromium/src/device/gamepad/gamepad_standard_mappings_linux.cc?l=573-580
                tested: ["Ubuntu 18.04 LTS / Chrome 66.0.3359.139"],
                matches: [
                    "054c-054c-blink-4-18",
                    "054c-09cc-blink-4-18",
                    "054c-0ba0-blink-4-18",
                ],
                axes: [{ src: "a0" }, { src: "a1" }, { src: "b6", xform: "01-11" }, { src: "b7", xform: "01-11" }],
                buttons: [
                    { src: "b2" }, { src: "b0" }, { src: "b3" }, { src: "b1" },
                    { src: "b4" }, { src: "b5" }, { src: "a2", xform: "11-01", param: 0.125 }, { src: "a3", xform: "11-01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b11" }, { src: "b16" },
                    { src: "b12" }, { src: "b13" }, { src: "b14" }, { src: "b15" },
                    // -- end of standard layout
                    { src: "b10" },
                ]
            }];
        // Avoid where possible.
        var xxxIsLinux = /\blinux\b/i.test(navigator.userAgent);
        var xxxIsChromeBased = /\bChrome\/\d{2,3}\b/i.test(navigator.userAgent);
        var xxxIsChromium = /\bChromium\/\d{2,3}\b/i.test(navigator.userAgent);
        var xxxIsChrome = xxxIsChromeBased && !xxxIsChromium;
        var liesAboutStandardMapping = xxxIsLinux && xxxIsChromeBased;
        var remapsByKey = {};
        remaps.forEach(function (remap) {
            remap.matches.forEach(function (id) {
                console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
                remapsByKey[id] = remap;
            });
        });
        function getRemapKey(gamepad) {
            var id = gamepad_1.parseGamepadId(gamepad.id);
            var key = id.vendor + "-" + id.product + "-" + id.hint + "-" + gamepad.axes.length + "-" + gamepad.buttons.length;
            return key;
        }
        function findStdRemap(gamepad) {
            var key = getRemapKey(gamepad);
            var value = remapsByKey[key];
            return value;
        }
        function tryRemapStdLayout(gamepad) {
            if (!gamepad)
                return gamepad;
            if (!liesAboutStandardMapping && gamepad.mapping === "standard")
                return gamepad; // Already remapped
            var remapGamepad = findStdRemap(gamepad);
            if (!remapGamepad)
                return gamepad;
            var flatGamepad = gamepad_1.flattenPremapGamepad(gamepad);
            var fakey = {
                id: gamepad.id,
                displayId: gamepad.displayId,
                index: gamepad.index,
                timestamp: gamepad.timestamp,
                connected: gamepad.connected,
                mapping: "standard",
                axes: new Array(remapGamepad.axes.length),
                buttons: new Array(remapGamepad.buttons.length)
            };
            for (var i = 0; i < remapGamepad.axes.length; ++i) {
                var remapAxis = remapGamepad.axes[i];
                if (remapAxis === undefined) {
                    fakey.axes[i] = 0.0;
                }
                else if (remapAxis.xform === undefined) {
                    var flatAxis = flatGamepad[remapAxis.src];
                    assert(!!flatAxis);
                    fakey.axes[i] = flatAxis ? flatAxis.value : 0.0;
                }
                else { // remap
                    var flatAxis = flatGamepad[remapAxis.src];
                    var remapXform = axisXforms[remapAxis.xform];
                    assert(!!flatAxis);
                    assert(!!remapXform);
                    fakey.axes[i] = remapXform(flatAxis, remapAxis).value;
                }
            }
            for (var i = 0; i < remapGamepad.buttons.length; ++i) {
                var remapButton = remapGamepad.buttons[i];
                if (remapButton === undefined) {
                    fakey.buttons[i] = { value: 0.0, pressed: false, touched: false };
                }
                else if (remapButton.xform === undefined) {
                    var flatButton = flatGamepad[remapButton.src];
                    assert(!!flatButton);
                    fakey.buttons[i] = flatButton ? flatButton : { value: 0.0, pressed: false, touched: false };
                }
                else { // remap
                    var flatButton = flatGamepad[remapButton.src];
                    var remapXform = buttonXforms[remapButton.xform];
                    assert(!!flatButton);
                    assert(!!remapXform);
                    fakey.buttons[i] = remapXform(flatButton, remapButton);
                }
            }
            return fakey;
        }
        gamepad_1.tryRemapStdLayout = tryRemapStdLayout;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function cloneGamepad(original) {
            if (!original)
                return original;
            var clone = {
                id: original.id,
                displayId: original.displayId,
                mapping: original.mapping,
                index: original.index,
                timestamp: original.timestamp,
                connected: original.connected,
                axes: new Array(original.axes.length),
                buttons: new Array(original.buttons.length)
            };
            for (var i = 0; i < original.axes.length; ++i) {
                clone.axes[i] = original.axes[i];
            }
            for (var i = 0; i < original.buttons.length; ++i) {
                var _a = original.buttons[i], pressed = _a.pressed, value = _a.value, touched = _a.touched;
                touched = touched || false;
                clone.buttons[i] = { pressed: pressed, value: value, touched: touched };
            }
            return clone;
        }
        gamepad.cloneGamepad = cloneGamepad;
        function cloneGamepads(original) {
            var clone = new Array(original.length);
            for (var i = 0; i < original.length; ++i)
                clone[i] = cloneGamepad(original[i]);
            return clone;
        }
        gamepad.cloneGamepads = cloneGamepads;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_2) {
        function flattenPremapGamepad(gamepad) {
            var map = {};
            for (var i = 0; i < gamepad.axes.length; ++i) {
                var a = gamepad.axes[i];
                var id = "a" + i;
                map[id] = { value: a, pressed: false, touched: false };
            }
            for (var i = 0; i < gamepad.buttons.length; ++i) {
                var b = gamepad.buttons[i];
                var id = "b" + i;
                map[id] = { value: b.value, pressed: b.pressed, touched: b.touched };
            }
            return map;
        }
        gamepad_2.flattenPremapGamepad = flattenPremapGamepad;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function getRawGamepads() {
            if ('getGamepads' in navigator) {
                var gp = navigator.getGamepads();
                var a = [];
                for (var i = 0; i < gp.length; ++i)
                    a.push(gp[i]);
                return a;
            }
            else {
                return [];
            }
        }
        gamepad.getRawGamepads = getRawGamepads;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        //const nameHintOverrides : {[nameHint: string]: string} = {
        //	"xinput-gecko": "Xbox 360 Controller"
        //};
        //
        //const vendProdNames : {[vendProd: string]: string} = {
        //	"054c-0ba0": "DUALSHOCK®4 Controller (Wireless)",
        //	"054c-09cc": "DUALSHOCK®4 Controller (USB)",
        //	"054c-0268": "PLAYSTATION(R)3 Controller"
        //};
        function parseGamepadId_Blink(id) {
            var mNameParen = /^(.+?)(?: \((.*)\))$/i.exec(id);
            if (!mNameParen)
                return undefined;
            var parsed = { name: mNameParen[1], vendor: "", product: "", hint: "blink" };
            var mVendorProduct = /(?:^| )Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})$/i.exec(mNameParen[2]);
            if (mVendorProduct) {
                parsed.vendor = mVendorProduct[1];
                parsed.product = mVendorProduct[2];
            }
            return parsed;
        }
        function parseGamepadId_Gecko(id) {
            if (id === "xinput")
                return { name: "xinput", vendor: "", product: "", hint: "gecko" };
            var m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
            if (m)
                return { name: m[3], vendor: m[1], product: m[2], hint: "gecko" };
            return undefined;
        }
        function parseGamepadId_Unknown(id) {
            // TODO: Scan for other 4-byte hex strings?
            return { name: id, vendor: "", product: "", hint: "unknown" };
        }
        function parseGamepadId(id) {
            if (!id)
                return parseGamepadId_Unknown("unknown");
            var parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
            return parsed;
        }
        gamepad.parseGamepadId = parseGamepadId;
        var parsedIdExamples = [
            // Chrome / Opera
            ["Xbox 360 Controller (XInput STANDARD GAMEPAD)", { name: "Xbox 360 Controller", vendor: "", product: "", hint: "blink" }],
            ["DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)", { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "blink" }],
            ["Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "blink" }],
            // Firefox
            ["xinput", { name: "xinput", vendor: "", product: "", hint: "gecko" }],
            ["054c-0ba0-DUALSHOCK®4 USB Wireless Adaptor", { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "gecko" }],
            ["054c-09cc-Wireless Controller", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "gecko" }],
            // Not actually seen
            [undefined, { name: "unknown", vendor: "", product: "", hint: "unknown" }],
            ["asdf", { name: "asdf", vendor: "", product: "", hint: "unknown" }],
            ["", { name: "unknown", vendor: "", product: "", hint: "unknown" }],
        ];
        parsedIdExamples.forEach(function (example) {
            var parsed = JSON.stringify(parseGamepadId(example[0]));
            var expected = JSON.stringify(example[1]);
            console.assert(parsed === expected, "Expected parsed:", parsed, "equal to expected:", expected);
        });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        // TODO: Make polling mechanics customizeable?
        // e.g. customize setInterval interval? force setInterval even if raf is available?
        function poll(action) {
            if ('requestAnimationFrame' in window) {
                var perFrame = function () {
                    window.requestAnimationFrame(perFrame);
                    action();
                };
                window.requestAnimationFrame(perFrame);
            }
            else {
                setInterval(action, 10); // 100Hz... good enough?
            }
        }
        gamepad.poll = poll;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
//# sourceMappingURL=mmk.gamepad.js.map