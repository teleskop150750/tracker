<template>
    <li
        class="v-tree-node"
        :class="containerClasses"
        role="treeitem"
        :aria-label="label(node)"
        :aria-expanded="expanded"
        :aria-setsize="node.children ? node.children.length : 0"
        :aria-posinset="index + 1"
        :aria-level="level"
    >
        <button
            class="v-tree-node-content"
            tabindex="0"
            :aria-expanded="expanded"
            @click="onClick"
            @touchend="onTouchEnd"
            @keydown.self="onKeyDown"
            :style="{ '--level': level }"
            type="button"
        >
            <button class="v-tree-toggler" @click="toggle" type="button" tabindex="-1" aria-label="toggler">
                <component :is="toggleIcon"></component>
            </button>
            <span class="v-tree-node-content__label">
                <component
                    :is="templates[node.type] || templates['default']"
                    :node="node"
                    v-if="templates[node.type] || templates['default']"
                />
                <template v-else>{{ label(node) }}</template>
            </span>
        </button>
        <ul class="v-tree-node-children" role="group" v-if="hasChildren && expanded">
            <VTreeNode
                v-for="childNode of node.children"
                :key="childNode[nodeKey]"
                :node="childNode"
                :templates="templates"
                :level="level + 1"
                :expandedKeys="expandedKeys"
                @node-toggle="onChildNodeToggle"
                @node-click="onChildNodeClick"
            />
        </ul>
    </li>
</template>

<script>
import VArrowDownIcon from '../../icons/VArrowDownIcon'
import VArrowRightIcon from '../../icons/VArrowRightIcon'

export default {
    components: {
        VArrowDownIcon,
        VArrowRightIcon,
    },
    emits: ['node-toggle', 'node-click'],
    props: {
        nodeKey: {
            type: [String, Number],
            default: 'id',
        },
        node: {
            type: null,
            default: null,
        },
        expandedKeys: {
            type: null,
            default: null,
        },
        templates: {
            type: null,
            default: null,
        },
        level: {
            type: Number,
            default: null,
        },
        index: {
            type: Number,
            default: null,
        },
    },
    nodeTouched: false,
    methods: {
        toggle() {
            this.$emit('node-toggle', this.node)
        },
        label(node) {
            return typeof node.label === 'function' ? node.label() : node.label
        },
        onChildNodeToggle(node) {
            this.$emit('node-toggle', node)
        },
        onClick(event) {
            if (event.target.classList.contains('v-tree-toggler') || event.target.parentElement.classList.contains('v-tree-toggler')) {
                return
            }

            this.$emit('node-click', {
                originalEvent: event,
                nodeTouched: this.nodeTouched,
                node: this.node,
            })
            this.nodeTouched = false
        },

        onChildNodeClick(event) {
            this.$emit('node-click', event)
        },

        onTouchEnd() {
            this.nodeTouched = true
        },

        onKeyDown(event) {
            const nodeElement = event.target.parentElement
            const code = event.code

            if (code === 'ArrowDown') {
                const listElement = nodeElement.children[1]

                if (listElement && listElement.children[0]) {
                    return this.focusNode(listElement.children[0])
                }

                const nextNodeElement = nodeElement.nextElementSibling

                if (nextNodeElement) {
                    return this.focusNode(nextNodeElement)
                }

                const nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement)

                if (nextSiblingAncestor) {
                    return this.focusNode(nextSiblingAncestor)
                }
            }

            if (code === 'ArrowUp') {
                const previousElement = nodeElement.previousElementSibling

                if (previousElement) {
                    return this.focusNode(this.findLastVisibleDescendant(previousElement))
                }
                const parentNodeElement = this.getParentNodeElement(nodeElement)

                if (parentNodeElement) {
                    return this.focusNode(parentNodeElement)
                }
            }

            if (code === 'ArrowRight' || code === 'ArrowLeft') {
                return this.$emit('node-toggle', this.node)
            }

            if (code === 'Enter' || code === 'Space') {
                return this.onClick(event)
            }
        },
        findNextSiblingOfAncestor(nodeElement) {
            let parentNodeElement = this.getParentNodeElement(nodeElement)

            if (parentNodeElement) {
                if (parentNodeElement.nextElementSibling) {
                    return parentNodeElement.nextElementSibling
                }

                return this.findNextSiblingOfAncestor(parentNodeElement)
            }

            return null
        },
        findLastVisibleDescendant(nodeElement) {
            const childrenListElement = nodeElement.children[1]

            if (childrenListElement) {
                const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1]

                return this.findLastVisibleDescendant(lastChildElement)
            }

            return nodeElement
        },
        getParentNodeElement(nodeElement) {
            const parentNodeElement = nodeElement.parentElement.parentElement

            return parentNodeElement.classList.contains('v-tree-node') ? parentNodeElement : null
        },
        focusNode(element) {
            element.children[0].focus()
        },
    },
    computed: {
        hasChildren() {
            return this.node.children && this.node.children.length > 0
        },
        expanded() {
            return this.expandedKeys && this.expandedKeys[this.node.key] === true
        },
        leaf() {
            if (this.node.leaf === false) {
                return false
            }

            return !(this.node.children && this.node.children.length)
        },
        toggleIcon() {
            return this.expanded ? VArrowDownIcon : VArrowRightIcon
        },
        containerClasses() {
            return { 'v-tree-node-leaf': this.leaf }
        },
    },
}
</script>

<style>
.v-tree-toggler svg {
    pointer-events: none;
}
</style>
