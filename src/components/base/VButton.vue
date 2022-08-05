<script>
export default {
  props: {
    to: {
      type: [String, Object],
      default: "",
    },
    link: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: [String, Object],
      default: null,
    },
    type: {
      type: String,
      default: "button",
    },
    label: {
      type: String,
      default: null,
    },
    block: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    linkHref() {
      return this.link ? this.to : null;
    },
    tag() {
      return this.link ? "router-link" : "button";
    },
    buttonType() {
      return this.link ? null : this.type;
    },
    classes() {
      return {
        "v-button--block": this.block,
        "v-button--circle": this.circle,
        "v-button--text": this.text,
      };
    },
  },
};
</script>

<template>
  <component
    :is="tag"
    class="v-button"
    :class="classes"
    :type="buttonType"
    :aria-label="label"
    :to="linkHref"
  >
    <span class="v-button__content">
      <span v-if="$slots['default']" class="v-button__label">
        <slot />
      </span>
      <span v-if="$slots['icon']" class="v-button__icon">
        <slot name="icon" />
      </span>
    </span>
  </component>
</template>

<style>
.v-button {
  display: inline-flex;
  justify-content: center;
  align-items: stretch;

  padding: 0.5rem 1rem;

  color: var(--v-color-on-primary);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1;
  text-decoration: inherit;

  border: 1px solid transparent;
  border-width: 1px;
  border-radius: 0.5rem;

  background-color: var(--v-color-primary);

  cursor: pointer;

  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 0.15s;
}

.v-button--block {
  display: flex;
  flex: 1 0 auto;

  min-width: 100%;
}

.v-button--text {
  background-color: transparent;
  color: var(--v-color-primary);
  padding-left: 0;
  padding-right: 0;
  border-radius: 0.25rem;
}

.v-button--circle {
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;

  border-radius: 50%;
}

.v-button:hover {
  background-color: rgb(108 43 217);
}

.v-button--text:hover {
  background-color: transparent;
}

.v-button:focus {
  outline: 0;

  box-shadow: 0 0 0 3px rgb(202 191 253 / 45%);
}

.v-button__content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-button__icon > * {
  max-width: 100%;
  max-height: 100%;
}
</style>
