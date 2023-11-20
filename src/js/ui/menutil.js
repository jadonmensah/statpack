// statpack - menutil.js | jadon mensah
// description: utility functions for menu modules

import * as sp from "../statpack.js";
import * as list_view from "./list_view.js"
import * as util from "../util.js";

export function read_list(menu, list_id) {
    let list = [];

    let table = sp.ui.active_table;   
    
    if (!table) {
        error(menu, `Cannot read list ${list_id+1} because no tabs are open.`);
        return null;
    }
    
    if (list_id < 0) {
        error(menu, `Can't read list ${list_id+1}, did you input the correct list number?`);
        return null;
    }

    let skipped_heading = false;
    for (let row of table.rows) {
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }
        if (row.cells.length > list_id) {
            let value = parseFloat(row.children[list_id].textContent);
            if (isNaN(value)) value = undefined;
            list.push(value);
        } else {
            error(menu, `Can't read list ${list_id+1}, did you input the correct list number?`);
            return null;
        }
    }

    return list;
}

export function write_list(menu, list_id, list) {
    let table = sp.ui.active_table;
    let skipped_heading = false;
    let counter = 0;
    
    if (list_id < 0) {
        error(menu, `Can't write to list ${list_id+1}, did you input the correct list number?`);
        return null;
    }

    for (let row of table.rows) {
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }

        if (row.cells.length > list_id) {
            if (!util.is_undefined(list[counter]))
                row.children[list_id].textContent = list[counter++];
        } else {

            while (row.cells.length < (list_id + 1)) {
                list_view.add_list(parseInt(table.id.split("-").slice(-1)))();
                
            }
            if (!util.is_undefined(list[counter]))
                row.children[list_id].textContent = list[counter++];
        }
    }

    return true;
}


export function close_button(menu, ui) {
    let close_button = document.createElement("button");
    close_button.classList.add("close");
    close_button.type = "button";
    close_button.textContent = "X";
    ui.close_button = close_button;
    
    menu.append(close_button);
    return true;
}

export function close_submit_button(menu, ui) {
    // Generate close and submit buttons for menu
    close_button(menu, ui);
    
    let submit_button = document.createElement("button");
    submit_button.classList.add("submit");
    submit_button.type = "button";
    submit_button.innerHTML = "Submit";
    ui.submit_button = submit_button;
    menu.append(submit_button);

    return true;
}

export function numeric_input(ui, key) {
    // Generate generic integer input box for menu
    let input = document.createElement("input");
    input.classList.add("menu-numeric-input");
    input.onblur = (event) => {event.target.scrollLeft = 0};
    ui[key] = input;
    return true;
}

export function dropdown_select(ui, key, opts) {
    let select = document.createElement("select");
    select.classList.add("menu-dropdown-select");
    for (let [value, text] of opts) {
        let option = document.createElement("option");
        option.value = value;
        option.innerHTML = text;
        select.append(option);
    }
    ui[key] = select;
    return true;
}

function mathml(element) {
    return document.createElementNS("http://www.w3.org/1998/Math/MathML", element);
}

export function formula_control(...params) {
    // Generate formula input control for menu using MathML
    let container = document.createElement("div");
    container.classList.add("menu-control-container");

    let math = mathml("math");
    let mrow = mathml("mrow");
    let mi = mathml("mi");

    let menu = params[0];
    let ui = params[1];
    for (let param of params.slice(2)) {
        if (typeof param === "string") {
            let element = mathml("mn")
            element.innerHTML = param;
            mi.append(element);
        } else {
            let mn = mathml("mn");
            mn.append(param)
            mi.append(mn);
        }
    }

    mi.style.cssText = "display: inline !important";
    mrow.append(mi);
    math.append(mrow);
    container.append(math);
    menu.insertBefore(container, ui.submit_button);
    return true;
}

export function num_lists_in_current_tab() {
    let table = sp.ui.active_table; 
    return table.rows[1].children.length;
}

export function show_menu(menu) {
    // Show a menu
    menu.style.display = "block";
    sp.ui.overlay.classList.toggle("overlay-on");
    sp.ui.main.classList.toggle("overlayed");
    sp.ui.command_search.classList.toggle("command-search-overlay-fix");
}

export function close_menu(menu) {
    // Close a menu
    menu.style.display = "none";
    sp.ui.overlay.classList.remove("overlay-on");
    sp.ui.main.classList.remove("overlayed");
    sp.ui.command_search.classList.remove("command-search-overlay-fix");
    sp.ui.command_search_suggestions.replaceChildren();
    
}

export function clear_messages(menu) {
    for (let element of menu.children) {
        if (element.classList.contains("menu-message")) element.remove();
    }
}

export function success(menu, message) {
    let success = document.createElement("span")
    success.classList.add("menu-message");
    success.classList.add("menu-message-success");
    success.innerHTML = message;
    menu.insertBefore(success, menu.lastChild);
}

export function error(menu, message) {
    let error = document.createElement("span")
    error.classList.add("menu-message");
    error.classList.add("menu-message-error");
    error.innerHTML = message;
    menu.insertBefore(error, menu.lastChild);
}

export function text_block(menu, message) {
    let span = document.createElement("span");
    span.classList.add("menu-text-block");
    span.innerHTML = message;
    menu.append(span);
}

export function statpack_logotype(menu) {
    let text = "Statpack";
    let span = document.createElement("span");
    span.classList.add("statpack-logotype");
    span.textContent = text;
    menu.append(span);
}

export function read_int(menu, element, error_msg) {
    let result = parseInt(element.value);
    if (isNaN(result)) {
        error(menu, error_msg);
        return null;
    }
    return result;
}

export function read_float(menu, element, error_msg) {
    let result = parseFloat(element.value);
    if (isNaN(result)) {
        error(menu, error_msg);
        return null;
    }
    return result;
}