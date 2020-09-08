import AsciiTree from "oo-ascii-tree";

const formatted = tree => `\n${tree.toString()}`;

function treeGraph(messages) {
  const [root, ...rest] = messages;
  return root
    ? new AsciiTree.AsciiTree(root, treeGraph(rest))
    : new AsciiTree.AsciiTree();
}

export { treeGraph, formatted };
