import { Result } from "./result.mjs";

const liftF = f => (...values) => () => f(...values);

const liftPromise = f => () =>
  f()
    .then(value => Result({ right: value }))
    .catch(err => Result({ left: err }));

const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => liftF(f)(value)())),
    sequence: (...fs) =>
      AsyncIO.chaining(() =>
        thunk().then(value => fs.forEach(f => f(value)()))
      ),
    _sequence: (...fs) =>
      AsyncIO.chaining(() => thunk().then(() => fs.forEach(f => f()))),
    _thread_: f =>
      AsyncIO.chaining(() =>
        thunk().then(value => {
          f();
          return value;
        })
      ),
    run: () => thunk().then(result => result()),
  }),
  of: thunk => AsyncIO.chaining(thunk),
};

const asynchronously = thunk => (...values) =>
  AsyncIO.chaining(liftPromise(liftF(thunk)(...values)));

export { AsyncIO, liftF, asynchronously };
