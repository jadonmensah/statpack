import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    // UI elements in the menu (nulls replaced with DOM elements once init() is called)
    close_button: null,
}

export let settings = {
    // Input placeholders and event listeners assigned here 
}

export function init() {
    // Defines menu UI
    
    // Standard close button
    if (!menutil.close_button(sp.ui.about_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
    ];
    
    // Set event listeners
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

