// Statpack - statpack.js | Jadon Mensah
// Description: Loads text into UI, sets up UI event callbacks, contains UI element names.

// Import modules from various files
import * as file_io from "./ui/file_io.js";
import * as list_view from "./ui/list_view.js";
import * as command from "./ui/command_search.js";

import * as add from "./ui/menus/add.js";
import * as log from "./ui/menus/log.js";
import * as linear from "./ui/menus/linear.js";
import * as calcpmcc from "./ui/menus/calcpmcc.js";
import * as export_csv from "./ui/menus/export_csv.js";
import * as binomial from "./ui/menus/binomial.js";
import * as normal from "./ui/menus/normal.js";
import * as poisson from "./ui/menus/poisson.js";
import * as about from "./ui/menus/about.js";
import * as geometric from "./ui/menus/geometric.js";
import * as chisquared from "./ui/menus/chisquared.js";

import * as unittest from "./unittest.js";

// UI elements
export let ui = {    
    // Menus
    add_menu: document.getElementById("add-menu"),
    log_menu: document.getElementById("log-menu"),
    linear_menu: document.getElementById("linear-menu"),
    calcpmcc_menu: document.getElementById("calcpmcc-menu"),
    export_csv_menu: document.getElementById("export-csv-menu"),
    binomial_menu: document.getElementById("binomial-menu"),
    normal_menu: document.getElementById("normal-menu"),
    poisson_menu: document.getElementById("poisson-menu"),
    about_menu: document.getElementById("about-menu"),
    geometric_menu: document.getElementById("geometric-menu"),
    chisquared_menu: document.getElementById("chisquared-menu"),

    // Menubar buttons
    menu_bar_button_file: document.getElementById("menu-bar-button-file"),
    menu_bar_button_edit: document.getElementById("menu-bar-button-edit"),
    menu_bar_button_info: document.getElementById("menu-bar-button-info"),

    // Miscellaneous elements
    main: document.getElementById("main"),
    overlay: document.getElementById("overlay"),
    import_csv_button: document.getElementById("import-csv-button"),
    file_input: document.getElementById("file-input"),
    export_csv_button: document.getElementById("export-csv-button"),
    about_button: document.getElementById("about-button"),
    tabs: document.getElementsByClassName("tab"),
    tab_bar: document.getElementById("tab-bar"),
    tab_buttons: document.getElementsByClassName("tab-button"),
    tab_button: (n) => document.getElementById("tab-"+n+"-button"),
    tab_close_button: (n) => document.getElementById("tab-"+n+"-close-button"),
    add_tab: document.getElementById("add-tab"),
    add_tab_button: document.getElementById("add-tab-button"),
    command_search: document.getElementById("command-search"),
    command_search_suggestions: document.getElementById("command-search-suggestions"),
    command_search_input: document.getElementById("command-search-input"),
    list_view: document.getElementById("list-view"),
    tables: document.getElementsByClassName("table"),
    table: (n) => document.getElementById("table-"+n),
    active_table: null,
    row: (n, id) => document.getElementById("row-"+n+"-tab-"+id),
    add_column: (n) => document.getElementById("add-column-"+n),

    null: document.getElementById("null"),
};

export const default_settings = {
    // Text for various UI buttons
    button_text: [
        [ui.menu_bar_button_file, "File"],
        [ui.import_csv_button, "Import .CSV file"],
        [ui.export_csv_button, "Export .CSV file"],
        [ui.menu_bar_button_edit, "Edit"],
        [ui.menu_bar_button_info, "Info"],
        [ui.about_button, "About Statpack"],
        [ui.add_tab_button, "+"],
    ],

    // Placeholders for UI input boxes
    input_placeholders: [
        [ui.command_search_input, "Search for a command..."]
    ],

    // Callbacks for various UI events - [element, event, function]
    event_listeners: [
        [ui.import_csv_button, "click", file_io.import_csv],
        [ui.file_input, "change", file_io.read_csv],
        [ui.export_csv_button, "click", export_csv.show],
        [ui.command_search_input, "change", command.execute_command],
        [ui.command_search_input, "input", command.update_suggestions],
        [ui.add_tab_button, "click", list_view.add_tab],
        [ui.about_button, "click", about.show],
    ],

    // Miscellaneous default values
    tab_name: "Sheet",
    list_name: "List",
    num_lists: 2,
    list_length: 10,
    suggestions_max_length: 5,
    decimal_places: 4,
    version: "1.0.0",
    last_updated: "11th December 2023",
};

// Variables containing global state information
export let state = {
    num_rows_for_tab: [10],
};

// Command names and descriptions
export const commands = {
    add: ["Add two lists.", add.show],
    log: ["Take the logarithm of each element in a list.",log.show],
    linear: ["Apply a linear transformation to a list.",linear.show],
    calcpmcc: ["Calculate the PMCC of two lists.",calcpmcc.show],
    binomial: ["Calculate probabilities for a binomial distribution.",binomial.show],
    normal: ["Calculate probabilities for a normally distributed random variable.",normal.show],
    poisson: ["Calculate probabilities for a Poisson distribution",poisson.show],
    geometric: ["Calculate probabilities for a geometric distribution",geometric.show],
    chisquared: ["Calculate probabilities for a chi-squared distribution",chisquared.show],
};

// UI initiation routine
export function init_ui() {
    // Add text to basic UI buttons
    for (let [button, text] of default_settings.button_text) button.textContent = text;

    // Set input placeholder text
    for (let [input, placeholder] of default_settings.input_placeholders) input.placeholder = placeholder;
    
    // Set up event listeners for controls
    for (let [element, event, func] of default_settings.event_listeners) element.addEventListener(event, func);

    // Set up tabs/list view
    if (!list_view.add_tab())
        console.error("sp.init_ui(): init tabs failed");

    // Run unit tests
    if (!unittest.run_tests()) console.error("sp.init_ui(): at least 1 unit test failed");

    // Call init routines for each menu
    for (let menu of [add, log, linear, calcpmcc, export_csv, binomial, normal, poisson, about, geometric, chisquared]) {
        if (!menu.init()) console.error("sp.init_ui(): menu init failed");
    }
}

