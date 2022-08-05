<template>
  <aside class="v-sidebar" :class="classes">
    <slot />
  </aside>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "v-sidebar--open": this.isOpen,
      };
    },
  },
};
</script>

<style>
.v-sidebar {
  width: 0;

  color: var(--v-on-container-background-color-dark);

  border-right: 1px solid var(--v-container-border-color-dark);

  background-color: var(--v-container-background-color-dark);

  overflow: hidden;
}

.v-sidebar--open {
  width: 300px;
}
</style>
