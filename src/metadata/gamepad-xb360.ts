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
    export interface ButtonMap extends Xb360ButtonMap {}
    export interface DeviceTypeMap { "gamepad-xb360": void; }

    interface Xb360ButtonMap {
        "gamepad-xb360-a": boolean;
        "gamepad-xb360-b": boolean;
        "gamepad-xb360-x": boolean;
        "gamepad-xb360-y": boolean;

        "gamepad-xb360-left-bumper": boolean;
        "gamepad-xb360-right-bumper": boolean;
        "gamepad-xb360-left-trigger": boolean;
        "gamepad-xb360-right-trigger": boolean;

        "gamepad-xb360-back": boolean;
        "gamepad-xb360-start": boolean;
        "gamepad-xb360-guide": boolean;
        "gamepad-xb360-left-stick-click": boolean;
        "gamepad-xb360-right-stick-click": boolean;
    }

    registerButtons<Xb360ButtonMap>({
        "gamepad-xb360-a":                  "gamepad-microsoft-a",
        "gamepad-xb360-b":                  "gamepad-microsoft-b",
        "gamepad-xb360-x":                  "gamepad-microsoft-x",
        "gamepad-xb360-y":                  "gamepad-microsoft-y",

        "gamepad-xb360-left-bumper":        "gamepad-microsoft-left-bumper",
        "gamepad-xb360-right-bumper":       "gamepad-microsoft-right-bumper",
        "gamepad-xb360-left-trigger":       "gamepad-microsoft-left-trigger",
        "gamepad-xb360-right-trigger":      "gamepad-microsoft-right-trigger",

        "gamepad-xb360-back":               "gamepad-microsoft-back",
        "gamepad-xb360-start":              "gamepad-microsoft-start",
        "gamepad-xb360-guide":              "gamepad-microsoft-guide",
        "gamepad-xb360-left-stick-click":   "gamepad-microsoft-left-stick-click",
        "gamepad-xb360-right-stick-click":  "gamepad-microsoft-right-stick-click",
    });

    registerDeviceType("gamepad-xb360", {
        "buttons": [
            "gamepad-xb360-a",
            "gamepad-xb360-b",
            "gamepad-xb360-x",
            "gamepad-xb360-y",

            "gamepad-xb360-left-bumper",
            "gamepad-xb360-right-bumper",
            "gamepad-xb360-left-trigger",
            "gamepad-xb360-right-trigger",

            "gamepad-xb360-back",
            "gamepad-xb360-start",
            "gamepad-xb360-left-stick-click",
            "gamepad-xb360-right-stick-click",

            "gamepad-microsoft-dpad-up",
            "gamepad-microsoft-dpad-down",
            "gamepad-microsoft-dpad-left",
            "gamepad-microsoft-dpad-right",

            "gamepad-xb360-guide",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("045e", "028e", "gamepad-xb360", { "en-US": "Xbox 360 Controller" });
    registerDevice("045e", "028f", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Controller" });
    registerDevice("045e", "0291", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Receiver for Windows" });
    registerDevice("045e", "02a1", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Receiver for Windows" });
}
