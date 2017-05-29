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

namespace mmk.gamepad {
	interface Entry {
		original:  Gamepad;
		display:   Gamepad;
		parsedIds: ParsedGamepadId;
	}

	function getEntries(): Entry[] {
		return getRawGamepads().filter(gp => !!gp).map(gp => { return {
			original:  gp,
			display:   tryRemapStdLayout(gp) || gp,
			parsedIds: parseGamepadId(gp.id)
		};});
	}

	function gamepadAxisText(gamepad: Gamepad, axisIndex: number): string {
		let axis = gamepad.axes[axisIndex];
		if (axis === undefined) return "";
		return (axis >= 0 ? "+" : "") + axis.toFixed(2);
	}

	function gamepadButtonText(gamepad: Gamepad, buttonIndex: number): string {
		let button = gamepad.buttons[buttonIndex];
		if (button === undefined) return "";
		return button.value.toFixed(2);
	}

	function gamepadAxisFill(gamepad: Gamepad, axisIndex: number): string {
		let axis = gamepad.axes[axisIndex];
		if (axis === undefined) return "";
		let v = 255 * Math.abs(axis);
		if (v>255) v=255;
		v = 255-Math.round(v);
		let c = v.toString(16);
		if (c.length === 1) c = "0"+c;

		return (axis > 0) ? ("#"+c+"FFFF") : ("#FF"+c+c);
	}

	function gamepadButtonFill(gamepad: Gamepad, buttonIndex: number): string {
		let button = gamepad.buttons[buttonIndex];
		if (button === undefined) return "";
		let v = 255 * (0.1 + 0.9 * Math.abs(button.value));
		if (v>255) v=255;
		v = 255-Math.round(v);
		let c = v.toString(16);
		if (c.length === 1) c = "0"+c;

		return !button.pressed ? ("#"+c+"FFFF") : ("#FF"+c+c);
	}

	function refresh() {
		let entries = getEntries();

		let d3entries = d3.select("#mmk-gamepad-demo").selectAll(".gamepad").data(entries);

		let d3new = d3entries.enter().append("tr").attr("class", "gamepad");
		d3new.append("td").attr("class", "gamepad-name");
		d3new.append("td").attr("class", "gamepad-index");
		d3new.append("td").attr("class", "gamepad-mapping");
		d3new.append("td").attr("class", "gamepad-connected");
		d3new.append("td").attr("class", "gamepad-vendor");
		d3new.append("td").attr("class", "gamepad-product");
		d3new.append("td").attr("class", "gamepad-hint");
		for (let i=0; i< 8; ++i) d3new.append("td").attr("class", "gamepad-axis-"+i);
		for (let i=0; i<20; ++i) d3new.append("td").attr("class", "gamepad-button-"+i);

		d3entries.exit().remove();

		d3entries.select(".gamepad-name"     ).text(gp => gp.parsedIds.name);
		d3entries.select(".gamepad-index"    ).text(gp => gp.display.index);
		d3entries.select(".gamepad-mapping"  ).text(gp => gp.display.mapping);
		d3entries.select(".gamepad-connected").text(gp => gp.display.connected ? "true" : "false");
		d3entries.select(".gamepad-vendor"   ).text(gp => gp.parsedIds.vendor  || "N/A");
		d3entries.select(".gamepad-product"  ).text(gp => gp.parsedIds.product || "N/A");
		d3entries.select(".gamepad-hint"     ).text(gp => gp.parsedIds.hint    || "N/A");

		for (let i=0; i< 8; ++i) {
			d3entries.select(".gamepad-axis-"+i)
				.style("background-color", gp => gamepadAxisFill(gp.display, i))
				.text(gp => gamepadAxisText(gp.display, i));
		}

		for (let i=0; i<20; ++i) {
			d3entries.select(".gamepad-button-"+i)
				.style("background-color", gp => gamepadButtonFill(gp.display, i))
				.text(gp => gamepadButtonText(gp.display, i));
		}
	}

	if ('d3' in window) addEventListener("load", function(){
		let demo = document.getElementById("mmk-gamepad-demo");
		if (!demo) return;

		refresh();
		poll(refresh);
	});
}
