var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_1) {
        function getEntries() {
            return gamepad_1.getRawGamepads().filter(function (gp) { return !!gp; }).map(function (gp) {
                return {
                    original: gp,
                    display: gamepad_1.tryRemapStdLayout(gp) || gp,
                    parsedIds: gamepad_1.parseGamepadId(gp.id)
                };
            });
        }
        function gamepadAxisText(gamepad, axisIndex) {
            var axis = gamepad.axes[axisIndex];
            if (axis === undefined)
                return "";
            return (axis >= 0 ? "+" : "") + axis.toFixed(2);
        }
        function gamepadButtonText(gamepad, buttonIndex) {
            var button = gamepad.buttons[buttonIndex];
            if (button === undefined)
                return "";
            return button.value.toFixed(2);
        }
        function gamepadAxisFill(gamepad, axisIndex) {
            var axis = gamepad.axes[axisIndex];
            if (axis === undefined)
                return "";
            var v = 255 * Math.abs(axis);
            if (v > 255)
                v = 255;
            v = 255 - Math.round(v);
            var c = v.toString(16);
            if (c.length === 1)
                c = "0" + c;
            return (axis > 0) ? ("#" + c + "FFFF") : ("#FF" + c + c);
        }
        function gamepadButtonFill(gamepad, buttonIndex) {
            var button = gamepad.buttons[buttonIndex];
            if (button === undefined)
                return "";
            var v = 255 * (0.1 + 0.9 * Math.abs(button.value));
            if (v > 255)
                v = 255;
            v = 255 - Math.round(v);
            var c = v.toString(16);
            if (c.length === 1)
                c = "0" + c;
            return !button.pressed ? ("#" + c + "FFFF") : ("#FF" + c + c);
        }
        function refresh() {
            var entries = getEntries();
            var d3entries = d3.select("#mmk-gamepad-demo").selectAll(".gamepad").data(entries);
            var d3new = d3entries.enter().append("tr").attr("class", "gamepad");
            d3new.append("td").attr("class", "gamepad-name");
            d3new.append("td").attr("class", "gamepad-index");
            d3new.append("td").attr("class", "gamepad-mapping");
            d3new.append("td").attr("class", "gamepad-connected");
            d3new.append("td").attr("class", "gamepad-vendor");
            d3new.append("td").attr("class", "gamepad-product");
            d3new.append("td").attr("class", "gamepad-hint");
            for (var i = 0; i < 8; ++i)
                d3new.append("td").attr("class", "gamepad-axis-" + i);
            for (var i = 0; i < 20; ++i)
                d3new.append("td").attr("class", "gamepad-button-" + i);
            d3entries.exit().remove();
            d3entries.select(".gamepad-name").text(function (gp) { return gp.parsedIds.name; });
            d3entries.select(".gamepad-index").text(function (gp) { return gp.display.index; });
            d3entries.select(".gamepad-mapping").text(function (gp) { return gp.display.mapping; });
            d3entries.select(".gamepad-connected").text(function (gp) { return gp.display.connected ? "true" : "false"; });
            d3entries.select(".gamepad-vendor").text(function (gp) { return gp.parsedIds.vendor || "N/A"; });
            d3entries.select(".gamepad-product").text(function (gp) { return gp.parsedIds.product || "N/A"; });
            d3entries.select(".gamepad-hint").text(function (gp) { return gp.parsedIds.hint || "N/A"; });
            var _loop_1 = function(i) {
                d3entries.select(".gamepad-axis-" + i)
                    .style("background-color", function (gp) { return gamepadAxisFill(gp.display, i); })
                    .text(function (gp) { return gamepadAxisText(gp.display, i); });
            };
            for (var i = 0; i < 8; ++i) {
                _loop_1(i);
            }
            var _loop_2 = function(i) {
                d3entries.select(".gamepad-button-" + i)
                    .style("background-color", function (gp) { return gamepadButtonFill(gp.display, i); })
                    .text(function (gp) { return gamepadButtonText(gp.display, i); });
            };
            for (var i = 0; i < 20; ++i) {
                _loop_2(i);
            }
        }
        if ('d3' in window)
            addEventListener("load", function () {
                var demo = document.getElementById("mmk-gamepad-demo");
                if (!demo)
                    return;
                refresh();
                setInterval(refresh, 100);
            });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function cloneGamepad(original) {
            var clone = {
                id: original.id,
                mapping: original.mapping,
                index: original.index,
                timestamp: original.timestamp,
                connected: original.connected,
                axes: new Array(original.axes.length),
                buttons: new Array(original.buttons.length)
            };
            for (var i = 0; i < original.axes.length; ++i)
                clone.axes[i] = original.axes[i];
            for (var i = 0; i < original.buttons.length; ++i)
                clone.buttons[i] = { pressed: original.buttons[i].pressed, value: original.buttons[i].value };
            return clone;
        }
        gamepad.cloneGamepad = cloneGamepad;
        function cloneGamepads(original) {
            var clone = new Array(original.length);
            for (var i = 0; i < original.length; ++i)
                clone[i] = cloneGamepad(original[i]);
            return clone;
        }
        gamepad.cloneGamepads = cloneGamepads;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_2) {
        function flattenPremapGamepad(gamepad) {
            var map = {};
            for (var i = 0; i < gamepad.axes.length; ++i) {
                var a = gamepad.axes[i];
                var id = "a" + i;
                map[id] = { value: a, pressed: false };
            }
            for (var i = 0; i < gamepad.buttons.length; ++i) {
                var b = gamepad.buttons[i];
                var id = "b" + i;
                map[id] = { value: b.value, pressed: b.pressed };
            }
            return map;
        }
        gamepad_2.flattenPremapGamepad = flattenPremapGamepad;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function parseGamepadId_Blink(id) {
            var mNameParen = /^(.+?)(?: \((.*)\))$/i.exec(id);
            if (!mNameParen)
                return undefined;
            var parsed = { name: mNameParen[1], vendor: undefined, product: undefined, hint: "blink" };
            var mVendorProduct = /(?:^| )Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})$/i.exec(mNameParen[2]);
            if (mVendorProduct) {
                parsed.vendor = mVendorProduct[1];
                parsed.product = mVendorProduct[2];
            }
            return parsed;
        }
        function parseGamepadId_Gecko(id) {
            if (id === "xinput")
                return { name: "xinput", vendor: undefined, product: undefined, hint: "gecko" };
            var m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
            if (m)
                return { name: m[3], vendor: m[1], product: m[2], hint: "gecko" };
            return undefined;
        }
        function parseGamepadId_Unknown(id) {
            return { name: id, vendor: undefined, product: undefined, hint: "unknown" };
        }
        function parseGamepadId(id) {
            if (!id)
                return undefined;
            var parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
            return parsed;
        }
        gamepad.parseGamepadId = parseGamepadId;
        var parsedIdExamples = [
            ["Xbox 360 Controller (XInput STANDARD GAMEPAD)", { name: "Xbox 360 Controller", vendor: undefined, product: undefined, hint: "blink" }],
            ["DUALSHOCK®4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)", { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "blink" }],
            ["Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "blink" }],
            ["xinput", { name: "xinput", vendor: undefined, product: undefined, hint: "gecko" }],
            ["054c-0ba0-DUALSHOCK®4 USB Wireless Adaptor", { name: "DUALSHOCK®4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "gecko" }],
            ["054c-09cc-Wireless Controller", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "gecko" }],
            [undefined, undefined]
        ];
        parsedIdExamples.forEach(function (example) {
            var parsed = JSON.stringify(parseGamepadId(example[0]));
            var expected = JSON.stringify(example[1]);
            console.assert(parsed === expected, "Expected parsed:", parsed, "equal to expected:", expected);
        });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_3) {
        var log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
        };
        var rawConnectedCallbacks = [];
        var rawDisconnectedCallbacks = [];
        function addRawConnectedListener(callback) {
            oldPads.forEach(function (gp) { if (gp !== undefined)
                callback(gp); });
            rawConnectedCallbacks.push(callback);
        }
        gamepad_3.addRawConnectedListener = addRawConnectedListener;
        function addRawDisconnectedListener(callback) {
            rawDisconnectedCallbacks.push(callback);
        }
        gamepad_3.addRawDisconnectedListener = addRawDisconnectedListener;
        function getRawGamepads() {
            if ('getGamepads' in navigator) {
                var gp = navigator.getGamepads();
                var a = [];
                for (var i = 0; i < gp.length; ++i)
                    a.push(gp[i]);
                return a;
            }
            else {
                return [];
            }
        }
        gamepad_3.getRawGamepads = getRawGamepads;
        var oldPads = [];
        if (!("addEventListener" in window))
            console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
        else
            addEventListener("load", function () {
                gamepad_3.poll(function () {
                    var newPads = getRawGamepads();
                    var n = Math.max(oldPads.length, newPads.length);
                    var _loop_3 = function(i) {
                        var oldPad = oldPads[i];
                        var newPad = newPads[i];
                        oldPads[i] = newPads[i];
                        if (oldPad === newPad) {
                            return "continue";
                        }
                        else if (!oldPad && !newPad) {
                            return "continue";
                        }
                        else if (!oldPad) {
                            log("fake connectedgamepad:", newPad);
                            rawConnectedCallbacks.forEach(function (cb) { return cb(newPad); });
                        }
                        else if (!newPad) {
                            log("fake disconnectedgamepad:", oldPad);
                            rawDisconnectedCallbacks.forEach(function (cb) { return cb(oldPad); });
                        }
                        else if ((oldPad.id !== newPad.id) || (oldPad.index !== newPad.index)) {
                            log("fake disconnectedgamepad:", oldPad);
                            log("fake connectedgamepad:", newPad);
                            rawDisconnectedCallbacks.forEach(function (cb) { return cb(oldPad); });
                            rawConnectedCallbacks.forEach(function (cb) { return cb(newPad); });
                        }
                        else {
                        }
                    };
                    for (var i = 0; i < n; ++i) {
                        var state_3 = _loop_3(i);
                        if (state_3 === "continue") continue;
                    }
                });
            });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function poll(action) {
            if ('requestAnimationFrame' in window) {
                var perFrame = function () {
                    window.requestAnimationFrame(perFrame);
                    action();
                };
                window.requestAnimationFrame(perFrame);
            }
            else {
                setInterval(action, 10);
            }
        }
        gamepad.poll = poll;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_4) {
        var assert = console.assert;
        function remapXformHat(condition) {
            return function (src, remap) {
                var i = src ? Math.round((src.value + 1) / 2 * 7) : 8;
                var v = condition(i);
                return { value: v ? 1.0 : 0.0, pressed: v };
            };
        }
        var axisXforms = {};
        var buttonXforms = {
            "11_01": function (src, remap) {
                var v = src ? (src.value + 1) / 2 : 0;
                return { value: v, pressed: !remap.param ? src.pressed : (v > remap.param) };
            },
            "hat-up-bit": remapXformHat(function (i) { return (i === 7) || (i === 0) || (i === 1); }),
            "hat-right-bit": remapXformHat(function (i) { return (1 <= i) && (i <= 3); }),
            "hat-down-bit": remapXformHat(function (i) { return (3 <= i) && (i <= 5); }),
            "hat-left-bit": remapXformHat(function (i) { return (5 <= i) && (i <= 7); })
        };
        var stdRemaps = {
            "054c-0ba0-blink-10-14": {
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a2" }, { src: "a5" }],
                buttons: [
                    { src: "b1" }, { src: "b2" }, { src: "b0" }, { src: "b3" },
                    { src: "b4" }, { src: "b5" }, { src: "a3", xform: "11_01", param: 0.125 }, { src: "a4", xform: "11_01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b10" }, { src: "b11" },
                    { src: "a9", xform: "hat-up-bit" }, { src: "a9", xform: "hat-down-bit" }, { src: "a9", xform: "hat-left-bit" }, { src: "a9", xform: "hat-right-bit" },
                    { src: "b12" },
                    { src: "b13" }
                ]
            },
            "054c-0ba0-gecko-8-18": {
                axes: [{ src: "a0" }, { src: "a1" }, { src: "a2" }, { src: "a5" }],
                buttons: [
                    { src: "b1" }, { src: "b2" }, { src: "b0" }, { src: "b3" },
                    { src: "b4" }, { src: "b5" }, { src: "a3", xform: "11_01", param: 0.125 }, { src: "a4", xform: "11_01", param: 0.125 },
                    { src: "b8" }, { src: "b9" }, { src: "b10" }, { src: "b11" },
                    { src: "b14" }, { src: "b15" }, { src: "b16" }, { src: "b17" },
                    { src: "b12" },
                    { src: "b13" }
                ]
            }
        };
        var stdRemapRepeats = {
            "054c-0ba0-gecko-6-18": "054c-0ba0-gecko-8-18",
            "054c-054c-gecko-8-18": "054c-0ba0-gecko-8-18",
            "054c-054c-gecko-6-18": "054c-0ba0-gecko-8-18",
            "054c-09cc-gecko-8-18": "054c-0ba0-gecko-8-18",
            "054c-09cc-gecko-6-18": "054c-0ba0-gecko-8-18"
        };
        Object.keys(stdRemapRepeats).forEach(function (newRemap) {
            var existingRemap = stdRemapRepeats[newRemap];
            console.assert(!!stdRemaps[existingRemap], "remap:", newRemap, "references nonexistant remap:", existingRemap);
            stdRemaps[newRemap] = stdRemaps[existingRemap];
        });
        function getRemapKey(gamepad) {
            var id = gamepad_4.parseGamepadId(gamepad.id);
            var key = id.vendor + "-" + id.product + "-" + id.hint + "-" + gamepad.axes.length + "-" + gamepad.buttons.length;
            return key;
        }
        function findStdRemap(gamepad) {
            var key = getRemapKey(gamepad);
            var value = stdRemaps[key];
            return value;
        }
        function tryRemapStdLayout(gamepad) {
            if (!gamepad)
                return gamepad;
            if (gamepad.mapping === "standard")
                return gamepad;
            var remapGamepad = findStdRemap(gamepad);
            if (!remapGamepad)
                return undefined;
            var flatGamepad = gamepad_4.flattenPremapGamepad(gamepad);
            var fakey = {
                id: gamepad.id,
                index: gamepad.index,
                timestamp: gamepad.timestamp,
                connected: gamepad.connected,
                mapping: "standard",
                axes: new Array(remapGamepad.axes.length),
                buttons: new Array(remapGamepad.buttons.length)
            };
            for (var i = 0; i < remapGamepad.axes.length; ++i) {
                var remapAxis = remapGamepad.axes[i];
                if (remapAxis === undefined) {
                    fakey.axes[i] = 0.0;
                }
                else if (remapAxis.xform === undefined) {
                    var flatAxis = flatGamepad[remapAxis.src];
                    assert(!!flatAxis);
                    fakey.axes[i] = flatAxis ? flatAxis.value : 0.0;
                }
                else {
                    var flatAxis = flatGamepad[remapAxis.src];
                    var remapXform = axisXforms[remapAxis.xform];
                    assert(!!flatAxis);
                    assert(!!remapXform);
                    fakey.axes[i] = remapXform(flatAxis, remapAxis).value;
                }
            }
            for (var i = 0; i < remapGamepad.buttons.length; ++i) {
                var remapButton = remapGamepad.buttons[i];
                if (remapButton === undefined) {
                    fakey.buttons[i] = { value: 0.0, pressed: false };
                }
                else if (remapButton.xform === undefined) {
                    var flatButton = flatGamepad[remapButton.src];
                    assert(!!flatButton);
                    fakey.buttons[i] = flatButton ? flatButton : { value: 0.0, pressed: false };
                }
                else {
                    var flatButton = flatGamepad[remapButton.src];
                    var remapXform = buttonXforms[remapButton.xform];
                    assert(!!flatButton);
                    assert(!!remapXform);
                    fakey.buttons[i] = remapXform(flatButton, remapButton);
                }
            }
            return fakey;
        }
        gamepad_4.tryRemapStdLayout = tryRemapStdLayout;
        function telemetryReportGamepad(gamepad) {
            if (!gamepad)
                return;
            if ((gamepad.mapping !== "standard") && !findStdRemap(gamepad)) {
                console.warn("No remap for gamepad:  ", getRemapKey(gamepad), "   " + gamepad.id);
                if (("Raven" in window) && Raven.isSetup()) {
                    var clone_1 = gamepad_4.cloneGamepad(gamepad);
                    var cloneNoData_1 = {};
                    Object.keys(clone_1).forEach(function (key) {
                        if ("axes buttons".split(' ').indexOf(key) === -1)
                            cloneNoData_1[key] = clone_1[key];
                    });
                    Raven.captureMessage("No remap for gamepad", {
                        level: "warning",
                        tags: {
                            remapKey: getRemapKey(gamepad),
                            gamepadId: gamepad.id
                        }, extra: {
                            axes: clone_1.axes,
                            buttons: clone_1.buttons.map(function (b) { return JSON.stringify(b); }),
                            gamepad: cloneNoData_1,
                            remapKey: getRemapKey(gamepad)
                        }
                    });
                }
            }
        }
        if ("addEventListener" in window)
            addEventListener("load", function () {
                gamepad_4.addRawConnectedListener(telemetryReportGamepad);
            });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad) {
        function isSupported() {
            if ('getGamepads' in navigator)
                return true;
            if ('onconnectedgamepad' in window)
                return true;
            return false;
        }
        gamepad.isSupported = isSupported;
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
//# sourceMappingURL=mmk.gamepad.js.map