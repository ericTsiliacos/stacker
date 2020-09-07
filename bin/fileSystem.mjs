import { writeFile, readFile } from "fs/promises";

export default ({ at: filePath }) => ({
  read: async () => await readFile(filePath),
  write: async data => await writeFile(filePath, data),
});
