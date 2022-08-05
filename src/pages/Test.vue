<template>
  <div>
    <VTree :items="mapped" />
  </div>
  <div>
    <button type="button" class="btn" @click="showModal">Open Modal!</button>

    <VModal v-model:is-open="isModalVisible"> </VModal>
    <div>
      <ModalContentNewFolder />
    </div>
  </div>
</template>

<script>
import ModalContentNewFolder from "../components/ModalContentNewFolder";
import VTree from "../components/base/VTree";
import VModal from "../components/base/VModal";
export default {
  components: {
    VTree,
    VModal,
    ModalContentNewFolder,
  },
  data() {
    return {
      isModalVisible: false,
      items: [
        {
          id: 1,
          parentId: null,
          name: "All",
          checked: true,
          isOpen: false,
        },
        {
          id: 34341,
          parentId: null,
          name: "All",
          checked: true,
          isOpen: false,
        },
        {
          id: 2,
          parentId: 1,
          name: "Customer",
          checked: true,
          isOpen: false,
        },
        {
          id: 3,
          parentId: 1,
          name: "Consumer",
          checked: true,
          isOpen: false,
        },
        {
          id: 4,
          parentId: 2,
          name: "East",
          checked: true,
          isOpen: false,
        },
        {
          id: 5,
          parentId: 2,
          name: "West",
          checked: true,
          isOpen: false,
        },
        {
          id: 6,
          parentId: 3,
          name: "East",
          checked: true,
          isOpen: false,
        },
        {
          id: 7,
          parentId: 3,
          name: "West",
          checked: true,
          isOpen: false,
        },
        {
          id: 2828,
          parentId: 4,
          name: "Amet",
          checked: true,
          isOpen: false,
        },
        {
          id: 2929,
          parentId: 4,
          name: "Memet",
          checked: true,
          isOpen: false,
        },
        {
          id: 2494,
          parentId: 5,
          name: "Artur",
          checked: true,
          isOpen: false,
        },
        {
          id: 2985,
          parentId: 5,
          name: "Hamid",
          checked: true,
          isOpen: false,
        },
        {
          id: 5228,
          parentId: 6,
          name: "Ibraim",
          checked: true,
          isOpen: false,
        },
        {
          id: 5078,
          parentId: 6,
          name: "Rustam",
          checked: true,
          isOpen: false,
        },
        {
          id: 5818,
          parentId: 7,
          name: "Ayder",
          checked: true,
          isOpen: false,
        },
        {
          id: 5857,
          parentId: 7,
          name: "Samit",
          checked: true,
          isOpen: false,
        },
      ],
    };
  },
  computed: {
    mapped: function () {
      const mapped = {},
        roots = [];
      for (const item of this.items) {
        mapped[item.id] = item;
        mapped[item.id]["childrens"] = [];
      }
      for (const key in mapped) {
        const item = mapped[key];
        if (item["parentId"]) {
          mapped[item["parentId"]]["childrens"].push(item);
        } else {
          roots.push(item);
        }
      }
      return roots;
    },
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>
