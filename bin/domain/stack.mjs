const additional = message => stack => [message, ...stack];

const initial = () => [];

export { additional, initial };
