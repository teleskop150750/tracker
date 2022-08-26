<template>
    <div class="v-date" :class="classes">
        <div class="v-date__header">
            <div class="v-date__header-subtitle-wrapper">
                <Transition name="v-transition--fade">
                    <div
                        class="v-date__header-subtitle"
                        :class="view === 'Years' ? 'v-date__header-subtitle--active' : ''"
                        :key="'h-sub' + headerSubtitle"
                        :tabindex="tabindex"
                        @click="view = 'Years'"
                        @keyup.enter="view.value = 'Years'"
                    >
                        {{ headerSubtitle }}
                    </div>
                </Transition>
            </div>
            <div class="v-date__header-title">
                <div class="v-date__header-title-wrapper">
                    <Transition name="v-transition--fade">
                        <div
                            class="v-date__header-title-label"
                            :class="view === 'Calendar' ? 'v-date__header-title-label--active' : ''"
                            :key="'h-sub' + headerTitle"
                            :tabindex="tabindex"
                            @click="view = 'Calendar'"
                            @keyup.enter="view.value = 'Calendar'"
                        >
                            {{ headerTitle }}
                        </div>
                    </Transition>
                </div>
                <VBtn
                    v-if="todayBtn"
                    class="v-date__header-today"
                    :icon="VCalendarIcon"
                    flat
                    size="sm"
                    :tabindex="tabindex"
                    round
                    @click="setToday"
                />
            </div>
        </div>
        <div class="v-date__main" ref="blurTargetRef" :tabindex="tabindex">
            <div class="v-date__content">
                <div v-if="view === 'Calendar'" class="v-date__view v-date__calendar" key="calendar-view">
                    <div class="v-date__navigation">
                        <MonthsNavigation />
                        <YearsNavigation />
                    </div>

                    <div class="v-date__calendar-weekdays">
                        <div class="v-date__calendar-item" v-for="(day, index) in daysOfWeek" :key="index">
                            <div>
                                {{ day }}
                            </div>
                        </div>
                    </div>

                    <div class="v-date__calendar-days-container">
                        <Transition :name="`v-transition--slide-${monthDirection}`">
                            <div class="v-date__calendar-days" :key="viewMonthHash">
                                <div v-for="day in days" :key="day.key" :class="day.classes">
                                    <VBtn
                                        v-if="day.in === true"
                                        :class="day.today === true ? 'v-date__today' : ''"
                                        dense
                                        :flat="day.flat"
                                        :label="day.i"
                                        :tabindex="tabindex"
                                        @click="onDayClick(day.i)"
                                        @mouseover="onDayMouseover(day.i)"
                                    />
                                    <div v-else class="v-date__day-disabled">
                                        {{ day.i }}
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
                <Months v-else-if="view === 'Months'" />
                <Years v-else-if="view === 'Years'" />
            </div>
        </div>
        <div v-if="$slots['default']" class="v-date__actions">
            <slot />
        </div>
        <input v-if="name" type="hidden" :name="name" :value="modelValue" />
    </div>
</template>

<script setup>
import VCalendarIcon from '../../icons/VCalendarIcon.vue'
import VArrowRightIcon from '../../icons/VArrowRightIcon.vue'
import VArrowLeftIcon from '../../icons/VArrowLeftIcon.vue'
import VBtn from '../VBtn/VBtn.vue'
import { h, Transition, computed, ref, nextTick, watch } from 'vue'

import useDateTime, { useDateTimeProps, getDayHash } from './use-date-time.js'

import { formatDate, __splitDate, getDateDiff } from './date.js'
import { pad } from './format.js'
import { isObject } from './is.js'

const lineStr = ' \u2014 '

const props = defineProps({
    ...useDateTimeProps,

    /**
     * Используется для указания имени элемента управления; Полезно при работе с формами, отправленными непосредственно на URL-адрес
     */
    name: String,
    /**
     * Разрешить множественный выбор; Модель должна быть Массив
     */
    multiple: Boolean,
    /**
     * Разрешить выбор диапазона; Частичная совместимость с опциями: выбранные диапазоны могут также включать «невыбираемые» дни
     */
    range: Boolean,

    /**
     * Если указано, он переопределяет заголовок заголовка по умолчанию; Имеет смысл, когда не находится в «минимальном» режиме
     */
    title: String,
    /**
     * Если указано, он переопределяет подзаголовок заголовка по умолчанию; Имеет смысл, когда не находится в «минимальном» режиме
     */
    subtitle: String,

    /**
     * Маска (строка форматирования), используемая для синтаксического анализа и форматирования значения
     */
    mask: {
        // this mask is forced
        // when using persian calendar
        default: 'YYYY/MM/DD',
    },

    /**
     * Год и месяц по умолчанию для отображения (в формате ГГГГ/ММ), когда модель не заполнена (неопределенная или пустая);
     * Пожалуйста, убедитесь, что он находится в пределах навигации мин / макс год-месяц (если они используются)
     */
    defaultYearMonth: {
        type: String,
        validator: (v) => /^-?[\d]+\/[0-1]\d$/.test(v),
    },

    /**
     * Отображение селектора лет в представлении месяцев
     */
    yearsInMonthView: Boolean,

    /**
     * Список событий для выделения в календаре;
     * При использовании функции она получает дату в виде String и должна возвращать логическое значение (совпадает или нет);
     * Если вы используете функцию, то для достижения наилучшей производительности ссылайтесь на нее из своей области и не определяйте ее в строке
     */
    events: [Array, Function],
    /**
     * Название цвета (из цветовой палитры Quasar);
     * При использовании функции она получает дату в виде String и должна возвращать String (цвет для полученной даты);
     * Если вы используете функцию, то для достижения наилучшей производительности ссылайтесь на нее из своей области и не определяйте ее в строке
     */
    eventColor: [String, Function],

    /**
     * Излучать модель, когда пользователь просматривает месяц и год; ТОЛЬКО для одиночного выбора (некратный, недиапазонный)
     */
    emitImmediately: Boolean,

    /**
     * При необходимости настройте выбираемые дни; При использовании функции она получает дату в виде String и должна возвращать логическое значение (является ли дата приемлемой или нет); Если вы используете функцию,
     * то для достижения наилучшей производительности ссылайтесь на нее из своей области и не определяйте ее в строке;
     * Несовместим с опорой 'range'
     */
    options: [Array, Function],

    /**
     * Заблокировать пользователя от навигации ниже определенного года + месяца (в формате ГГГГ/ММ);
     * Этот реквизит не используется для исправления модели;
     * Возможно, вы также захотите использовать реквизит «по умолчанию-год-месяц»
     */
    navigationMinYearMonth: {
        type: String,
        validator: (v) => /^-?[\d]+\/[0-1]\d$/.test(v),
    },

    /**
     * Блокировка пользователя от навигации выше определенного года + месяца (в формате ГГГГ/ММ);
     * Этот реквизит не используется для исправления модели;
     * Возможно, вы также захотите использовать реквизит «по умолчанию-год-месяц»
     */
    navigationMaxYearMonth: {
        type: String,
        validator: (v) => /^-?[\d]+\/[0-1]\d$/.test(v),
    },

    /**
     * Удалить возможность отмены выбора даты;
     * Это не относится к выбору диапазона по уже выбранным датам.
     */
    noUnset: Boolean,

    /**
     * Устанавливает день недели, который считается первым днем (0 - воскресенье, 1 - понедельник, ...);
     * Этот день будет отображаться в крайнем левом столбце календаря
     */
    firstDayOfWeek: [String, Number],
    /**
     * Отображение кнопки, выбирающей текущий день
     */
    todayBtn: {
        type: Boolean,
        default: true,
    },
    /**
     * Не отображать заголовок
     */
    minimal: Boolean,
    /**
     * Представление, которое будет отображаться по умолчанию
     */
    defaultView: {
        type: String,
        default: 'Calendar',
        validator: (v) => {
            const views = ['Calendar', 'Years', 'Months']
            return views.includes(v)
        },
    },
})

const viewIsValid = (v) => views.includes(v)

// update:modelValue | Излучается, когда компоненту необходимо изменить модель; Также используется v-моделью
// navigation | Выдается, когда пользователь переходит к другому месяцу или году (и даже когда модель изменяется из внешнего источника)
// range-start | Пользователь начал выбор диапазона
// range-end | Пользователь завершил выбор диапазона
const emit = defineEmits(['update:modelValue', 'range-start', 'range-end', 'navigation'])

const yearsInterval = 20
const dateArrow = [VArrowLeftIcon, VArrowRightIcon]
const computedColor = ref('red')
const computedTextColor = ref('green')

const classes = computed(() => {
    const type = props.landscape === true ? 'landscape' : 'portrait'
    return (
        `v-date--${type} v-date--${type}-${props.minimal === true ? 'minimal' : 'standard'}` +
        (props.bordered === true ? ' v-date--bordered' : '') +
        (props.square === true ? ' v-date--square no-border-radius' : '') +
        (props.flat === true ? ' v-date--flat no-shadow' : '') +
        (props.disable === true ? ' disabled' : props.readonly === true ? ' v-date--readonly' : '')
    )
})

const { getLocale, getCurrentDate } = useDateTime()
const tabindex = -1

let lastEmitValue

const blurTargetRef = ref(null)
const innerMask = ref(getMask())
const locale = getLocale()

const mask = computed(() => getMask())

const today = computed(() => getCurrentDate())

const viewModel = ref(getViewModel(innerMask.value, locale))

const view = ref(props.defaultView)

const direction = 'left'
const monthDirection = ref(direction)
const yearDirection = ref(direction)

const year = viewModel.value.year
const startYear = ref(year - (year % yearsInterval) - (year < 0 ? yearsInterval : 0))
const editRange = ref(null)

const isImmediate = computed(() => props.emitImmediately === true && props.multiple !== true && props.range !== true)

const normalizedModel = computed(() =>
    Array.isArray(props.modelValue) === true
        ? props.modelValue
        : props.modelValue !== null && props.modelValue !== void 0
        ? [props.modelValue]
        : []
)
const daysModel = computed(() =>
    normalizedModel.value
        .filter((date) => typeof date === 'string')
        .map((date) => decodeString(date, innerMask.value, locale))
        .filter((date) => date.dateHash !== null && date.day !== null && date.month !== null && date.year !== null)
)

const rangeModel = computed(() => {
    const fn = (date) => decodeString(date, innerMask.value, locale)
    return normalizedModel.value
        .filter((date) => isObject(date) === true && date.from !== void 0 && date.to !== void 0)
        .map((range) => ({ from: fn(range.from), to: fn(range.to) }))
        .filter((range) => range.from.dateHash !== null && range.to.dateHash !== null && range.from.dateHash < range.to.dateHash)
})

const getNativeDateFn = (model) => new Date(model.year, model.month - 1, model.day)

const encodeObjectFn = (date, mask, locale) =>
    formatDate(
        new Date(date.year, date.month - 1, date.day, date.hour, date.minute, date.second, date.millisecond),
        mask === void 0 ? innerMask.value : mask,
        locale === void 0 ? locale : locale,
        date.year,
        date.timezoneOffset
    )

const daysInModel = computed(
    () =>
        daysModel.value.length +
        rangeModel.value.reduce((acc, range) => acc + 1 + getDateDiff(getNativeDateFn(range.to), getNativeDateFn(range.from)), 0)
)

const headerTitle = computed(() => {
    if (props.title !== void 0 && props.title !== null && props.title.length > 0) {
        return props.title
    }

    if (editRange.value !== null) {
        const model = editRange.value.init
        const date = getNativeDateFn(model)

        return locale.daysShort[date.getDay()] + ', ' + locale.monthsShort[model.month - 1] + ' ' + model.day + lineStr + '?'
    }

    if (daysInModel.value === 0) {
        return lineStr
    }

    if (daysInModel.value > 1) {
        return `${daysInModel.value} ${locale.pluralDay}`
    }

    const model = daysModel.value[0]
    const date = getNativeDateFn(model)

    if (isNaN(date.valueOf()) === true) {
        return lineStr
    }

    if (locale.headerTitle !== void 0) {
        return locale.headerTitle(date, model)
    }

    return locale.daysShort[date.getDay()] + ', ' + locale.monthsShort[model.month - 1] + ' ' + model.day
})

const headerSubtitle = computed(() => {
    if (props.subtitle !== void 0 && props.subtitle !== null && props.subtitle.length > 0) {
        return props.subtitle
    }

    if (daysInModel.value === 0) {
        return lineStr
    }

    if (daysInModel.value > 1) {
        const from = minSelectedModel.value
        const to = maxSelectedModel.value
        const month = locale.monthsShort

        return (
            month[from.month - 1] +
            (from.year !== to.year
                ? ' ' + from.year + lineStr + month[to.month - 1] + ' '
                : from.month !== to.month
                ? lineStr + month[to.month - 1]
                : '') +
            ' ' +
            to.year
        )
    }

    return daysModel.value[0].year
})

const minSelectedModel = computed(() => {
    const model = daysModel.value.concat(rangeModel.value.map((range) => range.from)).sort((a, b) => a.year - b.year || a.month - b.month)

    return model[0]
})

const maxSelectedModel = computed(() => {
    const model = daysModel.value.concat(rangeModel.value.map((range) => range.to)).sort((a, b) => b.year - a.year || b.month - a.month)

    return model[0]
})

const computedFirstDayOfWeek = computed(() => (props.firstDayOfWeek !== void 0 ? Number(props.firstDayOfWeek) : locale.firstDayOfWeek))

const daysOfWeek = computed(() => {
    const days = locale.daysShort
    const first = computedFirstDayOfWeek.value

    return first > 0 ? days.slice(first, 7).concat(days.slice(0, first)) : days
})

const daysInMonth = computed(() => {
    const date = viewModel.value

    return new Date(date.year, date.month, 0).getDate()
})

const evtColor = computed(() => (typeof props.eventColor === 'function' ? props.eventColor : () => props.eventColor))

const minNav = computed(() => {
    if (props.navigationMinYearMonth === void 0) {
        return null
    }

    const data = props.navigationMinYearMonth.split('/')

    return { year: parseInt(data[0], 10), month: parseInt(data[1], 10) }
})

const maxNav = computed(() => {
    if (props.navigationMaxYearMonth === void 0) {
        return null
    }

    const data = props.navigationMaxYearMonth.split('/')

    return { year: parseInt(data[0], 10), month: parseInt(data[1], 10) }
})

const navBoundaries = computed(() => {
    const data = {
        month: { prev: true, next: true },
        year: { prev: true, next: true },
    }

    if (minNav.value !== null && minNav.value.year >= viewModel.value.year) {
        data.year.prev = false
        if (minNav.value.year === viewModel.value.year && minNav.value.month >= viewModel.value.month) {
            data.month.prev = false
        }
    }

    if (maxNav.value !== null && maxNav.value.year <= viewModel.value.year) {
        data.year.next = false
        if (maxNav.value.year === viewModel.value.year && maxNav.value.month <= viewModel.value.month) {
            data.month.next = false
        }
    }

    return data
})

const daysMap = computed(() => {
    const map = {}

    daysModel.value.forEach((entry) => {
        const hash = getMonthHash(entry)

        if (map[hash] === void 0) {
            map[hash] = []
        }

        map[hash].push(entry.day)
    })

    return map
})

const rangeMap = computed(() => {
    const map = {}

    rangeModel.value.forEach((entry) => {
        const hashFrom = getMonthHash(entry.from)
        const hashTo = getMonthHash(entry.to)

        if (map[hashFrom] === void 0) {
            map[hashFrom] = []
        }

        map[hashFrom].push({
            from: entry.from.day,
            to: hashFrom === hashTo ? entry.to.day : void 0,
            range: entry,
        })

        if (hashFrom < hashTo) {
            let hash
            const { year, month } = entry.from
            const cur = month < 12 ? { year, month: month + 1 } : { year: year + 1, month: 1 }

            while ((hash = getMonthHash(cur)) <= hashTo) {
                if (map[hash] === void 0) {
                    map[hash] = []
                }

                map[hash].push({
                    from: void 0,
                    to: hash === hashTo ? entry.to.day : void 0,
                    range: entry,
                })

                cur.month++
                if (cur.month > 12) {
                    cur.year++
                    cur.month = 1
                }
            }
        }
    })

    return map
})

const rangeView = computed(() => {
    if (editRange.value === null) {
        return
    }

    const { init, initHash, final, finalHash } = editRange.value

    const [from, to] = initHash <= finalHash ? [init, final] : [final, init]

    const fromHash = getMonthHash(from)
    const toHash = getMonthHash(to)

    if (fromHash !== viewMonthHash.value && toHash !== viewMonthHash.value) {
        return
    }

    const view = {}

    if (fromHash === viewMonthHash.value) {
        view.from = from.day
        view.includeFrom = true
    } else {
        view.from = 1
    }

    if (toHash === viewMonthHash.value) {
        view.to = to.day
        view.includeTo = true
    } else {
        view.to = daysInMonth.value
    }

    return view
})

const viewMonthHash = computed(() => getMonthHash(viewModel.value))

const selectionDaysMap = computed(() => {
    const map = {}

    if (props.options === void 0) {
        for (let i = 1; i <= daysInMonth.value; i++) {
            map[i] = true
        }

        return map
    }

    const fn = typeof props.options === 'function' ? props.options : (date) => props.options.includes(date)

    for (let i = 1; i <= daysInMonth.value; i++) {
        const dayHash = viewMonthHash.value + '/' + pad(i)
        map[i] = fn(dayHash)
    }

    return map
})

const eventDaysMap = computed(() => {
    const map = {}

    if (props.events === void 0) {
        for (let i = 1; i <= daysInMonth.value; i++) {
            map[i] = false
        }
    } else {
        const fn = typeof props.events === 'function' ? props.events : (date) => props.events.includes(date)

        for (let i = 1; i <= daysInMonth.value; i++) {
            const dayHash = viewMonthHash.value + '/' + pad(i)
            map[i] = fn(dayHash) === true && evtColor.value(dayHash)
        }
    }

    return map
})

const viewDays = computed(() => {
    const { year, month } = viewModel.value

    const date = new Date(year, month - 1, 1)
    const endDay = new Date(year, month - 1, 0).getDate()

    return {
        days: date.getDay() - computedFirstDayOfWeek.value - 1,
        endDay,
    }
})

const days = computed(() => {
    const res = []
    const { days, endDay } = viewDays.value

    const len = days < 0 ? days + 7 : days
    if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
            res.push({ i, fill: true })
        }
    }

    const index = res.length

    for (let i = 1; i <= daysInMonth.value; i++) {
        const day = { i, event: eventDaysMap.value[i], classes: [] }

        if (selectionDaysMap.value[i] === true) {
            day.in = true
            day.flat = true
        }

        res.push(day)
    }

    // if current view has days in model
    if (daysMap.value[viewMonthHash.value] !== void 0) {
        daysMap.value[viewMonthHash.value].forEach((day) => {
            const i = index + day - 1
            Object.assign(res[i], {
                selected: true,
                unelevated: true,
                flat: false,
            })
        })
    }

    // if current view has ranges in model
    if (rangeMap.value[viewMonthHash.value] !== void 0) {
        rangeMap.value[viewMonthHash.value].forEach((entry) => {
            if (entry.from !== void 0) {
                const from = index + entry.from - 1
                const to = index + (entry.to || daysInMonth.value) - 1

                for (let day = from; day <= to; day++) {
                    Object.assign(res[day], {
                        range: entry.range,
                        unelevated: true,
                    })
                }

                Object.assign(res[from], {
                    rangeFrom: true,
                    flat: false,
                })

                entry.to !== void 0 &&
                    Object.assign(res[to], {
                        rangeTo: true,
                        flat: false,
                    })
            } else if (entry.to !== void 0) {
                const to = index + entry.to - 1

                for (let day = index; day <= to; day++) {
                    Object.assign(res[day], {
                        range: entry.range,
                        unelevated: true,
                        color: computedColor.value,
                        textColor: computedTextColor.value,
                    })
                }

                Object.assign(res[to], {
                    flat: false,
                    rangeTo: true,
                })
            } else {
                const to = index + daysInMonth.value - 1
                for (let day = index; day <= to; day++) {
                    Object.assign(res[day], {
                        range: entry.range,
                        unelevated: true,
                        color: computedColor.value,
                        textColor: computedTextColor.value,
                    })
                }
            }
        })
    }

    if (rangeView.value !== void 0) {
        const from = index + rangeView.value.from - 1
        const to = index + rangeView.value.to - 1

        for (let day = from; day <= to; day++) {
            res[day].color = computedColor.value
            res[day].editRange = true
        }

        if (rangeView.value.includeFrom === true) {
            res[from].editRangeFrom = true
        }
        if (rangeView.value.includeTo === true) {
            res[to].editRangeTo = true
        }
    }

    if (viewModel.value.year === today.value.year && viewModel.value.month === today.value.month) {
        res[index + today.value.day - 1].today = true
    }

    const left = res.length % 7
    if (left > 0) {
        const afterDays = 7 - left
        for (let i = 1; i <= afterDays; i++) {
            res.push({ i, fill: true })
        }
    }

    res.forEach((day) => {
        let cls = 'v-date__calendar-item '

        if (day.fill === true) {
            cls += 'v-date__calendar-item--fill'
        } else {
            cls += `v-date__calendar-item--${day.in === true ? 'in' : 'out'}`

            if (day.range !== void 0) {
                cls += ` v-date__range${day.rangeTo === true ? '-to' : day.rangeFrom === true ? '-from' : ''}`
            }

            if (day.editRange === true) {
                cls += ` v-date__edit-range${day.editRangeFrom === true ? '-from' : ''}${day.editRangeTo === true ? '-to' : ''}`
            }

            if (day.range !== void 0 || day.editRange === true) {
                cls += ` text-${day.color}`
            }
        }

        day.classes = cls
        day.key = `${day.i} ${viewMonthHash.value}`
    })

    return res
})

const attributes = computed(() =>
    props.disable === true ? { 'aria-disabled': 'true' } : props.readonly === true ? { 'aria-readonly': 'true' } : {}
)

watch(
    () => props.modelValue,
    (v) => {
        if (lastEmitValue === v) {
            lastEmitValue = 0
        } else {
            const { year, month } = getViewModel(innerMask.value, locale)
            updateViewModel(year, month)
        }
    }
)

watch(view, () => {
    blurTargetRef.value !== null && blurTargetRef.value.focus()
})

watch(
    () => viewModel.value.year,
    (year) => {
        emit('navigation', { year, month: viewModel.value.month })
    }
)

watch(
    () => viewModel.value.month,
    (month) => {
        emit('navigation', { year: viewModel.value.year, month })
    }
)

watch(mask, (val) => {
    updateValue(val, locale, 'mask')
    innerMask.value = val
})

function getMonthHash(date) {
    return date.year + '/' + pad(date.month)
}

function setToday() {
    const date = today.value
    const month = daysMap.value[getMonthHash(date)]

    if (month === void 0 || month.includes(date.day) === false) {
        addToModel(date)
    }

    setCalendarTo(date.year, date.month)
}

function setView(viewMode) {
    if (viewIsValid(viewMode) === true) {
        view.value = viewMode
    }
}

function offsetCalendar(type, descending) {
    if (['month', 'year'].includes(type)) {
        const fn = type === 'month' ? goToMonth : goToYear
        fn(descending === true ? -1 : 1)
    }
}

function setCalendarTo(year, month) {
    view.value = 'Calendar'
    updateViewModel(year, month)
}

function setEditingRange(from, to) {
    if (props.range === false || !from) {
        editRange.value = null
        return
    }

    const init = Object.assign({ ...viewModel.value }, from)
    const final = to !== void 0 ? Object.assign({ ...viewModel.value }, to) : init

    editRange.value = {
        init,
        initHash: getDayHash(init),
        final,
        finalHash: getDayHash(final),
    }

    setCalendarTo(init.year, init.month)
}

function getMask() {
    return props.mask
}

function decodeString(date, mask, locale) {
    return __splitDate(date, mask, locale, props.calendar, {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    })
}

function getViewModel(mask, locale) {
    const model = Array.isArray(props.modelValue) === true ? props.modelValue : props.modelValue ? [props.modelValue] : []

    if (model.length === 0) {
        return getDefaultViewModel()
    }

    const target = model[model.length - 1]
    const decoded = decodeString(target.from !== void 0 ? target.from : target, mask, locale)

    return decoded.dateHash === null ? getDefaultViewModel() : decoded
}

function getDefaultViewModel() {
    let year
    let month

    if (props.defaultYearMonth !== void 0) {
        const d = props.defaultYearMonth.split('/')
        year = parseInt(d[0], 10)
        month = parseInt(d[1], 10)
    } else {
        // may come from data() where computed
        // props are not yet available
        const d = today.value !== void 0 ? today.value : getCurrentDate()

        year = d.year
        month = d.month
    }

    return {
        year,
        month,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        dateHash: year + '/' + pad(month) + '/01',
    }
}

function goToMonth(offset) {
    let year = viewModel.value.year
    let month = Number(viewModel.value.month) + offset

    if (month === 13) {
        month = 1
        year++
    } else if (month === 0) {
        month = 12
        year--
    }

    updateViewModel(year, month)
    isImmediate.value === true && emitImmediately('month')
}

function goToYear(offset) {
    const year = Number(viewModel.value.year) + offset
    updateViewModel(year, viewModel.value.month)
    isImmediate.value === true && emitImmediately('year')
}

function setYear(year) {
    updateViewModel(year, viewModel.value.month)
    view.value = props.defaultView === 'Years' ? 'Months' : 'Calendar'
    isImmediate.value === true && emitImmediately('year')
}

function setMonth(month) {
    updateViewModel(viewModel.value.year, month)
    view.value = 'Calendar'
    isImmediate.value === true && emitImmediately('month')
}

function toggleDate(date, monthHash) {
    const month = daysMap.value[monthHash]
    const fn = month !== void 0 && month.includes(date.day) === true ? removeFromModel : addToModel

    fn(date)
}

function getShortDate(date) {
    return { year: date.year, month: date.month, day: date.day }
}

function updateViewModel(year, month) {
    if (minNav.value !== null && year <= minNav.value.year) {
        year = minNav.value.year

        if (month < minNav.value.month) {
            month = minNav.value.month
        }
    }

    if (maxNav.value !== null && year >= maxNav.value.year) {
        year = maxNav.value.year

        if (month > maxNav.value.month) {
            month = maxNav.value.month
        }
    }

    const newHash = year + '/' + pad(month) + '/01'

    if (newHash !== viewModel.value.dateHash) {
        monthDirection.value = viewModel.value.dateHash < newHash === true ? 'left' : 'right'

        if (year !== viewModel.value.year) {
            yearDirection.value = monthDirection.value
        }

        nextTick(() => {
            startYear.value = year - (year % yearsInterval) - (year < 0 ? yearsInterval : 0)
            Object.assign(viewModel.value, {
                year,
                month,
                day: 1,
                dateHash: newHash,
            })
        })
    }
}

// Emit
function emitValue(val, action, date) {
    const value = val !== null && val.length === 1 && props.multiple === false ? val[0] : val

    lastEmitValue = value

    const { reason, details } = getEmitParams(action, date)
    emit('update:modelValue', value, reason, details)
}

function emitImmediately(reason) {
    const date = daysModel.value[0] !== void 0 && daysModel.value[0].dateHash !== null ? { ...daysModel.value[0] } : { ...viewModel.value } // inherit day, hours, minutes, milliseconds...

    // nextTick required because of animation delay in viewModel
    nextTick(() => {
        date.year = viewModel.value.year
        date.month = viewModel.value.month

        const maxDay = new Date(date.year, date.month, 0).getDate()

        date.day = Math.min(Math.max(1, date.day), maxDay)

        const value = encodeEntry(date)
        lastEmitValue = value

        const { details } = getEmitParams('', date)
        emit('update:modelValue', value, reason, details)
    })
}

function getEmitParams(action, date) {
    return date.from !== void 0
        ? {
              reason: `${action}-range`,
              details: {
                  ...getShortDate(date.target),
                  from: getShortDate(date.from),
                  to: getShortDate(date.to),
              },
          }
        : {
              reason: `${action}-day`,
              details: getShortDate(date),
          }
}

function encodeEntry(date, mask, locale) {
    return date.from !== void 0
        ? { from: encodeObjectFn(date.from, mask, locale), to: encodeObjectFn(date.to, mask, locale) }
        : encodeObjectFn(date, mask, locale)
}

function addToModel(date) {
    let value

    if (props.multiple === true) {
        if (date.from !== void 0) {
            // we also need to filter out intersections

            const fromHash = getDayHash(date.from)
            const toHash = getDayHash(date.to)

            const days = daysModel.value.filter((day) => day.dateHash < fromHash || day.dateHash > toHash)

            const ranges = rangeModel.value.filter(({ from, to }) => to.dateHash < fromHash || from.dateHash > toHash)

            value = days
                .concat(ranges)
                .concat(date)
                .map((entry) => encodeEntry(entry))
        } else {
            const model = normalizedModel.value.slice()
            model.push(encodeEntry(date))
            value = model
        }
    } else {
        value = encodeEntry(date)
    }

    emitValue(value, 'add', date)
}

function removeFromModel(date) {
    if (props.noUnset === true) {
        return
    }

    let model = null

    if (props.multiple === true && Array.isArray(props.modelValue) === true) {
        const val = encodeEntry(date)

        if (date.from !== void 0) {
            model = props.modelValue.filter((date) => (date.from !== void 0 ? date.from !== val.from && date.to !== val.to : true))
        } else {
            model = props.modelValue.filter((date) => date !== val)
        }

        if (model.length === 0) {
            model = null
        }
    }

    emitValue(model, 'remove', date)
}

function updateValue(mask, locale, reason) {
    const model = daysModel.value
        .concat(rangeModel.value)
        .map((entry) => encodeEntry(entry, mask, locale))
        .filter((entry) => {
            return entry.from !== void 0 ? entry.from.dateHash !== null && entry.to.dateHash !== null : entry.dateHash !== null
        })

    emit('update:modelValue', (props.multiple === true ? model : model[0]) || null, reason)
}

function onDayClick(dayIndex) {
    const day = { ...viewModel.value, day: dayIndex }

    if (props.range === false) {
        toggleDate(day, viewMonthHash.value)
        return
    }

    if (editRange.value === null) {
        const dayProps = days.value.find((day) => day.fill !== true && day.i === dayIndex)

        if (props.noUnset !== true && dayProps.range !== void 0) {
            removeFromModel({ target: day, from: dayProps.range.from, to: dayProps.range.to })
            return
        }

        if (dayProps.selected === true) {
            removeFromModel(day)
            return
        }

        const initHash = getDayHash(day)

        editRange.value = {
            init: day,
            initHash,
            final: day,
            finalHash: initHash,
        }

        emit('range-start', getShortDate(day))
    } else {
        const initHash = editRange.value.initHash,
            finalHash = getDayHash(day),
            payload = initHash <= finalHash ? { from: editRange.value.init, to: day } : { from: day, to: editRange.value.init }

        editRange.value = null
        addToModel(initHash === finalHash ? day : { target: day, ...payload })

        emit('range-end', {
            from: getShortDate(payload.from),
            to: getShortDate(payload.to),
        })
    }
}

function onDayMouseover(dayIndex) {
    if (editRange.value !== null) {
        const final = { ...viewModel.value, day: dayIndex }

        Object.assign(editRange.value, {
            final,
            finalHash: getDayHash(final),
        })
    }
}

// expose public methods
defineExpose({
    setToday,
    setView,
    offsetCalendar,
    setCalendarTo,
    setEditingRange,
})

const Months = () => {
    const currentYear = viewModel.value.year === today.value.year
    const isDisabled = (month) => {
        return (
            (minNav.value !== null && viewModel.value.year === minNav.value.year && minNav.value.month > month) ||
            (maxNav.value !== null && viewModel.value.year === maxNav.value.year && maxNav.value.month < month)
        )
    }

    const content = locale.monthsShort.map((month, i) => {
        const active = viewModel.value.month === i + 1

        return h(
            'div',
            {
                class: 'v-date__months-item',
            },
            [
                h(VBtn, {
                    class: currentYear === true && today.value.month === i + 1 ? 'v-date__today' : null,
                    flat: active !== true,
                    label: month,
                    unelevated: active,
                    color: active === true ? computedColor.value : null,
                    textColor: active === true ? computedTextColor.value : null,
                    tabindex: tabindex,
                    disable: isDisabled(i + 1),
                    onClick: () => {
                        setMonth(i + 1)
                    },
                }),
            ]
        )
    })

    props.yearsInMonthView === true &&
        content.unshift(
            h('div', { class: 'row no-wrap full-width' }, [
                getNavigation({
                    label: viewModel.value.year,
                    type: 'Years',
                    key: viewModel.value.year,
                    dir: yearDirection.value,
                    goTo: goToYear,
                    boundaries: navBoundaries.value.year,
                    cls: ' col',
                }),
            ])
        )

    return h(
        'div',
        {
            key: 'months-view',
            class: 'v-date__view v-date__months',
        },
        content
    )
}

const Years = () => {
    const start = startYear.value
    const stop = start + yearsInterval
    const years = []

    const isDisabled = (year) => {
        return (minNav.value !== null && minNav.value.year > year) || (maxNav.value !== null && maxNav.value.year < year)
    }

    for (let i = start; i <= stop; i++) {
        const active = viewModel.value.year === i

        years.push(
            h(
                'div',
                {
                    class: 'v-date__years-item',
                },
                [
                    h(VBtn, {
                        key: 'yr' + i,
                        class: today.value.year === i ? 'v-date__today' : null,
                        flat: !active,
                        label: i,
                        dense: true,
                        unelevated: active,
                        color: active === true ? computedColor.value : null,
                        textColor: active === true ? computedTextColor.value : null,
                        tabindex: tabindex,
                        disable: isDisabled(i),
                        onClick: () => {
                            setYear(i)
                        },
                    }),
                ]
            )
        )
    }

    return h(
        'div',
        {
            class: 'v-date__view v-date__years',
        },
        [
            h(
                'div',
                {
                    class: 'v-date__years-arrow',
                },
                [
                    h(VBtn, {
                        round: true,
                        dense: true,
                        flat: true,
                        icon: dateArrow[0],
                        tabindex: tabindex,
                        disable: isDisabled(start),
                        onClick: () => {
                            startYear.value -= yearsInterval
                        },
                    }),
                ]
            ),

            h(
                'div',
                {
                    class: 'v-date__years-content',
                },
                years
            ),

            h(
                'div',
                {
                    class: 'v-date__years-arrow',
                },
                [
                    h(VBtn, {
                        round: true,
                        dense: true,
                        flat: true,
                        icon: dateArrow[1],
                        tabindex: tabindex,
                        disable: isDisabled(stop),
                        onClick: () => {
                            startYear.value += yearsInterval
                        },
                    }),
                ]
            ),
        ]
    )
}

const MonthsNavigation = () =>
    getNavigation({
        label: locale.months[viewModel.value.month - 1],
        type: 'Months',
        key: viewModel.value.month,
        dir: monthDirection.value,
        goTo: goToMonth,
        boundaries: navBoundaries.value.month,
        cls: ' v-date__navigation-trigger--months',
    })

const YearsNavigation = () =>
    getNavigation({
        label: viewModel.value.year,
        type: 'Years',
        key: viewModel.value.year,
        dir: yearDirection.value,
        goTo: goToYear,
        boundaries: navBoundaries.value.year,
        cls: '',
    })

function getNavigation({ label, type, key, dir, goTo, boundaries, cls }) {
    return [
        h(
            'div',
            {
                class: 'v-date__arrow',
            },
            [
                h(VBtn, {
                    round: true,
                    dense: true,
                    size: 'sm',
                    flat: true,
                    icon: dateArrow[0],
                    tabindex: tabindex,
                    disable: boundaries.prev === false,
                    onClick() {
                        goTo(-1)
                    },
                }),
            ]
        ),

        h(
            'div',
            {
                class: 'v-date__navigation-trigger' + cls,
            },
            [
                h(
                    Transition,
                    {
                        name: 'v-transition--jump-' + dir,
                    },
                    () =>
                        h('div', { key }, [
                            h(VBtn, {
                                flat: true,
                                dense: true,
                                label,
                                tabindex: tabindex,
                                onClick: () => {
                                    view.value = type
                                },
                            }),
                        ])
                ),
            ]
        ),

        h(
            'div',
            {
                class: 'v-date__arrow',
            },
            [
                h(VBtn, {
                    round: true,
                    dense: true,
                    size: 'sm',
                    flat: true,
                    icon: dateArrow[1],
                    tabindex: tabindex,
                    disable: boundaries.next === false,
                    onClick() {
                        goTo(1)
                    },
                }),
            ]
        ),
    ]
}
</script>

<style>
.v-date {
    display: inline-flex;

    width: 290px;
    min-width: 290px;
    max-width: 100%;

    background: hsl(0deg 0% 100%);
}

.v-date__header {
    padding: 1rem;

    color: var(--v-color-on-primary);

    border-top-left-radius: inherit;

    background-color: var(--v-color-primary);
}

.v-date--portrait-standard .v-date__header {
    height: 86px;

    border-top-right-radius: inherit;
}

.v-date__header-subtitle-wrapper {
    position: relative;
}

.v-date__header-subtitle {
    font-size: 14px;
    line-height: 1.75;
    letter-spacing: 0.00938em;

    outline: 0;

    cursor: pointer;

    opacity: 0.64;

    transition: opacity 0.3s ease-out;
}

.v-date__header-subtitle--active,
.v-date__header-subtitle:hover,
.v-date__header-subtitle:focus {
    cursor: auto;

    opacity: 1;
}

.v-date__header-title {
    position: relative;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    height: 30px;
}

.v-date--portrait-standard .v-date__header-title {
    align-items: center;

    height: 30px;
}

.v-date__header-title-wrapper {
    position: relative;

    flex: 10000 1 0%;
}

.v-date__header-title-label {
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: 0.00735em;

    cursor: pointer;
}

.v-date__header-title-label--active,
.v-date__header-title-label:hover,
.v-date__header-title-label:focus {
    opacity: 1;
}

.v-date__header-today {
    color: var(--v-color-on-primary);
}

.v-date--landscape-standard .v-date__header-today {
    margin-top: 12px;
    margin-left: -8px;
}

.v-date__main {
    flex: 10000 1 0%;

    outline: 0;
}

.v-date__actions {
    padding: 0 16px 16px;
}

.v-date__content {
    position: relative;

    flex: 10000 1 0%;

    outline: 0;
}

.v-date__view {
    width: 100%;
    height: 100%;
    min-height: 290px;
    padding: 16px;
}

.v-date__content .v-btn {
    font-weight: normal;
}

.v-date__navigation {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    height: 12.5%;
}

.v-date__navigation-trigger {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
}

.v-date__navigation-trigger--months {
    flex: 10000 1 0%;
}

.v-date__calendar-weekdays {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    height: 12.5%;
}

.v-date__calendar-days-container {
    position: relative;

    height: 75%;
    min-height: 192px;

    overflow: hidden;
}

.v-date__calendar-days {
    width: 100% !important;
    height: 100% !important;
}

.v-date__calendar-item {
    position: relative;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    width: 14.285% !important;
    height: 12.5% !important;
    padding: 1px;

    vertical-align: middle;
}

.v-date__calendar-weekdays .v-date__calendar-item {
    font-size: 12px;

    opacity: 0.38;
}

.v-date__calendar-days > .v-date__calendar-item {
    height: 16.66% !important;
}

.v-date__calendar-item::after {
    position: absolute;
    top: 1px;
    left: 0;
    bottom: 1px;
    right: 0;
    content: '';

    border-color: transparent;
    border-style: dashed;
    border-width: 1px;

    pointer-events: none;
}

.v-date__calendar-item > .v-date__day-disabled,
.v-date__calendar-item .v-btn {
    width: 30px;
    height: 30px;

    border-radius: 50%;
}

.v-date__calendar-item > .v-date__day-disabled {
    line-height: 30px;
    text-align: center;
}

.v-date__calendar-item .v-btn {
    line-height: 22px;
}

.v-date__calendar-item--out {
    opacity: 0.18;
}

.v-date__calendar-item--fill {
    visibility: hidden;
}

.v-date__range {
    color: var(--v-color-primary);
}

.v-date__range .v-btn {
    color: var(--v-color-on-primary);
}

.v-date__range-from,
.v-date__range-to {
    color: var(--v-color-primary);
}

.v-date__range-from .v-btn,
.v-date__range-to .v-btn {
    color: var(--v-color-on-primary);
}

.v-date__range::before,
.v-date__range-from::before,
.v-date__range-to::before {
    position: absolute;
    top: 1px;
    left: 0;
    bottom: 1px;
    right: 0;
    content: '';

    background-color: currentcolor;

    opacity: 0.3;
}

.v-date__range:nth-child(7n-6)::before,
.v-date__range-from:nth-child(7n-6)::before,
.v-date__range-to:nth-child(7n-6)::before {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.v-date__range:nth-child(7n)::before,
.v-date__range-from:nth-child(7n)::before,
.v-date__range-to:nth-child(7n)::before {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.v-date__range-from::before {
    left: 50%;
}

.v-date__range-to::before {
    right: 50%;
}

.v-date__edit-range::after {
    border-color: currentcolor transparent;
}

.v-date__edit-range:nth-child(7n-6)::after {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.v-date__edit-range:nth-child(7n)::after {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.v-date__edit-range-from::after,
.v-date__edit-range-from-to::after {
    left: 4px;

    border-top-color: currentcolor;
    border-bottom-color: currentcolor;
    border-left-color: currentcolor;
    border-top-left-radius: 28px;
    border-bottom-left-radius: 28px;
}

.v-date__edit-range-to::after,
.v-date__edit-range-from-to::after {
    right: 4px;

    border-top-color: currentcolor;
    border-right-color: currentcolor;
    border-bottom-color: currentcolor;
    border-top-right-radius: 28px;
    border-bottom-right-radius: 28px;
}

.v-date__event {
    position: absolute;
    left: 50%;
    bottom: 2px;

    width: 8px;
    height: 5px;

    border-radius: 5px;

    background-color: var(--v-secondary);

    transform: translate3d(-50%, 0, 0);
}

.v-date__today {
    color: var(--v-color-on-primary);

    box-shadow: 0 0 1px 0 currentcolor;
}

.v-btn--flat.v-date__today {
    color: var(--v-color-primary);

    box-shadow: 0 0 1px 0 currentcolor;
}

.v-date__years {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.v-date__years-content {
    display: flex;
    flex: 10000 1 0%;
    flex-wrap: wrap;
    align-items: center;
    align-self: stretch;

    padding: 0 8px;
}

.v-date__years-item,
.v-date__months-item {
    display: flex;
    flex: 0 0 33.3333%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.v-date__months {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.v-date.disabled .v-date__header,
.v-date.disabled .v-date__content,
.v-date--readonly .v-date__header,
.v-date--readonly .v-date__content {
    pointer-events: none;
}

.v-date--readonly .v-date__navigation {
    display: none;
}

.v-date--portrait {
    flex-direction: column;
}

.v-date--portrait-standard .v-date__content {
    height: calc(100% - 86px);
}

.v-date--portrait-minimal .v-date__content {
    height: 100%;
}

.v-date--landscape {
    flex-direction: row;
    align-items: stretch;

    min-width: 420px;
}

.v-date--landscape > div {
    display: flex;
    flex-direction: column;
}

.v-date--landscape .v-date__content {
    height: 100%;
}

.v-date--landscape-standard {
    min-width: 420px;
}

.v-date--landscape-standard .v-date__header {
    width: 110px;
    min-width: 110px;

    border-bottom-left-radius: inherit;
}

.v-date--landscape-standard .v-date__header-title {
    flex-direction: column;
}

.v-date--landscape-minimal {
    width: 310px;
}

.v-date {
    --v-transition-duration: 0.3s;
}

.v-transition--slide-right-enter-active,
.v-transition--slide-right-leave-active,
.v-transition--slide-left-enter-active,
.v-transition--slide-left-leave-active {
    --v-transition-easing: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.v-transition--fade-leave-active,
.v-transition--slide-right-leave-active,
.v-transition--slide-left-leave-active,
.v-transition--jump-right-leave-active,
.v-transition--jump-left-leave-active,
.v-transition--jump-up-leave-active,
.v-transition--jump-down-leave-active {
    position: absolute;
}

.v-transition--slide-right-enter-active,
.v-transition--slide-right-leave-active,
.v-transition--slide-left-enter-active,
.v-transition--slide-left-leave-active {
    transition: transform var(--v-transition-duration) var(--v-transition-easing);
}

.v-transition--slide-right-enter-from {
    transform: translate3d(-100%, 0, 0);
}

.v-transition--slide-right-leave-to {
    transform: translate3d(100%, 0, 0);
}

.v-transition--slide-left-enter-from {
    transform: translate3d(100%, 0, 0);
}

.v-transition--slide-left-leave-to {
    transform: translate3d(-100%, 0, 0);
}

.v-transition--jump-right-enter-active,
.v-transition--jump-right-leave-active,
.v-transition--jump-left-enter-active,
.v-transition--jump-left-leave-active,
.v-transition--jump-up-enter-active,
.v-transition--jump-up-leave-active,
.v-transition--jump-down-enter-active,
.v-transition--jump-down-leave-active {
    transition: opacity var(--v-transition-duration), transform var(--v-transition-duration);
}

.v-transition--jump-right-enter-from,
.v-transition--jump-right-leave-to,
.v-transition--jump-left-enter-from,
.v-transition--jump-left-leave-to,
.v-transition--jump-up-enter-from,
.v-transition--jump-up-leave-to,
.v-transition--jump-down-enter-from,
.v-transition--jump-down-leave-to {
    opacity: 0;
}

.v-transition--jump-right-enter-from {
    transform: translate3d(-15px, 0, 0);
}

.v-transition--jump-right-leave-to {
    transform: translate3d(15px, 0, 0);
}

.v-transition--jump-left-enter-from {
    transform: translate3d(15px, 0, 0);
}

.v-transition--jump-left-leave-to {
    transform: translateX(-15px);
}

.v-transition--jump-up-enter-from {
    transform: translate3d(0, 15px, 0);
}

.v-transition--jump-up-leave-to {
    transform: translate3d(0, -15px, 0);
}

.v-transition--jump-down-enter-from {
    transform: translate3d(0, -15px, 0);
}

.v-transition--jump-down-leave-to {
    transform: translate3d(0, 15px, 0);
}

.v-transition--fade-enter-active,
.v-transition--fade-leave-active {
    transition: opacity var(--v-transition-duration) ease-out;
}

.v-transition--fade-enter-from,
.v-transition--fade-leave-to {
    opacity: 0;
}
</style>
