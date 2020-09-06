const get = parser => ({ from }) => () =>
  from.read().then(data => parser.parse(data));

const write = (dataTransformer, parser, { to }) => data =>
  to.write(parser.stringify(dataTransformer(data)));

export { get, write };
