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
    /**
     * Returns `true` if the browser seems to provide the gamepad APIs mmk.gamepad relies on for actual input.
     * This isn't 100% accurate, Chromium on Linux has been known to define the APIs but not implement them.
     * 
     * `mmk.gamepad` methods should generally still "work" (e.g. noop) even if the underlying browser APIs are missing,
     * this method mostly exists to hint that you might not want to bother showing gamepad specific hints, or might want
     * to suggest a gamepad-enabled browser, depending on your game.
     */
	export function isSupported(): boolean {
		if ('getGamepads' in navigator) return true;
		if ('onconnectedgamepad' in window) return true;
		return false;
	}
}
