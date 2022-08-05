<template>
  <div class="location-picker">
    <div class="location-picker__header">
      <p class="location-picker__label">Местоположение:</p>
      <div class="location-picker__folder">
        <VTag v-if="currentFolder">{{ currentFolder.name }}</VTag>
      </div>
    </div>
    <VButton text>Выберите папку</VButton>
  </div>
</template>

<script>
import VTag from "./base/VTag";
import VButton from "./base/VButton";

export default {
  components: {
    VButton,
    VTag,
  },
  data() {
    return {
      currentFolder: {
        id: 3,
        name: "Folder",
      },

      folders: [
        {
          id: 3,
          name: "Folder",
        },
        {
          id: 4,
          name: "Folder 4",
        },
        {
          id: 5,
          name: "Folder 5",
        },
      ],
    };
  },
};
</script>

<style>
.location-picker__header {
  display: grid;
  grid-template-columns: min-content 1fr;
  align-items: center;
  min-height: 24px;
  gap: 1rem;
}
</style>
