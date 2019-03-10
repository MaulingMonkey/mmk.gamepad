declare namespace mmk.gamepad {
    function isSupported(): boolean;
}
declare namespace mmk.gamepad {
    function tryRemapStdLayout(gamepad: Gamepad): Gamepad;
    function tryRemapStdLayout(gamepad: Gamepad | null): Gamepad | null;
}
declare namespace mmk.gamepad {
    interface Gamepad {
        readonly id: string;
        readonly displayId: number;
        readonly mapping: GamepadMappingType;
        readonly index: number;
        readonly timestamp: number;
        readonly connected: boolean;
        readonly axes: number[];
        readonly buttons: GamepadButton[];
    }
}
declare namespace mmk.gamepad {
    function cloneGamepad(original: Gamepad): Gamepad;
    function cloneGamepads(original: Gamepad[]): Gamepad[];
}
declare namespace mmk.gamepad {
    interface FlatPremapGamepadValue {
        value: number;
        pressed: boolean;
        touched: boolean;
    }
    type FlatPremapGamepad = {
        [no: string]: FlatPremapGamepadValue;
    };
    function flattenPremapGamepad(gamepad: Gamepad): FlatPremapGamepad;
}
declare namespace mmk.gamepad {
    interface GetGamepadsOptions {
        deadZone: number;
        standardize: boolean;
        keepNonstandard: boolean;
        keepInactive: boolean;
        keepNull: boolean;
    }
    function getGamepads(options: GetGamepadsOptions & {
        filterNull: false;
    }): (Gamepad | null)[];
    function getGamepads(options: GetGamepadsOptions): Gamepad[];
}
declare namespace mmk.gamepad {
    type RawGamepadCallback = (gamepad: Gamepad) => void;
    function addRawConnectedListener(callback: RawGamepadCallback): void;
    function addRawDisconnectedListener(callback: RawGamepadCallback): void;
    function getRawGamepads(): (Gamepad | null)[];
}
declare namespace mmk.gamepad {
    interface ParsedGamepadId {
        name: string;
        vendor: string;
        product: string;
        hint: "blink" | "gecko" | "unknown";
    }
    function parseGamepadId(id: string | undefined): ParsedGamepadId;
}
declare namespace mmk.gamepad {
    function poll(action: () => void): void;
}
//# sourceMappingURL=mmk.gamepad.d.ts.map