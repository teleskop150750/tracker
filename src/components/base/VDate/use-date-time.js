import { pad } from './format.js'
import { defaultLang } from './lang'

export const useDateTimeProps = {
    /**
     * Дата (даты) компонента; Должен быть Array, если используется 'множественный' prop;
     * Либо используйте это свойство (вместе с прослушивателем для события 'update:model-value'),
     * ЛИБО используйте директиву v-model
     */
    modelValue: {
        required: true,
    },

    /**
     * Маска (строка форматирования), используемая для синтаксического анализа и форматирования значения
     */
    mask: {
        type: String,
    },

    /**
     * Отображение компонента в альбомном режиме
     */
    landscape: Boolean,

    /**
     * Название цвета компонента из цветовой палитры Quasar
     */
    color: String,
    /**
     * Переопределяет цвет текста (при необходимости); Название цвета из цветовой палитры Quasar
     */
    textColor: String,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,

    /**
     * Перевод компонента в режим только для чтения
     */
    readonly: Boolean,
    /**
     * Перевод компонента в отключенный режим
     */
    disable: Boolean,
}

export function getDayHash(date) {
    return date.year + '/' + pad(date.month) + '/' + pad(date.day)
}

export default function () {
    function getLocale() {
        return defaultLang.date
    }

    function getCurrentDate(dateOnly) {
        const d = new Date()
        const timeFill = dateOnly === true ? null : 0

        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: timeFill,
            minute: timeFill,
            second: timeFill,
            millisecond: timeFill,
        }
    }

    return {
        getLocale,
        getCurrentDate,
    }
}
