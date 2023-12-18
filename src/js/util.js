// Statpack - util.js | Jadon Mensah
// Description: Contains useful functions to be used in any module.

// Round a number to a given number of decimal places
export function round_decimal(num, places) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, places)) / Math.pow(10, places); 
}

// Return true if a value is undefined or null
export function is_undefined(x) {
    return x === undefined || isNaN(x);
}

// gamm* functions translated from http://astronomy.swin.edu.au/~mmurphy/UVES_popler/, which is licensed under the GNU General Public License (version 2)

// Approximation of the mathematical Log Gamma function - see https://mathworld.wolfram.com/LogGammaFunction.html
function gammln(x) {
    let cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let xx = x;
    let y = xx;
    let tmp = xx + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j <= 5; j++) ser += cof[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / xx);
}

// Helper function for gammq() and gammp()
function gammser(k, x) {
    let gln = gammln(k);
    if (x === 0) {
        return 0;
    }
    else {
        let kp = k;
        let sum = 1 / k;
        let del = sum;
        for (let n = 1; n < 1000; n++) {
            ++kp;
            del *= x / kp;
            sum += del;
            if (Math.abs(del) < Math.abs(sum) * 3.0e-9) {
                return sum * Math.exp(-x + k * Math.log(x) - (gln));
            }
        }
        return null;
    }
}

// Helper function for gammq() and gammp()
function gammcf(k, x) {
    let gln = gammln(k);
    let del = 0
    let kn = 0
    let b = x + 1 - k;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    let n = 0;
    for (let i = 1; i < 1000; i++) {
        kn = -i * (i - k);
        b += 2.0;
        d = kn * d + b;
        if (Math.abs(d) < 1.0e-30) d = 1.0e-30;
        c = b + kn / c;
        if (Math.abs(c) < 1.0e-30) c = 1.0e-30;
        d = 1.0 / d; del = d * c; h *= del;
        if (Math.abs(del - 1.0) < 3.0e-9) break;
        n = i
    }
    if (n > 1000) {
        return null;
    }

    return Math.exp(-x + k * Math.log(x) - (gln)) * h;
}

// Mathematical regularised gamma function Q(a,x)
export function gammq(a, x) {

    if (x < 0) return null;
    if (a <= 0) return null;
    if (x < (a + 1)) {
        return 1 - gammser(a, x);
    }
    else {
        return gammcf(a, x);
    }
}

// Mathematical regularised gamma function P(a,x)
export function gammp(a,x) {
    return 1 - gammq(a,x);
}