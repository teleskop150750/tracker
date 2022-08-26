let lastId = 0

export const UniqueComponentId = function (prefix = 'pv_id_') {
    lastId++
    return `${prefix}${lastId}`
}
