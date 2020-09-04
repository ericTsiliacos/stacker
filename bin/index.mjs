#!/usr/bin/env node

import program from "commander";
import { writeFile, readFile } from "fs/promises";
import colors from "colors/safe.js";
import AsciiTree from "oo-ascii-tree";
import { mapResult, either } from "./result.mjs";
import { AsyncIO, liftF, props, pipe } from "./async_io.mjs";

program.command("push <message>").action(async message => {
  try {
    const data = await storage();

    await writeFile(storageFileName(), JSON.stringify([message, ...data]));
  } catch (error) {
    console.log(error);
  }
});

program.command("init").action(reset);

program.command("clear").action(reset);

const emptyMessage = () => colors.red("Nothing to see here!");

const initializeMessage = () =>
  colors.red("Please, initialize stacker: stacker init");

const latestMessage = message => (message ? `🆕 ${message}` : emptyMessage());

const peek = (getStorage, display) =>
  getStorage()
    .then(mapResult(props(0)))
    .then(pipe(either(initializeMessage, latestMessage), display));

program
  .command("peek")
  .action(() => peek(AsyncIO.from(getStorage), liftF(console.log)).run());

program.command("pop").action(async () => {
  const [head, ...rest] = await storage();

  if (!head) return console.log(colors.red("Nothing to pop!"));

  try {
    await writeFile(storageFileName(), JSON.stringify(rest));
    console.log(`✅ ${head}`);

    if (rest.length === 0) {
      console.log(`\n🎉 ${colors.rainbow("All done!")} 🎉`);
    } else {
      const [next] = rest;
      console.log(`\n⏭️  ${next}`);
    }
  } catch (err) {
    console.error(err);
  }
});

program.command("stack").action(displayStack);

async function displayStack() {
  try {
    const [head, ...rest] = await storage();

    if (!head) return;

    const data = [`🆕 ${head}`, ...rest];
    const tree = buildTreeGraph(data);
    console.log(`\n${tree.toString()}`);
  } catch (err) {
    console.error(colors.red("Please, initialize stacker: stacker init"));
  }
}

program.parse(process.argv);

if (process.argv.length < 3) {
  displayStack();
}

function buildTreeGraph(messages) {
  const [root, ...rest] = messages;
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

async function getStorage() {
  return readFile(storageFileName()).then(data => JSON.parse(data));
}

function storageFileName() {
  return `${cwd()}/.stacker.json`;
}

function cwd() {
  return process.cwd();
}
