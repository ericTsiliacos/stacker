import { Result } from "./result.mjs";
import { promisify } from "util";

const io = f => (...values) => () => f(...values);

const liftPromise = f => () =>
  f()
    .then(value => Result({ right: value }))
    .catch(err => Result({ left: err }));

const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => f(value))),
    run: () => thunk(),
  }),
  of: thunk => AsyncIO.chaining(thunk),
};

const asynchronously = thunk => (...values) =>
  AsyncIO.chaining(liftPromise(io(thunk)(...values)));

export { AsyncIO, io, asynchronously };
