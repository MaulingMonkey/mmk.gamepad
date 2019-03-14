"use strict";
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
var mmk;
(function (mmk) {
    var gamepad;
    (function (gamepad_1) {
        function getEntries() {
            var deadZone = document.getElementById("deadzone").checked ? 0.15 : 0;
            var standardize = document.getElementById("standardize").checked;
            var keepNonstandard = document.getElementById("keep-nonstd").checked;
            var keepInactive = document.getElementById("keep-inactive").checked;
            return mmk.gamepad.getGamepads({ deadZone: deadZone, standardize: standardize, keepNonstandard: keepNonstandard, keepInactive: keepInactive, keepNull: false }).map(function (gp) {
                return {
                    original: gp,
                    display: standardize ? gamepad_1.tryRemapStdLayout(gp) : gp,
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
        function refreshGamepads() {
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
            var _loop_1 = function (i) {
                d3entries.select(".gamepad-axis-" + i)
                    .style("background-color", function (gp) { return gamepadAxisFill(gp.display, i); })
                    .text(function (gp) { return gamepadAxisText(gp.display, i); });
            };
            for (var i = 0; i < 8; ++i) {
                _loop_1(i);
            }
            var _loop_2 = function (i) {
                d3entries.select(".gamepad-button-" + i)
                    .style("background-color", function (gp) { return gamepadButtonFill(gp.display, i); })
                    .text(function (gp) { return gamepadButtonText(gp.display, i); });
            };
            for (var i = 0; i < 20; ++i) {
                _loop_2(i);
            }
        }
        var eventRows = [];
        function refreshEvents() {
            var keepValueEvents = document.getElementById("keep-value-events").checked;
            if (!keepValueEvents)
                eventRows = eventRows.filter(function (row) { return row.type.substr(Math.max(0, row.type.length - 6)) !== "-value"; });
            while (eventRows.length > 20)
                eventRows.shift();
            var d3entries = d3.select("#mmk-gamepad-events-demo").selectAll(".event").data(eventRows);
            var d3new = d3entries.enter().append("tr").attr("class", "event");
            d3new.append("td").attr("class", "event-type");
            d3new.append("td").attr("class", "event-gamepad-index");
            d3new.append("td").attr("class", "event-index");
            d3new.append("td").attr("class", "event-held");
            d3new.append("td").attr("class", "event-value");
            d3entries.exit().remove();
            d3entries.select(".event-type").text(function (e) { return e.type; });
            d3entries.select(".event-gamepad-index").text(function (e) { return e.gamepadIndex; });
            d3entries.select(".event-index").text(function (e) { return e.index || ""; });
            d3entries.select(".event-held").text(function (e) { return e.held || ""; });
            d3entries.select(".event-value").text(function (e) { return e.value || ""; });
        }
        function refresh() {
            refreshGamepads();
            refreshEvents();
        }
        if ('d3' in window)
            addEventListener("load", function () {
                var demo = document.getElementById("mmk-gamepad-demo");
                if (!demo)
                    return;
                refresh();
                gamepad_1.poll(refresh);
                if ('addEventListener' in window) {
                    addEventListener("mmk-gamepad-connected", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), value: e.connected ? "connected" : "disconnected" }); });
                    addEventListener("mmk-gamepad-disconnected", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), value: e.connected ? "connected" : "disconnected" }); });
                    addEventListener("mmk-gamepad-button-down", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), index: e.buttonIndex.toString(), held: e.held ? "held" : "released", value: e.buttonValue.toFixed(2) }); });
                    addEventListener("mmk-gamepad-button-up", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), index: e.buttonIndex.toString(), held: e.held ? "held" : "released", value: e.buttonValue.toFixed(2) }); });
                    addEventListener("mmk-gamepad-button-value", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), index: e.buttonIndex.toString(), held: e.held ? "held" : "released", value: e.buttonValue.toFixed(2) }); });
                    addEventListener("mmk-gamepad-axis-value", function (e) { return eventRows.push({ type: e.type, gamepadIndex: e.gamepadIndex.toString(), index: e.axisIndex.toString(), value: e.axisValue.toFixed(2) }); });
                }
            });
    })(gamepad = mmk.gamepad || (mmk.gamepad = {}));
})(mmk || (mmk = {}));
//# sourceMappingURL=demo.js.map