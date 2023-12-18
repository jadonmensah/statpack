// Statpack - list_view.js | Jadon Mensah
// Description: Functions relating to the list-view part of the UI

// Import modules
import * as sp from "../statpack.js"

// Returns a function which adds a list to a given table
export function add_list(id) {
    return () => {
        let table = sp.ui.table(id);
        let head_row = sp.ui.head_row(id);
        let btn_th;
        if (sp.ui.add_column(id) === null) {
            btn_th = document.createElement("th");
            btn_th.classList.add("th-add-column")
            let btn = document.createElement("button");
            btn.id = "add-column-" + id;
            btn.textContent = "+";
            btn_th.onclick = add_list(id);
            btn_th.appendChild(btn);
            head_row.appendChild(btn_th);
        } else {
            btn_th = sp.ui.add_column(id).parentElement;
        }
        let name_th = document.createElement("th");
        let i = head_row.childNodes.length
        name_th.appendChild(
            document.createTextNode(sp.default_settings.list_name + " " + (i))
        );
        head_row.insertBefore(name_th, btn_th);        
        for (let j = 0; j < sp.state.num_rows_for_tab[id]; j++) {
            let row = sp.ui.row(j, id);
            let cell = document.createElement("td");
            cell.contentEditable = "true";
            cell.onblur = (event) => {event.target.scrollLeft = 0};
            row.appendChild(cell);
        }
    };
}

// Creates a default table with 2 lists
function create_default_table(id) { 
    let list_name = sp.default_settings.list_name;
    let num_lists = sp.default_settings.num_lists; 
    let list_length = sp.default_settings.list_length;
    
    let table = document.createElement("table");
    table.id = "table-" + id;
    table.classList.add("table");
    
    let t_head = table.createTHead();
    let h_row = table.insertRow();
    h_row.id = "row-header-"+id;
    t_head.appendChild(h_row);
    sp.ui.list_view.appendChild(table);
    
    sp.ui["head_row"] = (n) => document.getElementById("table-"+n).tHead.childNodes[0];
    
    for (let i = 0; i < list_length; i++) {
        let row = table.insertRow()
        row.id = "row-"+i+"-tab-"+id;
        table.appendChild(row);
    }
    
    for (let i = 0; i < num_lists; i++) add_list(id)();
    
    return table;
}

// Returns function which switches to a given tab
function switch_tab(tab_id){
    return () => {
        for (let element of sp.ui.tab_buttons) element.classList.remove("active-tab");
        sp.ui.tab_button(tab_id).classList.add("active-tab");

        
        for (let element of sp.ui.tables) {
            element.classList.remove("active-table")
            element.style.display = "none";
        }
        
        sp.ui.table(tab_id).classList.add("active-table");
        sp.ui.table(tab_id).style.display = "block";
        sp.ui.active_table = document.querySelector(".active-table");
    }; 
}

// Adds a new tab to the page
export function add_tab() {
    let tab_name = sp.default_settings.tab_name; 
    let list_name = sp.default_settings.list_name;
    let num_lists = sp.default_settings.num_lists; 
    let list_length = sp.default_settings.list_length;
    let n = sp.ui.tabs.length - 1;
    if (n < 0) return false;    
    let tab = document.createElement("li");
    tab.classList.add("tab");
    tab.id = "tab-"+n;
    let tab_n_button = document.createElement("button");
    tab_n_button.classList.add("tab-button");
    tab_n_button.id = "tab-"+n+"-button";
    tab_n_button.textContent = tab_name + " " + (n+1);
    tab_n_button.onclick = switch_tab(n);
    let tab_n_close_button = document.createElement("button");
    tab_n_close_button.classList.add("tab-close-button");
    tab_n_button.id = "tab-"+n+"-button";
    tab.append(tab_n_button, tab_n_close_button);
    sp.ui.tab_bar.insertBefore(tab, sp.ui.add_tab);
    let table = create_default_table(n);
    sp.ui.list_view.append(table);
    sp.state.num_rows_for_tab.push(list_length);
    switch_tab(n)();
    return true;
}
