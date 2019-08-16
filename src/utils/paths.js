import { interpolate } from './bezier';
import { fastRoot } from './math';

function straight_path(start, end, alpha) {
  // console.log('STRAIGHT');
  return interpolate(start, end, alpha)
}

function rooted_path(start, end, alpha) {
  return interpolate(start, end, fastRoot(alpha));
}

function rooted3_path(start, end, alpha) {
  // console.log('ROOTED 3');
  return interpolate(start, end, Math.pow(alpha, 1.0 / 3));
}

function squared_path(start, end, alpha) {
  return interpolate(start, end, alpha * alpha);
}

function getPath(path) {
  switch(path) {
    case 'straight_path': {
      return straight_path;
    }
    case 'rooted_path': {
      return rooted_path;
    }
    case 'squared_path': {
      return squared_path;
    }
    case 'rooted3_path': {
      return rooted3_path;
    }
  }
  return straight_path;
}

export {
  straight_path,
  rooted_path,
  rooted3_path,
  squared_path,
  getPath
}