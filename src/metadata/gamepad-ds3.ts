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
    export interface ButtonMap extends Ds3ButtonMap {}
    export interface DeviceTypeMap { "gamepad-ds3": void; }

    interface Ds3ButtonMap {
        "gamepad-ds3-cross": boolean;
        "gamepad-ds3-circle": boolean;
        "gamepad-ds3-square": boolean;
        "gamepad-ds3-triangle": boolean;
        "gamepad-ds3-l1": boolean; // left bumper
        "gamepad-ds3-r1": boolean; // right bumper
        "gamepad-ds3-l2": boolean; // left trigger
        "gamepad-ds3-r2": boolean; // right trigger
        "gamepad-ds3-select": boolean;
        "gamepad-ds3-start": boolean;
        "gamepad-ds3-playstation": boolean;
        "gamepad-ds3-l3": boolean; // left stick button
        "gamepad-ds3-r3": boolean; // right stick button
    }


    registerButtons<Ds3ButtonMap>({
        "gamepad-ds3-cross":        "gamepad-sony-cross",
        "gamepad-ds3-circle":       "gamepad-sony-circle",
        "gamepad-ds3-square":       "gamepad-sony-square",
        "gamepad-ds3-triangle":     "gamepad-sony-triangle",
        "gamepad-ds3-l1":           "gamepad-sony-l1",
        "gamepad-ds3-r1":           "gamepad-sony-r1",
        "gamepad-ds3-l2":           "gamepad-sony-l2",
        "gamepad-ds3-r2":           "gamepad-sony-r2",
        "gamepad-ds3-select":       "gamepad-sony-select",
        "gamepad-ds3-start":        "gamepad-sony-start",
        "gamepad-ds3-playstation":  "gamepad-sony-playstation",
        "gamepad-ds3-l3":           "gamepad-sony-l3",
        "gamepad-ds3-r3":           "gamepad-sony-r3",
    });

    registerDeviceType("gamepad-ds3", {
        "buttons": [
            "gamepad-ds3-cross",
            "gamepad-ds3-circle",
            "gamepad-ds3-square",
            "gamepad-ds3-triangle",
            "gamepad-ds3-l1",
            "gamepad-ds3-r1",
            "gamepad-ds3-l2",
            "gamepad-ds3-r2",
            "gamepad-ds3-select",
            "gamepad-ds3-start",
            "gamepad-ds3-l3",
            "gamepad-ds3-r3",
            "gamepad-sony-dpad-up",
            "gamepad-sony-dpad-down",
            "gamepad-sony-dpad-left",
            "gamepad-sony-dpad-right",
            "gamepad-ds3-playstation",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("054c", "0268", "gamepad-ds3", { "en-US": "DualShock 3 Controller" }); // aka "Sixaxis" / "PlayStation 3 Controller"

    registerRemap({
        "mapping": "standard",
        "tested": [
            "Windows 10 / Chrome 75.0.3770.100",
            "Windows 10 / Opera 60.0.3255.170",
            "Windows 10 / Opera 62.0.3331.43"
        ],
        "matches": [
            "054c-0268-blink-10-24", // DualShock 3 / "Sony PLAYSTATION(R)3 Controller"
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a2"}, {"src":"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        "buttons": [
            {"src":"b2"}, {"src":"b1"}, {"src":"b3"}, {"src":"b0"}, // ABXY
            {"src":"b6"}, {"src":"b7"}, {"src":"a3", "xform":"11-10", "param": 0.125}, {"src":"a4", "xform":"11-10", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b9"}, {"src":"b8"}, {"src":"b10"}, {"src":"b11"}, // Select, Start, Left Thumb, Right Thumb
            {"src":"a9", "xform":"hat-up-bit"}, {"src":"a9", "xform":"hat-down-bit"}, {"src":"a9", "xform":"hat-left-bit"}, {"src":"a9", "xform":"hat-right-bit"}, // DPad (Up Down Left Right)
            // -- end of standard layout
            {"src":"b12"}, // PS Logo Button
        ]
    });
    // Note: Axis 6 is ignored (Maps to X button pressure - O button pressure is missing, so let's not support X either)
    // Note: Lots of buttons ignored (dead)

    registerRemap({
        "mapping": "standard",
        "tested": [
            "Windows 10 / FireFox 67.0.2"
        ],
        "matches": [
            //"054c-0268-gecko-8-28", // DualShock 3 / "Sony PLAYSTATION(R)3 Controller"
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a2"}, {"src":"a5"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        // a6: X button pressure.  No axis for O button pressure.
        "buttons": [
            {"src":"b2"}, {"src":"b1"}, {"src":"b3"}, {"src":"b0"}, // ABXY
            {"src":"b6"}, {"src":"b7"}, {"src":"a3", "xform":"11-10", "param": 0.125}, {"src":"a4", "xform":"11-10", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b9"}, {"src":"b8"}, {"src":"b10"}, {"src":"b11"}, // Select, Start, Left Thumb, Right Thumb
            {"src":"b13"}, {"src":"b14"}, {"src":"b15"}, {"src":"b16"}, // DPad - note that these are dead in current FireFox builds
            // -- end of standard layout
            {"src":"b12"}, // PS Logo Button
        ]
    });
    // Note: Axis 6-7 are ignored (Both map to X button pressure - O button pressure is missing, so let's not support X either)
    // Note: Lots of buttons ignored (dead)

    registerRemap({
        "mapping": "standard",
        "tested": ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
        "matches": [
            "054c-0268-gecko-6-17", // DualShock 3 / "Sony PLAYSTATION(R)3 Controller"
        ],
        "axes": [{"src":"a0"}, {"src":"a1"}, {"src":"a3"}, {"src":"a4"}], // Left Stick X (+Right), Left Stick Y (+Down), Right Stick X (+Right), Right Stick Y (+Down)
        "buttons": [
            {"src":"b0"}, {"src":"b1"}, {"src":"b3"}, {"src":"b2"}, // ABXY
            {"src":"b4"}, {"src":"b5"}, {"src":"a2", "xform":"11-01", "param": 0.125}, {"src":"a5", "xform":"11-01", "param": 0.125}, // Left Shoulder, Right Shoulder, Left Trigger, Right Trigger
            {"src":"b8"}, {"src":"b9"}, {"src":"b11"}, {"src":"b12"}, // Select, Start, Left Thumb, Right Thumb
            {"src":"b13"}, {"src":"b14"}, {"src":"b15"}, {"src":"b16"},
            // -- end of standard layout
            {"src":"b10"}, // PS Logo Button
        ]
    });
}
