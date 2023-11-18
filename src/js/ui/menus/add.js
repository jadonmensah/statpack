import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    // UI elements in the menu (nulls replaced with DOM elements once init() is called)
    add_menu_list_1: null,
    add_menu_list_2: null,
    add_menu_out_list: null,
    close_button: null,
    submit_button: null,
}

export let settings = {
    // Input placeholders and event listeners assigned here 
}

export function init() {
    // Defines menu UI
    
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.add_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];
    // Input for the first list to be added
    if (!menutil.numeric_input(ui, "add_menu_list_1")) return false;
    
    // Input for the second list to be added
    if (!menutil.numeric_input(ui, "add_menu_list_2")) return false;

    // Input for the list which the result will be output to
    if (!menutil.numeric_input(ui, "add_menu_out_list")) return false;

    settings.input_placeholders = [
        [ui.add_menu_list_1, "First list"],
        [ui.add_menu_list_2, "Second list"],
        [ui.add_menu_out_list, "Output list"],
    ];
    
    // Custom control - looks like: List1 + List2 -> Output
    if (!menutil.formula_control(sp.ui.add_menu, ui, ui.add_menu_list_1, "&nbsp;+&nbsp;", ui.add_menu_list_2, "&nbsp;&DoubleRightArrow;&nbsp;", ui.add_menu_out_list)) return false;

    
    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

   
    return true;
}

export function show() {
    menutil.show_menu(sp.ui.add_menu);
}

export function close() {
    menutil.close_menu(sp.ui.add_menu);
}

export function submit() {
    let first = parseInt(ui.add_menu_list_1.value) - 1;
    let second = parseInt(ui.add_menu_list_2.value) - 1;
    let list_id = parseInt(ui.add_menu_out_list.value) - 1;
    
    let list_1 = menutil.read_list(first).map((v) => {if (isNaN(v)) return 0; return v;});
    let list_2 = menutil.read_list(second).map((v) => {if (isNaN(v)) return 0; return v;});
    
    let sum = list_1.map( (v, i) => {
            return v + list_2[i];
        }
    );
    
    menutil.write_list(list_id, sum);
    close();
}
