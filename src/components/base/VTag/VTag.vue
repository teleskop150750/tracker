<template>
    <div class="v-tag">
        <slot />
        <button class="v-tag__button" type="button" aria-label="удалить" @click="onClick">
            <VCloseIcon class="v-tag__button-icon" />
        </button>
    </div>
</template>

<script>
import VCloseIcon from '../../icons/VCloseIcon'

export default {
    components: {
        VCloseIcon,
    },
    emits: {
        delete: null,
    },
    methods: {
        onClick() {
            this.$emit('delete')
        },
    },
}
</script>

<style>
.v-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    min-height: 24px;
    padding: 2px 9px;
    padding-right: 5px;
    box-sizing: border-box;

    font-size: 14px;
    line-height: 1;
    white-space: nowrap;

    border-radius: 4px;

    background-color: hsl(0deg 0% 96%);
}

.v-tag__button {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    padding: 2px;

    border: 0;
    border-radius: 14px;

    background-color: transparent;

    cursor: pointer;
}

.v-tag__button:hover,
.v-tag__button:focus {
    color: hsl(0deg 0% 100%);

    background-color: var(--v-color-primary);

    outline: none;
}

.v-tag__button-icon {
    display: block;

    width: 100%;
    height: 100%;
}
</style>
