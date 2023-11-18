import * as sp from "../../statpack.js";
import * as menutil from "../menutil.js";
import * as util from "../../util.js";

export let ui = {
    close_button: null,
    submit_button: null,
    file_name: null,
}

export let settings = {
    
}

export function init() {
    // Standard close/submit buttons
    if (!menutil.close_submit_button(sp.ui.export_csv_menu, ui)) return false;

    settings.event_listeners = [
        [ui.close_button, "click", close],
        [ui.submit_button, "click", submit]
    ];

    if (!menutil.numeric_input(ui, "file_name")) return false;

    settings.input_placeholders = [
        [ui.file_name, "Filename"],
    ];
    
    if (!menutil.formula_control(sp.ui.export_csv_menu, ui, "Save file as: &nbsp;", ui.file_name, "&nbsp; .csv")) return false;

    // Set input placeholder text
    for (let [input, placeholder] of settings.input_placeholders) input.placeholder = placeholder;

    // Set event listeners
    for (let [element, event, func] of settings.event_listeners) element.addEventListener(event, func);

    return true;
}

export function show() {
    menutil.show_menu(sp.ui.export_csv_menu);
}

export function close() {
    menutil.close_menu(sp.ui.export_csv_menu);
}

export function submit() {
    menutil.clear_messages(sp.ui.export_csv_menu);

    let csv_str = "";

    for (let i = 0; i < menutil.num_lists_in_current_tab(); i++) {
        csv_str += menutil.read_list(i).map((x) => (util.is_undefined(x)) ? "" : x).join(", ") + "\n";
    }
    
    let csv_blob = new Blob([csv_str], {
        type: "text/csv"
    });
    
    var filename = ui.file_name.value;
    let download_link = document.createElement("a");
    download_link.download = filename;
    download_link.style.display = "none";
    download_link.href = window
    download_link.href = window.URL.createObjectURL(csv_blob);
    download_link.onclick = (e) => document.body.removeChild(e.target);
    document.body.appendChild(download_link);
    download_link.click();
    
    menutil.success(sp.ui.export_csv_menu, "Exported file successfully!");
}
