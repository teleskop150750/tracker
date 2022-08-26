// not perfect, but what we ARE interested is for Arrays not to slip in
// as spread operator will mess things up in various areas
export function isObject(v) {
    return v !== null && typeof v === 'object' && Array.isArray(v) !== true
}