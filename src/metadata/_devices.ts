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
    interface LocText {
        "en-US": string;
        [locale: string]: string;
    }

    export interface DeviceTypeMap {}
    export type DeviceType = keyof DeviceTypeMap;

    interface Device {
        deviceType: DeviceType;
        description: LocText;
    }

    export interface DeviceInformation {
        buttons: Button[];
        axises:  Axis[];
    }

    const deviceTypes : {[deviceType: string]: DeviceInformation | undefined} = {};
    export function registerDeviceType(deviceType: DeviceType, information: DeviceInformation) {
        console.assert(!(deviceType in deviceTypes));
        deviceTypes[deviceType] = information;
    }

    const devices : {[vendorProduct: string]: Device | undefined} = {};
    export function registerDevice(vendorId: string, productId: string, deviceType: DeviceType, description: LocText) {
        const id = `${vendorId}-${productId}`;
        console.assert(!(id in devices));
        devices[id] = { deviceType, description };
    }



    export type VendorProduct = { vendor: string; product: string; };
    function isGamepad (target: Gamepad | VendorProduct | DeviceType): target is Gamepad { return !(("vendor" in (target as any)) && ("product" in (target as any))); }
    function isDeviceType (target: Gamepad | VendorProduct | DeviceType): target is DeviceType { return typeof target === "string"; }
    function ids (target: Gamepad | VendorProduct): VendorProduct { return isGamepad(target) ? parseGamepadId(target.id) : target; }

    function vpid (target: Gamepad | VendorProduct): string {
        const {vendor, product} = ids(target);
        return `${vendor}-${product}`;
    }

    export function getDeviceLabel (target: Gamepad | VendorProduct, locHint: ReadonlyArray<string> = navigator.languages): string {
        const device = devices[vpid(target)];
        if (!device) return isGamepad(target) ? target.id : `Unknown Device ${JSON.stringify(target)}`;
        for (const lang of locHint) if (lang in device.description) return device.description[lang];
        return device.description["en-US"]; // Final fallback
    }

    export function getDeviceType (target: Gamepad | VendorProduct | DeviceType): DeviceType {
        if (isDeviceType(target)) return target;
        const device = devices[vpid(target)];
        return device ? device.deviceType
            : (isGamepad(target) && target.mapping === "standard") ? "gamepad-unknown"
            : "unknown-unknown";
    }

    export function getDeviceButtons (target: Gamepad | VendorProduct | DeviceType): Button[] {
        const type = deviceTypes[getDeviceType(target)];
        if (!type) return []; // Unknown as heck
        return type.buttons;
    }

    export function getDeviceAxises (target: Gamepad | VendorProduct | DeviceType): Axis[] {
        const type = deviceTypes[getDeviceType(target)];
        if (!type) return []; // Unknown as heck
        return type.axises;
    }
}
