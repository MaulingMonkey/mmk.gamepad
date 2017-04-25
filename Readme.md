# mmk.gamepad

MaulingMonKey's typescript gamepad API for consistent cross-browser and cross-gamepad binding, polling for input, etc.

License: [Apache 2.0](LICENSE.txt)



# Browser Support

| OS        | Browser   | Max Gamepads         |
| --------- | --------- | -------------------- |
| Windows 7 | Chrome 57 | 4                    |
| Windows 7 | IE 11     | N/A (no API support) |



# Basic API
```typescript
// ...todo...
```



# TODO

* Parse https://github.com/gabomdq/SDL_GameControllerDB/blob/master/gamecontrollerdb.txt
* Autodetect weird axis dpads
* Use database to remap controllers to "standard" layout
* Provide constants for standard layout buttons
* Provide api to get labels for buttons
* Herustically detect duplicate controllers (e.g. PS4 can be connected via wireless and microusb simultaniously)
* Provide connected/disconnected events (e.g. Chrome doesn't generate any, and we may want to hide browser-level duplicates or powered off controllers etc.)
* Test more browsers (Firefox? Mozilla? Edge? Opera?)
* Publish nuget
* Track active controllers



# Installation

## Via NuGet
<strike>Add [mmk.gamepad](https://www.nuget.org/packages/mmk.gamepad/) to your project via nuget.  Done!</strike>  **TODO:  Soon (tm)**
