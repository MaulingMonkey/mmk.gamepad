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
    export interface ButtonMap extends SonyButtonMap {}

    interface SonyButtonMap {
        "gamepad-sony-cross": boolean;
        "gamepad-sony-circle": boolean;
        "gamepad-sony-square": boolean;
        "gamepad-sony-triangle": boolean;
        "gamepad-sony-l1": boolean;
        "gamepad-sony-r1": boolean;
        "gamepad-sony-l2": boolean;
        "gamepad-sony-r2": boolean;
        "gamepad-sony-select": boolean;
        "gamepad-sony-start": boolean;
        "gamepad-sony-playstation": boolean;
        "gamepad-sony-l3": boolean;
        "gamepad-sony-r3": boolean;
        "gamepad-sony-touchpad": boolean;
        "gamepad-sony-dpad-up": boolean;
        "gamepad-sony-dpad-down": boolean;
        "gamepad-sony-dpad-left": boolean;
        "gamepad-sony-dpad-right": boolean;
    }

    registerButtons<SonyButtonMap>({
        "gamepad-sony-cross":        { "en-US": "Cross",            "fallback": "gamepad-facepad-down"      },
        "gamepad-sony-circle":       { "en-US": "Circle",           "fallback": "gamepad-facepad-right"     },
        "gamepad-sony-square":       { "en-US": "Square",           "fallback": "gamepad-facepad-left"      },
        "gamepad-sony-triangle":     { "en-US": "Triangle",         "fallback": "gamepad-facepad-up"        },
        "gamepad-sony-l1":           { "en-US": "L1 Bumper",        "fallback": "gamepad-left-bumper"       },
        "gamepad-sony-r1":           { "en-US": "R1 Bumper",        "fallback": "gamepad-right-bumper"      },
        "gamepad-sony-l2":           { "en-US": "L2 Trigger",       "fallback": "gamepad-left-trigger"      },
        "gamepad-sony-r2":           { "en-US": "R2 Trigger",       "fallback": "gamepad-right-trigger"     },
        "gamepad-sony-select":       { "en-US": "Select",           "fallback": "gamepad-face-left"         },
        "gamepad-sony-start":        { "en-US": "Start",            "fallback": "gamepad-face-right"        },
        "gamepad-sony-playstation":  { "en-US": "PS Button",        "fallback": "gamepad-logo"              },
        "gamepad-sony-l3":           { "en-US": "L3 Thumbstick",    "fallback": "gamepad-left-stick-click"  },
        "gamepad-sony-r3":           { "en-US": "R3 Thumbstick",    "fallback": "gamepad-right-stick-click" },
        "gamepad-sony-touchpad":     { "en-US": "Touchpad Button", /* no fallback */ },
        "gamepad-sony-dpad-up":      "gamepad-dpad-up",
        "gamepad-sony-dpad-down":    "gamepad-dpad-down",
        "gamepad-sony-dpad-left":    "gamepad-dpad-left",
        "gamepad-sony-dpad-right":   "gamepad-dpad-right",
    });
}
