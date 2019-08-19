import { getPath } from "./paths";
import { getEasing } from "./easing";

function interpolate(start, end, alpha, ease, path, arc) {
  let pathFunc = ( typeof path === 'function' ) ? path : getPath(path);
  let easingFunc = ( typeof ease === 'function' ) ? ease : getEasing(ease);

  // console.log('PATH: ', pathFunc.name, '  EASE: ', easingFunc.name);

  return pathFunc(start, end, easingFunc(alpha), arc);
}

export {
  interpolate
}