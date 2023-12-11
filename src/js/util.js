// statpack - util.js | jadon mensah
// description: contains useful functions to be used in any module

export function round_decimal(num, places) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, places)) / Math.pow(10, places); 
}

export function is_undefined(x) {
    return x === undefined || isNaN(x);
}

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
export function gammq(a, x) {
    // translated from https://github.com/MTMurphy77/UVES_popler/blob/master/gammq.c
    if (x < 0) return null;
    if (a <= 0) return null;
    if (x < (a + 1)) {
        return 1 - gammser(a, x);
    }
    else {
        return gammcf(a, x);
    }
}

export function gammp(a,x) {
    return 1 - gammq(a,x);
}