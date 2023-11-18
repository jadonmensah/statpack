import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";

export let ui = {
    close_button: null,
    submit_button: null,
    log_base: null,
    list_1: null,
    out_list: null,
}

export let settings = {

}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.log_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    // Input for the log base
    if (!menutil.numeric_input(ui, "log_base", "log-menu-log-base")) return false;
    
    // Input for the list to apply the log function to
    if (!menutil.numeric_input(ui, "list_1", "log-menu-list-1")) return false;

    // Input for the list we want to output to
    if (!menutil.numeric_input(ui, "out_list", "log-menu-out-list")) return false;

    settings.input_placeholders = [
        [ui.list_1, "List"],
        [ui.log_base, "Base"],
        [ui.out_list, "Output list"],
    ];
    
    let subscript_input = document.createElement("sub");
    subscript_input.append(ui.log_base);

    // Custom control - looks like: Log_base(list_1) => out_list
    if (!menutil.formula_control(sp.ui.log_menu, ui, "log", subscript_input, "(", ui.list_1, ")&nbsp;&DoubleRightArrow;&nbsp;", ui.out_list)) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
    
}

export function show() {
    menutil.show_menu(sp.ui.log_menu);
}

export function close() {
    menutil.close_menu(sp.ui.log_menu);
}

function log_base(base, num) {
    return (Math.log(num) / Math.log(base));
}

export function submit() {
    let base = parseFloat(ui.log_base.value);
    let list_to_log = parseInt(ui.list_1.value) - 1;
    let out_list = parseInt(ui.out_list.value) - 1;
    
    let list_1 = menutil.read_list(list_to_log);

    let log_of_list = list_1.map( (v) => {
            return log_base(base, v);
        }
    );
    
    menutil.write_list(out_list, log_of_list);
    close();
}
