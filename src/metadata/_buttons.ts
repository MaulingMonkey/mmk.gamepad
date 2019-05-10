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
     * An extensible interface containing members for every valid legal buttom image ID 
     */
    export interface ButtonMap {}
    export type Button = keyof ButtonMap;
    interface ButtonInformation_Leaf {
        /** A fallback button to inherit localization information (text, images, etc.) if not provided for this specific button. */
        "fallback": Button;
        /** A US English string describing the button.  Required unless you specify a "fallback" to inherit from. */
        "en-US"?:   string;
        // NEED?:  Default UI behavior (select, back, select-x-back, back-x-select)
    }
    interface ButtonInformation_Root {
        /** A US English string describing the button.  Required unless you specify a "fallback" to inherit from. */
        "en-US":    string;
        // NEED?:  Default UI behavior (select, back, select-x-back, back-x-select)
    }
    export type ButtonInformation = ButtonInformation_Leaf | ButtonInformation_Root;

    const buttons : {[buttonId: string]: ButtonInformation} = {};
    export function registerButtons<ButtonMap>(newButtons: {[P in keyof ButtonMap]: Button | ButtonInformation}) {
        for (const id in newButtons) {
            const value = newButtons[id];
            console.assert(!(id in buttons));
            buttons[id] = (typeof value === "string") ? { "fallback": value as Button } : (value as ButtonInformation);
        }
    }

    export function getButtonLabel (id: Button, locHint: readonly string[] = navigator.languages): string {
        for (let button = buttons[id]; button; ) {
            for (const lang of locHint) {
                if (lang.indexOf('-') === -1) continue;
                if (lang in button) return (button as any)[lang];
            }
            if (!("fallback" in button)) break;
            const old = button;
            button = buttons[button.fallback];
            if (!button) return `${JSON.stringify(id)} w/ missing fallback ${JSON.stringify(old.fallback)}`;
        }

        return `Unlocalized Button ${JSON.stringify(id)}`;
    }

    export function getGamepadButtonLabel (gamepad: Gamepad | VendorProduct | DeviceType, index: number, locHint: readonly string[] = navigator.languages): string | undefined {
        const b = getDeviceButtons(gamepad);
        return (0 <= index && index < b.length) ? getButtonLabel(b[index], locHint) : undefined;
    }
}
