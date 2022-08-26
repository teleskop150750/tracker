<script>
export default {
    props: {
        label: {
            type: String,
            default: '',
        },
        to: {
            type: [String, Object],
            default: '',
        },
    },
}
</script>

<template>
    <router-link class="v-link" :to="to" exact-active-class="v-link--active">
        <span class="v-link__label">{{ label }}</span>
    </router-link>
</template>

<style>
.v-link {
    color: rgb(126 58 242);
    font-weight: 500;
    font-size: 0.875rem;
    text-decoration: none;
}

.v-link:hover {
    text-decoration: underline;
}
</style>
