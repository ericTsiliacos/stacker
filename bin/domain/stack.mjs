const additional = message => stack => [message, ...stack];

const initial = () => [];

const whoseTopMessageIs = f => ([head, ...rest]) => [f(head), ...rest];

export { additional, initial, whoseTopMessageIs };
