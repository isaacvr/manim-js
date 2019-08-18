import { sin, exp, sinc } from './math';

const PI = Math.PI;
const PI_2 = PI / 2;

function linear(alpha) {
  return alpha;
}

function easeIn(alpha) {
  return 1 - sin( (alpha + 1) * PI_2);
}

function easeOut(alpha) {
  return sin( alpha * PI_2);
}

function easeInOut(alpha) {
  return (sin( (alpha * 2 + 3) * PI_2 ) + 1) / 2;
}

function bounce(alpha) {
  return 1 - sinc(4 * PI * alpha) * exp( -4 * alpha );
}

function softBounce(alpha) {
  return 1 - sinc(3 * PI * alpha) * exp( -3 * alpha );
}

function getEasing(easing) {
  switch( easing ) {
    case 'linear': {
      return linear;
    }
    case 'easeIn': {
      return easeIn;
    }
    case 'easeOut': {
      return easeOut;
    }
    case 'easeInOut': {
      return easeInOut;
    }
    case 'bounce': {
      return bounce;
    }
    case 'softBounce': {
      return softBounce;
    }
  }
  return linear;
}

export {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  bounce,
  softBounce,
  getEasing
}