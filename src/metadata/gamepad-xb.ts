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
    export interface ButtonMap extends XboxButtonMap {}
    export interface DeviceTypeMap { "gamepad-xbox": void; }

    interface XboxButtonMap {
        "gamepad-xbox-a": boolean;
        "gamepad-xbox-b": boolean;
        "gamepad-xbox-x": boolean;
        "gamepad-xbox-y": boolean;

        "gamepad-xbox-left-bumper": boolean;
        "gamepad-xbox-right-bumper": boolean;
        "gamepad-xbox-left-trigger": boolean;
        "gamepad-xbox-right-trigger": boolean;

        "gamepad-xbox-back": boolean;
        "gamepad-xbox-start": boolean;
        "gamepad-xbox-guide": boolean;
        "gamepad-xbox-left-stick-click": boolean;
        "gamepad-xbox-right-stick-click": boolean;
    }

    registerButtons<XboxButtonMap>({
        "gamepad-xbox-a":                  "gamepad-microsoft-a",
        "gamepad-xbox-b":                  "gamepad-microsoft-b",
        "gamepad-xbox-x":                  "gamepad-microsoft-x",
        "gamepad-xbox-y":                  "gamepad-microsoft-y",

        "gamepad-xbox-left-bumper":        "gamepad-microsoft-left-bumper",
        "gamepad-xbox-right-bumper":       "gamepad-microsoft-right-bumper",
        "gamepad-xbox-left-trigger":       "gamepad-microsoft-left-trigger",
        "gamepad-xbox-right-trigger":      "gamepad-microsoft-right-trigger",

        "gamepad-xbox-back":               "gamepad-microsoft-back",
        "gamepad-xbox-start":              "gamepad-microsoft-start",
        "gamepad-xbox-guide":              "gamepad-microsoft-guide",
        "gamepad-xbox-left-stick-click":   "gamepad-microsoft-left-stick-click",
        "gamepad-xbox-right-stick-click":  "gamepad-microsoft-right-stick-click",
    });

    registerDeviceType("gamepad-xbox", {
        "buttons": [
            "gamepad-xbox-a",
            "gamepad-xbox-b",
            "gamepad-xbox-x",
            "gamepad-xbox-y",

            "gamepad-xbox-left-bumper",
            "gamepad-xbox-right-bumper",
            "gamepad-xbox-left-trigger",
            "gamepad-xbox-right-trigger",

            "gamepad-xbox-back",
            "gamepad-xbox-start",
            "gamepad-xbox-left-stick-click",
            "gamepad-xbox-right-stick-click",

            "gamepad-microsoft-dpad-up",
            "gamepad-microsoft-dpad-down",
            "gamepad-microsoft-dpad-left",
            "gamepad-microsoft-dpad-right",

            "gamepad-xbox-guide",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("045e", "0202", "gamepad-xbox", { "en-US": "Xbox Controller" });
    registerDevice("045e", "0285", "gamepad-xbox", { "en-US": "Xbox Controller S" });
    registerDevice("045e", "0289", "gamepad-xbox", { "en-US": "Xbox Controller S" });
}
