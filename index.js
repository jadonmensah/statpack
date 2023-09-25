console.log(`welcome to statpack v0.0.0
want to help develop & maintain statpack? visit TODO https://github.com/jadonmensah/statpack
`);
console.log("tested with mozilla firefox & google chrome on windows 11");

const StatpackSettings = {
    DEBUG_random_counter: 0,
    default_num_lists: 2,
    default_list_length: 10,
    default_tab_name: "Sheet",
    default_list_name: "List",
    suggestions_max_length: 5,
};

const StatpackCommands = {
    "add": cmd_add,
    "add_desc": "Add two lists together",
    "log": cmd_log,
    "log_desc": "Apply a log function to every element in a list",
    "linear": cmd_linear,
    "linear_desc": "Apply a linear transformation to every element in a list",
    "calcpmcc": cmd_calcpmcc,
    "calcpmcc_desc": "Calculate the product-moment correlation coefficient of two lists",
    "testpmcc": cmd_testpmcc,
    "testpmcc_desc": "Test the significance of a PMCC",
    "normal": cmd_normaldist,
    "normal_desc": "TODO add normal_desc",
    "poisson": cmd_poissondist,
    "poisson_desc": "TODO add poisson_desc",
    "binomial": cmd_binomialdist,
    "binomial_desc": "TODO add binomial_desc",
    "geometric": cmd_geodist,
    "geometric_desc": "TODO add geometric_desc",
    "chisquared": cmd_x2dist,
    "chisquared_desc": "TODO add chisquared_desc"
}

let State = {
    // State variables that need to be accessed easily
    num_tabs: 0,
    num_lists_for_tab: [StatpackSettings.default_num_lists], //
}

let current_listview = document.getElementById("current-listview");
let tab_bar = document.getElementById("tab-bar");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init_tabs(default_tab_name) {
    document.getElementById("default-tab").textContent = default_tab_name + " " + ++State.num_tabs;
    
    document.getElementById("default-tab").onclick = function () {
        let tab = document.getElementById("listview-"+0);
        for (let child of document.getElementById("current-listview").children) {
            
            child.classList.remove("visible-listview");
   
        }
        
        tab.classList.add("visible-listview");
        for (let child of document.getElementById("tab-bar").children) {
            child.classList.remove("current-tab");
        }
        document.getElementById("default-tab").parentElement.classList.add("current-tab");
    }
    document.getElementById("add-tab").onclick = function () {
        add_tab(State.num_tabs++, default_tab_name);
        for (let child of document.getElementById("current-listview").children) {
            child.classList.remove("visible-listview");
        }
        document.getElementById("listview-"+(State.num_tabs-1)).classList.add("visible-listview");
        State.num_lists_for_tab[State.num_tabs-1] = StatpackSettings.default_num_lists;
        for (let child of document.getElementById("tab-bar").children) {
            child.classList.remove("current-tab");
        }
        document.getElementById("tab-"+(State.num_tabs-1)).parentElement.classList.add("current-tab");
    }
}

function add_list(tab_id, num_lists, default_list_length, default_list_name) {
    
    for (let i = 0; i <= default_list_length; i++) {	
	if (i === 0) {
	    let row = document.getElementById("row-header-" + tab_id);
	    let th = document.createElement("th");
	    th.classList.add("bordered-cell");
	    let text = document.createTextNode(default_list_name + " " + (num_lists+1));
	    let plusbtn_th = document.getElementById("add-column-" + tab_id).parentElement;
	    th.appendChild(text);
	    row.appendChild(th);
	    row.insertBefore(th, plusbtn_th);
	    
	} else {
	    let row = document.getElementById("row-" + (i - 1) + "-listview-" + tab_id);
	    
	    let cell = document.createElement("td");
	    cell.classList.add("bordered-cell");
            cell.contentEditable = "true";
	    cell.onblur = function (evt) {evt.target.scrollLeft = 0;}
	    cell.onwheel = e => {
		
		e.preventDefault();
		const container = e.target.parentElement.parentElement;
		const containerScrollPosition = e.target.scrollLeft;
		container.scrollTo({
		    top: 0,
		    left: containerScrollPosition + e.deltaY,
		    behaviour: "smooth"
		});
	    };
	    row.appendChild(cell);
	}
    }
    
}

function init_listview(listview, default_num_lists, default_list_length, default_list_name, tab_id) {
    // Generate table
    const table = document.createElement("table");
    table.id = "listview-" + tab_id;
    table.classList.add("listview");
    table.classList.add("visible-listview");
    //table.contentEditable = "true";
    table.onwheel = e => {
	
	e.preventDefault();
	const container = e.target;
	const containerScrollPosition = e.target.scrollLeft;
	container.scrollTo({
	    top: 0,
	    left: containerScrollPosition + e.deltaY,
	    behaviour: "smooth"
	});
    };



    // Generate table headings
    let thead = table.createTHead();
    let row = table.insertRow();
    row.id = "row-header-" + tab_id;
    for (let i = 0; i <= default_num_lists; i++) {
	if (i !== default_num_lists) {
	    // Insert default heading text
	    let th = document.createElement("th");
	    th.classList.add("bordered-cell");
	    let text = document.createTextNode(default_list_name + " " + (i+1));
	    th.appendChild(text);
	    row.appendChild(th);
	} else {
	    // Add plus button
	    let plusbtn_th = document.createElement("th");
	    let plusbtn = document.createElement("button");
	    plusbtn.textContent = "+";
	    plusbtn.title="Add a new list to the current sheet"
	    plusbtn.id = "add-column-" + tab_id;
	    plusbtn.contentEditable = "false";
	    plusbtn.onclick = function () {  add_list(tab_id,
						      State.num_lists_for_tab[tab_id],
						      default_list_length,
						      default_list_name);
					     State.num_lists_for_tab[tab_id] += 1;}
	    plusbtn_th.appendChild(plusbtn);
	    row.appendChild(plusbtn_th);
	    
	}
    }
    thead.appendChild(row);

    // Generate table cells
    for (let j = 0; j < default_list_length; j++) {
	const row = table.insertRow();
	row.id = "row-" + j + "-listview-" + tab_id;
	for (let k = 0; k < default_num_lists; k++) {
	    let cell = document.createElement("td");
	    cell.classList.add("bordered-cell");
            cell.contentEditable = "true";
	    
	    cell.onblur = function (evt) {evt.target.scrollLeft = 0;}
	    cell.onwheel = e => {
		
		e.preventDefault();
		const container = e.target.parentElement.parentElement;
		const containerScrollPosition = e.target.scrollLeft;
		container.scrollTo({
		    top: 0,
		    left: containerScrollPosition + e.deltaY,
		    behaviour: "smooth"
		});
	    };
	    row.appendChild(cell);
	    
	}
	table.appendChild(row);
    }
    listview.appendChild(table);

    // Prevent user from entering newlines in cell
    table.addEventListener("keydown", (evt) => {
	if (evt.code === "Enter") {
            evt.preventDefault();
	}
    });
}

function draw_command_suggestions(suggestions) {
    let suggestions_div = document.getElementById("palette-suggestions");
    suggestions_div.replaceChildren();
    for (let i = 0; i < suggestions.length; i++ ) {
	// add p with strong.command-name for command name and then description
	let suggestion = document.createElement("p");
	let cmdname = document.createElement("strong");
	cmdname.classList.add("command-name");
	cmdname.textContent += suggestions[i].name;
	suggestion.appendChild(cmdname);

	let cmddesc = document.createTextNode(suggestions[i].desc);
	
	suggestion.appendChild(cmddesc);
	suggestion.insertBefore(cmdname, cmddesc);
	suggestions_div.appendChild(suggestion);
    }
}


function strdist(a,b) {
    // truncated hamming distance
    if (a.length > b.length) {
        a = a.slice(0, b.length);
    }
    if (a.length < b.length) {
        b = b.slice(0, a.length);
    }
    let count = 0;
    for (let n = 0; n < a.length; n++) {
        if (a[n] != b[n]) {
            count = count + 1;
            console.log(a + " " + b);
        }
    }
    return count;
    
}

function sort_by_strdist(singleWord, words) {
    let wordDistances = words.map(word => ({
        word: word,
        distance: strdist(word, singleWord)
    }));

    // Sort the array by distance
    wordDistances.sort((a, b) => a.distance - b.distance);

    // Return the sorted list of words
    return wordDistances.map(wd => wd.word);    
}

function gen_suggest_obj(cmd) {
    return {
        name: cmd,
        desc: StatpackCommands[cmd+"_desc"],
    }; 
}

function suggest(input) {
    function clear_suggest(input) {
        document.getElementById("palette-suggestions").replaceChildren();
    }
    let tokens = input.trim().split(/\s+/);
    // create copy of StatpackCommands keys
    // filter elements ending in _desc
    var keys = Object.keys(StatpackCommands).filter(key => !(key.endsWith("_desc")));
    // sort based on levenshtein distance between user input and StatpackCommands keys
    
    
    let suggestions = sort_by_strdist(tokens[0], keys).reverse().slice(-3).map(gen_suggest_obj);
    //let suggestions = [{name: ("FakeCommand" + StatpackSettings.DEBUG_random_counter++), desc: "This is a fake command for testing purposes."}];
    draw_command_suggestions(suggestions);
}

function clear_suggest(input) {
   document.getElementById("palette-suggestions").replaceChildren();
}

function init_palette() {
    let palette_input = document.getElementsByName("palette-input");
    if (palette_input.length !== 1) {
	console.log("more than 1 palette-input (or none at all) - something's up")
    }
    palette_input = palette_input[0];
    
    palette_input.oninput = function () {suggest(palette_input.value);}
    palette_input.addEventListener("keydown", (evt) => {
	if (evt.code === "Enter") {
            evt.preventDefault();
            exec_command(palette_input.value);
            palette_input.value = "";
            clear_suggest();
	}
    });
}

async function exec_command(cmd) {
    // Split on whitespace
    let tokens = cmd.trim().split(/\s+/);
    if (tokens[0] in StatpackCommands) {
        StatpackCommands[tokens[0]](tokens.slice(1));
    } else {
        // add err to palette input
        let palette_input = document.getElementsByName("palette-input")[0];
        palette_input.classList.add("error");
        // sleep 500ms
        await sleep(500);
        // remove err from palette input
        palette_input.classList.remove("error");
    }
}

function get_list(list_num, tab_id) {
    let list = []
    let table = document.getElementById("listview-"+tab_id);
    if (table === null) {
        return null;
    }
    if (list_num < 0) {
        return null;
    }

    let skipped_heading = false;
    for (let row of table.rows) {
        if (!skipped_heading) {skipped_heading = true; continue;}
        if (row.cells.length > list_num) {
            
            list.push(parseFloat(row.children[list_num].textContent));
        } else {
            return null;
        }
    }
    return list;
}

function add_tab(tab_id, default_tab_name) {
    // add new listview table with id listview-{tab_id)
    init_listview(current_listview,
                  StatpackSettings.default_num_lists,
                  StatpackSettings.default_list_length,
                  StatpackSettings.default_list_name,
                  tab_id);
    // add button to switch tabs
    let tab_bar = document.getElementById("tab-bar");
    let tab_bar_li = document.createElement("li");
    tab_bar_li.classList.add("tab");
    let tab_btn = document.createElement("button");
    tab_btn.id = "tab-" + tab_id;
    tab_btn.textContent = default_tab_name + " " + (tab_id+1);
    tab_bar_li.appendChild(tab_btn);
    tab_bar.appendChild(tab_bar_li);
    let add_btn_li = document.getElementById("add-tab-li");
    tab_bar.insertBefore(tab_bar_li, add_btn_li);
      // button onclick -> add current-tab to listview table classList, remove from other listviews
    tab_btn.onclick = function () {
        let tab = document.getElementById("listview-"+tab_id);
        for (let child of document.getElementById("current-listview").children) {
            
            child.classList.remove("visible-listview");
   
        }
	// highlight self, unhighlight every other tab button
        
        
        for (let child of document.getElementById("tab-bar").children) {
            child.classList.remove("current-tab");
        }
        tab_bar_li.classList.add("current-tab");
        
        tab.classList.add("visible-listview");

    }
    // click button to switch to tab
}

function write_list(list, list_num, tab_id) {
    // Note: trying to write to a cell that doesn't exist fails silently 
    let table = document.getElementById("listview-"+tab_id);
    let skipped_heading = false;
    let counter = 0;
    for (let row of table.rows) {
        if (!skipped_heading) {skipped_heading = true; continue;}

        if (row.cells.length > list_num) {
            row.children[list_num].textContent = list[counter++]
        }
    }
}

function cmd_add() {}
function cmd_log() {}
function cmd_linear() {}
function cmd_calcpmcc() {}
function cmd_testpmcc() {}
function cmd_normaldist() {}
function cmd_poissondist() {}
function cmd_binomialdist() {}
function cmd_geodist() {}
function cmd_x2dist() {}

init_tabs(StatpackSettings.default_tab_name);
init_listview(current_listview,
	      StatpackSettings.default_num_lists,
	      StatpackSettings.default_list_length,
	      StatpackSettings.default_list_name,
	      0);
init_palette();
write_list([5245240],1,0);


