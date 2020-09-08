import props from "./props.mjs";
import identity from "./identity.mjs";

const Maybe = value => {
  return Object.assign(
    {},
    { value },
    { map: f => (value ? Maybe(f(value)) : Maybe(value)) }
  );
};

const maybe = (defaultValue, just) => maybe =>
  maybe.value ? just(maybe.value) : defaultValue();

const orJust = identity;

const maybeMap = f => maybe => maybe.map(f);

const forMaybeIndex = index => obj => Maybe(props(index)(obj));

const nonEmptyList = ([head, ...rest]) =>
  head ? Maybe([head, ...rest]) : Maybe();

export { Maybe, maybe, orJust, forMaybeIndex, maybeMap, nonEmptyList };
