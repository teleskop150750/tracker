<template>
  <div
    ref="el$"
    :class="[
      ns.b(),
      ns.is('dragging', !!dragState.draggingNode),
      ns.is('drop-not-allow', !dragState.allowDrop),
      ns.is('drop-inner', dragState.dropType === 'inner'),
      { [ns.m('highlight-current')]: highlightCurrent },
    ]"
    role="tree"
  >
    <el-tree-node
      v-for="child in root.childNodes"
      :key="getNodeKey(child)"
      :node="child"
      :props="props"
      :accordion="accordion"
      :render-after-expand="renderAfterExpand"
      :show-checkbox="showCheckbox"
      :render-content="renderContent"
      @node-expand="handleNodeExpand"
    />
    <div v-if="isEmpty" :class="ns.e('empty-block')">
      <span :class="ns.e('empty-text')">{{
        emptyText ?? t("el.tree.emptyText")
      }}</span>
    </div>
    <div
      v-show="dragState.showDropIndicator"
      ref="dropIndicator$"
      :class="ns.e('drop-indicator')"
    />
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  provide,
  ref,
  watch,
} from "vue";
import { useLocale, useNamespace } from "@element-plus/hooks";
import { formItemContextKey } from "@element-plus/tokens";
import TreeStore from "./model/tree-store";
import { getNodeKey as getNodeKeyUtil } from "./model/util";
import ElTreeNode from "./tree-node";
import { useNodeExpandEventBroadcast } from "./model/useNodeExpandEventBroadcast";
import { useDragNodeHandler } from "./model/useDragNode";
import { useKeydown } from "./model/useKeydown";

export default defineComponent({
  components: { ElTreeNode },
  props: {
    /** {array} tree data */
    data: {
      type: Array,
      default: () => [],
    },
    /** {string} Текст, отображаемый при отсутствии данных */
    emptyText: {
      type: String,
    },
    /** {string} Уникальное имя ключа идентификации для узлов, его значение должно быть уникальным по всему дереву */
    nodeKey: String,
    /** {boolean} Следует ли отображать дочерние узлы только после первого расширения родительского узла */
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    /**
     * {function(node, resolve)}
     * Метод загрузки данных поддерева, работает только при значении lazy true
     */
    load: Function,
    /**
     * {Function(h, { node, data, store })}
     * Функция рендеринга для узла дерева
     */
    renderContent: Function,
    /** {boolean} Выделен ли текущий узел */
    highlightCurrent: Boolean,
    /** {boolean} Следует ли развертывать все узлы по умолчанию */
    defaultExpandAll: Boolean,
    /**
     * {boolean}
     * Следует ли разворачивать или сворачивать узел при нажатии на узел,
     * если false, то разворачивать или сворачивать узел только при нажатии на значок стрелки.
     */
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    /**
     * {boolean}
     * следует ли проверять или снимать флажок с узла при нажатии на узел,
     * если значение false, узел можно проверить или снять, только нажав на флажок.
     */
    checkOnClickNode: Boolean,
    /** Следует ли расширять исходный узел при развертывании дочернего узла*/
    autoExpandParent: {
      type: Boolean,
      default: true,
    },
    /** {array} массив ключей изначально развернутых узлов */
    defaultExpandedKeys: Array,
    /** {boolean} можно ли выбрать узел */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * {boolean}
     * Влияет ли проверенное состояние узла на его отцовские и дочерние узлы,
     * когда show-checkbox true
     */
    checkStrictly: Boolean,
    /**
     * {array}
     * Массив ключей изначально проверенных узлов
     */
    defaultCheckedKeys: Array,
    /** {string, number} Ключ изначально выбранного узла */
    currentNodeKey: [String, Number],
    /**
     * {Function(value, data, node)}
     * Эта функция будет выполняться на каждом узле при использовании метода фильтра.
     * Если возвращается false, узел дерева будет скрыт.
     */
    filterNodeMethod: Function,
    /** {boolean} Может ли одновременно быть развернут только один узел на одном уровне */
    accordion: Boolean,
    /** {number} Горизонтальный отступ узлов на смежных уровнях в пикселях */
    indent: {
      type: Number,
      default: 18,
    },
    /** {string / Component} Настраиваемый компонент значка узла дерева */
    icon: [String, Object],
    /** {boolean} Можно ли лениво загружать листовой узел, используемый с атрибутом load */
    lazy: {
      type: Boolean,
      default: false,
    },
    /** Включить ли перетаскивание узлов дерева */
    draggable: {
      type: Boolean,
      default: false,
    },

    /**
     * {Function(node)}
     * Эта функция будет выполнена перед перетаскиванием узла.
     * Если возвращается false, узел не может быть перетащен
     */
    allowDrag: Function,
    /**
     * {Function(draggingNode, dropNode, type)}
     * Эта функция будет выполнена до того, как перетащите перетаскивающий узел.
     * Если возвращается false, перетаскивающий узел не может быть отброшен на целевой узел.
     * Type имеет три возможных значения:
     * 'prev' (вставка узла перетаскивания перед целевым узлом),
     * 'inner' (вставка перетаскивающего узла в целевой узел),
     * 'next' (вставка узла перетаскивания после целевого узла)
     */
    allowDrop: Function,
    /**
     * -----------
     * проверьте потомков
     */
    checkDescendants: {
      type: Boolean,
      default: false,
    },

    /**
     * label: string, function(data, node)
     * Укажите, какой ключ объекта узла используется в качестве метки узла
     *
     * children: string
     * Укажите, какой объект узла используется в качестве поддерева узла
     *
     * disabled: string, function(data, node)
     * Укажите, какой ключ представляет объект узла, если флажок узла отключен
     *
     * isLeaf: string, function(data, node)
     * Укажите, является ли узел конечным узлом, работает только при включенной отложенной загрузке
     *
     * class: string, function(data, node)
     * имя пользовательского класса узла
     */
    props: {
      type: Object,
      default: () => ({
        children: "children",
        label: "label",
        disabled: "disabled",
      }),
    },
  },
  emits: [
    "check-change",
    "current-change",
    "node-click",
    "node-contextmenu",
    "node-collapse",
    "node-expand",
    "check",
    "node-drag-start",
    "node-drag-end",
    "node-drop",
    "node-drag-leave",
    "node-drag-enter",
    "node-drag-over",
  ],
  setup(props, ctx) {
    const { t } = useLocale();
    const ns = useNamespace("tree");

    const store =
      ref <
      TreeStore >
      new TreeStore({
        key: props.nodeKey,
        data: props.data,
        lazy: props.lazy,
        props: props.props,
        load: props.load,
        currentNodeKey: props.currentNodeKey,
        checkStrictly: props.checkStrictly,
        checkDescendants: props.checkDescendants,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
        filterNodeMethod: props.filterNodeMethod,
      });

    store.value.initialize();

    const root = ref(store.value.root);
    const currentNode = ref(null);
    const el$ = ref(null);
    const dropIndicator$ = ref(null);

    const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

    const { dragState } = useDragNodeHandler({
      props,
      ctx,
      el$,
      dropIndicator$,
      store,
    });

    useKeydown({ el$ }, store);

    const isEmpty = computed(() => {
      const { childNodes } = root.value;
      return (
        !childNodes ||
        childNodes.length === 0 ||
        childNodes.every(({ visible }) => !visible)
      );
    });

    watch(
      () => props.defaultCheckedKeys,
      (newVal) => {
        store.value.setDefaultCheckedKey(newVal);
      }
    );

    watch(
      () => props.defaultExpandedKeys,
      (newVal) => {
        store.value.setDefaultExpandedKeys(newVal);
      }
    );

    watch(
      () => props.data,
      (newVal) => {
        store.value.setData(newVal);
      },
      { deep: true }
    );

    watch(
      () => props.checkStrictly,
      (newVal) => {
        store.value.checkStrictly = newVal;
      }
    );

    const filter = (value) => {
      if (!props.filterNodeMethod)
        throw new Error("[Tree] filterNodeMethod is required when filter");
      store.value.filter(value);
    };

    /**
     * @param {Node} node
     * @returns {TreeNodeData.$treeNodeId|*}
     */
    const getNodeKey = (node) => {
      return getNodeKeyUtil(props.nodeKey, node.data);
    };

    /**
     * @param {TreeKey | TreeNodeData} data
     */
    const getNodePath = (data) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in getNodePath");
      const node = store.value.getNode(data);
      if (!node) return [];
      const path = [node.data];
      let parent = node.parent;
      while (parent && parent !== root.value) {
        path.push(parent.data);
        parent = parent.parent;
      }
      return path.reverse();
    };

    /**
     *
     * @param {boolean | null} leafOnly
     * @param {boolean | null} includeHalfChecked
     * @return {TreeNodeData[]}
     */
    const getCheckedNodes = (leafOnly = null, includeHalfChecked = null) => {
      return store.value.getCheckedNodes(leafOnly, includeHalfChecked);
    };

    /**
     * @param {boolean | null} leafOnly
     * @return {TreeKey[]}
     */
    const getCheckedKeys = (leafOnly = null) => {
      return store.value.getCheckedKeys(leafOnly);
    };

    /**
     * @return {TreeNodeData}
     */
    const getCurrentNode = () => {
      const currentNode = store.value.getCurrentNode();
      return currentNode ? currentNode.data : null;
    };

    /**
     * @return {*}
     */
    const getCurrentKey = () => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in getCurrentKey");
      const currentNode = getCurrentNode();
      return currentNode ? currentNode[props.nodeKey] : null;
    };

    /**
     * @param {Node[]} nodes
     * @param {boolean | null} leafOnly
     */
    const setCheckedNodes = (nodes, leafOnly = null) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCheckedNodes");
      store.value.setCheckedNodes(nodes, leafOnly);
    };

    /**
     * @param keys
     * @param {boolean | null} leafOnly
     */
    const setCheckedKeys = (keys, leafOnly = null) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCheckedKeys");
      store.value.setCheckedKeys(keys, leafOnly);
    };

    /**
     * @param {TreeKey | TreeNodeData} data
     * @param {boolean} checked
     * @param {boolean} deep
     */
    const setChecked = (data, checked, deep) => {
      store.value.setChecked(data, checked, deep);
    };

    /**
     * @return {TreeNodeData[]}
     */
    const getHalfCheckedNodes = () => {
      return store.value.getHalfCheckedNodes();
    };

    /**
     * @return {TreeKey[]}
     */
    const getHalfCheckedKeys = () => {
      return store.value.getHalfCheckedKeys();
    };

    /**
     * @param {Node} node
     * @param {boolean} shouldAutoExpandParent
     */
    const setCurrentNode = (node, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCurrentNode");
      store.value.setUserCurrentNode(node, shouldAutoExpandParent);
    };

    /**
     *
     * @param {TreeKey} key
     * @param {boolean} shouldAutoExpandParent
     */
    const setCurrentKey = (key, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in setCurrentKey");
      store.value.setCurrentNodeKey(key, shouldAutoExpandParent);
    };

    /**
     * @param {TreeKey | TreeNodeData} data
     * @return {Node}
     */
    const getNode = (data) => {
      return store.value.getNode(data);
    };

    /**
     * @param {TreeNodeData | Node} data
     */
    const remove = (data) => {
      store.value.remove(data);
    };

    /**
     * @param {TreeNodeData} data
     * @param {TreeNodeData | TreeKey | Node} parentNode
     */
    const append = (data, parentNode) => {
      store.value.append(data, parentNode);
    };

    /**
     * @param {TreeNodeData} data
     * @param {TreeKey | TreeNodeData} refNode
     */
    const insertBefore = (data, refNode) => {
      store.value.insertBefore(data, refNode);
    };

    /**
     *
     * @param {TreeNodeData} data
     * @param {TreeKey | TreeNodeData} refNode
     */
    const insertAfter = (data, refNode) => {
      store.value.insertAfter(data, refNode);
    };

    /**
     * @param {TreeNodeData} nodeData
     * @param {Node} node
     * @param {ComponentInternalInstance} instance
     */
    const handleNodeExpand = (nodeData, node, instance) => {
      broadcastExpanded(node);
      ctx.emit("node-expand", nodeData, node, instance);
    };

    /**
     * @param {TreeKey} key
     * @param {TreeData} data
     */
    const updateKeyChildren = (key, data) => {
      if (!props.nodeKey)
        throw new Error("[Tree] nodeKey is required in updateKeyChild");
      store.value.updateChildren(key, data);
    };

    provide("RootTree", {
      ctx,
      props,
      store,
      root,
      currentNode,
      instance: getCurrentInstance(),
    });

    provide(formItemContextKey, undefined);

    return {
      ns,
      // ref
      store,
      root,
      currentNode,
      dragState,
      el$,
      dropIndicator$,

      // computed
      isEmpty,

      // methods
      filter,
      getNodeKey,
      getNodePath,
      getCheckedNodes,
      getCheckedKeys,
      getCurrentNode,
      getCurrentKey,
      setCheckedNodes,
      setCheckedKeys,
      setChecked,
      getHalfCheckedNodes,
      getHalfCheckedKeys,
      setCurrentNode,
      setCurrentKey,
      t,
      getNode,
      remove,
      append,
      insertBefore,
      insertAfter,
      handleNodeExpand,
      updateKeyChildren,
    };
  },
});
</script>
