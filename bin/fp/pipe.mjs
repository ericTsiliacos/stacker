const compose = f => g => x => g(f(x));

const identity = x => x;

const pipe = (...xs) => x =>
  xs.reduce((accu, curr) => compose(accu)(curr), identity)(x);

const an = pipe;

const into = identity;

export { pipe, compose, an, into };
