<template>
    <template v-if="inline">
        <slot />
    </template>
    <Teleport v-else-if="isClient" :to="appendTo">
        <slot />
    </Teleport>
</template>

<script>
import { DomHandler } from '../../utils/DomHandler/DomHandler'

export default {
    props: {
        appendTo: {
            type: String,
            default: 'body',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        inline() {
            return this.disabled || this.appendTo === 'self'
        },
        isClient() {
            return DomHandler.isClient()
        },
    },
}
</script>
