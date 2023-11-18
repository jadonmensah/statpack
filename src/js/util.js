// statpack - util.js | jadon mensah
// description: contains useful functions to be used in any module

export function round_decimal(num, places) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, places)) / Math.pow(10, places); 
}

export function is_undefined(x) {
    return x === undefined || isNaN(x);
}
