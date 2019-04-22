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

namespace mmk.gamepad {
    /**
     * Dual Shock / Sony Button values in the standard mapping layout.
     * 
     * Main values are:
     * `Cross`,
     * `Circle`,
     * `Square`,
     * `Triangle`,
     * `LeftShoulder`,
     * `RightShoulder`,
     * `LeftTrigger`,
     * `RightTrigger`,
     * `Select`,
     * `Start`,
     * `LeftThumb`,
     * `RightThumb`,
     * `DirectionalPadUp`,
     * `DirectionalPadDown`,
     * `DirectionalPadLeft`,
     * `DirectionalPadRight`
     *
     * Additionally, there are a few shorthand aliases - `LeftShoulder` has `LShoulder`, `DirectionalPadLeft` has
     * `DPadLeft` - and `Select`/`Start` have DS4 aliases `Share`/`Options`.
     *
     * Finally, the hideously and unfixably nonportable `_PlayStationLogo` button can be used.
     * 
     * See also:
     * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/buttons
     * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping
     * - https://w3c.github.io/gamepad/#dom-gamepad-buttons
     */
    export enum DualShockButton {
        Cross = 0,
        Circle = 1,
        Square = 2,
        Triangle = 3,
        LeftShoulder  = 4,
        RightShoulder = 5,
        LeftTrigger   = 6,
        RightTrigger  = 7,
        Select = 8,
        Start = 9,
        LeftThumb  = 10,
        RightThumb = 11,
        DirectionalPadUp    = 12,
        DirectionalPadDown  = 13,
        DirectionalPadLeft  = 14,
        DirectionalPadRight = 15,
        /** AVOID.  This is unavailable on many browsers, and even if available, likely triggers other software like Steam or built in Windows 10 stuff. */
        _PlayStationLogo = 16,

        // Extra Aliases
        LShoulder = LeftShoulder,
        RShoulder = RightShoulder,
        LTrigger = LeftTrigger,
        RTrigger = RightTrigger,
        LThumb = LeftThumb,
        RThumb = RightThumb,
        DPadUp    = DirectionalPadUp,
        DPadDown  = DirectionalPadDown,
        DPadLeft  = DirectionalPadLeft,
        DPadRight = DirectionalPadRight,

        // Sony terminology / aliases
        L1 = LeftShoulder,
        L2 = LeftTrigger,
        L3 = LeftThumb,
        R1 = RightShoulder,
        R2 = RightTrigger,
        R3 = RightThumb,

        // DS4 terminology / aliases
        Share   = Select,
        Options = Start,
    }
}
