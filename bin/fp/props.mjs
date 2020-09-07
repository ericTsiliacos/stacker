export default (...properties) => x =>
  properties.reduce((accu, curr) => accu[curr], x);
