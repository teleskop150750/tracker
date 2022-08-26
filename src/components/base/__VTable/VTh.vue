<script>
export default {}
</script>

<template>
    <th class="v-th">
        <slot />
    </th>
</template>

<style>
.v-th {
    padding: 0.25rem;
    font-size: 1rem;
    border: 1px solid hsl(210deg 14% 89%);
    border-bottom: 2px solid hsl(210deg 14% 89%);
}
</style>
