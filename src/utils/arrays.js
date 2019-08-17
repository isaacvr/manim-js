function types(arr) {
  let res = [];

  for (let i = 0, maxi = arr.length; i < maxi; i += 1) {
    if ( Array.isArray(arr[i]) ) {
      res.push('a');
    } else switch( typeof arr[i] ) {
      case 'number':
      case 'string':
      case 'object':
      case 'undefined':
      case 'function': {
        res.push( ( typeof arr[i] )[0] );
        break;
      }
      default: {
        res.push('?');
        break;
      }
    }
  }

  return res.join('');
}

function range(a, b, s) {

  let tp = types([a, b, s]);
  let ini, fin, step;

  if ( tp === 'uuu' ) {
    throw new ReferenceError('Range expected at least 1 argument, got 0.');
  } else if ( tp === 'nuu' ) {
    ini = 0, fin = a, step = 1;
  } else if ( tp === 'nnu' ) {
    ini = a, fin = b, step = 1;
  } else if ( tp === 'nnn' ) {
    ini = a, fin = b, step = s;
  } else {
    return [];
  }

  if ( step === 0 ) {
    throw new TypeError('Range step argument must not be zero');
  }

  if ( (step < 0 && ini <= fin) || (step > 0 && ini >= fin) ) {
    return [];
  }

  let ret = [];

  do {
    ret.push(ini);
    ini += step;
  } while( (step < 0 && ini > fin) || (step > 0 && ini < fin) );

  return ret;

}

function sum(arr) {
  let res = 0;
  for (let i = 0, maxi = arr.length; i < maxi; i += 1) {
    res += arr[i];
  }
  return res;
}

function equal(arr, val) {
  return arr.map((e) => e === val ? 1 : 0);
}

function notEqual(arr, val) {
  return arr.map((e) => e != val ? 1 : 0);
}

function gt(arr, val) {
  return arr.map((e) => e > val ? 1 : 0);
}

function gte(arr, val) {
  return arr.map((e) => e >= val ? 1 : 0);
}

function lt(arr, val) {
  return arr.map((e) => e < val ? 1 : 0);
}

function lte(arr, val) {
  return arr.map((e) => e <= val ? 1 : 0);
}

export { types, range, sum, equal, notEqual, gt, gte, lt, lte };