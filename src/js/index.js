// statpack - index.js | jadon mensah
// description: main javascript file, calls init_ui once window has loaded

console.log(`welcome to statpack v0.0.0
want to help develop & maintain statpack? visit https://github.com/jadonmensah/statpack
`);

import {init_ui} from "./statpack.js";

// Call UI init routine
window.onload = () => init_ui();
