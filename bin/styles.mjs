import colors from "colors/safe.js";

const error = colors.red;

const newest = () => "🆕";

const labelled = label => value => `${label()} ${value}`;

export { error, newest, labelled };
