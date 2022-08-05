<template>
  <form class="v-form" @submit.prevent="submit($event)">
    <div class="v-form__header" v-if="$slots['header']">
      <slot name="header" />
    </div>

    <slot />

    <div class="v-form__footer" v-if="$slots['footer']">
      <slot name="footer" />
    </div>
  </form>
</template>

<script>
export default {
  emits: {
    submit: (event) => {
      if (event) {
        return true;
      } else {
        console.warn("Invalid submit event payload!");
        return false;
      }
    },
  },

  methods: {
    submit(event) {
      this.$emit("submit", event);
    },
  },
};
</script>

<style>
.v-form__header {
  margin-bottom: 1rem;
}

.v-form__field + .v-form__field {
  margin-top: 1rem;
}

.v-form__footer {
  margin-top: 1.5rem;
}
</style>
