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
     * A [[Gamepad.buttons]] value.
     */
    export interface GamepadButton {
        readonly pressed: boolean;
        readonly touched: boolean;

        /**
         * Generally 0 or 1 for most digital buttons, but can also be fractional values for triggers.
         */
        readonly value: number;
    }

    /**
     * See also:
     * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad
     * - https://w3c.github.io/gamepad/#gamepad-interface
     */
    export interface Gamepad {
        /**
         * A browser specific string defining what kind of gamepad this is.  Note that this does *not* uniquely identify
         * the gamepad, multiple gamepads of the same type (or even different types, if provided through xinput) may
         * share the same [[Gamepad.id]].  If you want to differentiate multiple gamepads, instead use [[Gamepad.index]].
         * 
         * Examples observed:
         * - `"xinput"`
         * - `"Xbox 360 Controller (XInput STANDARD GAMEPAD)"`
         * - `"DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)"`
         * - `"054c-0ba0-DUALSHOCK®4 USB Wireless Adaptor"`
         * - `"Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)"`
         * - `"054c-09cc-Wireless Controller"`
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/id
         * - https://w3c.github.io/gamepad/#dom-gamepad-id
         */
        readonly id: string;

        /**
         * A `VRDisplay.displayId` this gamepad is associated with.
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/displayId
         * - https://immersive-web.github.io/webvr/spec/1.1/#dom-vrdisplay-displayid
         * - https://immersive-web.github.io/webvr/spec/1.1/#gamepad-getvrdisplays-attribute
         */
        readonly displayId?: number;

        /**
         * The gamepad mapping.  `"standard" | ""`.
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping
         * - https://w3c.github.io/gamepad/#dom-gamepad-mapping
         */
        readonly mapping: GamepadMappingType;

        /**
         * A unique index corresponding to this gamepad.  Stable for as long as the gamepad is connected.  Might be
         * reused if the gamepad is disconnected and a new one connected in it's place.  Corresponds to the index of
         * [[Gamepad]][] arrays that have *not* culled null/undefined/nonstandard gamepads only!
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/index
         * - https://w3c.github.io/gamepad/#dom-gamepad-index
         */
        readonly index: number;

        /**
         * A unique timestamp for when this gamepad data was last updated.
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/timestamp
         * - https://w3c.github.io/gamepad/#dom-gamepad-timestamp
         */
        readonly timestamp: number;

        /**
         * Indicates if this gamepad is still connected or not.
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/connected
         * - https://w3c.github.io/gamepad/#dom-gamepad-connected
         */
        readonly connected: boolean;

        /**
         * Gamepad axes (for the `"standard"` mapping, this means only the thumbsticks, not any triggers.)
         * 
         * "standard" mapping values per https://w3c.github.io/gamepad/#remapping :
         * 
         * - [0] L. Stick X Right
         * - [1] L. Stick Y Down
         * - [2] R. Stick X Right
         * - [3] R. Stick Y Down
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/axes
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping
         * - https://w3c.github.io/gamepad/#dom-gamepad-axes
         * - https://w3c.github.io/gamepad/#dom-gamepad-mapping
         */
        readonly axes: ReadonlyArray<number>;

        /**
         * Gamepad buttons (for the `"standard"` mapping, this include the triggers.)
         * 
         * "standard" mapping values per https://w3c.github.io/gamepad/#remapping :
         * 
         * - [ 0] A
         * - [ 1] B
         * - [ 2] X
         * - [ 3] Y
         * - [ 4] L. Shoulder
         * - [ 5] R. Shoulder
         * - [ 6] L. Trigger
         * - [ 7] R. Trigger
         * - [ 8] Back/View
         * - [ 9] Start/Menu
         * - [10] L. Thumb
         * - [11] R. Thumb
         * - [12] Dpad Up
         * - [13] Dpad Down
         * - [14] Dpad Left
         * - [15] Dpad Right
         * - [16] Guide (x)
         * 
         * See also:
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/buttons
         * - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping
         * - https://w3c.github.io/gamepad/#dom-gamepad-buttons
         */
        readonly buttons: ReadonlyArray<GamepadButton>;
    }

    /** @hidden */
    export interface ClonedGamepad extends Gamepad {
        axes:       number[];
        buttons:    GamepadButton[];
    }
}
