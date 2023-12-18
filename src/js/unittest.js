import { choose, binomial_cdf } from "./ui/menus/binomial.js";
import { round_decimal, gammln, gammq                                               } from "./util.js";
import { string_distance, sort_by_string_distance } from "./ui/command_search.js"; 
import { erf } from "./ui/menus/normal.js";
import { log_base } from "./ui/menus/log.js";
import { linear_transform } from "./ui/menus/linear.js";
import { geometric_cdf } from "./ui/menus/geometric.js";
import { haircut, sample_pmcc } from "./ui/menus/calcpmcc.js";

let last_fail = "";
function fail(str) {
    last_fail = str;
    return false;
}


let tests = {
    choose: () => {
        // Edge cases
        if (choose(1, 1) !== 1) return fail("choose(1,1)");
        if (choose(0, 0) !== 1) return fail("choose(0,0)");
        if (choose(14, 14) !== 1) return fail("choose(14,14)");
        if (choose(19, 0) !== 1) return fail("choose(0,19)");
        if (choose(0, 1)) return fail("choose(0,1)");
        if (choose(7, 14)) return fail("choose(7,14)");

        // Invalid data
        if (choose(0)) return fail("choose(0)");
        if (choose(null, 1)) return fail("choose(null, 1)");
        if (choose(1, null)) return fail("choose(1, null)");
        if (choose(null, null)) return fail("choose(null,null)");
        if (choose("test", 1)) return fail("choose('test', 1)");
        if (choose(1, "test")) return fail("choose(1, 'test')");
        if (choose("test", "test")) return fail("choose('test', 'test')");
        
        // Valid data - compared with with WolframAlpha
        let args_val = [
            [7, 6, 7],
            [24, 15, 1307504],
            [11, 7, 330],
            [13, 8, 1287],
            [15, 11, 1365],
        ]

        for (let x of args_val) {
            if (choose(x[0], x[1]) !== x[2]) return fail(`choose(${x[0]},${x[1]})`);
        }
        return true;
    },
    binomial_cdf: () => { return true },
    round_decimal: () => { return true },
    gammln: () => { return true },
    gammp: () => { return true },
    string_distance: () => { return true },
    sort_by_string_distance: () => { return true },
    erf: () => { return true },
    log_base: () => { return true },
    linear_transform: () => { return true },
    geometric_cdf: () => { return true },
    haircut: () => { return true },
    sample_pmcc: () => { return true },

}

export function run_tests() {
    for (let test of Object.entries(tests)) { 
        if (!test[1]()) {
            console.log(`test failed: ${last_fail}`);
            return false;
        }
    }
}