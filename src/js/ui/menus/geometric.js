import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    close_button: null,
    submit_button: null,
    prob_success: null,
    comparison: null,
    x: null,
}

export let settings = {
    
}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.geometric_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    if (!menutil.numeric_input(ui, "prob_success")) return false;

    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["eq", "="], ["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;

    if (!menutil.numeric_input(ui, "x")) return false;

    settings.input_placeholders = [
        [ui.prob_success, "P(Success)"],
        [ui.x, "x"],
    ];

    if (!menutil.formula_control(sp.ui.geometric_menu, ui, "X~Geo(", ui.prob_success, ")")) return false;

    if (!menutil.formula_control(sp.ui.geometric_menu, ui, "P(X&nbsp;", ui.comparison, "&nbsp;" , ui.x, ")")) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
}

export function show() {
    menutil.show_menu(sp.ui.geometric_menu);
}

export function close() {
    menutil.close_menu(sp.ui.geometric_menu);
}

function geometric_cdf(x, p) {
    if (x >= 1) return 1 - Math.pow((1-p), Math.floor(x));
    return 0;
}

export function submit() {
    menutil.clear_messages(sp.ui.geometric_menu);
    
    let x = menutil.read_int(sp.ui.geometric_menu, ui.x, "x must be an integer");
    if (x === null) return;
    let prob_success = menutil.read_float(sp.ui.geometric_menu, ui.prob_success, "Probability of success must be a number");
    if (prob_success === null) return;
    let comparison = ui.comparison.value;

    if (x < 1) {
        menutil.error(sp.ui.geometric_menu, "x must be greater than one");
        return;
    }

    if ((prob_success < 0) || (prob_success > 1)) {
        menutil.error(sp.ui.geometric_menu, "Probability of success must be between 0 and 1");
        return;
    }

    let result = geometric_cdf(x, prob_success);
    if (comparison === "eq") result = result - geometric_cdf(x - 1, prob_success);
    if (comparison === "geq") result = 1 - geometric_cdf(x - 1, prob_success);
    result = util.round_decimal(result, sp.default_settings.decimal_places);
    
    menutil.success(sp.ui.geometric_menu, result);
}
