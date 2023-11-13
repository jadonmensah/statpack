// statpack - menutil.js | jadon mensah
// description: utility functions for menu modules

import * as sp from "../statpack.js";
import * as list_view from "./list_view.js"
import * as util from "../util.js";

export function read_list(list_id) {
    let list = [];

    let table = sp.ui.active_table;   
    
    if (table === null) return null;
    
    if (list_id < 0) return null;
    let skipped_heading = false;
    for (let row of table.rows) {
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }
        if (row.cells.length > list_id) {
            list.push(parseFloat(row.children[list_id].textContent));
        } else {
            return null;
        }
    }

    
    return list;
}

export function write_list(list_id, list) {
    let table = sp.ui.active_table;
    let skipped_heading = false;
    let counter = 0;
    for (let row of table.rows) {
        if (!skipped_heading) {
            skipped_heading = true;
            continue;
        }

        if (row.cells.length > list_id) {
            if (!isNaN(list[counter])) row.children[list_id].textContent = list[counter++];
        } else {

            while (row.cells.length < (list_id + 1)) {
                list_view.add_list(parseInt(table.id.split("-").slice(-1)))();
                
            }
            if (!isNaN(list[counter])) row.children[list_id].textContent = list[counter++];
        }
    }
}

export function close_submit_button(menu, ui, id_stem) {
    // Generate close and submit buttons for menu
    let close_button = document.createElement("button");
    close_button.classList.add("close");
    close_button.type = "button";
    close_button.textContent = "X";
    ui.close_button = close_button;
    
    menu.append(close_button);

    let submit_button = document.createElement("button");
    submit_button.classList.add("submit");
    submit_button.type = "button";
    submit_button.innerHTML = "Submit";
    ui.submit_button = submit_button;
    menu.append(submit_button);

    return true;
}

export function integer_input(menu, ui, key, id_stem) {
    // Generate generic integer input box for menu
    let input = document.createElement("input");
    input.classList.add("menu-numeric-input");
    input.onblur = (event) => {event.target.scrollLeft = 0};
    ui[key] = input;
    return true;
    
}

export function formula_control(...params) {
    // Generate formula input control for menu using MathML
    let container = document.createElement("div");
    container.classList.add("menu-control-container");
    let menu = params[0];
    let ui = params[1];
    for (let param of params.slice(2)) {
        if (typeof param === "string") {
            let element = document.createElement("mn")
            element.innerHTML = param;
            container.append(element);
        } else {
            container.append(param);
        }
    }
    menu.insertBefore(container, ui.submit_button);
    return true;
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
