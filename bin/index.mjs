#!/usr/bin/env node

import program from "commander";
import { writeFile, readFile } from "fs/promises";
import colors from "colors/safe.js";
import AsciiTree from "oo-ascii-tree";
import { mapResult, either } from "./result.mjs";
import { from, liftF, props, pipe } from "./async_io.mjs";

const log = console.log;

const initializeMessage = () =>
  colors.red("Please, initialize stacker: stacker init");

const push = message => stack => [message, ...stack];

const writeData = data => writeFile(storageFileName(), JSON.stringify(data));

program.command("push <message>").action(async message => {
  from(getStorage)()
    .then(
      either(
        pipe(initializeMessage, liftF(log)),
        pipe(push(message), liftF(writeData))
      )
    )
    .run();
});

program.command("init").action(reset);

program.command("clear").action(reset);

const emptyMessage = () => colors.red("Nothing to see here!");

const latestMessage = message => (message ? `🆕 ${message}` : emptyMessage());

program.command("peek").action(() =>
  from(getStorage)()
    .then(mapResult(props(0)))
    .then(pipe(either(initializeMessage, latestMessage), liftF(log)))
    .run()
);

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
