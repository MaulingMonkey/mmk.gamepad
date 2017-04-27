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
	// TODO: Make polling mechanics customizeable?
	// e.g. customize setInterval interval? force setInterval even if raf is available?

	export function poll(action: ()=>void) {
		if ('requestAnimationFrame' in window) {
			var perFrame = ()=>{
				window.requestAnimationFrame(perFrame);
				action();
			};
			window.requestAnimationFrame(perFrame);
		} else {
			setInterval(action, 10); // 100Hz... good enough?
		}
	}
}
