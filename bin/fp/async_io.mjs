import { Result } from "./result.mjs";

const io = f => (...values) => () => f(...values);

const doNothing = () => undefined;

const liftPromise = f => () =>
  f()
    .then(value => Result({ right: value }))
    .catch(err => Result({ left: err }));

const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => f(value))),
    map: f => AsyncIO.chaining(() => thunk().then(value => value.map(f))),
    run: () => thunk(),
  }),
  of: thunk => AsyncIO.chaining(thunk),
};

const asynchronously = thunk => (...values) =>
  AsyncIO.chaining(liftPromise(io(thunk)(...values)));

export { AsyncIO, doNothing, asynchronously };
