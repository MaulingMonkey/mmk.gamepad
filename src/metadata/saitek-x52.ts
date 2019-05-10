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
    export interface ButtonMap extends SaitekX52ButtonMap {}
    export interface AxisMap extends SaitekX52AxisMap {}
    export interface StickMap extends SaitekX52StickMap {}
    export interface DeviceTypeMap { "saitek-x52": void; }

    interface SaitekX52ButtonMap {
        "saitek-x52-trigger-half": boolean;
        "saitek-x52-trigger-full": boolean;
        "saitek-x52-trigger-pinky": boolean;
        "saitek-x52-fire": boolean;
        "saitek-x52-a": boolean;
        "saitek-x52-b": boolean;
        "saitek-x52-c": boolean;
        "saitek-x52-d": boolean;
        "saitek-x52-e": boolean;
        "saitek-x52-i": boolean;
        "saitek-x52-t1": boolean;
        "saitek-x52-t2": boolean;
        "saitek-x52-t3": boolean;
        "saitek-x52-t4": boolean;
        "saitek-x52-t5": boolean;
        "saitek-x52-t6": boolean;
        "saitek-x52-mfd-function": boolean;
        "saitek-x52-mfd-up": boolean;
        "saitek-x52-mfd-down": boolean;
        "saitek-x52-hat-thumb-up": boolean;
        "saitek-x52-hat-thumb-down": boolean;
        "saitek-x52-hat-thumb-left": boolean;
        "saitek-x52-hat-thumb-right": boolean;
        "saitek-x52-hat-alt-up": boolean;
        "saitek-x52-hat-alt-down": boolean;
        "saitek-x52-hat-alt-left": boolean;
        "saitek-x52-hat-alt-right": boolean;
        "saitek-x52-hat-throttle-up": boolean;
        "saitek-x52-hat-throttle-down": boolean;
        "saitek-x52-hat-throttle-left": boolean;
        "saitek-x52-hat-throttle-right": boolean;
        "saitek-x52-mouse-click": boolean;
        "saitek-x52-mouse-wheel": boolean;
        "saitek-x52-mode-a": boolean;
        "saitek-x52-mode-b": boolean;
        "saitek-x52-mode-c": boolean;
        "saitek-x52-mouse-wheel-down": boolean;
        "saitek-x52-mouse-wheel-up": boolean;
    }

    interface SaitekX52StickMap {
        "saitek-x52-joystick": void;
        "saitek-x52-mouse": void;
    }

    interface SaitekX52AxisMap {
        "saitek-x52-mouse-x": number;
        "saitek-x52-mouse-y": number;
        "saitek-x52-throttle": number;
        "saitek-x52-throttle-thumb-slider": number;
        "saitek-x52-joystick-x": number;
        "saitek-x52-joystick-y": number;
        "saitek-x52-joystick-twist": number;
        "saitek-x52-e-dial": number;
        "saitek-x52-i-dial": number;
    }

    registerButtons<SaitekX52ButtonMap>({
        // XXX: Should probably add some "joystick-*" fallbacks eventually
        "saitek-x52-trigger-half":          { "en-US": "Joystick Half Trigger"            },
        "saitek-x52-fire":                  { "en-US": "Joystick Fire Button"             },
        "saitek-x52-a":                     { "en-US": "Joystick A Button"                },
        "saitek-x52-b":                     { "en-US": "Joystick B Button"                },
        "saitek-x52-c":                     { "en-US": "Joystick C Button"                },
        "saitek-x52-trigger-pinky":         { "en-US": "Joystick Pinky Trigger"           },
        "saitek-x52-d":                     { "en-US": "Throttle D Button"                },
        "saitek-x52-e":                     { "en-US": "Throttle E Button"                },
        "saitek-x52-t1":                    { "en-US": "T1"                               },
        "saitek-x52-t2":                    { "en-US": "T2"                               },
        "saitek-x52-t3":                    { "en-US": "T3"                               },
        "saitek-x52-t4":                    { "en-US": "T4"                               },
        "saitek-x52-t5":                    { "en-US": "T5"                               },
        "saitek-x52-t6":                    { "en-US": "T6"                               },
        "saitek-x52-trigger-full":          { "en-US": "Joystick Full Trigger"            },
        "saitek-x52-hat-alt-up":            { "en-US": "Alternate Hat: Up"                },
        "saitek-x52-hat-alt-right":         { "en-US": "Alternate Hat: Right"             },
        "saitek-x52-hat-alt-down":          { "en-US": "Alternate Hat: Down"              },
        "saitek-x52-hat-alt-left":          { "en-US": "Alternate Hat: Left"              },
        "saitek-x52-hat-throttle-up":       { "en-US": "Throttle Hat: Up"                 },
        "saitek-x52-hat-throttle-right":    { "en-US": "Throttle Hat: Right"              },
        "saitek-x52-hat-throttle-down":     { "en-US": "Throttle Hat: Down"               },
        "saitek-x52-hat-throttle-left":     { "en-US": "Throttle Hat: Left"               },
        // XXX Mode A-C: Is this how we want things mapped?
        "saitek-x52-mode-a":                { "en-US": "Mode Dial: Down (White)"          },
        "saitek-x52-mode-b":                { "en-US": "Mode Dial: Middle (Orange)"       },
        "saitek-x52-mode-c":                { "en-US": "Mode Dial: Up (Red)"              },
        "saitek-x52-mfd-function":          { "en-US": "MFD Button: Function"             },
        "saitek-x52-mfd-up":                { "en-US": "MFD Button: Down / Start / Stop"  },
        "saitek-x52-mfd-down":              { "en-US": "MFD Button: Up / Reset"           },
        "saitek-x52-i":                     { "en-US": "Throttle i Button"                },
        "saitek-x52-mouse-click":           { "en-US": "Left Mouse (Throttle)"            },
        "saitek-x52-mouse-wheel":           { "en-US": "Mouse Wheel (Throttle)"           },
        "saitek-x52-mouse-wheel-down":      { "en-US": "Mouse Wheel Forward / Down"       },
        "saitek-x52-mouse-wheel-up":        { "en-US": "Mouse Wheel Back / Up"            },
        // Synthetic Buttons
        "saitek-x52-hat-thumb-up":          { "en-US": "Joystick Hat: Up"                 },
        "saitek-x52-hat-thumb-right":       { "en-US": "Joystick Hat: Right"              },
        "saitek-x52-hat-thumb-down":        { "en-US": "Joystick Hat: Down"               },
        "saitek-x52-hat-thumb-left":        { "en-US": "Joystick Hat: Left"               },
    });

    regsiterAxises<SaitekX52AxisMap>({
        "saitek-x52-joystick-x":            { "range": "11", "min": "left",    "max": "right",    "en-US": "Joystick X Axis",       "stick": "saitek-x52-joystick"  },
        "saitek-x52-joystick-y":            { "range": "11", "min": "forward", "max": "backward", "en-US": "Joystick Y Axis",       "stick": "saitek-x52-joystick"  },
        "saitek-x52-throttle":              { "range": "11", "min": "forward", "max": "backward", "en-US": "Throttle"                                               },
        "saitek-x52-i-dial":                { "range": "11", "min": "ccw",     "max": "cw",       "en-US": "Throttle (i) Dial"                                      },
        "saitek-x52-e-dial":                { "range": "11", "min": "ccw",     "max": "cw",       "en-US": "Throttle (E) Dial"                                      },
        "saitek-x52-joystick-twist":        { "range": "11", "min": "ccw",     "max": "cw",       "en-US": "Joystick Twist Axis",   "stick": "saitek-x52-joystick"  },
        "saitek-x52-throttle-thumb-slider": { "range": "11", "min": "forward", "max": "backward", "en-US": "Throttle Thumb Slider"                                  },
        "saitek-x52-mouse-x":               { "range": "11", "min": "left",    "max": "right",    "en-US": "Throttle Mouse X Axis", "stick": "saitek-x52-mouse"     },
        "saitek-x52-mouse-y":               { "range": "11", "min": "up",      "max": "down",     "en-US": "Throttle Mouse Y Axis", "stick": "saitek-x52-mouse"     },
    });

    // XXX: Note: HAT button order:                     Up Right Down Left
    // Doesn't match "standard" gamepad dpad orders:    Up Down Left Right
    registerDeviceType("saitek-x52", {
        "buttons": [
            "saitek-x52-trigger-half",
            "saitek-x52-fire",
            "saitek-x52-a",
            "saitek-x52-b",
            "saitek-x52-c",
            "saitek-x52-trigger-pinky",
            "saitek-x52-d",
            "saitek-x52-e",
            "saitek-x52-t1",
            "saitek-x52-t2",
            "saitek-x52-t3",
            "saitek-x52-t4",
            "saitek-x52-t5",
            "saitek-x52-t6",
            "saitek-x52-trigger-full",
            "saitek-x52-hat-alt-up",
            "saitek-x52-hat-alt-right",
            "saitek-x52-hat-alt-down",
            "saitek-x52-hat-alt-left",
            "saitek-x52-hat-throttle-up",
            "saitek-x52-hat-throttle-right",
            "saitek-x52-hat-throttle-down",
            "saitek-x52-hat-throttle-left",
            "saitek-x52-mode-a", // XXX: Is this how we want things map?
            "saitek-x52-mode-b",
            "saitek-x52-mode-c",
            "saitek-x52-mfd-function",
            "saitek-x52-mfd-up",
            "saitek-x52-mfd-down",
            "saitek-x52-i",
            "saitek-x52-mouse-click",
            "saitek-x52-mouse-wheel",
            "saitek-x52-mouse-wheel-down", // N/A in Chrome
            "saitek-x52-mouse-wheel-up",   // N/A in Chrome
            // Synthetic Buttons
            "saitek-x52-hat-thumb-up",    // N/A in FireFox
            "saitek-x52-hat-thumb-right", // N/A in FireFox
            "saitek-x52-hat-thumb-down",  // N/A in FireFox
            "saitek-x52-hat-thumb-left",  // N/A in FireFox
        ],
        "axises": [
            "saitek-x52-joystick-x",
            "saitek-x52-joystick-y",
            "saitek-x52-throttle",
            "saitek-x52-i-dial",
            "saitek-x52-e-dial",
            "saitek-x52-joystick-twist",
            "saitek-x52-throttle-thumb-slider",
            "saitek-x52-mouse-x",
            "saitek-x52-mouse-y",
            // Original Axis 9 = Primary HAT (remapped to buttons)
        ],
    });

    registerDevice("06a3", "075c", "saitek-x52", { "en-US": "Saitek X52 Flight Control System" });
}
