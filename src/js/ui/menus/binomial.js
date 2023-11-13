import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";

export let ui = {
    close_button: null,
    submit_button: null,
    num_trials: null,
    prob_success: null,
    comparison: null,
    x: null,
}

export let settings = {
    
}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.binomial_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    // Input for the log base
    if (!menutil.numeric_input(ui, "num_trials")) return false;

    // Input for the list to apply the log function to
    if (!menutil.numeric_input(ui, "prob_success")) return false;

    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["eq", "="], ["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;

    // Input for the list we want to output to
    if (!menutil.numeric_input(ui, "x")) return false;

    settings.input_placeholders = [
        [ui.num_trials, "Trial count"],
        [ui.prob_success, "P(Success)"],
        [ui.x, "x"],
    ];

    if (!menutil.formula_control(sp.ui.binomial_menu, ui, "X~B(", ui.num_trials, ", ", ui.prob_success, ")")) return false;

    if (!menutil.formula_control(sp.ui.binomial_menu, ui, "P(X ", ui.comparison, ui.x, ")")) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
}

export function show() {
    menutil.show_menu(sp.ui.binomial_menu);
}

export function close() {
    menutil.close_menu(sp.ui.binomial_menu);
}

export function submit() {
    
}
