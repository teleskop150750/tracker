export const hSlot = (slot, scope, otherwise) => {
    return slot !== void 0 ? slot(scope) || otherwise : otherwise
}
