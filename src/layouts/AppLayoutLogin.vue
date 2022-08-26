<template>
    <div class="v-layout-login">
        <slot />
    </div>
</template>

<style>
.v-layout-login {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    justify-items: center;
    align-items: center;

    min-height: 100vh;
    padding: 2rem 1rem;
}
</style>
