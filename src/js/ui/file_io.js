// Statpack - file_io.js | Jadon Mensah
// Description: Functions relating to file reading and writing.

import * as menutil from "./menutil.js";
import * as sp from "../statpack.js";

// Imports a file from the user's computer
export function import_csv() {
    document.getElementById("file-input").click();
}

// Reads a file from the user's computer
export function read_csv(e) {
    let [file] = e.target.files;
    let f_reader = new FileReader();
    f_reader.addEventListener(
        "load",
        () => {
            parse_and_write_csv(f_reader.result);
        },
        false,  
    );
    if (file) f_reader.readAsText(file);  
}

// Parses CSV string as a list and writes it to the current tab
function parse_and_write_csv(str) {
    let lines = str.split(/[\r\n]+/)
        .map((e) => e.trim())
        .filter(Boolean);
    let idx = 0;
    for (let line of lines) {
        let list = line.split(",").map((e) => e.trim());
        if (!list.length) continue;
        menutil.write_list(sp.ui.null, idx++, list);
    }
}

