<script>
import VTr from "./VTr";
import VTd from "./VTd";

export default {
  components: {
    VTr,
    VTd,
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemKey: {
      type: [String, Function],
      default: "id",
    },
  },

  computed: {
    getItemKey() {
      return typeof this.itemKey === "function"
        ? this.itemKey
        : (row) => row[this.itemKey];
    },

    countItems() {
      return this.items.length;
    },
  },
};
</script>

<template>
  <div class="v-table">
    <div class="v-table__inner">
      <table class="v-table__table">
        <thead>
          <VTr header>
            <VTd v-for="header in headers" :key="header.value">
              {{ header.text }}
            </VTd>
          </VTr>
        </thead>
        <tbody class="v-table__table-body">
          <VTr v-for="item in items" :key="getItemKey(item)">
            <slot
              v-for="header in headers"
              :key="getItemKey(item) + header.value"
              :name="`item-${header.value}`"
              :item="item"
            >
              <VTd>{{ item[header.value] }} </VTd>
            </slot>
          </VTr>
        </tbody>
      </table>
    </div>
    <footer class="v-table__footer">
      <span class="v-table__count">Показано {{ countItems }}</span>
    </footer>
  </div>
</template>

<style>
.v-table {
  width: 100%;

  border-radius: 0.5rem;

  box-shadow: 0 0 0 1px rgb(0 0 0 / 5%);

  overflow: hidden;
}

.v-table__inner {
  width: 100%;

  overflow-x: auto;
}

.v-table__table {
  width: 100%;

  white-space: nowrap;

  border: 0 solid hsl(210deg 2% 84%);
  border-collapse: collapse;
}

.v-table__table-body {
  background-color: rgb(255 255 255);
}

.v-table__footer {
  padding: 0.75rem 1rem;

  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;

  border-top: 1px solid hsl(220deg 13% 91%);

  background-color: hsl(210deg 20% 98%);
}

.v-table__count {
  color: rgb(112 114 117);
  text-transform: uppercase;
}
</style>
