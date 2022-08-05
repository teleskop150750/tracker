<template>
  <header class="v-header">
    <div class="v-header__container">
      <div class="v-header__left">
        <VButton circle label="Меню" @click="toggleSidebar">
          <template #icon>
            <VBurgerMenuIcon />
          </template>
        </VButton>
        <VButton circle link :to="{ name: 'home' }" label="Домашняя страница">
          <template #icon>
            <VHomeIcon />
          </template>
        </VButton>
      </div>
      <div class="v-header__right">
        <VTextField dark aria-label="Поиск" placeholder="поиск" />
        <VButton circle label="Добавить" @click="logout">
          <template #icon>
            <VPlusIcon />
          </template>
        </VButton>
        <VAvatar>A</VAvatar>
      </div>
    </div>
  </header>
</template>

<script>
import VButton from "../../base/VButton";
import VAvatar from "../../base/VAvatar";
import VTextField from "../../base/VTextField";
import VBurgerMenuIcon from "../../icons/VBurgerMenuIcon";
import VHomeIcon from "../../icons/VHomeIcon";
import VPlusIcon from "../../icons/VPlusIcon";

export default {
  components: {
    VAvatar,
    VButton,
    VBurgerMenuIcon,
    VHomeIcon,
    VPlusIcon,
    VTextField,
  },
  props: {
    isOpenSidebar: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    "update:isOpenSidebar": null,
  },
  methods: {
    toggleSidebar() {
      console.log("click");
      this.$emit("update:isOpenSidebar", !this.isOpenSidebar);
    },
    async logout() {
      await this.$store.commit("auth/DELETE_USER");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
.v-header {
  padding: 1rem 0;

  color: var(--v-on-container-background-color-dark);

  border-bottom: 1px solid var(--v-container-border-color-dark);

  background-color: var(--v-container-background-color-dark);
}

.v-header__container {
  display: grid;
  grid-template-columns: 1fr 1fr;

  padding: 0 1rem;
}

.v-header__left {
  display: grid;
  grid-template-columns: min-content min-content;
  gap: 0.5rem;
  align-items: center;
}

.v-header__right {
  display: grid;
  grid-template-columns: 200px min-content min-content;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
}
</style>
