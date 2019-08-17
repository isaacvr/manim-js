/**
 *
 * @param { number } n
 * @description
 * Newthon iterative method for the squared root
 */
function fastRoot(n) {
  let res = n;
  for (let i = 1; i <= 10; i += 1) {
    res = (res + n / res) / 2;
  }
  return res;
}

function clip(val, a, b) {
  return max( a, min(val, b) );
}

function max() {
  return Math.max.apply(null, arguments);
}

function min() {
  return Math.min.apply(null, arguments);
}

function sigmoid(x) {
  return 1 / (1 + exp(-x));
}

function exp(x) {
  return Math.exp(x);
}

function sin(x) {
  return Math.sin(x);
}

function sinc(x) {
  if ( Math.abs(x) > 1e-9 ) {
    return sin(x) / x;
  }
  return 1;
}

function cos(x) {
  return Math.cos(x);
}

function tan(x) {
  return Math.tan(x);
}

function acosh(x) {
  return Math.acosh(x);
}

function asinh(x) {
  return Math.asinh(x);
}

function atan2(x) {
  return Math.atan2(x);
}

function cosh(x) {
  return Math.cosh(x);
}

function log10(x) {
  return Math.log10(x);
}

function log2(x) {
  return Math.log2(x);
}

function sinh(x) {
  return Math.sinh(x);
}

function acos(x) {
  return Math.acos(x);
}

function asin(x) {
  return Math.asin(x);
}

function atan(x) {
  return Math.atan(x);
}

function atanh(x) {
  return Math.atanh(x);
}

function sqrt(x) {
  return Math.sqrt(x);
}

function tanh(x) {
  return Math.tanh(x);
}



export {
  fastRoot,
  clip,
  sigmoid,
  max,
  min,
  exp,
  sin,
  sinc,
  cos,
  tan,
  acosh,
  asinh,
  atan2,
  cosh,
  log10,
  log2,
  sinh,
  acos,
  asin,
  atan,
  atanh,
  sqrt,
  tanh,
}