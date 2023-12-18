// Statpack - menutil.js | Jadon Mensah
// Description: Utility functions for menu modules

// Import modules from various files.
import * as sp from "../statpack.js";
import * as list_view from "./list_view.js"
import * as util from "../util.js";

// Reads a list from the currently open tab.
export function read_list(menu, list_id) {
    let list = [];
    let table = sp.ui.active_table;  
    // If the table is "falsy" - null, undefined, etc., this means there are no tabs open, so we can't read the list.
    if (!table) {
        error(menu, `Cannot read list ${list_id+1} because no tabs are open.`);
        return null;
    }    
    // list_id cannot be negative.
    if (list_id < 0) {
        error(menu, `Can't read list ${list_id+1}, did you input the correct list number?`);
        return null;
    }
    // Declare flag variable to check if we have skipped reading the header row.
    let skipped_heading = false;
    for (let row of table.rows) {
        // If we haven't already skipped reading the header row, skip reading the current row as it must be the header row.
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }
        // If the length of the current row is greater than list_id, then we can read it.
        // Otherwise error and quit.
        if (row.cells.length > list_id) {
            // Read the value in the given cell as a float.
            let value = parseFloat(row.children[list_id].textContent);
            // If the value can't be read as a float, set it to undefined.
            if (isNaN(value)) value = undefined;
            // Append the value to the list we will return
            list.push(value);
        } else {
            error(menu, `Can't read list ${list_id+1}, did you input the correct list number?`);
            return null;
        }
    }
    return list;
}

// Writes to a list in the currently open tab.
export function write_list(menu, list_id, list) {
    let table = sp.ui.active_table;
    // Declare flag variable to check if we have skipped writing to the header row.
    let skipped_heading = false;
    let counter = 0;
    // list_id cannot be negative.
    if (list_id < 0) {
        error(menu, `Can't write to list ${list_id+1}, did you input the correct list number?`);
        return null;
    }
    // Loop over the rows in the table
    for (let row of table.rows) {
        // If we haven't already skipped writing to the header row, skip writing to the current row as it must be the header row.
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }
        // If the length of the current row is greater than list_id then we can write to it, and increment the counter variable.
        // Otherwise, add a new list to the tab until the we can write to the list that we want
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

// Adds a standard "close" button to the menu
export function close_button(menu, ui) {
    let close_button = document.createElement("button");
    close_button.classList.add("close");
    close_button.type = "button";
    close_button.textContent = "X";
    // Add the element to the calling module's UI object 
    ui.close_button = close_button;
    // Add the element to the page
    menu.append(close_button);
    return true;
}

// Adds standard "close" and "submit" buttons to the menu
export function close_submit_button(menu, ui) {
    // Call close_button() to add a close button to the menu
    close_button(menu, ui);
    let submit_button = document.createElement("button");
    submit_button.classList.add("submit");
    submit_button.type = "button";
    submit_button.innerHTML = "Submit";
    ui.submit_button = submit_button;
    menu.append(submit_button);
    return true;
}

// Adds a input box which allows the user to enter numbers
export function numeric_input(ui, key) {
    let input = document.createElement("input");
    input.classList.add("menu-numeric-input");
    // When the input box loses focus, scroll back to the start
    input.onblur = (event) => {event.target.scrollLeft = 0};
    ui[key] = input;
    return true;
}

// Adds a control which allows the user to select one of many options from a drop-down menu
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

// Returns the MathML element with a given name
function mathml(element) {
    return document.createElementNS("http://www.w3.org/1998/Math/MathML", element);
}

// Adds a custom UI element to the menu, which looks like a mathematical formula
export function formula_control(...params) {
    let container = document.createElement("div");
    container.classList.add("menu-control-container");
    let math = mathml("math");
    let mrow = mathml("mrow");
    let mi = mathml("mi");
    let menu = params[0];
    let ui = params[1];
    // Loop through remaining parameters
    for (let param of params.slice(2)) {
        // If the parameter is a string, format it as mathematical formula text.  
        // Otherwise, insert the HTML element into the control
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
    // Ensure the formula displays as a single line
    mi.style.cssText = "display: inline !important";
    mrow.append(mi);
    math.append(mrow);
    container.append(math);
    // Place the formula at the bottom of the menu but just before the "submit" button
    menu.insertBefore(container, ui.submit_button);
    return true;
}

// Returns the number of lists in the current tab
export function num_lists_in_current_tab() {
    let table = sp.ui.active_table; 
    return table.rows[1].children.length;
}

// Makes a menu visible to the user
export function show_menu(menu) {
    menu.style.display = "block";
    sp.ui.overlay.classList.toggle("overlay-on");
    sp.ui.main.classList.toggle("overlayed");
    sp.ui.command_search.classList.toggle("command-search-overlay-fix");
}

// Makes a menu invisible to the user
export function close_menu(menu) {
    menu.style.display = "none";
    sp.ui.overlay.classList.remove("overlay-on");
    sp.ui.main.classList.remove("overlayed");
    sp.ui.command_search.classList.remove("command-search-overlay-fix");
    sp.ui.command_search_suggestions.replaceChildren();
    
}

// Removes any success or error messages from the menu
export function clear_messages(menu) {
    for (let element of menu.children) {
        if (element.classList.contains("menu-message")) element.remove();
    }
}

// Adds a success message to the menu
export function success(menu, message) {
    let success = document.createElement("span")
    success.classList.add("menu-message");
    success.classList.add("menu-message-success");
    success.innerHTML = message;
    menu.insertBefore(success, menu.lastChild);
}

// Adds an error message to the menu
export function error(menu, message) {
    let error = document.createElement("span")
    error.classList.add("menu-message");
    error.classList.add("menu-message-error");
    error.innerHTML = message;
    menu.insertBefore(error, menu.lastChild);
}

// Adds a text block to the menu
export function text_block(menu, message) {
    let span = document.createElement("span");
    span.classList.add("menu-text-block");
    span.innerHTML = message;
    menu.append(span);
}

// Adds the Statpack logo text to the menu
export function statpack_logotype(menu) {
    let text = "Statpack";
    let span = document.createElement("span");
    span.classList.add("statpack-logotype");
    span.textContent = text;
    menu.append(span);
}

// Reads an integer from an input box, and errors if the input is not an integer
export function read_int(menu, element, error_msg) {
    let result = parseInt(element.value);
    if (isNaN(result)) {
        error(menu, error_msg);
        return null;
    }
    return result;
}

// Reads a float from an input box, and erros if the input is not a float
export function read_float(menu, element, error_msg) {
    let result = parseFloat(element.value);
    if (isNaN(result)) {
        error(menu, error_msg);
        return null;
    }
    return result;
}