#!/usr/bin/env node

import program from "commander";
import { writeFile, readFile } from "fs/promises";
import colors from "colors/safe.js";
import graph from "./graph.mjs";

program.command("push <message>").action(async message => {
  try {
    const data = await storage();

    await writeFile(filePath(), JSON.stringify([message, ...data]));
  } catch (error) {
    console.log(error);
  }
});

program.command("init").action(reset);

program.command("clear").action(reset);

program.command("peek").action(async () => {
  const [head] = await storage();

  if (!head) return console.log(colors.red("Nothing to see here!"));

  console.log(`🆕 ${head}`);
});

program.command("pop").action(async () => {
  const [head, ...rest] = await storage();

  if (!head) return console.log(colors.red("Nothing to pop!"));

  try {
    await writeFile(filePath(), JSON.stringify(rest));
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

    head && console.log(`\n${graph([`🆕 ${head}`, ...rest])}`);
  } catch (err) {
    console.error(colors.red("Please, initialize stacker: stacker init"));
  }
}

program.parse(process.argv);

if (process.argv.length < 3) {
  displayStack();
}

async function reset() {
  await writeFile(filePath(), JSON.stringify([]));
}

async function storage() {
  const data = await readFile(filePath());
  return JSON.parse(data);
}

function filePath() {
  return `${cwd()}/.stacker.json`;
}

function cwd() {
  return process.cwd();
}
