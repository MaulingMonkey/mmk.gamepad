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
    export interface ButtonMap {}
    export interface DeviceTypeMap {
        /** Device should not be considered a real gamepad */               "dead": void;
        /** Device is unknown - not a "standard" gamepad or anything. */    "unknown-unknown": void; 
    }

    registerDeviceType("dead", {
        "axises": [],
        "buttons": [],
    });

    registerDeviceType("unknown-unknown", {
        "axises": [],
        "buttons": [],
    });

    // registerDeviceType("gamepad-unknown", { ... }); // See gamepad-aaa-generic.ts
    // registerDeviceType("gamepad-xinput", { ... });  // See gamepad-microsoft.ts

    registerDevice("04f3", "0089", "dead", { "en-US": "Unknown Device" }); // Unknown/dead Samsung 940X 2-axis 0-button device.  Probably the touchpad or screen, but interacting with neither causes any axis changes.  Pen tilt?
}
