<script>
export default {
  props: {
    header: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return {
        "v-tr--header": this.header,
      };
    },
  },
};
</script>

<template>
  <tr class="v-tr" :class="classes">
    <slot />
  </tr>
</template>

<style>
.v-tr {
  white-space: nowrap;

  border-top: 1px solid hsl(220deg 13% 91%);
  border-collapse: collapse;
}

.v-tr--header {
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
  white-space: nowrap;
  text-align: left;
  text-transform: uppercase;

  border-collapse: collapse;

  background-color: hsl(210deg 20% 98%);
}
</style>
