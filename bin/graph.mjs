import AsciiTree from "oo-ascii-tree";

export default function graph(data) {
  const [root, ...rest] = data;
  return root
    ? new AsciiTree.AsciiTree(root, graph(rest))
    : new AsciiTree.AsciiTree();
}
