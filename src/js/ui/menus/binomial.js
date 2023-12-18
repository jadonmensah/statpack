// Statpack - binomial.js | Jadon Mensah
// Description: Module for the "binomial" command menu.

// Import modules
import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

// Object containing UI elements which need to be polled or updated
export let ui = {
    close_button: null,
    submit_button: null,
    num_trials: null,
    prob_success: null,
    comparison: null,
    x: null,
}

// Object containing settings for the menu
export let settings = {}

// Set up menu elements and event listeners
export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.binomial_menu, ui)) return false;

    if (!menutil.numeric_input(ui, "num_trials")) return false;
    if (!menutil.numeric_input(ui, "prob_success")) return false;
    if (!menutil.dropdown_select(ui,
                                 "comparison",
                                 [["eq", "="], ["geq", "&#8805;"], ["leq", "&#8804;"]])) return false;
    if (!menutil.numeric_input(ui, "x")) return false;
    if (!menutil.formula_control(sp.ui.binomial_menu, ui, "X~B(", ui.num_trials, "&nbsp;,&nbsp;", ui.prob_success, ")")) return false;
    if (!menutil.formula_control(sp.ui.binomial_menu, ui, "P(X&nbsp;", ui.comparison, "&nbsp;" , ui.x, ")")) return false;

    // Set input placeholder text
    settings.input_placeholders = [
        [ui.num_trials, "Trial count"],
        [ui.prob_success, "P(Success)"],
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
    menutil.show_menu(sp.ui.binomial_menu);
}

export function close() {
    menutil.close_menu(sp.ui.binomial_menu);
}

// Look-up table for Pascal's triangle. If further rows are needed, it is extended on-the-fly by the choose() function
const pascals_triangle = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
    [1, 7, 21, 35, 35, 21, 7, 1],
    [1, 8, 28, 56, 70, 56, 28, 8, 1],

];

// Mathematical choose function, n C k
function choose(n, k) {
    while (n >= pascals_triangle.length) {
        let length = pascals_triangle.length;
        let next_row = [];
        next_row[0] = 1;
        for (let i = 1, prev = length - 1; i < length; i++) {
            next_row[i] = pascals_triangle[prev][i - 1] + pascals_triangle[prev][i];
        }
        next_row[length] = 1;
        pascals_triangle.push(next_row);
    }
    return pascals_triangle[n][k]
}

// Cumulative distribution function for the binomial distribution
function binomial_cdf(k, n, p) {
    let cumulative_sum = 0;
    
    for (let j = 0; j <= k; j++) {
        let nCj = choose(n, j);
        cumulative_sum += nCj * (p ** j) * ((1 - p) ** (n - j));
    }
    
    return cumulative_sum;
}

// Read inputs, check for invalid data and output the correct probability that the user wanted to calculate
export function submit() {
    menutil.clear_messages(sp.ui.binomial_menu);
    
    let x = menutil.read_int(sp.ui.binomial_menu, ui.x, "x must be an integer");
    if (x === null) return;
    let num_trials = menutil.read_int(sp.ui.binomial_menu, ui.num_trials, "Number of trials must be an integer");
    if (num_trials === null) return;
    let prob_success = menutil.read_float(sp.ui.binomial_menu, ui.prob_success, "Probability of success must be a number");
    if (prob_success === null) return;
    let comparison = ui.comparison.value;

    if (x < 0) {
        menutil.error(sp.ui.binomial_menu, "x must be greater than zero");
        return;
    }

    if (num_trials < 0) {
        menutil.error(sp.ui.binomial_menu, "Number of trials must be greater than zero");
        return;
    }

    if ((prob_success < 0) || (prob_success > 1)) {
        menutil.error(sp.ui.binomial_menu, "Probability of success must be between 0 and 1");
        return;
    }

    let result = binomial_cdf(x, num_trials, prob_success);
    if (comparison === "eq") result = result - binomial_cdf(x - 1, num_trials, prob_success);
    if (comparison === "geq") result = 1 - binomial_cdf(x - 1, num_trials, prob_success);
    result = util.round_decimal(result, sp.default_settings.decimal_places);
    
    menutil.success(sp.ui.binomial_menu, result);
}
