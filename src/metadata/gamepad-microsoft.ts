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
    export interface ButtonMap extends MicrosoftButtonMap {}
    export interface DeviceTypeMap { "gamepad-xinput": void; }

    interface MicrosoftButtonMap {
        "gamepad-microsoft-a": boolean;
        "gamepad-microsoft-b": boolean;
        "gamepad-microsoft-x": boolean;
        "gamepad-microsoft-y": boolean;
        "gamepad-microsoft-left-bumper": boolean;
        "gamepad-microsoft-right-bumper": boolean;
        "gamepad-microsoft-left-trigger": boolean;
        "gamepad-microsoft-right-trigger": boolean;
        "gamepad-microsoft-back": boolean;
        "gamepad-microsoft-start": boolean;
        "gamepad-microsoft-guide": boolean;
        "gamepad-microsoft-left-stick-click": boolean;
        "gamepad-microsoft-right-stick-click": boolean;
        "gamepad-microsoft-dpad-up": boolean;
        "gamepad-microsoft-dpad-down": boolean;
        "gamepad-microsoft-dpad-left": boolean;
        "gamepad-microsoft-dpad-right": boolean;
    }


    registerButtons<MicrosoftButtonMap>({
        "gamepad-microsoft-a":                  { "en-US": "A Button",          "fallback": "gamepad-facepad-down"      },
        "gamepad-microsoft-b":                  { "en-US": "B Button",          "fallback": "gamepad-facepad-right"     },
        "gamepad-microsoft-x":                  { "en-US": "X Button",          "fallback": "gamepad-facepad-left"      },
        "gamepad-microsoft-y":                  { "en-US": "Y Button",          "fallback": "gamepad-facepad-up"        },
        "gamepad-microsoft-left-bumper":        { "en-US": "Left Bumper",       "fallback": "gamepad-left-bumper"       },
        "gamepad-microsoft-right-bumper":       { "en-US": "Right Bumper",      "fallback": "gamepad-right-bumper"      },
        "gamepad-microsoft-left-trigger":       { "en-US": "Left Trigger",      "fallback": "gamepad-left-trigger"      },
        "gamepad-microsoft-right-trigger":      { "en-US": "Right Trigger",     "fallback": "gamepad-right-trigger"     },
        "gamepad-microsoft-back":               { "en-US": "Back Button",       "fallback": "gamepad-face-left"         },
        "gamepad-microsoft-start":              { "en-US": "Start Button",      "fallback": "gamepad-face-right"        },
        "gamepad-microsoft-guide":              { "en-US": "Guide Button",      "fallback": "gamepad-logo"              },
        "gamepad-microsoft-left-stick-click":   { "en-US": "Left Stick Click",  "fallback": "gamepad-left-stick-click"  },
        "gamepad-microsoft-right-stick-click":  { "en-US": "Right Stick Click", "fallback": "gamepad-right-stick-click" },
        "gamepad-microsoft-dpad-up":            "gamepad-dpad-up",
        "gamepad-microsoft-dpad-down":          "gamepad-dpad-down",
        "gamepad-microsoft-dpad-left":          "gamepad-dpad-left",
        "gamepad-microsoft-dpad-right":         "gamepad-dpad-right",
    });

    registerDeviceType("gamepad-xinput", {
        "buttons": [
            "gamepad-microsoft-a",
            "gamepad-microsoft-b",
            "gamepad-microsoft-x",
            "gamepad-microsoft-y",
            "gamepad-left-bumper",
            "gamepad-right-bumper",
            "gamepad-left-trigger",
            "gamepad-right-trigger",
            "gamepad-microsoft-back",
            "gamepad-microsoft-start",
            "gamepad-left-stick-click",
            "gamepad-right-stick-click",
            "gamepad-dpad-up",
            "gamepad-dpad-down",
            "gamepad-dpad-left",
            "gamepad-dpad-right",
            "gamepad-microsoft-guide",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("", "", "gamepad-xinput", { "en-US": "Xbox Style Gamepad (XInput)" });
}
