declare namespace mmk.gamepad {
    namespace settings {
        var captureGamepadEvents: boolean;
    }
    interface GamepadEvent extends CustomEvent<undefined> {
        readonly gamepadIndex: number;
    }
    interface GamepadConnectivityEvent extends GamepadEvent {
        readonly connected: boolean;
    }
    interface GamepadButtonEvent extends GamepadEvent {
        readonly held: boolean;
        readonly buttonIndex: number;
        readonly buttonValue: number;
    }
    interface GamepadAxisEvent extends GamepadEvent {
        readonly axisIndex: number;
        readonly axisValue: number;
    }
    type PollGamepadOptions = GetGamepadsOptions & {
        keepInactive: true;
        keepNull: true;
        standardize: true;
    };
    function pollEvents(options?: PollGamepadOptions): void;
}
interface GlobalEventHandlersEventMap {
    "mmk-gamepad-connected": mmk.gamepad.GamepadConnectivityEvent;
    "mmk-gamepad-disconnected": mmk.gamepad.GamepadConnectivityEvent;
    "mmk-gamepad-button-down": mmk.gamepad.GamepadButtonEvent;
    "mmk-gamepad-button-up": mmk.gamepad.GamepadButtonEvent;
    "mmk-gamepad-button-value": mmk.gamepad.GamepadButtonEvent;
    "mmk-gamepad-axis-value": mmk.gamepad.GamepadAxisEvent;
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
        keepNull: false;
    }): Gamepad[];
    function getGamepads(options: GetGamepadsOptions): (Gamepad | null)[];
}
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
    function cloneGamepad(original: Gamepad | null): Gamepad | null;
    function cloneGamepad(original: Gamepad | undefined): Gamepad | undefined;
    function cloneGamepad(original: Gamepad | undefined | null): Gamepad | undefined | null;
    function cloneGamepads(original: Gamepad[]): Gamepad[];
    function cloneGamepads(original: (Gamepad | null)[]): (Gamepad | null)[];
    function cloneGamepads(original: (Gamepad | undefined)[]): (Gamepad | undefined)[];
    function cloneGamepads(original: (Gamepad | undefined | null)[]): (Gamepad | undefined | null)[];
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