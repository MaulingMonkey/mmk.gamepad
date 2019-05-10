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
}
