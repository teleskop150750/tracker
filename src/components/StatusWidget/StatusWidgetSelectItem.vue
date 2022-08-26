<template>
    <button class="status-widget-select-item" :class="classes" :style="styles" type="button">
        <span class="status-widget-select-item__color"> </span>
        <span class="status-widget-select-item__label">
            {{ item.name }}
        </span>
    </button>
</template>

<script>
export default {
    props: {
        item: Object,
        active: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                'status-widget-select-item--active': this.active,
            }
        },
        styles() {
            return {
                '--status-widget-select-item-color': this.item.color,
            }
        },
    },
}
</script>

<style>
.status-widget-select-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    width: 100%;
    padding: 0.375rem 1.5rem;

    font-size: 14px;

    border: 0;

    background-color: transparent;

    cursor: pointer;
}

.status-widget-select-item:hover {
    background-color: hsl(0deg 0% 92%);
}

.status-widget-select-item--active {
    color: hsl(0deg 0% 100%);

    background-color: hsl(218deg 100% 63%);
}

.status-widget-select-item--active:hover {
    background-color: hsl(218deg 100% 63%);
}

.status-widget-select-item__color {
    width: 10px;
    height: 10px;

    border: 1px solid hsl(var(--status-widget-select-item-color));
    border-radius: 2px;

    background-color: hsl(var(--status-widget-select-item-color));
}

.status-widget-select-item--active .status-widget-select-item__color {
    border-color: var(--v-container-background-color-light);
}
</style>
