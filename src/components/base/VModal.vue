<template>
  <Transition
    name="p-dialog"
    @enter="onEnter"
    @after-leave="onAfterLeave"
    appear
  >
    <VFocusTrap v-if="isOpen" class="v-overlay ref">
      <div class="v-overlay-modal" @click.self="close">
        <div class="v-modal" role="dialog">
          <div class="v-modal__header">
            <button
              aria-label="Close this dialog"
              class="v-modal__header-btn-close"
              type="button"
              @click="close"
            >
              <VCloseIcon />
            </button>
          </div>
          <div class="v-modal__body">
            <slot />
          </div>
          <footer v-if="$slots['footer']" class="v-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </VFocusTrap>
  </Transition>
</template>

<script>
import VFocusTrap from "./VFocusTrap";
import VCloseIcon from "../icons/VCloseIcon";

export default {
  components: {
    VCloseIcon,
    VFocusTrap,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    "update:isOpen": null,
  },
  documentKeydownListener: null,
  methods: {
    close() {
      this.$emit("update:isOpen", false);
    },
    onEnter() {
      this.bindGlobalListeners();
    },
    onAfterLeave() {
      this.unbindGlobalListeners();
    },
    bindGlobalListeners() {
      this.bindDocumentKeyDownListener();
    },
    unbindGlobalListeners() {
      this.unbindDocumentKeyDownListener();
    },
    bindDocumentKeyDownListener() {
      if (!this.documentKeydownListener) {
        this.documentKeydownListener = this.onKeyDown.bind(this);
        window.document.addEventListener(
          "keydown",
          this.documentKeydownListener
        );
      }
    },
    unbindDocumentKeyDownListener() {
      if (this.documentKeydownListener) {
        window.document.removeEventListener(
          "keydown",
          this.documentKeydownListener
        );
        this.documentKeydownListener = null;
      }
    },
    onKeyDown(event) {
      if (event.key === "Escape") {
        this.close();
      }
    },
  },
};
</script>

<style>
.v-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.v-overlay-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}

.v-modal {
  position: relative;
  margin: 50px auto 50px;
  background: var(--v-container-background-color-light);
  border-radius: 4px;
  box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
    0px 8px 20px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  width: 50%;
}

.v-modal__header {
  display: flex;
  justify-content: flex-end;
  padding: 0.25rem 1rem;
}

.v-modal__header-btn-close {
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

.v-modal__header-btn-close:focus {
  outline: 0;

  box-shadow: 0 0 0 3px hsla(251, 53%, 59%, 0.85);
}

.v-modal__footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.v-modal__body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
