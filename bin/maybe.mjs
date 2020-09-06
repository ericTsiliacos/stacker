const Maybe = value => ({ value });

const maybe = (defaultValue, just) => maybe =>
  maybe.value ? just(maybe.value) : defaultValue();

const orJust = f => (...values) => f(values);

export { Maybe, maybe, orJust };
