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
            return (src, remap) => {
                let i = src ? Math.round((src.value + 1) / 2 * 7) : 8;
                let v = condition(i);
                return { value: v ? 1.0 : 0.0, pressed: v, touched: v };
            };
        }
        const axisXforms = {
            "01-11": (src, remap) => {
                let value = src ? (src.value * 2) - 1 : 0;
                return { value, pressed: false, touched: false };
            }
        };
        const buttonXforms = {
            "11-01": (src, remap) => {
                let value = src ? (src.value + 1) / 2 : 0;
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
            "hat-up-bit": remapXformHat(i => (i === 7) || (i === 0) || (i === 1)),
            "hat-right-bit": remapXformHat(i => (1 <= i) && (i <= 3)),
            "hat-down-bit": remapXformHat(i => (3 <= i) && (i <= 5)),
            "hat-left-bit": remapXformHat(i => (5 <= i) && (i <= 7))
        };
        // http://www.linux-usb.org/usb.ids
        const vendorProductToName = {
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
            "054c-0ba0": "DualShock 4 Wireless Adapter",
        };
        //const stdRemaps : {[vendProdHintAxesButtons: string]: Remap} = {
        const remaps = [{
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
                ],
            }];
        // Avoid where possible.
        const xxxIsLinux = /\blinux\b/i.test(navigator.userAgent);
        const xxxIsChromeBased = /\bChrome\/\d{2,3}\b/i.test(navigator.userAgent);
        const xxxIsChromium = /\bChromium\/\d{2,3}\b/i.test(navigator.userAgent);
        const xxxIsChrome = xxxIsChromeBased && !xxxIsChromium;
        const liesAboutStandardMapping = xxxIsLinux && xxxIsChromeBased;
        const remapsByKey = {};
        remaps.forEach(remap => {
            remap.matches.forEach(id => {
                console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
                remapsByKey[id] = remap;
            });
        });
        function getRemapKey(gamepad) {
            let id = gamepad_1.parseGamepadId(gamepad.id);
            let key = id.vendor + "-" + id.product + "-" + id.hint + "-" + gamepad.axes.length + "-" + gamepad.buttons.length;
            return key;
        }
        function findStdRemap(gamepad) {
            let key = getRemapKey(gamepad);
            let value = remapsByKey[key];
            return value;
        }
        function tryRemapStdLayout(gamepad) {
            if (!gamepad)
                return gamepad;
            if (!liesAboutStandardMapping && gamepad.mapping === "standard")
                return gamepad; // Already remapped
            let remapGamepad = findStdRemap(gamepad);
            if (!remapGamepad) {
                return undefined;
            }
            let flatGamepad = gamepad_1.flattenPremapGamepad(gamepad);
            let fakey = {
                id: gamepad.id,
                displayId: gamepad.displayId,
                index: gamepad.index,
                timestamp: gamepad.timestamp,
                connected: gamepad.connected,
                mapping: "standard",
                axes: new Array(remapGamepad.axes.length),
                buttons: new Array(remapGamepad.buttons.length)
            };
            for (let i = 0; i < remapGamepad.axes.length; ++i) {
                let remapAxis = remapGamepad.axes[i];
                if (remapAxis === undefined) {
                    fakey.axes[i] = 0.0;
                }
                else if (remapAxis.xform === undefined) {
                    let flatAxis = flatGamepad[remapAxis.src];
                    assert(!!flatAxis);
                    fakey.axes[i] = flatAxis ? flatAxis.value : 0.0;
                }
                else { // remap
                    let flatAxis = flatGamepad[remapAxis.src];
                    let remapXform = axisXforms[remapAxis.xform];
                    assert(!!flatAxis);
                    assert(!!remapXform);
                    fakey.axes[i] = remapXform(flatAxis, remapAxis).value;
                }
            }
            for (let i = 0; i < remapGamepad.buttons.length; ++i) {
                let remapButton = remapGamepad.buttons[i];
                if (remapButton === undefined) {
                    fakey.buttons[i] = { value: 0.0, pressed: false, touched: false };
                }
                else if (remapButton.xform === undefined) {
                    let flatButton = flatGamepad[remapButton.src];
                    assert(!!flatButton);
                    fakey.buttons[i] = flatButton ? flatButton : { value: 0.0, pressed: false, touched: false };
                }
                else { // remap
                    let flatButton = flatGamepad[remapButton.src];
                    let remapXform = buttonXforms[remapButton.xform];
                    assert(!!flatButton);
                    assert(!!remapXform);
                    fakey.buttons[i] = remapXform(flatButton, remapButton);
                }
            }
            return fakey;
        }
        gamepad_1.tryRemapStdLayout = tryRemapStdLayout;
        function telemetryReportGamepad(gamepad) {
            if (!gamepad)
                return;
            if ((gamepad.mapping !== "standard") && !findStdRemap(gamepad)) {
                console.warn("No remap for gamepad:  ", getRemapKey(gamepad), "   " + gamepad.id);
                if (("Raven" in window) && Raven.isSetup()) {
                    let clone = gamepad_1.cloneGamepad(gamepad);
                    let cloneNoData = {};
                    Object.keys(clone).forEach(key => {
                        if ("axes buttons".split(' ').indexOf(key) === -1)
                            cloneNoData[key] = clone[key];
                    });
                    Raven.captureMessage("No remap for gamepad", {
                        level: "warning",
                        tags: {
                            remapKey: getRemapKey(gamepad),
                            gamepadId: gamepad.id
                        }, extra: {
                            axes: clone.axes,
                            buttons: clone.buttons.map(b => JSON.stringify(b)),
                            gamepad: cloneNoData,
                            remapKey: getRemapKey(gamepad)
                        }
                    });
                }
            }
        }
        if ("addEventListener" in window)
            addEventListener("load", function () {
                gamepad_1.addRawConnectedListener(telemetryReportGamepad);
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
            let clone = {
                id: original.id,
                displayId: original.displayId,
                mapping: original.mapping,
                index: original.index,
                timestamp: original.timestamp,
                connected: original.connected,
                axes: new Array(original.axes.length),
                buttons: new Array(original.buttons.length),
            };
            for (let i = 0; i < original.axes.length; ++i) {
                clone.axes[i] = original.axes[i];
            }
            for (let i = 0; i < original.buttons.length; ++i) {
                let { pressed, value, touched } = original.buttons[i];
                touched = touched || false;
                clone.buttons[i] = { pressed, value, touched };
            }
            return clone;
        }
        gamepad.cloneGamepad = cloneGamepad;
        function cloneGamepads(original) {
            let clone = new Array(original.length);
            for (let i = 0; i < original.length; ++i)
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
            let map = {};
            for (let i = 0; i < gamepad.axes.length; ++i) {
                let a = gamepad.axes[i];
                let id = "a" + i;
                map[id] = { value: a, pressed: false, touched: false };
            }
            for (let i = 0; i < gamepad.buttons.length; ++i) {
                let b = gamepad.buttons[i];
                let id = "b" + i;
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
    (function (gamepad_3) {
        //var log = console.log;
        var log = (...args) => { };
        var rawConnectedCallbacks = [];
        var rawDisconnectedCallbacks = [];
        function addRawConnectedListener(callback) {
            oldPads.forEach(gp => { if (gp)
                callback(gp); });
            rawConnectedCallbacks.push(callback);
        }
        gamepad_3.addRawConnectedListener = addRawConnectedListener;
        function addRawDisconnectedListener(callback) {
            rawDisconnectedCallbacks.push(callback);
        }
        gamepad_3.addRawDisconnectedListener = addRawDisconnectedListener;
        function getRawGamepads() {
            if ('getGamepads' in navigator) {
                let gp = navigator.getGamepads();
                let a = [];
                for (let i = 0; i < gp.length; ++i)
                    a.push(gp[i]);
                return a;
            }
            else {
                return [];
            }
        }
        gamepad_3.getRawGamepads = getRawGamepads;
        var oldPads = [];
        if (!("addEventListener" in window))
            console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
        else
            addEventListener("load", function () {
                gamepad_3.poll(function () {
                    let newPads = getRawGamepads();
                    let n = Math.max(oldPads.length, newPads.length);
                    for (let i = 0; i < n; ++i) {
                        let oldPad = oldPads[i];
                        let newPad = newPads[i];
                        oldPads[i] = newPads[i];
                        if (oldPad === newPad) {
                            continue;
                        }
                        else if (!oldPad && !newPad) {
                            continue;
                        }
                        else if (!oldPad) {
                            log("fake connectedgamepad:", newPad);
                            rawConnectedCallbacks.forEach(cb => cb(newPad));
                        }
                        else if (!newPad) {
                            log("fake disconnectedgamepad:", oldPad);
                            rawDisconnectedCallbacks.forEach(cb => cb(oldPad));
                        }
                        else if ((oldPad.id !== newPad.id) || (oldPad.index !== newPad.index)) { // index should always be equal...?
                            log("fake disconnectedgamepad:", oldPad);
                            log("fake connectedgamepad:", newPad);
                            rawDisconnectedCallbacks.forEach(cb => cb(oldPad));
                            rawConnectedCallbacks.forEach(cb => cb(newPad));
                        }
                        else {
                            // id === id, index === index, but instance !== instance?  Hmm.
                        }
                    }
                });
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
            let mNameParen = /^(.+?)(?: \((.*)\))$/i.exec(id);
            if (!mNameParen)
                return undefined;
            let parsed = { name: mNameParen[1], vendor: "", product: "", hint: "blink" };
            let mVendorProduct = /(?:^| )Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})$/i.exec(mNameParen[2]);
            if (mVendorProduct) {
                parsed.vendor = mVendorProduct[1];
                parsed.product = mVendorProduct[2];
            }
            return parsed;
        }
        function parseGamepadId_Gecko(id) {
            if (id === "xinput")
                return { name: "xinput", vendor: "", product: "", hint: "gecko" };
            let m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
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
            let parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
            return parsed;
        }
        gamepad.parseGamepadId = parseGamepadId;
        const parsedIdExamples = [
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
        parsedIdExamples.forEach(example => {
            let parsed = JSON.stringify(parseGamepadId(example[0]));
            let expected = JSON.stringify(example[1]);
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
                var perFrame = () => {
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