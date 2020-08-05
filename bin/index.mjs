#!/usr/bin/env node

import commander from "commander";
import { writeFile, readFile } from "fs/promises";
import colors from "colors/safe.js";
import AsciiTree from "oo-ascii-tree";

commander.command("push <message>").action(async message => {
  try {
    const data = await storage();

    await writeFile(storageFileName(), JSON.stringify([message, ...data]));
  } catch (error) {
    console.log(error);
  }
});

commander.command("init").action(reset);

commander.command("clear").action(reset);

commander.command("peek").action(async () => {
  const [head] = await storage();

  if (!head) return console.log(colors.red("Nothing to see here!"));

  console.log(head);
});

commander.command("pop").action(async () => {
  const [head, ...rest] = await storage();

  if (!head) return console.log(colors.red("Nothing to pop!"));

  try {
    await writeFile(storageFileName(), JSON.stringify(rest));
    console.log(head);
  } catch (err) {
    console.error(err);
  }
});

commander.command("stack").action(async () => {
  const data = await storage();
  const tree = buildTreeGraph(data);
  console.log(tree.toString());
});

commander.parse(process.argv);

function buildTreeGraph(messages) {
  const [root, ...rest] = messages.reverse();
  return root
    ? new AsciiTree.AsciiTree(root, buildTreeGraph(rest))
    : new AsciiTree.AsciiTree();
}

async function reset() {
  await writeFile(storageFileName(), JSON.stringify([]));
}

async function storage() {
  const data = await readFile(storageFileName());
  return JSON.parse(data);
}

function storageFileName() {
  return `${cwd()}/.stacker.json`;
}

function cwd() {
  return process.cwd();
}
