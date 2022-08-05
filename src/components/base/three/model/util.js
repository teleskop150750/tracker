export const NODE_KEY = "$treeNodeId";

/**
 * @param {Node} node
 * @param {TreeNodeData} data
 */
export const markNodeData = function (node, data) {
  if (!data || data[NODE_KEY]) {
    return;
  }

  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false,
  });
};

/**
 * @param {TreeKey} key
 * @param {TreeNodeData} data
 * @returns {TreeNodeData.$treeNodeId|*}
 */
export const getNodeKey = function (key, data) {
  if (!key) {
    return data[NODE_KEY];
  }

  return data[key];
};
