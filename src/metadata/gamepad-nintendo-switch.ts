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
    export interface ButtonMap extends NintendoSwitchButtonMap {}
    export interface DeviceTypeMap { "gamepad-nintendo-switch": void; }

    interface NintendoSwitchButtonMap {
        "gamepad-nintendo-switch-b": boolean;
        "gamepad-nintendo-switch-a": boolean;
        "gamepad-nintendo-switch-y": boolean;
        "gamepad-nintendo-switch-x": boolean;
        "gamepad-nintendo-switch-left-bumper": boolean;
        "gamepad-nintendo-switch-right-bumper": boolean;
        "gamepad-nintendo-switch-left-trigger": boolean;
        "gamepad-nintendo-switch-right-trigger": boolean;
        "gamepad-nintendo-switch-minus": boolean;
        "gamepad-nintendo-switch-plus": boolean;
        "gamepad-nintendo-switch-capture": boolean;
        "gamepad-nintendo-switch-home": boolean;
        "gamepad-nintendo-switch-left-stick-click": boolean;
        "gamepad-nintendo-switch-right-stick-click": boolean;
        "gamepad-nintendo-switch-dpad-up": boolean;
        "gamepad-nintendo-switch-dpad-down": boolean;
        "gamepad-nintendo-switch-dpad-left": boolean;
        "gamepad-nintendo-switch-dpad-right": boolean;
    }

    registerButtons<NintendoSwitchButtonMap>({
        "gamepad-nintendo-switch-b":                  { "en-US": "B Button",          "fallback": "gamepad-facepad-down"      },
        "gamepad-nintendo-switch-a":                  { "en-US": "A Button",          "fallback": "gamepad-facepad-right"     },
        "gamepad-nintendo-switch-y":                  { "en-US": "Y Button",          "fallback": "gamepad-facepad-left"      },
        "gamepad-nintendo-switch-x":                  { "en-US": "X Button",          "fallback": "gamepad-facepad-up"        },
        "gamepad-nintendo-switch-left-bumper":        { "en-US": "L (Left Bumper)",   "fallback": "gamepad-left-bumper"       },
        "gamepad-nintendo-switch-right-bumper":       { "en-US": "R (Right Bumper)",  "fallback": "gamepad-right-bumper"      },
        "gamepad-nintendo-switch-left-trigger":       { "en-US": "ZL (Left Trigger)", "fallback": "gamepad-left-trigger"      },
        "gamepad-nintendo-switch-right-trigger":      { "en-US": "ZR (Right Trigger)","fallback": "gamepad-right-trigger"     },
        "gamepad-nintendo-switch-minus":              { "en-US": "Minus Button",      "fallback": "gamepad-face-left"         },
        "gamepad-nintendo-switch-plus":               { "en-US": "Plus Button",       "fallback": "gamepad-face-right"        },
        "gamepad-nintendo-switch-capture":            { "en-US": "Capture Button",    "fallback": "gamepad-logo"              },
        "gamepad-nintendo-switch-home":               { "en-US": "Home Button",       "fallback": "gamepad-logo"              },
        "gamepad-nintendo-switch-left-stick-click":   { "en-US": "Left Stick Click",  "fallback": "gamepad-left-stick-click"  },
        "gamepad-nintendo-switch-right-stick-click":  { "en-US": "Right Stick Click", "fallback": "gamepad-right-stick-click" },
        "gamepad-nintendo-switch-dpad-up":            "gamepad-dpad-up",
        "gamepad-nintendo-switch-dpad-down":          "gamepad-dpad-down",
        "gamepad-nintendo-switch-dpad-left":          "gamepad-dpad-left",
        "gamepad-nintendo-switch-dpad-right":         "gamepad-dpad-right",
    });

    registerDeviceType("gamepad-nintendo-switch", {
        "buttons": [
            "gamepad-nintendo-switch-b",
            "gamepad-nintendo-switch-a",
            "gamepad-nintendo-switch-y",
            "gamepad-nintendo-switch-x",
            "gamepad-nintendo-switch-left-bumper",
            "gamepad-nintendo-switch-right-bumper",
            "gamepad-nintendo-switch-left-trigger",
            "gamepad-nintendo-switch-right-trigger",
            "gamepad-nintendo-switch-minus",
            "gamepad-nintendo-switch-plus",
            "gamepad-nintendo-switch-left-stick-click",
            "gamepad-nintendo-switch-right-stick-click",
            "gamepad-nintendo-switch-dpad-up",
            "gamepad-nintendo-switch-dpad-down",
            "gamepad-nintendo-switch-dpad-left",
            "gamepad-nintendo-switch-dpad-right",
            "gamepad-nintendo-switch-home",
            "gamepad-nintendo-switch-capture",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });

    registerDevice("057e", "2009", "gamepad-nintendo-switch", { "en-US": "Nintendo Switch Pro Controller" });

    // Windows 10 Chrome 75.0.3770.100:  No remaps necessary, supported out of the box.
    // Windows 10 Opera  62.0.3331.43:   No remaps necessary, supported out of the box.
    // Windows 10 FireFox 67.0.4:  No data... unless chrome is poking it, then completely bogus data.  Remap pointless.
    // Linux:  ?
}
