<template>
    <div>
        <div class="grid-column-selector-group">
            <div class="grid-column-selector-group__header">
                <VCheckbox :modelValue="headerChecked" @update:model-value="selectGroup(group.id, $event)" :label="group.label" />
            </div>
            <div class="grid-column-selector-group__list">
                <div class="grid-column-selector-group__item" v-for="item in group.children" :key="item.id">
                    <VCheckbox :modelValue="item.value" @update:model-value="selectItem(item.id, $event)" :label="item.label" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VCheckbox from '../VCheckbox/VCheckbox'

export default {
    components: {
        VCheckbox,
    },
    props: {
        group: {
            type: Object,
            default: () => ({
                children: [],
            }),
        },
    },
    emits: ['selectItem', 'selectGroup'],
    computed: {
        headerChecked() {
            const values = this.group.children.map((item) => item.value)

            if (values.every((value) => value === true)) {
                return true
            }

            if (values.every((value) => value === false)) {
                return false
            }

            return null
        },
    },
    methods: {
        selectGroup(id, value) {
            this.$emit('selectGroup', { id, value })
        },
        selectItem(id, value) {
            this.$emit('selectItem', { id, value })
        },
    },
}
</script>

<style>
.grid-column-selector-group {
    display: block;

    width: 160px;
}

.grid-column-selector-group__header {
    font-weight: 700;
}
</style>
