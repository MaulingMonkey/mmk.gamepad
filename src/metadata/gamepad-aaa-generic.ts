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
    export interface ButtonMap extends GenericGamepadButtonMap {}
    export interface AxisMap extends GenericGamepadAxisMap {}
    export interface StickMap extends GenericGamepadStickMap {}
    export interface DeviceTypeMap { "gamepad-unknown": void; }

    interface GenericGamepadButtonMap {
        "gamepad-facepad-down": boolean;
        "gamepad-facepad-right": boolean;
        "gamepad-facepad-left": boolean;
        "gamepad-facepad-up": boolean;
        "gamepad-left-bumper": boolean;
        "gamepad-right-bumper": boolean;
        "gamepad-left-trigger": boolean;
        "gamepad-right-trigger": boolean;
        "gamepad-face-left": boolean;
        "gamepad-face-right": boolean;
        "gamepad-logo": boolean;
        "gamepad-left-stick-click": boolean;
        "gamepad-right-stick-click": boolean;
        "gamepad-dpad-up": boolean;
        "gamepad-dpad-down": boolean;
        "gamepad-dpad-left": boolean;
        "gamepad-dpad-right": boolean;
    }

    interface GenericGamepadStickMap {
        "gamepad-left-thumb": void;
        "gamepad-right-thumb": void;
    }

    interface GenericGamepadAxisMap {
        "gamepad-left-thumb-x": number;
        "gamepad-left-thumb-y": number;
        "gamepad-right-thumb-x": number;
        "gamepad-right-thumb-y": number;
    }

    registerButtons<GenericGamepadButtonMap>({
        "gamepad-facepad-down":       { "en-US": "Face Down (A?) Button"    },
        "gamepad-facepad-right":      { "en-US": "Face Right (B?) Button"   },
        "gamepad-facepad-left":       { "en-US": "Face Left (X?) Button"    },
        "gamepad-facepad-up":         { "en-US": "Face Up (Y?) Button"      },
        "gamepad-left-bumper":        { "en-US": "Left Bumper"              },
        "gamepad-right-bumper":       { "en-US": "Right Bumper"             },
        "gamepad-left-trigger":       { "en-US": "Left Trigger"             },
        "gamepad-right-trigger":      { "en-US": "Right Trigger"            },
        "gamepad-face-left":          { "en-US": "Left Face (Back)"         },
        "gamepad-face-right":         { "en-US": "Right Face (Start)"       },
        "gamepad-logo":               { "en-US": "Gamepad Logo"             },
        "gamepad-left-stick-click":   { "en-US": "Left Stick Click"         },
        "gamepad-right-stick-click":  { "en-US": "Right Stick Click"        },
        "gamepad-dpad-up":            { "en-US": "D-Pad Up"                 },
        "gamepad-dpad-down":          { "en-US": "D-Pad Down"               },
        "gamepad-dpad-left":          { "en-US": "D-Pad Left"               },
        "gamepad-dpad-right":         { "en-US": "D-Pad Right"              },
    });

    regsiterAxises<GenericGamepadAxisMap>({
        "gamepad-left-thumb-x":  { "range": "11", "min": "left", "max": "right", "en-US": "Left Thumbstick X Axis",  "stick": "gamepad-left-thumb" },
        "gamepad-left-thumb-y":  { "range": "11", "min": "up",   "max": "down",  "en-US": "Left Thumbstick Y Axis",  "stick": "gamepad-left-thumb" },
        "gamepad-right-thumb-x": { "range": "11", "min": "left", "max": "right", "en-US": "Right Thumbstick X Axis", "stick": "gamepad-right-thumb" },
        "gamepad-right-thumb-y": { "range": "11", "min": "up",   "max": "down",  "en-US": "Right Thumbstick Y Axis", "stick": "gamepad-right-thumb" },
    });

    registerDeviceType("gamepad-unknown", {
        "buttons": [
            "gamepad-facepad-down",
            "gamepad-facepad-right",
            "gamepad-facepad-left",
            "gamepad-facepad-up",
            "gamepad-left-bumper",
            "gamepad-right-bumper",
            "gamepad-left-trigger",
            "gamepad-right-trigger",
            "gamepad-face-left",
            "gamepad-face-right",
            "gamepad-left-stick-click",
            "gamepad-right-stick-click",
            "gamepad-dpad-up",
            "gamepad-dpad-down",
            "gamepad-dpad-left",
            "gamepad-dpad-right",
            "gamepad-logo",
        ],
        "axises": [
            "gamepad-left-thumb-x",
            "gamepad-left-thumb-y",
            "gamepad-right-thumb-x",
            "gamepad-right-thumb-y",
        ]
    });
}
