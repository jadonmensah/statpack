// Statpack - index.js | Jadon Mensah
// Description: Main javascript file, calls init_ui once window has loaded.

// Import the function "init_ui" from the file "statpack.js"
import { init_ui } from "./statpack.js";

// Call UI init routine once the window has loaded.
window.onload = () => init_ui();
