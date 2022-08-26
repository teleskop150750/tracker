import { ObjectUtils } from '../utils/ObjectUtils/ObjectUtils'

const FilterService = {
    filter(value, fields, filterValue, filterMatchMode) {
        let filteredItems = []

        if (value) {
            for (let item of value) {
                for (let field of fields) {
                    let fieldValue = ObjectUtils.resolveFieldData(item, field)

                    if (this.filters[filterMatchMode](fieldValue, filterValue, )) {
                        filteredItems.push(item)
                        break
                    }
                }
            }
        }

        return filteredItems
    },
    filters: {
        startsWith(value, filter) {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
            let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase()

            return stringValue.slice(0, filterValue.length) === filterValue
        },
        contains(value, filter) {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
            let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase()

            return stringValue.indexOf(filterValue) !== -1
        },
        notContains(value, filter) {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
            let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase()

            return stringValue.indexOf(filterValue) === -1
        },
        endsWith(value, filter) {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
            let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase()

            return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1
        },
        equals(value, filter) {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime && filter.getTime) return value.getTime() === filter.getTime()
            else
                return (
                    ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase() ==
                    ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
                )
        },
        notEquals(value, filter) {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return false
            }

            if (value === undefined || value === null) {
                return true
            }

            if (value.getTime && filter.getTime) return value.getTime() !== filter.getTime()
            else
                return (
                    ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase() !=
                    ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase()
                )
        },
        in(value, filter) {
            if (filter === undefined || filter === null || filter.length === 0) {
                return true
            }

            for (let i = 0; i < filter.length; i++) {
                if (ObjectUtils.equals(value, filter[i])) {
                    return true
                }
            }

            return false
        },
        between(value, filter) {
            if (filter == null || filter[0] == null || filter[1] == null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime) return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime()
            else return filter[0] <= value && value <= filter[1]
        },
        lt(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime && filter.getTime) return value.getTime() < filter.getTime()
            else return value < filter
        },
        lte(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime && filter.getTime) return value.getTime() <= filter.getTime()
            else return value <= filter
        },
        gt(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime && filter.getTime) return value.getTime() > filter.getTime()
            else return value > filter
        },
        gte(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            if (value.getTime && filter.getTime) return value.getTime() >= filter.getTime()
            else return value >= filter
        },
        dateIs(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            return value.toDateString() === filter.toDateString()
        },
        dateIsNot(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            return value.toDateString() !== filter.toDateString()
        },
        dateBefore(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            return value.getTime() < filter.getTime()
        },
        dateAfter(value, filter) {
            if (filter === undefined || filter === null) {
                return true
            }

            if (value === undefined || value === null) {
                return false
            }

            return value.getTime() > filter.getTime()
        },
    },
    register(rule, fn) {
        this.filters[rule] = fn
    },
}

export default FilterService
