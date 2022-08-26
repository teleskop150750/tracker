export function pad(v, length = 2, char = '0') {
    if (v === void 0 || v === null) {
        return v
    }

    const val = '' + v
   
    return val.length >= length ? val : new Array(length - val.length + 1).join(char) + val
}