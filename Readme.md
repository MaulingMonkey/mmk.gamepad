# mmk.gamepad

MaulingMonKey's typescript gamepad API for consistent cross-browser and cross-gamepad binding, polling for input, etc.

Demo: http://maulingmonkey.com/mmk.gamepad/demo/

License: [Apache 2.0](LICENSE.txt)



# Browser Support

| OS               | Browser     | Max Gamepads | API(s)             | Notes                    |
| ---------------- | ----------- | ------------ | ------------------ | ------------------------ |
| Windows  7       | Opera 44    | 4            | XInput or RawInput |                          |
| Windows  7       | Chrome 57   | 4            | XInput or RawInput |                          |
| Windows  7       | FireFox 53  | 5+           | XInput or RawInput |                          |
| Windows 10       | Edge        | 4?           | Only XInput?       | [4] [5]                  |
| Windows  7       | IE 11       | 0            | No gamepad API [1] | !isSupported [4]         |
| Windows  7       | IE  8       | XXX [2]      | No gamepad API     | Compatability bugs       |
| Ubuntu 18.04 LTS | Chromium 65 | 0            | No gamepad API [1] | "isSupported" lies [3]   |
| Ubuntu 18.04 LTS | Chrome 66   | 4+           | Unknown            |                          |
| Ubuntu 18.04 LTS | FireFox 59  | 4+           | Unknown            |                          |

1. All mmk.gamepad functions should still "work" as if there were no gamepads connected.
2. This browser may still have compatability bugs even providing the "no gamepads" interface.
3. This browser implements a gamepad API, but no gamepads work.
4. You may need to specify `<meta http-equiv="X-UA-Compatible" content="IE=9" />` or better to avoid JS errors.
5. Edge has some built-in gamepad navigation behavior.  `mmk.gamepad` will disable this by default.


# Gamepad support

| OS      | Gamepad                 | Chrome   | Opera    | FireFox  | Edge   | Notes          |
| ------- | ----------------------- | -------- | -------- | -------- | ------ | -------------- |
| Windows | Xbox 360                | OK       | OK       | OK [1]   | OK     |                |
| Windows | Xbox One                | OK [1]   | OK [1]   | OK [1]   | OK [1] |                |
| Windows | DualShock 4 (Micro-USB) | OK       | OK       | No DPad  |        | No touch/gyros |
| Windows | DualShock 4 (Wireless)  | OK       | OK       | No DPad  |        | No touch/gyros |
| Windows | DualShock 3 (Mini-USB)  |          |          |          |        | Bad HID [2]    |

1. This gamepad displays an incorrect or generic name which we cannot work around (e.g. "Xbox 360 Controller" for XB1 controllers, or "xinput")
2. Third party (non-Sony!) drivers may make this gamepad work - it doesn't speak standard HID properly.

| OS      | Gamepad                 | Chrome [3] | FireFox  | Notes                                     |
| ------- | ----------------------- | ---------- | -------- | ----------------------------------------- |
| Ubuntu  | Xbox 360                | OK         | OK       |                                           |
| Ubuntu  | Xbox One                | OK         | OK       |                                           |
| Ubuntu  | DualShock 4 (Micro-USB) | OK [4]     | OK       | No gyros, bad init [5], touchpad is mouse |
| Ubuntu  | DualShock 4 (Wireless)  | OK [4]     | OK       | No gyros, bad init [5], touchpad is mouse |
| Ubuntu  | DualShock 3 (Mini-USB)  | OK         | OK       | No gyros                                  |

3. Not Chromium - which still defines the gamepad API, but doesn't appear to actually
   export info about connected gamepads even when Chrome will on the same system.

4. Note that the baseline gamepad API lies about this gamepad being in the standard
   layout already in Chrome 66 on Ubuntu 18.04 LTS.  tryRemapStdLayout will fix these
   to use the correct layout anyways.

5. Some triggers/axises of this gamepad currently misinitialize to non-zero
   values (e.g. -1, 0.5), although they'll correct themselves after some use.
   Could be worked around with some more stateful mapping (e.g. treating known
   bad values as 0.0 until the right stick / triggers are sufficiently
   exercised.)



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
* <strike>Add [mmk.gamepad](https://www.nuget.org/packages/mmk.gamepad/) to your project via nuget.</strike>
* <strike>Reference `<script src="Scripts/mmk.gamepad/mmk.gamepad.js"></script>` on your page.</strike>
* <strike>Done!</strike>



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
* Test more OSes (<strike>Linux?</strike> OS X?)
* <strike>Publish nuget</strike>
* Track active controllers
