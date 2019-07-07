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

namespace mmk.gamepad.metadata {
    export interface ButtonMap extends Ds4ButtonMap {}
    export interface DeviceTypeMap { "gamepad-ds4": void; }

    interface Ds4ButtonMap {
        "gamepad-ds4-cross": boolean;
        "gamepad-ds4-circle": boolean;
        "gamepad-ds4-square": boolean;
        "gamepad-ds4-triangle": boolean;
        "gamepad-ds4-l1": boolean; // left bumper
        "gamepad-ds4-r1": boolean; // right bumper
        "gamepad-ds4-l2": boolean; // left trigger
        "gamepad-ds4-r2": boolean; // right trigger
        "gamepad-ds4-share": boolean;
        "gamepad-ds4-options": boolean;
        "gamepad-ds4-playstation": boolean;
        "gamepad-ds4-l3": boolean; // left stick button
        "gamepad-ds4-r3": boolean; // right stick button
        "gamepad-ds4-touchpad": boolean;
    }

    registerButtons<Ds4ButtonMap>({
        "gamepad-ds4-cross":        "gamepad-sony-cross",
        "gamepad-ds4-circle":       "gamepad-sony-circle",
        "gamepad-ds4-square":       "gamepad-sony-square",
        "gamepad-ds4-triangle":     "gamepad-sony-triangle",
        "gamepad-ds4-l1":           "gamepad-sony-l1",
        "gamepad-ds4-r1":           "gamepad-sony-r1",
        "gamepad-ds4-l2":           "gamepad-sony-l2",
        "gamepad-ds4-r2":           "gamepad-sony-r2",
        "gamepad-ds4-share":        { "fallback": "gamepad-sony-select",    "en-US": "SHARE" },
        "gamepad-ds4-options":      { "fallback": "gamepad-sony-start",     "en-US": "OPTIONS" },
        "gamepad-ds4-playstation":  "gamepad-sony-playstation",
        "gamepad-ds4-l3":           "gamepad-sony-l3",
        "gamepad-ds4-r3":           "gamepad-sony-r3",
        "gamepad-ds4-touchpad":     "gamepad-sony-touchpad",
    });

    registerDeviceType("gamepad-ds4", {
        "buttons": [
            "gamepad-ds4-cross",
            "gamepad-ds4-circle",
            "gamepad-ds4-square",
            "gamepad-ds4-triangle",
            "gamepad-ds4-l1",
            "gamepad-ds4-r1",
            "gamepad-ds4-l2",
            "gamepad-ds4-r2",
            "gamepad-ds4-share",
            "gamepad-ds4-options",
            "gamepad-ds4-l3",
            "gamepad-ds4-r3",
            "gamepad-sony-dpad-up",
            "gamepad-sony-dpad-down",
            "gamepad-sony-dpad-left",
            "gamepad-sony-dpad-right",
            "gamepad-ds4-playstation",
            "gamepad-ds4-touchpad",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("054c", "054c", "gamepad-ds4", { "en-US": "DualShock 4 Controller" });
    registerDevice("054c", "09cc", "gamepad-ds4", { "en-US": "DualShock 4 Controller (2nd Gen)" });
    registerDevice("054c", "0ba0", "gamepad-ds4", { "en-US": "DualShock 4 Wireless Adapter" });


    registerRemap({
        "mapping": "standard",
        "tested": ["Windows 7 / Opera 52.0.2871.99"],
        "matches": [
            "054c-054c-blink-10-14", // DualShock 4
            "054c-09cc-blink-10-14", // DualShock 4 (2nd Gen)
            "054c-0ba0-blink-10-14", // DualShock 4 Wireless Adapter
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a2"}, {"src":"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        "buttons": [
            {"src":"b1"}, {"src":"b2"}, {"src":"b0"}, {"src":"b3"}, // ABXY
            {"src":"b4"}, {"src":"b5"}, {"src":"a3", "xform":"11-01", "param": 0.125}, {"src":"a4", "xform":"11-01", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b8"}, {"src":"b9"}, {"src":"b10"}, {"src":"b11"}, // Back, Start, Left Thumb, Right Thumb
            {"src":"a9", "xform":"hat-up-bit"}, {"src":"a9", "xform":"hat-down-bit"}, {"src":"a9", "xform":"hat-left-bit"}, {"src":"a9", "xform":"hat-right-bit"}, // DPad (Up Down Left Right)
            // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
            {"src":"b12"}, // Guide button
            {"src":"b13"}  // Touchpad click (unavailable on FireFox)
        ]
        // Note: Axis 6-8 are ignored (dead)
        // Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
    });

    registerRemap({
        "mapping": "standard",
        "tested": ["Windows 7 / Firefox 62.0a1 (2018-05-09) - DPad busted"],
        "matches": [
            "054c-054c-gecko-8-18", // DualShock 4
            "054c-09cc-gecko-8-18", // DualShock 4 (2nd Gen)
            "054c-0ba0-gecko-8-18", // DualShock 4 Wireless Adapter
            "054c-054c-gecko-6-18", // DualShock 4                   - optimistic prepatch in case 2 dead axises are ever dropped 
            "054c-09cc-gecko-6-18", // DualShock 4 (2nd Gen)         - optimistic prepatch in case 2 dead axises are ever dropped
            "054c-0ba0-gecko-6-18", // DualShock 4 Wireless Adapter  - optimistic prepatch in case 2 dead axises are ever dropped
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a2"}, {"src":"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        "buttons": [
            {"src":"b1"}, {"src":"b2"}, {"src":"b0"}, {"src":"b3"}, // ABXY
            {"src":"b4"}, {"src":"b5"}, {"src":"a3", "xform":"11-01", "param": 0.125}, {"src":"a4", "xform":"11-01", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b8"}, {"src":"b9"}, {"src":"b10"}, {"src":"b11"}, // Back, Start, Left Thumb, Right Thumb
            {"src":"b14"}, {"src":"b15"}, {"src":"b16"}, {"src":"b17"}, // DPad - note that these are dead in current FireFox builds
            // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
            {"src":"b12"}, // Guide button
            {"src":"b13"}  // Touchpad click (unavailable on FireFox)
        ]
        // Note: Axis 6-7 are ignored (dead)
        // Note: Button 6 and 7 are ignored (overlaps with axis 3/4 for triggers)
    });

    registerRemap({
        "mapping": "standard",
        "tested": ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
        "matches": [
            "054c-054c-gecko-8-13", // DualShock 4 Controller
            "054c-09cc-gecko-8-13", // DualShock 4 Controller (2nd Gen)
            "054c-0ba0-gecko-8-13", // DualShock 4 Wireless Adapter
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a3"}, {"src":"a4"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        "buttons": [
            {"src":"b0"}, {"src":"b1"}, {"src":"b3"}, {"src":"b2"}, // ABXY
            {"src":"b4"}, {"src":"b5"}, {"src":"a2", "xform":"11-01", "param": 0.125}, {"src":"a5", "xform":"11-01", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b8"}, {"src":"b9"}, {"src":"b11"}, {"src":"b12"}, // Back, Start, Left Thumb, Right Thumb
            {"src":"a7", "xform":"axis-negative-01"}, {"src":"a7", "xform":"axis-positive-01"}, {"src":"a6", "xform":"axis-negative-01"}, {"src":"a6", "xform":"axis-positive-01"}, // DPad (Up Down Left Right)
            // -- end of standard layout - bellow matches existing wired ds4 connection standard of chrome/blink
            {"src":"b10"}, // Guide button
            // No touchpad click - Firefox on Linux remaps the touchpad to the mouse!
        ]
    });

    registerRemap({
        "mapping": "standard",
        // Did version_number get bumped again maybe?  These are mappings for a "standard" layout
        // https://cs.chromium.org/chromium/src/device/gamepad/gamepad_standard_mappings_linux.cc?l=573-580
        "tested": ["Ubuntu 18.04 LTS / Chrome 66.0.3359.139"],
        "matches": [
            "054c-054c-blink-4-18", // DualShock 4 Controller
            "054c-09cc-blink-4-18", // DualShock 4 Controller (2nd Gen)
            "054c-0ba0-blink-4-18", // DualShock 4 Wireless Adapter
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"b6", "xform":"01-11"}, {"src":"b7", "xform":"01-11"}],
        "buttons": [
            {"src":"b2"}, {"src":"b0"}, {"src":"b3"}, {"src":"b1"},
            {"src":"b4"}, {"src":"b5"}, {"src":"a2", "xform":"11-01", "param": 0.125}, {"src":"a3", "xform":"11-01", "param": 0.125},
            {"src":"b8"}, {"src":"b9"}, {"src":"b11"}, {"src":"b16"},
            {"src":"b12"}, {"src":"b13"}, {"src":"b14"}, {"src":"b15"},
            // -- end of standard layout
            {"src":"b10"},
        ],
    });
}
