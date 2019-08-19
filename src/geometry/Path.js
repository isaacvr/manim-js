import { Color } from '../Color';
import { max, min, euclidMCD } from '../utils/math';
import { interpolate } from '../utils/bezier';

const CONFIG = {
  closed: false,
  filled: false,
};

class Path {
  constructor(pts, col) {
    let arr = [];
    if ( Array.isArray( pts ) ) {
      for (let i = 0, maxi = pts.length; i < maxi; i += 1) {
        arr[i] = [];
        for (let j = 0; j < 3; j += 1) {
          arr[i][j] = pts[i][j] || 0;
        }
      }
    }

    this.objects = nj.array( arr );
    this.color = col || new Color();
    this.border_color = col || new Color();
    this.loadConfig(CONFIG);
  }

  loadConfig(config) {
    let conf = config || {};
    for (let i in conf) {
      if ( conf.hasOwnProperty(i) ) {
        this[i] = conf[i];
      }
    }

    this.color.a = ( this.filled ) ? 1 : 0;

  }

  clear() {
    this.objects = nj.array();
  }

  clone() {
    // console.log('CLONING: ', this.objects);
    let copy = Object.assign({}, this);

    copy.__proto__ = this.__proto__;

    delete copy.objects;
    delete copy.color;
    delete copy.border_color;

    copy.objects = this.objects.clone();
    copy.color = this.color.clone();
    copy.border_color = this.border_color.clone();

    return copy;
  }

  length() {
    return ~~this.objects.shape[0];
  }

  interpolate(p1, alpha, easing, path, ang) {
    this.objects = interpolate(this.objects, p1.objects, alpha, easing, path, ang);
    this.color.interpolate(p1.color, alpha, easing);
    this.border_color.interpolate(p1.border_color, alpha, easing);
    return this;
  }

  interpolateBetween(p1, p2, alpha, easing, path, ang) {
    this.objects = interpolate(p1.objects, p2.objects, alpha, easing, path, ang);
    this.color = p1.color.clone().interpolate(p2.color, alpha, easing);
    this.border_color = p1.border_color.clone().interpolate(p2.border_color, alpha, easing);
    return this;
  }

  align_points(p1) {
    // console.log('P1: ', p1);
    let lt = p1.length();
    let lf = this.length();
    let mcd = euclidMCD(lt, lf);
    let lcm = lt * lf / mcd;
    let nt = lcm / lt;
    let nf = lcm / lf;
    let shouldReverse = p1.closed ^ this.closed;
    // console.log('BEFORE ---- FROM: ', lf, 'TO: ', lt, nf, nt, lcm);
    this.fill_with_n_objects( nf, shouldReverse &&  !this.closed );
    p1.fill_with_n_objects( nt, shouldReverse &&  !p1.closed );
    // console.log(this.objects.toString());
    // console.log('AFTER ----- FROM: ', this.length(), 'TO: ', p1.length());
  }

  fill_with_n_objects(cant, reversed) {

    if ( cant === 0 ) {
      return;
    }

    if ( !reversed ) {
      cant *= 2;
    }

    let len = this.length();
    let temp = [];

    for (let i = 0; i < len; i += 1) {
      let cur = this.objects.slice([i, i + 1]);
      temp.push( cur.tolist()[0] );
      let dt = 1 / max(1, cant);
      let next = this.objects.slice([ (i + 1) % len, (i + 2) % len ]);
      let tot = cant;

      if ( i + 2 >= len ) {
        if ( i + 1 >= len ) {
          break;
        } else {
          tot = 2 * cant - 1;
          dt = 1 / ( cant * 2 );
          next = this.objects.slice([ len - 1, len ]);
        }
      }

      for (let j = 1; j < tot; j += 1) {
        temp.push( interpolate(cur, next, dt * j).tolist()[0] );
      }
    }

    let result = [];

    if ( reversed ) {
      for (let i = temp.length - 1; i >= 0; i -= 1) {
        result.unshift( temp[i] );
        result.push( [].concat(temp[i]) );
      }
    } else {
      result = temp;
    }

    this.objects = nj.array( result );

  }

  mutate(p1) {
    for (let i in this) {
      delete this[i];
    }
    for (let i in p1) {
      if ( typeof p1[i] === 'object' ) {
        if ( p1[i] && typeof p1[i].clone === 'function' ) {
          this[i] = p1[i].clone();
        } else if ( Array.isArray(p1[i]) ) {
          this[i] = p1[i].map(e => ( e.clone ) ? e.clone() : e);
        } else {
          // console.log('DEBUG: ', this, p1, i, p1[i]);
          Object.assign(this[i], p1[i]);
        }
      } else {
        this[i] = p1[i];
      }
    }
    this.__proto__ = p1.__proto__;
  }

}

export { Path }