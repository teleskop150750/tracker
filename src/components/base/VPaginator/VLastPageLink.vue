<template>
    <button :class="containerClass" type="button">
        <span class="p-paginator-icon pi pi-angle-double-right"></span>
    </button>
</template>

<script>
export default {
    computed: {
        containerClass() {
            return [
                'p-paginator-last p-paginator-element p-link',
                {
                    'p-disabled': this.$attrs.disabled,
                },
            ]
        },
    },
}
</script>
