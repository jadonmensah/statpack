import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    close_button: null,
    submit_button: null,
    mean: null,
    variance: null,
    comparison: null,
    x: null,
}

export let settings = {
    
}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.normal_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    if (!menutil.numeric_input(ui, "mean")) return false;

    if (!menutil.numeric_input(ui, "variance")) return false;

    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;


    if (!menutil.numeric_input(ui, "x")) return false;

    settings.input_placeholders = [
        [ui.mean, "Mean"],
        [ui.variance, "Variance"],
        [ui.x, "x"],
    ];

    if (!menutil.formula_control(sp.ui.normal_menu, ui, "X~N(", ui.mean, "&nbsp;,&nbsp;", ui.variance, ")")) return false;

    if (!menutil.formula_control(sp.ui.normal_menu, ui, "P(X&nbsp;", ui.comparison, "&nbsp;" , ui.x, ")")) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
}

export function show() {
    menutil.show_menu(sp.ui.normal_menu);
}

export function close() {
    menutil.close_menu(sp.ui.normal_menu);
}

function erf(x) {
    // Numerical approximation, adapted from Abramowitz & Stegun Handbook of Mathematical Functions 7.1.26
    // Maximal error is 1.5e-7
    // https://personal.math.ubc.ca/~cbm/aands/abramowitz_and_stegun.pdf
    const c = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
    const p = 0.3275911;
    x = Math.abs(x);
    let t = 1 / (1 + p * x);
    return 1 - ((((((c[4] * t + c[3]) * t) + c[2]) * t + c[1]) * t) + c[0]) * t * Math.exp(-1 * x * x);
}

export function submit() {
    menutil.clear_messages(sp.ui.normal_menu);

    // Agrees with casio FX cg50 to 6 decimal places
    // TODO test with wolfram alpha & other statistical packages

    let mean = menutil.read_float(sp.ui.normal_menu, ui.mean, "Mean of normal distribution must be a number");
    if (mean === null) return;
    let variance = menutil.read_float(sp.ui.normal_menu, ui.variance, "Variance of normal distribution must be a number");
    if (variance === null) return;
    let x = menutil.read_float(sp.ui.normal_menu, ui.x, "x must be a number");
    if (x === null) return;
    let comparison = ui.comparison.value;

    if (variance < 0) {
        menutil.error(sp.ui.normal_menu, "Variance of normal distribution must be greater than zero");
        return;
    }

    // normal distribution calculation stuff
    let result = (1 / 2) * (1 + erf((x - mean) / (Math.sqrt(variance) * Math.sqrt(2))));
    if (comparison == "geq") result = 1 - result;

    result = util.round_decimal(result, sp.default_settings.decimal_places);

    menutil.success(sp.ui.normal_menu, result);
}
