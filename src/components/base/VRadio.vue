<template>
  <label class="v-radio">
    <span class="v-radio__input">
      <input
        class="v-radio__original"
        v-model="modelValue"
        :value="value"
        :name="name"
        type="radio"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
      />
      <span class="v-radio__inner"></span>
    </span>
    <span class="v-radio__label" @keydown.stop>
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  emits: {
    "update:modelValue": null,
    change: null,
  },
  methods: {
    handleChange() {
      this.$nextTick(() => this.$emit("change", this.modelValue));
    },
  },
};
</script>

<style>
.v-radio__input {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  position: relative;
  vertical-align: middle;
}

.v-radio__original {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
}

.v-radio__inner {
  border: 1px solid var(--v-color-primary);
  border-radius: 4rem;
  width: 1rem;
  height: 1rem;
  background-color: transparent;
  position: rvative;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
}

.v-radio__input.is-checked .v-radio__inner {
  border-color: var(--v-color-primary);
  background: var(--v-color-primary);
}

.v-radio__original:focus-visible + .v-radio__inner {
  outline: 2px solid var(--v-color-primary);
  outline-offset: 1px;
}
</style>
