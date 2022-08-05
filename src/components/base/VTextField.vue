<script>
import { getCurrentInstance } from "vue";

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    ariaLabel: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "text",
    },
    type: {
      type: String,
      default: "text",
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    "update:modelValue": (value) => {
      if (value) {
        return true;
      } else {
        console.warn("Invalid payload!");
        return false;
      }
    },
  },
  data() {
    return {
      id: getCurrentInstance().uid,
    };
  },

  methods: {
    onInput(value) {
      this.$emit("update:modelValue", value);
    },
  },

  computed: {
    classes() {
      return {
        "v-text-field--dark": this.dark,
      };
    },
  },
};
</script>

<template>
  <div class="v-text-field" :class="classes">
    <label v-if="label" class="v-text-field__label" :for="id">
      {{ label }}
    </label>

    <input
      class="v-text-field__input"
      :id="id"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      :aria-label="ariaLabel"
      @input="onInput($event.target.value)"
    />
  </div>
</template>

<style>
.v-text-field {
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: 100%;
}

.v-text-field__label {
  margin-bottom: 0.5rem;

  color: hsl(227deg 11% 16%);
  font-size: 0.875rem;
}

.v-text-field__input {
  display: block;

  padding: 0.5rem 0.75rem;

  color: inherit;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.5;

  border: 1px solid hsl(214deg 22% 77%);
  border-radius: 0.25rem;

  background-color: hsl(0deg 0% 100%);

  appearance: none;
}

.v-text-field--dark .v-text-field__input {
  color: hsl(0deg 0% 100%);

  background-color: hsl(0deg 0% 100% / 8%);
}

.v-text-field__input::placeholder {
  color: hsl(214deg 20% 69%);
}

.v-text-field--dark .v-text-field__input::placeholder {
  color: hsl(214deg 20% 69%);
}

.v-text-field__input:focus {
  border-color: rgb(172 148 250);

  outline: 0;

  box-shadow: 0 0 0 3px rgb(202 191 253 / 45%);
}
</style>
