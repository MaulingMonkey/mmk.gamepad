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
    /**
     * An extensible interface containing members for every valid legal axis image ID
     */
    export interface AxisMap {}
    export type Axis = keyof AxisMap;

    export interface AxisRangeMap {
        "01": void;
        "11": void;
    }
    export interface AxisMinMap {
        "left": void;
        "ccw": void;
        "up": void;
        "forward": void;
    }
    export interface AxisMaxMap {
        "right": void;
        "cw": void;
        "down": void;
        "backward": void;
    }
    export type AxisRange = keyof AxisRangeMap;
    export type AxisMin = keyof AxisMinMap;
    export type AxisMax = keyof AxisMaxMap;

    interface AxisInformation_Root {
        "stick"?:   Stick;
        "range":    AxisRange;
        "min":      AxisMin;
        "max":      AxisMax;
        "en-US":    string;
    }
    export type AxisInformation = AxisInformation_Root;

    const axises : {[id: string]: AxisInformation} = {};
    export function regsiterAxises<AxisMap>(newAxises: {[P in keyof AxisMap]: AxisInformation}) {
        for (const id in newAxises) {
            const value = newAxises[id];
            console.assert(!(id in axises));
            axises[id] = value;
        }
    }

    export function getAxisLabel (id: Axis, locHint: readonly string[] = navigator.languages): string {
        const axis = axises[id];
        for (const lang of locHint) {
            if (lang.indexOf('-') === -1) continue;
            if (lang in axis) return (axis as any)[lang];
        }
        return `Unlocalized Axis ${JSON.stringify(id)}`;
    }

    export function getGamepadAxisLabel (gamepad: Gamepad | VendorProduct | DeviceType, index: number, locHint: readonly string[] = navigator.languages): string | undefined {
        const a = getDeviceAxises(gamepad);
        return (0 <= index && index < a.length) ? getAxisLabel(a[index], locHint) : undefined;
    }
}
