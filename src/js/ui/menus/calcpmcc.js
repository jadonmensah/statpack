import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    // UI elements in the menu (nulls replaced with DOM elements once init() is called)
    list_1: null,
    list_2: null,
    close_button: null,
    submit_button: null,
}

export let settings = {
    // Input placeholders and event listeners assigned here 
}

export function init() {
    // Defines menu UI
    
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.calcpmcc_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];
    
    if (!menutil.numeric_input(ui, "list_1")) return false;
    
    if (!menutil.numeric_input(ui, "list_2")) return false;

    settings.input_placeholders = [
        [ui.list_1, "First list"],
        [ui.list_2, "Second list"],
    ];
    
    if (!menutil.formula_control(sp.ui.calcpmcc_menu, ui, "&#961; (", ui.list_1, "&nbsp;,&nbsp;", ui.list_2, ")")) return false;

    
    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

   
    return true;
}

export function show() {
    menutil.show_menu(sp.ui.calcpmcc_menu);
}

export function close() {
    menutil.close_menu(sp.ui.calcpmcc_menu);
}

function haircut(a, b) {
    let shorter = Math.min(a.findIndex(util.is_undefined), b.findIndex(util.is_undefined));
    return [a.slice(0, shorter), b.slice(0, shorter)];
}

function sample_pmcc(a, b) {

    if (a.length != b.length) {
        return null;
    }

    let n = a.length;
    
    let sum_of_ab = a.map((v, i) => v * b[i]).reduce((s, t) => s + t, 0);
    let sum_of_a = a.reduce((s, t) => s + t, 0);
    let sum_of_b = b.reduce((s, t) => s + t, 0);
    let sum_of_a_squared = a.map((v) => v * v).reduce((s, t) => s + t, 0);
    let sum_of_b_squared = b.map((v) => v * v).reduce((s, t) => s + t, 0);

    let numerator = ((n * sum_of_ab) - (sum_of_a * sum_of_b));
    let denominator_part_a = Math.sqrt((n * sum_of_a_squared) - (sum_of_a * sum_of_a));
    let denominator_part_b = Math.sqrt((n * sum_of_b_squared) - (sum_of_b * sum_of_b));

    let pmcc = numerator / (denominator_part_a * denominator_part_b);

    return pmcc;

}

export function submit() {
    menutil.clear_messages(sp.ui.calcpmcc_menu);

    let list_1 = menutil.read_list(parseInt(ui.list_1.value) - 1);
    let list_2 = menutil.read_list(parseInt(ui.list_2.value) - 1);

    let result = util.round_decimal(
                        sample_pmcc(...haircut(list_1, list_2)),
                        sp.default_settings.decimal_places);
    
    menutil.success(sp.ui.calcpmcc_menu, result);
}
