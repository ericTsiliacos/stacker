#!/usr/bin/env node

import program from "commander";
import { writeFile, readFile } from "fs/promises";
import AsciiTree from "oo-ascii-tree";
import { mapResult, either, or } from "./result.mjs";
import { Maybe, maybe, orJust } from "./maybe.mjs";
import { asyncio, liftF, props, pipe } from "./async_io.mjs";
import { uninitialization, emptyStack } from "./copy.mjs";
import { error, latest } from "./styles.mjs";
import { additional } from "./stack.mjs";
import { fileSystem } from "./fileSystem.mjs";

const forMaybeIndex = index => obj => Maybe(props(index)(obj));

const show = transform => value => liftF(console.log)(transform(value));

const get = parser => ({ from }) => () =>
  from.read().then(data => parser.parse(data));

const write = (dataTransformer, parser, { to }) => data =>
  liftF(to.write(parser.stringify(dataTransformer(data))));

program.command("push <message>").action(async message => {
  asyncio(get(JSON)({ from: fileSystem({ at: filePath() }) }))()
    .then(
      either(
        show(pipe(uninitialization, error)),
        or(
          write(additional(message), JSON, {
            to: fileSystem({ at: filePath() }),
          })
        )
      )
    )
    .run();
});

program.command("init").action(reset);

program.command("clear").action(reset);

program.command("peek").action(() =>
  asyncio(get(JSON)({ from: fileSystem({ at: filePath() }) }))()
    .then(mapResult(forMaybeIndex(0)))
    .then(
      show(
        either(
          pipe(uninitialization, error),
          or(maybe(pipe(emptyStack, error), orJust(latest)))
        )
      )
    )
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
  return readFile(storageFileName()).then(data => JSON.parse(data));
}

function storageFileName() {
  return `${cwd()}/.stacker.json`;
}

function filePath() {
  return `${cwd()}/.stacker.json`;
}

function cwd() {
  return process.cwd();
}
