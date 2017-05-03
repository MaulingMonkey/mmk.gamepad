# mmk.gamepad

MaulingMonKey's typescript gamepad API for consistent cross-browser and cross-gamepad binding, polling for input, etc.

Demo: http://maulingmonkey.com/mmk.gamepad/mmk.gamepad/demo/

License: [Apache 2.0](LICENSE.txt)



# Browser Support

| OS         | Browser    | Max Gamepads | API(s)                       |
| ---------- | ---------- | ------------ | ---------------------------- |
| Windows  7 | Opera 44   | 4            | XInput or RawInput           |
| Windows  7 | Chrome 57  | 4            | XInput or RawInput           |
| Windows  7 | FireFox 53 | 5+           | XInput or RawInput           |
| Windows 10 | Edge       | 4?           | Only XInput?                 |
| Windows  7 | IE 11      | 0            | No gamepad API [1]           |
| Windows  7 | IE  8      | XXX [2]      | No gamepad API [1]           |

1. All mmk.gamepad functions should still "work" as if there were no gamepads connected.
2. This browser may still have compatability bugs even providing the "no gamepads" interface.



# Gamepad support

| OS      | Gamepad                 | Chrome   | Opera    | FireFox  | Edge   | Notes          |
| ------- | ----------------------- | -------- | -------- | -------- | ------ | -------------- |
| Windows | Xbox 360                | OK       | OK       | OK [1]   | OK     |                |
| Windows | Xbox One                | OK [1]   | OK [1]   | OK [1]   | OK [1] |                |
| Windows | DualShock 4 (Micro-USB) | OK       | OK       | No DPad  |        | No touch/gyros |
| Windows | DualShock 4 (Wireless)  | OK       | OK       | No DPad  |        | No touch/gyros |
| Windows | DualShock 3 (Mini-USB)  |          |          |          |        | Dead [2]       |

1. This gamepad displays an incorrect or generic name which we cannot work around (e.g. "Xbox 360 Controller" for XB1 controllers, or "xinput")
2. This might just be my gamepad, or my default windows 7 drivers being insufficient.



# Basic API

See [src/demo.ts](src/demo.ts)

```typescript
// In case you want to display a hint to switch browsers ;)
if (!mmk.gamepad.isSupported()) console.warn("Gamepads not available in this browser");

// The rough equivalent of navigator.getGamepads(), with fallbacks.
var gamepads = mmk.gamepad.getRawGamepads() // Can return undefined elements (for e.g. disconnected controllers)

var snapshot = mmk.gamepad.cloneGamepads(gamepads); // Deep copy of basic fields
snapshot[0]  = mmk.gamepad.cloneGamepad(snapshot[0]); // Hey why not

// Works despite the lack of "connectedgamepad" and "disconnectedgamepad" events:
mmk.gamepad.addRawConnectedListener   ( function(gamepad) { console.log("Connected gamepad:",   gamepad); } );
mmk.gamepad.addRawDisconnectedListener( function(gamepad) { console.log("Disconnected gamepad:", gamepad); } );
// (note that addRawConnectedListener will immediately invoke your callback on already connected gamepads!)

var standard = mmk.gamepad.tryRemapStdLayout(snapshot[0]);
if (standard) { console.assert(standard.mapping === "standard"); } // Well, that was easy!
else          { ... } // Fallback to non-standard mapping prompts etc...
```

# Installation

## Via NuGet
* Add [mmk.gamepad](https://www.nuget.org/packages/mmk.gamepad/) to your project via nuget.
* Reference `<script src="Scripts/mmk.gamepad/mmk.gamepad.js"></script>` on your page.
* Done!



# TODO

* Implement controller database
  * <strike>Parse https://github.com/gabomdq/SDL_GameControllerDB/blob/master/gamecontrollerdb.txt</strike> **Wrong useful :(**
  * <strike>Build my own database</strike> **Started :)**
  * Consider parsing https://github.com/luser/gamepad-data ?
* Controller autodetect / fixup
  * Autodetect weird axis dpads
  * Autodetect mismapped axies (e.g. -1..+1 triggers)
  * Autodetect misbehaving axies
* <strike>Use database to remap controllers to "standard" layout</strike> **Done**
* Provide constants for standard layout buttons
* Provide api to get labels for buttons
* Herustically detect duplicate controllers (e.g. PS4 can be connected via wireless and microusb simultaniously)
* Herustically detect disconnected/off controllers (e.g. PS4 wireless dongle still shows up with home button held 10+ seconds)
* Provide connected/disconnected events (e.g. Chrome doesn't generate any, and we may want to hide browser-level duplicates or powered off controllers etc.)
* Test more browsers (<strike>Firefox? Mozilla? Edge? Opera?</strike>)  **Huzzah!**
* Test more OSes (Linux? OS X?)
* <strike>Publish nuget</strike>
* Track active controllers
