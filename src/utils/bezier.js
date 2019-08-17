function interpolate(start, end, alpha) {
  if ( typeof start === 'number' ) {
    return start * (1 - alpha) + end * alpha;
  } else if ( typeof start.mul === 'function' ) {
    return start.mul(1 - alpha).add( end.mul(alpha) );
  }
  return start.interpolate(end, alpha);
}

export {
  interpolate
}