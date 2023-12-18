// Statpack - add.js | Jadon Mensah
// Description: Module for the "add" command menu.

// Import modules 
import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";

// Object containing UI elements which need to be polled or updated
export let ui = {
    add_menu_list_1: null,
    add_menu_list_2: null,
    add_menu_out_list: null,
    close_button: null,
    submit_button: null,
}

// Object containing settings for the menu
export let settings = {}

// Set up menu elements and event listeners
export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.add_menu, ui)) return false;

    // Input for the first list to be added
    if (!menutil.numeric_input(ui, "add_menu_list_1")) return false;
    
    // Input for the second list to be added
    if (!menutil.numeric_input(ui, "add_menu_list_2")) return false;

    // Input for the list which the result will be output to
    if (!menutil.numeric_input(ui, "add_menu_out_list")) return false;

    // Custom control - looks like: List1 + List2 -> Output
    if (!menutil.formula_control(sp.ui.add_menu, ui, ui.add_menu_list_1, "&nbsp;+&nbsp;", ui.add_menu_list_2, "&nbsp;&DoubleRightArrow;&nbsp;", ui.add_menu_out_list)) return false;

    
    // Set input placeholder text
    settings.input_placeholders = [
        [ui.add_menu_list_1, "First list"],
        [ui.add_menu_list_2, "Second list"],
        [ui.add_menu_out_list, "Output list"],
    ];
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);
   
    return true;
}

export function show() {
    menutil.show_menu(sp.ui.add_menu);
}

export function close() {
    menutil.close_menu(sp.ui.add_menu);
}

// Read inputs, check for invalid data and output the new list as the user wanted.
export function submit() {
    menutil.clear_messages(sp.ui.add_menu);

    let first = menutil.read_int(sp.ui.add_menu, ui.add_menu_list_1, "First list ID must be an integer");
    if (first === null) return;
    first -= 1;
    let second = menutil.read_int(sp.ui.add_menu, ui.add_menu_list_2, "Second list ID must be an integer");
    if (second === null) return;
    second -= 1;
    let list_id = menutil.read_int(sp.ui.add_menu, ui.add_menu_out_list, "Output list ID must be an integer");
    if (list_id === null) return;
    list_id -= 1;

    let list_1 = menutil.read_list(sp.ui.add_menu, first);
    if (!list_1) return;
    list_1 = list_1.map((v) => {if (isNaN(v)) return 0; return v;});

    let list_2 = menutil.read_list(sp.ui.add_menu, second);
    if (!list_2) return;
    list_2 = list_2.map((v) => {if (isNaN(v)) return 0; return v;});

    let sum = list_1.map( (v, i) => {
            return v + list_2[i];
        }
    );
    
    if (!menutil.write_list(sp.ui.add_menu, list_id, sum)) return;

    close();
}
