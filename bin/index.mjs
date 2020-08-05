#!/usr/bin/env node

import commander from "commander";
import { writeFile, readFile } from "fs/promises";
import colors from "colors/safe.js";

commander.command("push <message>").action(async message => {
  try {
    const data = await storage();

    await writeFile(storageFileName(), JSON.stringify([message, ...data]));
  } catch (error) {
    console.log(error);
  }
});

commander.command("init").action(reset);

commander.command("reset").action(reset);

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
    console.log("Pop:", head);
  } catch (err) {
    console.error(err);
  }
});

commander.command("stack").action(async () => {
  const data = await storage();
  const items = [].concat(...data.reverse().map(e => ["^\n|", e])).slice(1);
  items.forEach(item => console.log(item));
});

commander.parse(process.argv);

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
