import identity from "./identity.mjs";

const pipe = (...xs) => x =>
  xs.reduce((accu, curr) => y => curr(accu(y)), identity)(x);

const compose = (...xs) => x =>
  xs.reduce((accu, curr) => y => accu(curr(y)), identity)(x);

const an = pipe;
const into = identity;

export { pipe, compose, an, into };
