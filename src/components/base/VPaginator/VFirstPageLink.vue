<template>
    <button :class="containerClass" type="button">
        <span class="p-paginator-icon pi pi-angle-double-left"></span>
    </button>
</template>

<script>
export default {
    computed: {
        containerClass() {
            return [
                'p-paginator-first p-paginator-element p-link',
                {
                    'p-disabled': this.$attrs.disabled,
                },
            ]
        },
    },
}
</script>
