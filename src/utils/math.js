function fastRoot(n) {
  let res = n;
  for (let i = 1; i <= 10; i += 1) {
    res = (res + n / res) / 2;
  }
  return res;
}

function clip(val, min, max) {
  return Math.max( min, Math.min(val, max) );
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export {
  fastRoot,
  clip,
  sigmoid
}