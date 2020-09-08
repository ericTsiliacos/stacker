import { an } from "./fp/pipe.mjs";

const get = ({ decode }, { from: { read } }) => read().then(decode);

const write = ({ encode: encoded }, { to: { write: writer } }) =>
  an(encoded, writer);

export { get, write };
