import { h, onScopeDispose, ref, watch, unref } from "vue";
import { createFocusTrap } from "focus-trap";

export default {
  props: ["as"],

  setup(props, { slots }) {
    let trap;
    const target = ref();

    function resolveUnref(r) {
      return typeof r === "function" ? r() : unref(r);
    }

    function unrefElement(elRef) {
      const plain = resolveUnref(elRef);
      return plain?.$el ?? plain;
    }

    const activate = () => trap && trap.activate();
    const deactivate = () => trap && trap.deactivate();

    watch(
      () => unrefElement(target),
      (el) => {
        if (!el) {
          return;
        }
        trap = createFocusTrap(el, {
          escapeDeactivates: false,
        });
        activate();
      },
      { flush: "post" }
    );

    // Cleanup on unmount
    onScopeDispose(() => deactivate());

    return () => {
      if (slots.default) {
        return h(props.as || "div", { ref: target }, slots.default());
      }
    };
  },
};
