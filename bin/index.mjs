#!/usr/bin/env node

import program from "commander";
import AsciiTree from "oo-ascii-tree";
import json from "./adapters/json.mjs";
import fileSystem from "./adapters/fileSystem.mjs";
import { writeFile, readFile } from "fs/promises";
import { mapResult, either, or } from "./fp/result.mjs";
import { maybe, orJust, forMaybeIndex } from "./fp/maybe.mjs";
import { asynchronously, liftF } from "./fp/async_io.mjs";
import { pipe, into, an } from "./fp/pipe.mjs";
import { uninitialization, emptyStack } from "./copy.mjs";
import { error, latest } from "./styles.mjs";
import { additional, initial } from "./domain/stack.mjs";
import { get, write } from "./repository.mjs";

const displayTerminal = liftF(console.log);

program.command("push <message>").action(async message => {
  asynchronously(get)(json(), { from: fileSystem({ at: filePath() }) })
    .then(
      either(
        pipe(uninitialization, error, into(displayTerminal)),
        or(
          liftF(
            write(additional(message), json(), {
              to: fileSystem({ at: filePath() }),
            })
          )
        )
      )
    )
    .run();
});

const reset = write(initial, json(), { to: fileSystem({ at: filePath() }) });

program.command("init").action(reset);

program.command("clear").action(reset);

program.command("peek").action(() =>
  asynchronously(get)(json(), { from: fileSystem({ at: filePath() }) })
    .then(mapResult(forMaybeIndex(0)))
    .then(
      pipe(
        either(
          an(uninitialization, error),
          or(maybe(an(emptyStack, error), orJust(latest)))
        ),
        into(displayTerminal)
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
