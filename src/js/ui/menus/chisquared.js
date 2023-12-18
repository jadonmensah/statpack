// Statpack - chisquared.js | Jadon Mensah
// Description: Module for the "chisquared" command menu.

// Import modules
import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

// Object containing UI elements which need to be polled or updated
export let ui = {
    close_button: null,
    submit_button: null,
    degrees_freedom: null,
    comparison: null,
    x: null,
}

// Object containing settings for the menu
export let settings = {}

// Set up menu elements and event listeners
export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.chisquared_menu, ui)) return false;

    if (!menutil.numeric_input(ui, "degrees_freedom")) return false;
    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;
    if (!menutil.numeric_input(ui, "x")) return false;
    if (!menutil.formula_control(sp.ui.chisquared_menu, ui, "X~&chi;&sup2;(", ui.degrees_freedom, ")")) return false;
    if (!menutil.formula_control(sp.ui.chisquared_menu, ui, "P(X&nbsp;", ui.comparison, "&nbsp;" , ui.x, ")")) return false;

    // Set input placeholder text
    settings.input_placeholders = [
        [ui.degrees_freedom, "Degrees of freedom"],
        [ui.x, "x"],
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
    menutil.show_menu(sp.ui.chisquared_menu);
}

export function close() {
    menutil.close_menu(sp.ui.chisquared_menu);
}

// Cumulative distribution function for the chi-squared distribution
function chisquared_cdf(x, degrees_freedom) {
    return util.gammp(degrees_freedom/2, x/2);
}

// Read inputs, check for invalid data and output the correct probability that the user wanted to calculate
export function submit() {
    menutil.clear_messages(sp.ui.chisquared_menu);

    let degrees_freedom = menutil.read_int(sp.ui.chisquared_menu, ui.degrees_freedom, "Number of degrees of freedom must be an integer");
    if (degrees_freedom === null) return;
    let x = menutil.read_float(sp.ui.chisquared_menu, ui.x, "x must be a number");
    if (x === null) return;
    let comparison = ui.comparison.value;

    if (degrees_freedom < 0) {
        menutil.error(sp.ui.chisquared_menu, "x must be greater than zero");
        return;
    }

    if (x < 0) {
        menutil.error(sp.ui.chisquared_menu, "x must be greater than zero");
        return;
    }

    let result = chisquared_cdf(x, degrees_freedom);
    if (comparison == "geq") result = 1 - result;

    result = util.round_decimal(result, sp.default_settings.decimal_places);

    menutil.success(sp.ui.chisquared_menu, result);
}
