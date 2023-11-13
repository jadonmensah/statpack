import * as sp from "../statpack.js";

function sort_by_string_distance(initial_word, words_to_sort) {
    let word_distances = words_to_sort.map(word => ({
        word: word,
        distance: string_distance(word, initial_word)
    }));

    // Sort by distance from initial word
    word_distances.sort((a, b) => b.distance - a.distance);

    // Return sorted list
    return word_distances.map(word_distance => word_distance.word);
}

function string_distance(a, b) {
    // truncated hamming distance
    if (a.length > b.length) a = a.slice(0, b.length);
    if (a.length < b.length) b = b.slice(0, a.length);
    
    let count = 0;
    for (let n = 0; n < a.length; n++) {
        if (a[n] != b[n]) {
            count = count + 1;
        }
    }
    
    return count;
}

export function execute_command() {
    let search = sp.ui.command_search_input.value;
    let suggestion = sort_by_string_distance(search, Object.keys(sp.commands)).slice(-1);
    sp.commands[suggestion][1]();
    sp.ui.command_search_input.value = "";
}
export function update_suggestions() {
    sp.ui.command_search_suggestions.replaceChildren();

    let search = sp.ui.command_search_input.value;

    if (search.length === 0) {
        return;
    }
    
    let suggestions = sort_by_string_distance(search, Object.keys(sp.commands)).slice(-3);

    for (let suggestion of suggestions) {
        let element = document.createElement("span");
        element.classList.add("command-search-suggestion");
        
        let command_name = document.createElement("strong");
        command_name.classList.add("command-search-suggestion-name");
        command_name.textContent = suggestion;
        element.append(command_name);

        let command_description = document.createElement("p");
        command_description.classList.add("command-search-suggestion-description");
        command_description.textContent = sp.commands[suggestion][0];
        element.append(command_description);
        
        sp.ui.command_search_suggestions.append(element);
    }
}
