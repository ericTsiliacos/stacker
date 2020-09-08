const additional = message => stack => [message, ...stack];

const initial = () => [];

const whoseTopMessageIs = transform => ([head, ...rest]) => [
  transform(head),
  ...rest,
];

export { additional, initial, whoseTopMessageIs };
