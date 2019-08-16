import { Point } from './Point';
import { Color } from '../Color';
import { range, sum, equal } from '../utils/arrays';

const CONFIG = {
  closed: false,
  filled: false,
};

class Path {
  constructor(pts, col) {
    this.objects = [];
    this.color = col || new Color();
    this.border_color = col || new Color();

    this.loadConfig(CONFIG);

    if ( Array.isArray(pts) ) {
      for (let i = 0, maxi = pts.length; i < maxi; i += 1) {
        this.addBack(pts[i]);
      }
    }
  }

  static checkType(p) {
    return Point.isPoint(p) || ( Array.isArray(p) && p.length >= 2 );
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

  addFront(pt) {
    if ( Path.checkType(pt) ) {
      this.objects.unshift(new Point(pt));
    }
  }

  addBack(pt) {
    if ( Path.checkType(pt) ) {
      this.objects.push(new Point(pt));
    }
  }

  popFront() {
    if ( this.objects.length > 0 ) {
      this.objects.shift();
    }
  }

  popBack() {
    if ( this.objects.length > 0 ) {
      this.objects.pop();
    }
  }

  clear() {
    this.objects.length = 0;
  }

  clone() {
    // console.log('CLONING: ', this.objects);
    this.objects
    let copy = Object.assign({}, this);

    copy.__proto__ = this.__proto__;

    delete copy.objects;
    delete copy.color;
    delete copy.border_color;

    copy.objects = this.objects.map(e => e.clone());
    copy.color = this.color.clone();
    copy.border_color = this.border_color.clone();

    // console.log('CLONED: ', this.objects, copy.objects);

    return copy;
  }

  length() {
    return this.objects.length;
  }

  interpolate(p1, alpha, interp) {
    let len = Math.min( this.length(), p1.length() );
    for (let i = 0; i < len; i += 1) {
      this.objects[i].interpolate( p1.objects[i], alpha, interp );
    }
    this.color.interpolate(p1.color, alpha, interp);
    this.border_color.interpolate(p1.border_color, alpha, interp);
    // console.log('INTERPOLATION DONE: ', alpha);
    return this;
  }

  interpolateBetween(p1, p2, alpha, interp) {
    // console.log('itbw: ', this.length(), p1.length(), p2.length());
    let len = Math.min( this.length(), p1.length(), p2.length() );
    for (let i = 0; i < len; i += 1) {
      this.objects[i] = p1.objects[i].clone().interpolate( p2.objects[i], alpha, interp );
    }
    this.color = p1.color.clone().interpolate(p2.color, alpha, interp);
    this.border_color = p1.border_color.clone().interpolate(p2.border_color, alpha, interp);
    // console.log('INTERPOLATION DONE: ', alpha);
    return this;
  }

  align_points(p1) {
    // console.log('P1: ', p1);
    let lt = p1.length();
    let lf = this.length();
    this.fill_with_n_objects(Math.max(0, lt - lf ) );
    p1.fill_with_n_objects(Math.max(0, lf - lt ) );
  }

  fill_with_n_objects(cant) {

    if ( cant === 0 ) {
      return;
    }

    let len = this.length();
    let tot = len + cant;
    let newObjects = [];
    let cants = (function() {
      let c = range(tot).map(e => ~~(e * len / tot));
      let res = [];
      for (let i = 0; i < len; i += 1) {
        res.push( sum( equal(c, i) ) );
      }
      return res;
    }());

    if ( len > 1 ) {
      if ( cants[len - 1] > 1 ) {
        cants[ len - 2 ] += cants[ len - 1 ] - 1;
        cants[ len - 1 ] = 1;
      }
    }

    for (let i = 0; i < len; i += 1) {
      newObjects.push( this.objects[i].clone() );
      let dt = 1 / Math.max(1, cants[i]);
      let next = this.objects[ (i + 1) % len ];

      for (let j = 1; j < cants[i]; j += 1) {
        newObjects.push( this.objects[i].clone().interpolate(next, dt * j) );
        // newObjects.push( this.objects[i].clone() );
      }
    }

    this.objects = newObjects;

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