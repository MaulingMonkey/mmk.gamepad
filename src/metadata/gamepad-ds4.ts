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
}
