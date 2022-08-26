<template>
    <tr class="v-table-head-row">
        <slot />
    </tr>
</template>

<style>
.v-table-head-row {
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.025em;
    white-space: nowrap;
    white-space: nowrap;
    text-align: left;
    text-transform: uppercase;

    border-top: 1px solid hsl(220deg 13% 91%);
    border-collapse: collapse;
    border-collapse: collapse;

    background-color: hsl(210deg 20% 98%);
}
</style>
