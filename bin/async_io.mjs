import { Result } from "./result.mjs";

const liftF = f => (...values) => () => f(...values);

const compose = f => g => x => g(f(x));

const pipe = (...xs) => x =>
  xs.reduce(
    (accu, curr) => compose(accu)(curr),
    x => x
  )(x);

const props = (...properties) => x =>
  properties.reduce((accu, curr) => accu[curr], x);

const puts = liftF(console.log);

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

const asyncio = thunk => (...values) =>
  AsyncIO.chaining(liftPromise(liftF(thunk)(...values)));

export { AsyncIO, liftF, compose, pipe, props, puts, asyncio };
