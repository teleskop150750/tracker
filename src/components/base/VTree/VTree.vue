<template>
    <div class="v-tree">
        <div class="v-tree-wrapper">
            <ul class="v-tree-container" role="tree">
                <VTreeNode
                    v-for="(node, index) of valueToRender"
                    :key="node.key"
                    :node-key="nodeKey"
                    :node="node"
                    :templates="$slots"
                    :level="level + 1"
                    :index="index"
                    :expandedKeys="d_expandedKeys"
                    @node-toggle="onNodeToggle"
                ></VTreeNode>
            </ul>
        </div>
    </div>
</template>

<script>
import VTreeNode from './VTreeNode.vue'

export default {
    components: {
        VTreeNode: VTreeNode,
    },
    emits: ['node-expand', 'node-collapse', 'update:expandedKeys'],
    props: {
        nodeKey: {
            type: [String, Number],
            default: 'id',
        },
        value: {
            type: null,
            default: null,
        },
        expandedKeys: {
            type: null,
            default: null,
        },
        level: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            d_expandedKeys: this.expandedKeys || {},
            filterValue: null,
        }
    },
    watch: {
        expandedKeys(newValue) {
            this.d_expandedKeys = newValue
        },
    },
    methods: {
        onNodeToggle(node) {
            const key = node[this.nodeKey]

            if (this.d_expandedKeys[key]) {
                delete this.d_expandedKeys[key]
                this.$emit('node-collapse', node)
            } else {
                this.d_expandedKeys[key] = true
                this.$emit('node-expand', node)
            }

            this.d_expandedKeys = { ...this.d_expandedKeys }
            this.$emit('update:expandedKeys', this.d_expandedKeys)
        },
        isNodeLeaf(node) {
            return node.leaf === false ? false : !(node.children && node.children.length)
        },
    },
    computed: {
        valueToRender() {
            return this.value
        },
    },
}
</script>

<style>
.v-tree-container {
    margin: 0;
    padding: 0;

    list-style-type: none;

    overflow: auto;
}

.v-tree-node-children {
    margin: 0;
    padding: 0;

    list-style-type: none;
}

.v-tree-wrapper {
    overflow: auto;
}

.v-tree-toggler {
    position: relative;

    display: inline-flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;

    padding: 0;

    color: inherit;
    font: inherit;

    border: 0;

    background-color: transparent;

    cursor: pointer;

    overflow: hidden;

    user-select: none;
}

.v-tree-node-leaf > .v-tree-node-content .v-tree-toggler {
    visibility: hidden;
}

.v-tree-node-content {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    width: 100%;
    padding: 0.25rem 0.5rem;
    padding-left: calc((var(--level, 1) - 1) * 0.75rem + 0.5rem);

    color: var(--v-container-color-dark);
    font: inherit;
    font-size: 14px;

    border: 0;

    background-color: transparent;

    cursor: pointer;
}

.v-tree-node-content:hover {
    background-color: rgb(255 255 255 / 8%);
}

.v-tree-node-content:focus {
    outline: none;

    box-shadow: inset 0 0 0 3px rgb(162 142 255 / 65%);
}
</style>
