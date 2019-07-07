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
    /** @hidden */ export type RemapAxisType = "01-11";
    /** @hidden */ export type RemapButtonType = "constant" | "11-01" | "11-10" | "axis-negative-01" | "axis-positive-01" | "hat-up-bit" | "hat-right-bit" | "hat-down-bit" | "hat-left-bit";

    /** @hidden */
    export interface RemapSrc<RemapXformType> {
        "src":    string; // e.g. "a0", "b0", etc.
        "xform"?: RemapXformType;
        "param"?: number; // Optional param corresponding to xform
    }

    export interface Remap {
        "mapping":  GamepadMappingType;
        "tested"?:  string[];
        "matches":  string[];
        "axes":     RemapSrc<RemapAxisType>[];
        "buttons":  RemapSrc<RemapButtonType>[];
    }

    /** @hidden */ const remapsList : Remap[] = [];
    /** @hidden */ const remapsByKey : { [id: string]: Remap } = {};

    export function registerRemap (remap: Remap) {
        remapsList.push(remap);
        remap.matches.forEach(id => {
            console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
            remapsByKey[id] = remap;
        });
    }

    /** @hidden */
    function getRemapKey(gamepad: Gamepad): string {
        let id = parseGamepadId(gamepad.id);
        let key = id.vendor+"-"+id.product+"-"+id.hint+"-"+gamepad.axes.length+"-"+gamepad.buttons.length;
        return key;
    }

    export function findRemap(gamepad: Gamepad): Remap {
        let key = getRemapKey(gamepad);
        let value = remapsByKey[key];
        return value;
    }
}
