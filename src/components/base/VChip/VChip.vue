<template>
    <span class="v-chip">
        <slot />
        <button class="v-chip__button" type="button" aria-label="удалить" @click="onDelete($event)">
            <svg
                class="v-icon v-chip__button-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.6719 12.0812L9.59065 7.99999L13.6719 3.91874C14.1125 3.47812 14.1125 2.76874 13.6719 2.32812C13.2313 1.88749 12.5219 1.88749 12.0813 2.32812L8.00002 6.40937L3.91877 2.32812C3.47815 1.88749 2.76877 1.88749 2.32815 2.32812C1.88752 2.76874 1.88752 3.47812 2.32815 3.91874L6.4094 7.99999L2.32815 12.0812C1.88752 12.5219 1.88752 13.2312 2.32815 13.6719C2.76877 14.1125 3.47815 14.1125 3.91877 13.6719L8.00002 9.59062L12.0813 13.6719C12.5219 14.1125 13.2313 14.1125 13.6719 13.6719C14.1094 13.2312 14.1094 12.5187 13.6719 12.0812Z"
                    fill="currentColor"
                />
            </svg>
        </button>
    </span>
</template>

<script setup>
const emit = defineEmits(['delete'])

function onDelete(event) {
    event.cancelable !== false && event.preventDefault()
    event.stopPropagation()
    emit('delete')
}
</script>

<style>
.v-chip {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    min-height: 24px;
    padding: 2px 9px;
    padding-right: 5px;
    box-sizing: border-box;

    color: hsl(210deg 9% 31%);
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    white-space: nowrap;

    border-radius: 4px;
    border-radius: 16px;

    background: hsl(210deg 14% 89%);
}

.v-chip__button {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    padding: 2px;

    color: hsl(215deg 7% 32%);

    border: 1px solid hsl(215deg 7% 32%);
    border-radius: 14px;

    background-color: transparent;

    cursor: pointer;
}

.v-chip__button:hover,
.v-chip__button:focus {
    color: hsl(0deg 0% 100%);

    background-color: var(--v-color-primary);

    outline: none;
}

.v-chip__button-icon {
    display: block;

    width: 10px;
    height: 10px;
}
</style>
