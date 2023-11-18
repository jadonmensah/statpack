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

function gammln(x) {
    let cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let xx = x;
    let y = xx;
    let tmp = xx + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j <= 5; j++) ser += cof[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / xx);
}

function gammser(k, x) {
    let gln = gammln(k);
    if (x === 0) {
        return 0;
    }
    else {
        let kp = k;
        let sum = 1 / k;
        let del = sum;
        for (let n = 1; n < 1000; n++) {
            ++kp;
            del *= x / kp;
            sum += del;
            if (Math.abs(del) < Math.abs(sum) * 3.0e-9) {
                return sum * Math.exp(-x + k * Math.log(x) - (gln));
            }
        }
        return null;
    }
}

function gammcf(k, x) {
    let gln = gammln(k);
    let del = 0
    let kn = 0
    let b = x + 1 - k;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    let n = 0;
    for (let i = 1; i < 1000; i++) {
        kn = -i * (i - k);
        b += 2.0;
        d = kn * d + b;
        if (Math.abs(d) < 1.0e-30) d = 1.0e-30;
        c = b + kn / c;
        if (Math.abs(c) < 1.0e-30) c = 1.0e-30;
        d = 1.0 / d; del = d * c; h *= del;
        if (Math.abs(del - 1.0) < 3.0e-9) break;
        n = i
    }
    if (n > 1000) {
        return null;
    }

    return Math.exp(-x + k * Math.log(x) - (gln)) * h;
}
function gammq(a, x) {
    // translated from https://github.com/MTMurphy77/UVES_popler/blob/master/gammq.c
    if (x < 0) return null;
    if (a <= 0) return null;
    if (x < (a + 1)) {
        return 1 - gammser(a, x);
    }
    else {
        return gammcf(a, x);
    }
}

export function submit() {
    menutil.clear_messages(sp.ui.poisson_menu);

    let rate = parseFloat(ui.rate.value);
    let x = parseFloat(ui.x.value);
    let comparison = ui.comparison.value;

    let result = NaN;
    if (comparison == "leq") result = gammq(Math.floor(x + 1), rate);
    else if (comparison == "geq") result = 1 - gammq(Math.floor(x), rate);
    else if (comparison == "eq") result = gammq(Math.floor(x + 1), rate) - gammq(Math.floor(x), rate);

    result = util.round_decimal(result, sp.default_settings.decimal_places);
    
    menutil.success(sp.ui.poisson_menu, result);
}
