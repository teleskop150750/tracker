<template>
  <div class="v-default-layout">
    <VHeader
      v-model:is-open-sidebar="isOpenSidebar"
      class="v-default-layout__header"
    />
    <VSidebar :is-open="isOpenSidebar">23</VSidebar>
    <VMain class="v-default-layout__main">
      <slot />
    </VMain>
    <VFooter class="v-default-layout__footer" />
  </div>
</template>

<script>
import VHeader from "../components/layouts/default/VHeader";
import VMain from "../components/layouts/default/VMain";
import VFooter from "../components/layouts/default/VFooter";
import VSidebar from "../components/layouts/default/VSidebar";
export default {
  components: {
    VHeader,
    VMain,
    VFooter,
    VSidebar,
  },
  data() {
    return {
      isOpenSidebar: false,
    };
  },
};
</script>

<style>
.v-default-layout {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns: min-content 1fr;

  min-height: 100vh;
}

.v-default-layout__header {
  grid-column: 1 / -1;
}

.v-default-layout__footer {
  grid-column: 1 / -1;
}
</style>
