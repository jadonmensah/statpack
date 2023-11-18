import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";

export let ui = {
    close_button: null,
    submit_button: null,
    gradient: null,
    y_intercept: null,
    list_1: null,
    out_list: null,
}

export let settings = {

}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.linear_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    if (!menutil.numeric_input(ui, "gradient")) return false;

    if (!menutil.numeric_input(ui, "y_intercept")) return false;

    if (!menutil.numeric_input(ui, "list_1")) return false;

    if (!menutil.numeric_input(ui, "out_list")) return false;

    settings.input_placeholders = [
        [ui.list_1, "List"],
        [ui.gradient, "Gradient"],
        [ui.y_intercept, "y-intercept"],
        [ui.out_list, "Output list"],
    ];
    
    if (!menutil.formula_control(sp.ui.linear_menu, ui, "Code list &nbsp;", ui.list_1, "&nbsp;with:&nbsp;", ui.gradient, "&nbsp;,&nbsp;", ui.y_intercept, "&nbsp;&DoubleRightArrow;&nbsp;", ui.out_list)) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
    
}

export function show() {
    menutil.show_menu(sp.ui.linear_menu);
}

export function close() {
    menutil.close_menu(sp.ui.linear_menu);
}

function linear_transform(value, gradient, y_intercept) {
    return (value * gradient) + y_intercept;
}

export function submit() {
    let gradient = parseFloat(ui.gradient.value);
    let y_intercept = parseFloat(ui.y_intercept.value);
    let list_to_code = parseInt(ui.list_1.value) - 1;
    let out_list = parseInt(ui.out_list.value) - 1;
    
    let list_1 = menutil.read_list(list_to_code);

    let coded_list = list_1.map( (v) => {
            return linear_transform(v, gradient, y_intercept);
        }
    );
    
    menutil.write_list(out_list, coded_list);
    close();
}
