<script>
import VContainer from "../components/layouts/default/VContainer";
import VTitle from "../components/base/VTitle";
import VTd from "../components/base/VTd";
import VTable from "../components/base/VTable";
import VButton from "../components/base/VButton";
import VFormCard from "../components/base/VFormCard";
import VForm from "../components/base/VForm";
import VTextField from "../components/base/VTextField";
// import FileService from "../services/FileService";

export default {
  components: {
    VContainer,
    VTitle,
    VTable,
    VTd,
    VButton,
    VFormCard,
    VForm,
    VTextField,
  },
  data() {
    return {
      user: {
        login: "",
        password: "",
      },
      table: {
        headers: [
          {
            text: "Название",
            value: "name",
          },
          {
            text: "Дата",
            value: "created_at",
          },
          {
            text: "Действия",
            value: "actions",
          },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    this.getFiles();
  },
  methods: {
    async getFiles() {
      // const user = this.$store.getters["auth/user"];
      // const response = await FileService.all({
      // login: user.login,
      //   password: user.password,
      // });
      // this.table.items = response.data.files;
    },
    async uploadFile() {},
    async downloadFile() {},
    async deleteFile() {},
  },
};
</script>

<template>
  <div class="page">
    <VContainer>
      <VTitle class="page__title">Файловый менеджер</VTitle>
      <div class="file-manager">
        <div class="file-manager__table">
          <VTable :headers="table.headers" :items="table.items">
            <template #item-actions="{ item }">
              <VTd>
                <div class="item-actions">
                  <VButton
                    @click="downloadFile(item.id, item.name)"
                    label="Скачать"
                  />
                  <VButton @click="deleteFile(item.id)" label="Удалить" />
                </div>
              </VTd>
            </template>
          </VTable>
        </div>
        <div class="file-manager__form">
          <VFormCard>
            <VForm @submit="uploadFile($event)">
              <template #header>
                <VTitle level="2">Добавить файл</VTitle>
              </template>

              <VTextField
                class="v-form__field"
                label="File"
                name="file"
                type="file"
              />

              <template #footer>
                <VButton block label="Загрузить" type="submit" />
              </template>
            </VForm>
          </VFormCard>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style>
.file-manager {
  display: grid;
  grid-template-columns: 50rem 20rem;
  gap: 2rem;
}

.page__title {
  margin-bottom: 30px;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
