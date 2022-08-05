<template>
  <div class="v-tag">
    <slot />
    <button class="v-tag__button" type="button" aria-label="удалить">
      <VCloseIcon class="v-tag__button-icon" />
    </button>
  </div>
</template>

<script>
import VCloseIcon from "../icons/VCloseIcon";

export default {
  components: {
    VCloseIcon,
  },
  emits: {
    delete: null,
  },
  methods: {
    delete() {
      this.$emit("delete");
    },
  },
};
</script>

<style>
.v-tag {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  padding-right: 5px;
  font-size: 14px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
}

.v-tag__button {
  margin-left: 6px;
  color: #67c23a;
  width: 16px;
  height: 16px;
  border-radius: 14px;
  border: 0;
  padding: 2px;
  background-color: transparent;
  cursor: pointer;
}

.v-tag__button:hover,
.v-tag__button:focus {
  outline: none;
  color: #ffffff;
  background-color: #67c23a;
}

.v-tag__button-icon {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
