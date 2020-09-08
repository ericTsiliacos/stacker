#!/usr/bin/env node

import program from "commander";
import { treeGraph, formatted } from "./adapters/tree.mjs";
import json from "./adapters/json.mjs";
import fileSystem from "./adapters/fileSystem.mjs";
import display from "./adapters/display.mjs";
import colors from "colors/safe.js";
import { compose, an } from "./fp/pipe.mjs";
import { writeFile, readFile } from "fs/promises";
import { either, or } from "./fp/result.mjs";
import { nonEmptyList, maybe, orJust, forMaybeIndex } from "./fp/maybe.mjs";
import { asynchronously, doNothing } from "./fp/async_io.mjs";
import { initialization, emptyStack } from "./copy.mjs";
import { error, newest, labelled } from "./styles.mjs";
import { additional, initial, whoseTopMessageIs } from "./domain/stack.mjs";
import { get, write } from "./repository.mjs";

const resetTo = write(json(), { to: fileSystem({ at: filePath() }) });

program.command("init").action(() => resetTo(initial()));

program.command("clear").action(() => resetTo(initial()));

program.command("push <message>").action(message => {
  asynchronously(get)(json(), { from: fileSystem({ at: filePath() }) })
    .map(additional(message))
    .then(
      either(
        display(an(initialization, error)),
        or(write(json(), { to: fileSystem({ at: filePath() }) }))
      )
    )
    .run();
});

program.command("peek").action(() =>
  asynchronously(get)(json(), { from: fileSystem({ at: filePath() }) })
    .map(forMaybeIndex(0))
    .then(
      display(
        either(
          an(initialization, error),
          or(maybe(an(emptyStack, error), orJust(labelled(newest))))
        )
      )
    )
    .run()
);

program.command("stack").action(displayStack);

function displayStack() {
  asynchronously(get)(json(), { from: fileSystem({ at: filePath() }) })
    .map(nonEmptyList)
    .then(
      either(
        display(an(initialization, error)),
        or(maybe)(
          doNothing,
          orJust(display)`\n${compose(
            formatted,
            treeGraph,
            whoseTopMessageIs(labelled(newest))
          )}`
        )
      )
    )
    .run();
}

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

program.parse(process.argv);

if (process.argv.length < 3) {
  displayStack();
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
