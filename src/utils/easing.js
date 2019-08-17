import { interpolate } from './bezier';
import { sin, exp, sinc } from './math';

const PI = Math.PI;
const PI_2 = PI / 2;

function linear(start, end, alpha) {
  return interpolate(start, end, alpha);
}

function easeIn(start, end, alpha) {
  return interpolate(start, end, 1 - sin( (alpha + 1) * PI_2));
}

function easeOut(start, end, alpha) {
  return interpolate(start, end, sin( alpha * PI_2));
}

function easeInOut(start, end, alpha) {
  return interpolate(start, end, (sin( (alpha * 2 + 3) * PI_2 ) + 1) / 2);
}

function bounce(start, end, alpha) {
  return interpolate(start, end, 1 - sinc(4 * PI * alpha) * exp( -3 * alpha ) );
}

function softBounce(start, end, alpha) {
  return interpolate(start, end, 1 - sinc(3 * PI * alpha) * exp( -3 * alpha ) );
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