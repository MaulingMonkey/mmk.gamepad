# mmk.gamepad

MaulingMonKey's typescript gamepad API for consistent cross-browser and cross-gamepad binding, polling for input, etc.

Demo: http://maulingmonkey.com/mmk.gamepad/mmk.gamepad/demo/

License: [Apache 2.0](LICENSE.txt)



# Browser Support

| OS        | Browser    | Max Gamepads |
| --------- | ---------- | ------------ |
| Windows 7 | Opera 44   | 4            |
| Windows 7 | Chrome 57  | 4            |
| Windows 7 | FireFox 53 | 5+           |
| Windows 7 | IE 11      | 0 [1]        |

1. This browser does not support the gamepad API.  All mmk.gamepad functions should still "work" as if there were no gamepads connected.

# Gamepad support

| OS        | Gamepad                 | Chrome   | Opera    | FireFox  | Notes          |
| --------- | ----------------------- | -------- | -------- | -------- | -------------- |
| Windows 7 | Xbox 360                | OK       | OK       | OK [1]   |                |
| Windows 7 | Xbox One                | OK [1]   | OK [1]   | OK [1]   |                |
| Windows 7 | DualShock 4 (Micro-USB) | OK       | OK       | No DPad  | No touch/gyros |
| Windows 7 | DualShock 4 (Wireless)  | OK       | OK       | No DPad  | No touch/gyros |
| Windows 7 | DualShock 3 (Mini-USB)  | Dead [2] | Dead [2] | Dead [2] |                |

1. This gamepad displays an incorrect or generic name which we cannot work around (e.g. "Xbox 360 Controller" for XB1 controllers, or "xinput")
2. This might just be my gamepad, or my default windows 7 drivers being insufficient.




# Basic API
```typescript
// ...todo...
```

# Installation

## Via NuGet
<strike>Add [mmk.gamepad](https://www.nuget.org/packages/mmk.gamepad/) to your project via nuget.  Done!</strike>  **TODO:  Soon (tm)**



# TODO

* Implement controller database
    * <strike>Parse https://github.com/gabomdq/SDL_GameControllerDB/blob/master/gamecontrollerdb.txt</strike> **Wrong useful :(**
    * <strike>Build my own database</strike> **Started :)**
    * Consider parsing https://github.com/luser/gamepad-data ?
* Autodetect weird axis dpads
* <strike>Use database to remap controllers to "standard" layout</strike> **Done**
* Provide constants for standard layout buttons
* Provide api to get labels for buttons
* Herustically detect duplicate controllers (e.g. PS4 can be connected via wireless and microusb simultaniously)
* Provide connected/disconnected events (e.g. Chrome doesn't generate any, and we may want to hide browser-level duplicates or powered off controllers etc.)
* Test more browsers (<strike>Firefox? Mozilla?</strike> Edge? <strike>Opera?</strike>)  **Need Win8 VM for Edge**
* Publish nuget
* Track active controllers
