import { writeFile, readFile } from "fs/promises";

const fileSystem = ({ at: filePath }) => ({
  read: async () => await readFile(filePath),
  write: async data => await writeFile(filePath, data),
});

export { fileSystem };
