import identity from "./identity.mjs";

const Result = ({ left, right }) => {
  return Object.assign(
    {},
    left
      ? { map: () => Result({ left }) }
      : { map: f => Result({ right: f(right) }) },
    { left: left, right: right }
  );
};

const mapResult = f => result => result.map(f);

const either = (left, right) => result =>
  result.left ? left(result.left) : right(result.right);

const or = identity;

export { Result, mapResult, either, or };
