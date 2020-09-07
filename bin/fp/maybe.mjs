import props from "./props.mjs";

const Maybe = value => ({ value });

const maybe = (defaultValue, just) => maybe =>
  maybe.value ? just(maybe.value) : defaultValue();

const orJust = f => (...values) => f(values);

const forMaybeIndex = index => obj => Maybe(props(index)(obj));

export { Maybe, maybe, orJust, forMaybeIndex };
