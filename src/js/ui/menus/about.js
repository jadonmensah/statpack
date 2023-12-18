// Statpack - add.js | Jadon Mensah
// Description: Module for the "add" command menu.

// Import modules
import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";

// Object containing UI elements which need to be polled or updated
export let ui = {
    close_button: null,
}

// Object containing settings for the menu
export let settings = {}

export function init() {
    // Standard close button
    if (!menutil.close_button(sp.ui.about_menu, ui)) return false;

    // Set event listeners
    settings.event_listeners = [
        [ui.close_button, "click", close],
    ];
    for (let [element, event, func] of settings.event_listeners) {
        element.addEventListener(event, func);
    }

    menutil.statpack_logotype(sp.ui.about_menu);
    menutil.text_block(sp.ui.about_menu, "Statistical calculator for A-Level Mathematics and Further Mathematics.");
    menutil.text_block(sp.ui.about_menu, "(c) Jadon Mensah, 2023")
    menutil.text_block(sp.ui.about_menu, `version ${sp.default_settings.version}, last updated ${sp.default_settings.last_updated}`)
    
    return true;
}

export function show() {
    menutil.show_menu(sp.ui.about_menu);
}

export function close() {
    menutil.close_menu(sp.ui.about_menu);
}

