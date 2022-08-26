<script>
export default {
    props: {
        level: {
            type: [String, Number],
            default: 1,
        },
    },
    computed: {
        tagName() {
            return `h${this.level}`
        },
        classes() {
            return [`v-title--${this.level}`]
        },
    },
}
</script>

<template>
    <component :is="tagName" class="v-title" :class="classes">
        <slot />
    </component>
</template>

<style>
.v-title {
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 1.5;
}

.v-title--2 {
    font-size: 1.2rem;
}
</style>
