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
    console.error(initialization());
  }
});

program.command("init").action(reset);

program.command("clear").action(reset);

program.command("peek").action(async () => {
  try {
    const [head, ...rest] = await storage();

    if (!head) return console.log(colors.red("Nothing to see here!"));

    console.log(rest.length === 0 ? `${target(head)}` : `${current(head)}`);
  } catch (err) {
    console.error(initialization());
  }
});

program.command("pop").action(async () => {
  const [head, ...rest] = await storage();

  if (!head) return console.log(finished());

  try {
    await writeFile(filePath(), JSON.stringify(rest));
    console.log(`✅ ${head}`);

    if (rest.length === 0) {
      console.log(`\n🎉 ${colors.rainbow("All done!")} 🎉`);
    } else {
      const [next, ...ending] = rest;
      if (ending.length === 0) {
        console.log(`\n${target(next)}`);
      } else {
        console.log(`\n⏭️  ${next}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

program.command("stack").action(displayStack);

async function displayStack() {
  try {
    const [head, ...rest] = await storage();

    console.log(
      head ? `\n${graph([`${current(head)}`, ...label(rest)])}` : finished()
    );
  } catch (err) {
    console.error(initialization());
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

function initialization() {
  return colors.red("Please, initialize stacker: stacker init");
}

function current(message) {
  return `➡️  ${message}`;
}

function label(messages) {
  const [last, ...rest] = messages.reverse();
  if (last) {
    return [target(last), ...rest].reverse();
  } else {
    return [];
  }
}

function target(value) {
  return `🎯 ${value}`;
}

function finished() {
  return "🏁";
}
