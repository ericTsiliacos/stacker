import identity from "./identity.mjs";

const compose = (g, f) => x => g(f(x));

const pipe = (...xs) => x =>
  xs.reduce((accu, curr) => compose(curr, accu), identity)(x);

const a = (...xs) => x =>
  xs.reduce((accu, curr) => compose(accu, curr), identity)(x);

const an = pipe;

const into = identity;

export { pipe, compose, a, an, into };
