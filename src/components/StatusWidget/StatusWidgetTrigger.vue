<template>
    <button class="status-widget-trigger" :style="styles" type="button">
        <span class="status-widget-trigger__label">
            {{ item.name }}
        </span>
        <VArrowDownIcon class="status-widget-trigger__icon" />
    </button>
</template>

<script>
import VArrowDownIcon from '../icons/VArrowDownIcon'

export default {
    props: {
        item: Object,
    },
    components: {
        VArrowDownIcon,
    },
    computed: {
        styles() {
            return {
                '--status-widget-trigger-color': this.item.color,
            }
        },
    },
}
</script>

<style>
.status-widget-trigger {
    display: flex;
    align-items: center;

    height: 2rem;
    padding: 0 0.5rem;

    border: 0;
    border-left: 4px solid hsl(var(--status-widget-trigger-color));

    background-color: hsl(var(--status-widget-trigger-color) / 15%);

    cursor: pointer;
}

.status-widget-trigger__label {
    font-size: 12px;
}
</style>
