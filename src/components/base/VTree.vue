<template>
  <ul class="v-tree">
    <li class="v-tree__list" v-for="item in items" :key="item.id">
      <span class="toggler" v-if="hasChild(item)" @click="toggle(item)">
        [{{ item.isOpen ? "-" : "+" }}]
      </span>
      {{ item.name }}
      <VTree
        :items="item.childrens"
        @changed="changed(item)"
        v-if="item.isOpen"
      />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: Array,
  },
  data() {
    return {
      isOpen: {},
    };
  },
  methods: {
    selected(item, status) {
      this.recursiveSelect(item, status);
      this.$emit("changed");
    },
    recursiveSelect(item, status) {
      for (const i of item.childrens) {
        this.recursiveSelect(i, status);
        i.checked = status;
      }
    },
    changed(item) {
      const status = item.childrens.every(
        (children) => children.checked === true
      );
      item.checked = status;
      this.$emit("changed");
    },
    toggle(item) {
      item.isOpen = !item.isOpen;
    },
    hasChild(item) {
      return item.childrens && item.childrens.length;
    },
  },
};
</script>

<style>
.toggler {
  cursor: pointer;
}
</style>
