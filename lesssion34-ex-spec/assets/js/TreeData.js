export class TreeData {
    constructor(root, data) {
        this.root = new TreeNode(root, data, null);
    }
    setData(newNode, data) {
        var parent = this.searchDirectParentOrNodeSelf(newNode);
        if (parent.node === newNode) {
            return;
        }
        parent.children.push(new TreeNode(newNode, data, parent));
    }
    alterData(node, data) {
        if (data === undefined)
            return node;
        var cur = this.searchDirectParentOrNodeSelf(node);
        while (true) {
            var nodeData = cur.getData();
            for (var key in nodeData) {
                if (key in data) {
                    if (Array.isArray(nodeData[key])) {
                        var oldArr = nodeData[key];
                        var diffObj = data[key];
                        for (const k2 in diffObj) {
                            if (diffObj[k2][1] === undefined) {
                                // remove
                                oldArr.splice(k2, 1);
                            }
                            else if (diffObj[k2][0] === undefined) {
                                // add
                                oldArr[k2] = diffObj[k2][1];
                            }
                            else {
                                // inplace
                                oldArr[k2] = diffObj[k2][1];
                            }
                        }
                    }
                    else if (typeof nodeData[key] === 'object') {
                        throw new Error("Method not implemented Error");
                    }
                    else {
                        var newData = data[key][1];
                        nodeData[key] = newData;
                    }
                    delete data[key];
                }
            }
            if (Object.keys(data).length && cur.parent) {
                cur = cur.parent;
            }
            else {
                break;
            }
        }
        return cur.node;
    }
    getDataByNode(node) {
        var cur = this.root;
        var res = Object.assign({}, cur.getData());
        while (true) {
            var parent = cur.children.find(child => child.containsNode(node));
            if (!parent) {
                break;
            }
            cur = parent;
            Object.assign(res, cur.getData());
        }
        return res;
    }
    deleteChildrenTreeNodeByNode(node) {
        var cur = this.searchDirectParentOrNodeSelf(node);
        if (cur.node == node) {
            cur.children = [];
        }
    }
    searchDirectParentOrNodeSelf(node) {
        var cur = this.root;
        while (true) {
            var child = cur.children.find(child => child.containsNode(node) || child.node === node);
            if (child == null) {
                break;
            }
            cur = child;
            if (cur.node === node) {
                break;
            }
        }
        return cur;
    }
}
export class TreeNode {
    constructor(node, data, parent) {
        this.node = node;
        this.data = data;
        this.children = [];
        this.parent = parent;
    }
    containsNode(node) {
        return this.node.contains(node);
    }
    getData() {
        return this.data;
    }
}
