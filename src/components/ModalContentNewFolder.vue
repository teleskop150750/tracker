<template>
  <div class="modal-content-mew-folder">
    <VTitle class="modal-content-mew-folder__title">Создать папку</VTitle>
    <VTextField
      class="modal-content-mew-folder__name"
      v-model="folderName"
      label="Название папки"
    />
    <div class="modal-content-mew-folder__location">
      <LocationPicker />
    </div>

    <button type="button">sdsd</button>
  </div>
</template>

<script>
import VTitle from "./base/VTitle";
import VTextField from "./base/VTextField";
import LocationPicker from "./LocationPicker";

export default {
  components: {
    VTitle,
    VTextField,
    LocationPicker,
  },

  data() {
    return {
      folderName: "",
    };
  },
};
</script>

<style>
.modal-content-mew-folder {
  background-color: #ffffff;
  max-width: 500px;
  padding: 2rem;
}

.modal-content-mew-folder__title {
  padding-bottom: 1rem;
}

.modal-content-mew-folder__name {
  margin-bottom: 2rem;
}
</style>
