import { Node } from './node'
import { getNodeKey } from './util'
import { hasOwn, isObject } from '@vue/shared'

export default class TreeStore {
    /** @type {Node}*/
    currentNode
    /** @type {TreeKey}*/
    currentNodeKey
    /** @type {TreeStoreNodesMap}*/
    nodesMap
    /** @type {Node}*/
    root
    /** @type {TreeData}*/
    data
    /** @type {boolean} */
    lazy
    /** @type {LoadFunction}*/
    load
    /** @type {FilterNodeMethodFunction}*/
    filterNodeMethod
    /** @type {TreeKey} */
    key
    /** @type {TreeKey[]} */
    defaultCheckedKeys
    /** @type {boolean} */
    checkStrictly
    /** @type {TreeKey[]} */
    defaultExpandedKeys
    /** @type {boolean} */
    autoExpandParent
    /** @type {boolean} */
    defaultExpandAll
    /** @type {boolean} */
    checkDescendants
    /** @type {TreeOptionProps} */
    props

    /**
     * @param {TreeStoreOptions} options
     */
    constructor(options) {
        this.currentNode = null
        this.currentNodeKey = null

        for (const option in options) {
            if (hasOwn(options, option)) {
                this[option] = options[option]
            }
        }

        this.nodesMap = {}
    }

    initialize() {
        this.root = new Node({
            data: this.data,
            store: this,
        })
        this.root.initialize()

        if (this.lazy && this.load) {
            const loadFn = this.load

            loadFn(this.root, (data) => {
                this.root.doCreateChildren(data)
                this._initDefaultCheckedNodes()
            })
        } else {
            this._initDefaultCheckedNodes()
        }
    }

    /**
     * @param {FilterValue} value
     */
    filter(value) {
        const filterNodeMethod = this.filterNodeMethod
        const lazy = this.lazy
        const traverse = function (node) {
            const childNodes = node.root ? node.root.childNodes : node.childNodes

            childNodes.forEach((child) => {
                child.visible = filterNodeMethod.call(child, value, child.data, child)

                traverse(child)
            })

            if (!node.visible && childNodes.length) {
                let allHidden = true
                allHidden = !childNodes.some((child) => child.visible)

                if (node.root) {
                    node.root.visible = allHidden === false
                } else {
                    node.visible = allHidden === false
                }
            }
            if (!value) return

            if (node.visible && !node.isLeaf && !lazy) node.expand()
        }

        traverse(this)
    }

    /**
     * @param {TreeData} newVal
     */
    setData(newVal) {
        const instanceChanged = newVal !== this.root.data

        if (instanceChanged) {
            this.root.setData(newVal)
            this._initDefaultCheckedNodes()
        } else {
            this.root.updateChildren()
        }
    }

    /**
     *
     * @param {TreeKey | TreeNodeData} data
     * @return {TreeKey|TreeNodeData|Node|null}
     */
    getNode(data) {
        if (data instanceof Node) {
            return data
        }

        const key = isObject(data) ? getNodeKey(this.key, data) : data

        return this.nodesMap[key] || null
    }

    /**
     *
     * @param {TreeNodeData} data
     * @param {TreeKey | TreeNodeData} refData
     */
    insertBefore(data, refData) {
        const refNode = this.getNode(refData)
        refNode.parent.insertBefore({ data }, refNode)
    }

    /**
     *
     * @param {TreeNodeData} data
     * @param {TreeKey | TreeNodeData} refData
     */
    insertAfter(data, refData) {
        const refNode = this.getNode(refData)
        refNode.parent.insertAfter({ data }, refNode)
    }

    /**
     * @param {TreeNodeData | Node} data
     */
    remove(data) {
        const node = this.getNode(data)

        if (node && node.parent) {
            if (node === this.currentNode) {
                this.currentNode = null
            }
            node.parent.removeChild(node)
        }
    }

    /**
     * @param {TreeNodeData} data
     * @param {TreeNodeData | TreeKey | Node} parentData
     */
    append(data, parentData) {
        const parentNode = parentData ? this.getNode(parentData) : this.root

        if (parentNode) {
            parentNode.insertChild({ data })
        }
    }

    _initDefaultCheckedNodes() {
        const defaultCheckedKeys = this.defaultCheckedKeys || []
        const nodesMap = this.nodesMap

        defaultCheckedKeys.forEach((checkedKey) => {
            const node = nodesMap[checkedKey]

            if (node) {
                node.setChecked(true, !this.checkStrictly)
            }
        })
    }

    /**
     * @param {Node} node
     * @private
     */
    _initDefaultCheckedNode(node) {
        const defaultCheckedKeys = this.defaultCheckedKeys || []

        if (defaultCheckedKeys.includes(node.key)) {
            node.setChecked(true, !this.checkStrictly)
        }
    }

    /**
     * @param {TreeKey[]} newVal
     */
    setDefaultCheckedKey(newVal) {
        if (newVal !== this.defaultCheckedKeys) {
            this.defaultCheckedKeys = newVal
            this._initDefaultCheckedNodes()
        }
    }

    /**
     * @param {Node} node
     */
    registerNode(node) {
        const key = this.key
        if (!node || !node.data) return

        if (!key) {
            this.nodesMap[node.id] = node
        } else {
            const nodeKey = node.key

            if (nodeKey !== undefined) {
                this.nodesMap[node.key] = node
            }
        }
    }

    /**
     * @param {Node} node
     */
    deregisterNode(node) {
        const key = this.key

        if (!key || !node || !node.data) {
            return
        }

        node.childNodes.forEach((child) => {
            this.deregisterNode(child)
        })

        delete this.nodesMap[node.key]
    }

    /**
     * @param {boolean} leafOnly
     * @param {boolean} includeHalfChecked
     * @return {TreeNodeData[]}
     */
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
        const checkedNodes = []
        const traverse = function (node) {
            const childNodes = node.root ? node.root.childNodes : node.childNodes

            childNodes.forEach((child) => {
                if ((child.checked || (includeHalfChecked && child.indeterminate)) && (!leafOnly || (leafOnly && child.isLeaf))) {
                    checkedNodes.push(child.data)
                }

                traverse(child)
            })
        }

        traverse(this)

        return checkedNodes
    }

    /**
     * @param leafOnly
     * @return {TreeKey[]}
     */
    getCheckedKeys(leafOnly = false) {
        return this.getCheckedNodes(leafOnly).map((data) => (data || {})[this.key])
    }

    /**
     * @return {TreeNodeData[]}
     */
    getHalfCheckedNodes() {
        const nodes = []
        const traverse = function (node) {
            const childNodes = node.root ? node.root.childNodes : node.childNodes

            childNodes.forEach((child) => {
                if (child.indeterminate) {
                    nodes.push(child.data)
                }

                traverse(child)
            })
        }

        traverse(this)

        return nodes
    }

    /**
     * @return {TreeKey[]}
     */
    getHalfCheckedKeys() {
        return this.getHalfCheckedNodes().map((data) => (data || {})[this.key])
    }

    /**
     * @return {Node[]}
     * @private
     */
    _getAllNodes() {
        /** @type {Node[]}*/
        const allNodes = []
        const nodesMap = this.nodesMap
        for (const nodeKey in nodesMap) {
            if (hasOwn(nodesMap, nodeKey)) {
                allNodes.push(nodesMap[nodeKey])
            }
        }

        return allNodes
    }

    /**
     *
     * @param {TreeKey} key
     * @param {TreeData} data
     */
    updateChildren(key, data) {
        const node = this.nodesMap[key]

        if (!node) {
            return
        }

        const childNodes = node.childNodes

        for (let i = childNodes.length - 1; i >= 0; i--) {
            const child = childNodes[i]
            this.remove(child.data)
        }

        for (let i = 0, j = data.length; i < j; i++) {
            const child = data[i]
            this.append(child, node.data)
        }
    }

    /**
     *
     * @param {TreeKey} key
     * @param  {boolean} leafOnly
     * @param {{ [key: string]: boolean }} checkedKeys
     * @private
     */
    _setCheckedKeys(key, leafOnly = false, checkedKeys) {
        const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level)
        const cache = Object.create(null)
        const keys = Object.keys(checkedKeys)

        allNodes.forEach((node) => node.setChecked(false, false))

        for (let i = 0, j = allNodes.length; i < j; i++) {
            const node = allNodes[i]
            const nodeKey = node.data[key].toString()
            const checked = keys.includes(nodeKey)

            if (!checked) {
                if (node.checked && !cache[nodeKey]) {
                    node.setChecked(false, false)
                }
                continue
            }

            let parent = node.parent

            while (parent && parent.level > 0) {
                cache[parent.data[key]] = true
                parent = parent.parent
            }

            if (node.isLeaf || this.checkStrictly) {
                node.setChecked(true, false)
                continue
            }

            node.setChecked(true, true)

            if (leafOnly) {
                node.setChecked(false, false)
                const traverse = function (node) {
                    const childNodes = node.childNodes
                    childNodes.forEach((child) => {
                        if (!child.isLeaf) {
                            child.setChecked(false, false)
                        }
                        traverse(child)
                    })
                }
                traverse(node)
            }
        }
    }

    /**
     * @param {Node[]} array
     * @param {boolean} leafOnly
     */
    setCheckedNodes(array, leafOnly = false) {
        const key = this.key
        const checkedKeys = {}

        array.forEach((item) => {
            checkedKeys[(item || {})[key]] = true
        })

        this._setCheckedKeys(key, leafOnly, checkedKeys)
    }

    /**
     * @param {TreeKey[]} keys
     * @param leafOnly
     */
    setCheckedKeys(keys, leafOnly = false) {
        this.defaultCheckedKeys = keys
        const key = this.key
        const checkedKeys = {}
        keys.forEach((key) => {
            checkedKeys[key] = true
        })

        this._setCheckedKeys(key, leafOnly, checkedKeys)
    }

    /**
     * @param {TreeKey[]} keys
     */
    setDefaultExpandedKeys(keys) {
        keys = keys || []
        this.defaultExpandedKeys = keys
        keys.forEach((key) => {
            const node = this.getNode(key)
            if (node) node.expand(null, this.autoExpandParent)
        })
    }

    /**
     * @param {TreeKey | TreeNodeData} data
     * @param {boolean} checked
     * @param {boolean} deep
     */
    setChecked(data, checked, deep) {
        const node = this.getNode(data)

        if (node) {
            node.setChecked(!!checked, deep)
        }
    }

    /**
     * @return {Node}
     */
    getCurrentNode() {
        return this.currentNode
    }

    /**
     * @param {Node} currentNode
     */
    setCurrentNode(currentNode) {
        const prevCurrentNode = this.currentNode

        if (prevCurrentNode) {
            prevCurrentNode.isCurrent = false
        }

        this.currentNode = currentNode
        this.currentNode.isCurrent = true
    }

    /**
     * @param {Node} node
     * @param {boolean} shouldAutoExpandParent
     */
    setUserCurrentNode(node, shouldAutoExpandParent = true) {
        const key = node[this.key]
        const currNode = this.nodesMap[key]
        this.setCurrentNode(currNode)

        if (shouldAutoExpandParent && this.currentNode.level > 1) {
            this.currentNode.parent.expand(null, true)
        }
    }

    /**
     * @param {TreeKey} key
     * @param shouldAutoExpandParent
     */
    setCurrentNodeKey(key, shouldAutoExpandParent = true) {
        if (key === null || key === undefined) {
            this.currentNode && (this.currentNode.isCurrent = false)
            this.currentNode = null

            return
        }

        const node = this.getNode(key)

        if (node) {
            this.setCurrentNode(node)

            if (shouldAutoExpandParent && this.currentNode.level > 1) {
                this.currentNode.parent.expand(null, true)
            }
        }
    }
}
