import * as sp from "../statpack.js";
import * as menutil from "./menutil.js";

export function import_csv() {
    document.getElementById("file-input").click();
}

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
    
    if (file)
        f_reader.readAsText(file);  
}

function parse_and_write_csv(str, f_reader) {
    // Extremely naive CSV parsing, ignores non comma separators
    let lines = str.split(/[\r\n]+/)
        .map((e) => e.trim())
        .filter(Boolean);

    let idx = 0;
    for (let line of lines) {
        let list = line.split(",").map((e) => e.trim());
        if (!list.length) continue;

        menutil.write_list(idx++, list);
    }
}

