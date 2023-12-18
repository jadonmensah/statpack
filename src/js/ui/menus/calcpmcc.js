// Statpack - calcpmcc.js | Jadon Mensah
// Description: Module for the "calcpmcc" command menu.

// Import modules
import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

// Object containing UI elements which need to be polled or updated
export let ui = {
    list_1: null,
    list_2: null,
    close_button: null,
    submit_button: null,
}

// Object containing settings for the menu
export let settings = {}

// Set up menu elements and event listeners
export function init() {    
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.calcpmcc_menu, ui)) return false;
    
    if (!menutil.numeric_input(ui, "list_1")) return false;
    if (!menutil.numeric_input(ui, "list_2")) return false;
    if (!menutil.formula_control(sp.ui.calcpmcc_menu, ui, "&#961; (", ui.list_1, "&nbsp;,&nbsp;", ui.list_2, ")")) return false;
    
    // Set input placeholder text
    settings.input_placeholders = [
        [ui.list_1, "First list"],
        [ui.list_2, "Second list"],
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
    menutil.show_menu(sp.ui.calcpmcc_menu);
}

export function close() {
    menutil.close_menu(sp.ui.calcpmcc_menu);
}

// Given two lists, truncate the longer one so that they are both the same length
export function haircut(a, b) {
    let shorter = Math.min(a.findIndex(util.is_undefined), b.findIndex(util.is_undefined));
    return [a.slice(0, shorter), b.slice(0, shorter)];
}

// Calculate the sample PMCC for bivariate data (a,b)
export function sample_pmcc(a, b) {
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

// Read inputs, check for invalid data and output the correct PMCC
export function submit() {
    menutil.clear_messages(sp.ui.calcpmcc_menu);

    let l1_id = menutil.read_int(sp.ui.calcpmcc_menu, ui.list_1, "First list ID must be an integer");
    if (l1_id === null) return;
    l1_id = l1_id - 1;
    let l2_id = menutil.read_int(sp.ui.calcpmcc_menu, ui.list_2, "Second list ID must be an integer");
    if (l2_id === null) return;
    l2_id = l2_id - 1;

    let list_1 = menutil.read_list(sp.ui.calcpmcc_menu, l1_id);
    if (!list_1) return;
    let list_2 = menutil.read_list(sp.ui.calcpmcc_menu, l2_id);
    if (!list_2) return;

    let result = util.round_decimal(
                        sample_pmcc(...haircut(list_1, list_2)),
                        sp.default_settings.decimal_places);
    

    if (isNaN(result)) {
        menutil.error(sp.ui.binomial_menu, "Couldn't calculate PMCC. Have you chosen lists which contain numbers?");
        return;
    }
    menutil.success(sp.ui.calcpmcc_menu, result);
}
