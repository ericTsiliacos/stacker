import { pipe } from "./fp/pipe.mjs";

const get = ({ decode }, { from: { read } }) => read().then(decode);

const write = (transform, { encode }, { to: { write } }) =>
  pipe(transform, encode, write);

export { get, write };
