declare namespace mmk.gamepad {
}
declare namespace mmk.gamepad {
    function cloneGamepad(original: Gamepad): Gamepad;
    function cloneGamepads(original: Gamepad[]): Gamepad[];
}
declare namespace mmk.gamepad {
    interface FlatPremapGamepadValue {
        value: number;
        pressed: boolean;
    }
    type FlatPremapGamepad = {
        [no: string]: FlatPremapGamepadValue;
    };
    function flattenPremapGamepad(gamepad: Gamepad): FlatPremapGamepad;
}
declare namespace mmk.gamepad {
    interface ParsedGamepadId {
        name: string;
        vendor: string;
        product: string;
        hint: string;
    }
    function parseGamepadId(id: string): ParsedGamepadId;
}
declare namespace mmk.gamepad {
    type RawGamepadCallback = (gamepad: Gamepad) => void;
    function addRawConnectedListener(callback: RawGamepadCallback): void;
    function addRawDisconnectedListener(callback: RawGamepadCallback): void;
    function getRawGamepads(): Gamepad[];
}
declare namespace mmk.gamepad {
    function poll(action: () => void): void;
}
declare namespace mmk.gamepad {
    function tryRemapStdLayout(gamepad: Gamepad): Gamepad;
}
declare namespace mmk.gamepad {
    function isSupported(): boolean;
}
