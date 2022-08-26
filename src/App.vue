<template>
    <AppLayout>
        <RouterView />
    </AppLayout>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
</script>

<style>
:root {
    --v-text-color: hsl(227deg 11% 16%);
    --v-color-primary: hsl(262deg 88% 59%);
    --v-color-on-primary: rgb(255 255 255);
    --v-container-background-color-dark: hsl(222deg 34% 25%);
    --v-container-border-color-dark: hsl(0deg 0% 100% / 8%);
    --v-container-color-dark: hsl(220deg 5% 87%);
    --v-container-background-color-light: rgb(255 255 255);
    --v-container-color-light: hsl(224deg 39% 11%);
}

*,
*::before,
*::after {
    margin: 0;
    box-sizing: border-box !important;
    -webkit-tap-highlight-color: transparent;

    font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
    min-height: 100%;

    background-color: hsl(220deg 13% 91%);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.visually-hidden,
.visually-hidden-focusable:not(:focus, :focus-within) {
    position: absolute !important;

    width: 1px !important;
    height: 1px !important;
    margin: -1px !important;
    padding: 0 !important;

    white-space: nowrap !important;

    border: 0 !important;

    overflow: hidden !important;

    clip: rect(0, 0, 0, 0) !important;
}
</style>
