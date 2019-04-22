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
     * Gamepad axes for the `"standard"` gamepad `mapping`.  This means only the thumbsticks, not any triggers.
     *
     * Per https://w3c.github.io/gamepad/#remapping this contains:
     *
     * - `LeftStickRight`,  `LeftStickX`,  `LStickX` (axis 0)
     * - `LeftStickDown`,   `LeftStickY`,  `LStickY` (axis 1)
     * - `RightStickRight`, `RightStickX`, `RStickX` (axis 2)
     * - `RightStickDown`,  `RightStickY`, `RStickY` (axis 3)
     */
    export enum StandardAxis {
        /** The left stick's X axis.  Right is positive, left is negative. */
        LeftStickRight  = 0,
        /** The left stick's Y axis.  Down is positive, up is negative. */
        LeftStickDown   = 1,
        /** The right stick's X axis.  Right is positive, left is negative. */
        RightStickRight = 2,
        /** The right stick's Y axis.  Down is positive, up is negative. */
        RightStickDown  = 3,

        /** The left stick's X axis.  Right is positive, left is negative. */
        LeftStickX  = LeftStickRight,
        /** The left stick's Y axis.  Down is positive, up is negative. */
        LeftStickY  = LeftStickDown,
        /** The right stick's X axis.  Right is positive, left is negative. */
        RightStickX = RightStickRight,
        /** The right stick's Y axis.  Down is positive, up is negative. */
        RightStickY = RightStickDown,

        /** The left stick's X axis.  Right is positive, left is negative. */
        LStickX  = LeftStickRight,
        /** The left stick's Y axis.  Down is positive, up is negative. */
        LStickY  = LeftStickDown,
        /** The right stick's X axis.  Right is positive, left is negative. */
        RStickX = RightStickRight,
        /** The right stick's Y axis.  Down is positive, up is negative. */
        RStickY = RightStickDown,
    }
}
