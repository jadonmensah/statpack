import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    close_button: null,
    submit_button: null,
    rate: null,
    comparison: null,
    x: null,
}

export let settings = {
    
}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.poisson_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    if (!menutil.numeric_input(ui, "rate")) return false;

    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["eq", "="], ["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;

    if (!menutil.numeric_input(ui, "x")) return false;

    settings.input_placeholders = [
        [ui.rate, "Mean rate"],
        [ui.x, "x"],
    ];

    if (!menutil.formula_control(sp.ui.poisson_menu, ui, "X~Po(", ui.rate, ")")) return false;

    if (!menutil.formula_control(sp.ui.poisson_menu, ui, "P(X&nbsp;", ui.comparison, "&nbsp;" , ui.x, ")")) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
}

export function show() {
    menutil.show_menu(sp.ui.poisson_menu);
}

export function close() {
    menutil.close_menu(sp.ui.poisson_menu);
}

export function submit() {
    menutil.clear_messages(sp.ui.poisson_menu);

    let rate = menutil.read_float(sp.ui.poisson_menu, ui.rate, "Mean rate of poisson distribution must be a number");
    if (rate === null) return;
    let x = menutil.read_int(sp.ui.poisson_menu, ui.x, "x must be an integer");
    if (x === null) return;
    let comparison = ui.comparison.value;

    if (rate < 0) {
        menutil.error(sp.ui.poisson_menu, "Mean rate of poisson distribution must be greater than zero");
        return;
    }

    if (x < 0) {
        menutil.error(sp.ui.poisson_menu, "x must be greater than zero");
        return;
    }

    let result = NaN;
    if (comparison == "leq") result = util.gammq(Math.floor(x + 1), rate);
    else if (comparison == "geq") result = 1 - util.gammq(Math.floor(x), rate);
    else if (comparison == "eq") result = util.gammq(Math.floor(x + 1), rate) - util.gammq(Math.floor(x), rate);

    result = util.round_decimal(result, sp.default_settings.decimal_places);
    
    menutil.success(sp.ui.poisson_menu, result);
}
