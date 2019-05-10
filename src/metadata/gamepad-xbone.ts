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
    export interface ButtonMap extends XbOneButtonMap {}
    export interface DeviceTypeMap { "gamepad-xbone": void; }

    interface XbOneButtonMap {
        "gamepad-xbone-a": boolean;
        "gamepad-xbone-b": boolean;
        "gamepad-xbone-x": boolean;
        "gamepad-xbone-y": boolean;

        "gamepad-xbone-left-bumper": boolean;
        "gamepad-xbone-right-bumper": boolean;
        "gamepad-xbone-left-trigger": boolean;
        "gamepad-xbone-right-trigger": boolean;

        "gamepad-xbone-view": boolean;
        "gamepad-xbone-menu": boolean;
        "gamepad-xbone-xbox": boolean;
        "gamepad-xbone-left-stick-click": boolean;
        "gamepad-xbone-right-stick-click": boolean;
    }

    registerButtons<XbOneButtonMap>({
        "gamepad-xbone-a":                  "gamepad-microsoft-a",
        "gamepad-xbone-b":                  "gamepad-microsoft-b",
        "gamepad-xbone-x":                  "gamepad-microsoft-x",
        "gamepad-xbone-y":                  "gamepad-microsoft-y",

        "gamepad-xbone-left-bumper":        "gamepad-microsoft-left-bumper",
        "gamepad-xbone-right-bumper":       "gamepad-microsoft-right-bumper",
        "gamepad-xbone-left-trigger":       "gamepad-microsoft-left-trigger",
        "gamepad-xbone-right-trigger":      "gamepad-microsoft-right-trigger",

        "gamepad-xbone-view":               { "fallback": "gamepad-microsoft-back",     "en-US": "View Button" },
        "gamepad-xbone-menu":               { "fallback": "gamepad-microsoft-start",    "en-US": "Menu Button" },
        "gamepad-xbone-xbox":               { "fallback": "gamepad-microsoft-guide",    "en-US": "Xbox Button" },
        "gamepad-xbone-left-stick-click":   "gamepad-microsoft-left-stick-click",
        "gamepad-xbone-right-stick-click":  "gamepad-microsoft-right-stick-click",
    });

    registerDeviceType("gamepad-xbone", {
        "buttons": [
            "gamepad-xbone-a",
            "gamepad-xbone-b",
            "gamepad-xbone-x",
            "gamepad-xbone-y",

            "gamepad-xbone-left-bumper",
            "gamepad-xbone-right-bumper",
            "gamepad-xbone-left-trigger",
            "gamepad-xbone-right-trigger",

            "gamepad-xbone-view",
            "gamepad-xbone-menu",
            "gamepad-xbone-left-stick-click",
            "gamepad-xbone-right-stick-click",

            "gamepad-microsoft-dpad-up",
            "gamepad-microsoft-dpad-down",
            "gamepad-microsoft-dpad-left",
            "gamepad-microsoft-dpad-right",

            "gamepad-xbone-xbox",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("045e", "02d1", "gamepad-xbone", { "en-US": "Xbox One Controller" });
    registerDevice("045e", "02dd", "gamepad-xbone", { "en-US": "Xbox One Controller" }); // Firmware 2015
    registerDevice("045e", "02e3", "gamepad-xbone", { "en-US": "Xbox One Elite Controller" });
    registerDevice("045e", "02e6", "gamepad-xbone", { "en-US": "Wireless XBox Controller Dongle" });
    registerDevice("045e", "02ea", "gamepad-xbone", { "en-US": "Xbox One S Controller" });
    registerDevice("045e", "02fd", "gamepad-xbone", { "en-US": "Xbox One S Controller (Bluetooth)" });
}
