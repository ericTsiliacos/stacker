export default (strings, ...literals) => x => {
  if (strings instanceof Function) {
    console.log(strings(x));
  } else {
    var result = strings[0];
    for (var i = 0; i < literals.length; ++i) {
      result += literals[i](x) + strings[i + 1];
    }

    console.log(result);
  }
};
