(function () {
  'use strict';

  function interpolate(start, end, alpha) {
    if ( typeof start === 'number' ) {
      return start * (1 - alpha) + end * alpha;
    } else if ( typeof start.mul === 'function' ) {
      return start.mul(1 - alpha).add( end.mul(alpha) );
    }
    return start.interpolate(end, alpha);
  }

  /**
   *
   * @param { number } n
   * @description
   * Newthon iterative method for the squared root
   */

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

  class Point {

    constructor(X, Y, Z) {
      if ( X instanceof Point ) {
        this.x = X.x;
        this.y = X.y;
        this.z = X.z;
      } else {
        this.x = X || 0;
        this.y = Y || 0;
        this.z = Z || 0;
      }
    }

    static fromPolar(abs, arg) {
      let tAbs = Math.abs(abs);
      let x = tAbs * Math.cos(arg);
      let y = tAbs * Math.sin(arg);
      return new Point(x, y, 0);
    }

    static fromSpherical(abs, theta, phi) {
      let tAbs = Math.abs(abs);
      let x = tAbs * Math.sin(theta) * Math.cos(phi);
      let y = tAbs * Math.sin(theta) * Math.sin(phi);
      let z = tAbs * Math.cos(theta);
      return new Point(x, y, z);
    }

    static isPoint(p) {
      return p instanceof Point;
    }

    add(p) {
      return new Point(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    sub(p) {
      return new Point(this.x - p.x, this.y - p.y, this.z - p.z);
    }

    mul(s) {
      return new Point(this.x * s, this.y * s, this.z * s);
    }

    div(s) {
      return new Point(this.x / s, this.y / s, this.z / s);
    }

    dot(p) {
      return this.x * p.x + this.y * p.y + this.z * p.z;
    }

    cross(p) {
      let x1 = ( this.y * p.z - p.y * this.z );
      let y1 = -( this.x * p.z - p.x * this.z );
      let z1 = ( this.x * p.y - p.x * this.y );
      return new Point(x1, y1, z1);
    }

    abs() {
      return Math.sqrt( this.dot(this) );
    }

    angleTo(p) {
      let l1 = this.abs();
      let l2 = p.abs();
      let cr = this.dot(p);
      return Math.acos( cr / (l1 * l2) );
    }

    mid(p) {
      return this.add(p).div(2);
    }

    clone() {
      return new Point(this.x, this.y, this.z);
    }

    interpolate(p1, alpha, interp) {
      let intp = (typeof interp === 'function') ? interp : getEasing(interp);
      let np = intp(this, p1, clip(alpha, 0, 1));
      this.x = np.x;
      this.y = np.y;
      this.z = np.z;
      return this;
    }
  }

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

  function adjust(val) {
    return clip( ~~val, 0, 255 );
  }

  class Color {
    constructor(a, b, c, d, e) {
      let tp = types([ a, b, c, d, e ]);

      this.r = adjust( Math.random() * 255 );
      this.g = adjust( Math.random() * 255 );
      this.b = adjust( Math.random() * 255 );
      this.a = 1;

      // console.log('TYPES: ', tp);

      switch( tp ) {
        case 'nnnns': {
          if ( e.match(/cmyk/i) ) {
            this.fromCMYK(a, b, c, d);
          } else if ( e.match(/rgba/i) ) {
            this.fromRGBA(a, b, c, d);
          } else {
            throw new TypeError(`Unknown format color ${e}`);
          }
          break;
        }
        case 'nnnnu': {
          this.fromRGBA(a, b, c, d);
          break;
        }
        case 'nnnsu': {
          if ( d.match(/cmy/i) ) {
            this.fromCMY(a, b, c);
          } else if ( d.match(/ryb/i) ) {
            this.fromRYB(a, b, c);
          } else if ( d.match(/hsv/i) ) {
            this.fromHSV(a, b, c);
          } else {
            throw new TypeError(`Unknown format color ${e}`);
          }
          break;
        }
        case 'nnnuu': {
          this.fromRGB(a, b, c);
          break;
        }
        case 'suuuu': {
          this.fromString(a);
          break;
        }
        case 'uuuuu': {
          /// Allow for random generation
          break;
        }
        default: {
          // console.log(arguments);
          throw new TypeError(`Invalid parameters`);
        }
      }
    }

    // fromCMYK(C, M, Y, K) {
    //   throw new ReferenceError('CMYK not supported yet');
    // }

    fromRGB(r, g, b) {
      this.r = adjust(r);
      this.g = adjust(g);
      this.b = adjust(b);
    }

    fromRGBA(r, g, b, a) {
      this.fromRGB(r, g, b);
      this.a = clip(a, 0, 1);
    }

    fromString(s) {
      let rgbaReg = /$rgba\(([0-9]*),([0-9]*),([0-9]*),([0-9]*)\)$/;
      let rgbReg = /^rgb\(([0-9]*),([0-9]*),([0-9]*)\)$/;
      let str = s.replace(/\s/g, '');

      if ( rgbaReg.test(str) ) {
        this.fromRGBA.apply(this, str.replace(rgbaReg, '$1 $2 $3 $4').split(' '));
      } else if ( rgbReg.test(str) ) {
        this.fromRGB.apply(this, str.replace(rgbReg, '$1 $2 $3').split(' '));
      } else {
        throw new TypeError('String format other than rgb() or rgba() not supported yet');
      }
    }

    interpolate(col, alpha, interp) {
      let intp = (typeof interp === 'function') ? interp : getEasing(interp);
      let alp = clip(alpha, 0, 1);
      this.r = adjust( intp(this.r, col.r, alp) );
      this.g = adjust( intp(this.g, col.g, alp) );
      this.b = adjust( intp(this.b, col.b, alp) );
      this.a = intp(this.a, col.a, alp);
      return this;
    }

    clone() {
      let res = new Color(0, 0, 0);
      res.r = this.r;
      res.g = this.g;
      res.b = this.b;
      res.a = this.a;
      return res;
    }

    toHex() {
      let r = ('00' + this.r.toString(16)).substr(-2, 2);
      let g = ('00' + this.g.toString(16)).substr(-2, 2);
      let b = ('00' + this.b.toString(16)).substr(-2, 2);
      let a = ('00' + adjust(this.a * 255).toString(16)).substr(-2, 2);
      return '#' + r + g + b + a;
    }
  }

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
      this.objects;
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

  const CONFIG$1 = {
    closed: true,
    filled: true,
  };

  class Dot extends Path {
    constructor(x, y, z, col) {
      super([], col);
      this.loadConfig(CONFIG$1);
      this.objects = [
        new Point(x, y, z)
      ];
    }

    get x() {
      return this.objects[0].x;
    }

    get y() {
      return this.objects[0].y;
    }

    get z() {
      return this.objects[0].z;
    }

  }

  const CONFIG$2 = {
    closed: false,
    filled: false,
  };

  class Line extends Path {
    constructor(a, b, col) {
      super([], col);
      this.loadConfig(CONFIG$2);
      this.objects = [];
      this.objects[0] = (a instanceof Point) ? a.clone() : new Point();
      this.objects[1] = (b instanceof Point) ? b.clone() : new Point();
    }

    get p1() {
      return this.objects[0];
    }

    set p1(p) {
      this.objects[0] = p.clone();
    }

    get p2() {
      return this.objects[1];
    }

    set p2(p) {
      this.objects[1] = p.clone();
    }

    // clone() {
    //   let res = new Line();
    //   res.objects.length = 0;
    //   res.objects = this.objects.map(e => e.clone());
    //   res.color = this.color.clone();
    //   return res;
    // }
  }

  const CONFIG$3 = {
    closed: true,
    filled: true,
  };

  class Triangle extends Path {
    constructor(x1, y1, x2, y2, x3, y3, col) {
      super([], col);
      this.loadConfig(CONFIG$3);
      this.objects = [];
      if ( Point.isPoint(x1) && Point.isPoint(y1) && Point.isPoint(x2) ) {
        this.objects.push( x1.clone() );
        this.objects.push( y1.clone() );
        this.objects.push( x2.clone() );
        this.objects.push( x1.clone() );
      } else {
        this.objects.push( new Point(x1, y1) );
        this.objects.push( new Point(x2, y2) );
        this.objects.push( new Point(x3, y3) );
        this.objects.push( new Point(x1, y1) );
      }
    }
  }

  const UP = new Point(0, 1, 0);
  const DOWN = new Point(0, -1, 0);
  const LEFT = new Point(-1, 0, 0);
  const RIGHT = new Point(1, 0, 0);
  const OUT = new Point(0, 0, -1);
  const IN = new Point(0, 0, 1);

  const CIRCLE_POINTS = 100;

  const ANIMATION_DURATION = 1000;
  const ANIMATION_LAG_RATIO = 0;

  const DEFAULT_WAIT = 1000;

  const CONFIG$4 = {
    closed: true,
    filled: true,
  };

  class Rectangle extends Path {

    constructor(x, y, w, h, col) {
      super([], col);
      this.loadConfig(CONFIG$4);
      let p = new Point(x, y, 0);

      this.objects = [];
      this.width = w;
      this.height = h;
      this.objects[0] = p.clone();
      this.objects[1] = p.add( RIGHT.mul(w) );
      this.objects[2] = p.add( RIGHT.mul(w) ).add( UP.mul(h) );
      this.objects[3] = p.add( UP.mul(h) );
      this.objects[4] = p.clone();
    }

    get p() {
      return this.objects[0];
    }

  }

  const CONFIG$5 = {
    closed: true,
    filled: true,
  };

  class Circle extends Path {
    constructor(cx, cy, rad, col) {
      super([], col);
      this.loadConfig(CONFIG$5);
      this.objects = [];
      this.center = new Point(cx, cy);
      this.rad = rad;
      this.generatePoints();
    }

    generatePoints() {
      this.objects.length = 0;
      let dt = 2 * Math.PI / CIRCLE_POINTS;
      for (let i = 0; i < CIRCLE_POINTS; i += 1) {
        let x = this.center.x + this.rad * Math.cos(i * dt);
        let y = this.center.y + this.rad * Math.sin(i * dt);
        this.objects.push(new Point(x, y));
      }
      this.objects.push( this.objects[0].clone() );
    }

  }

  const CONFIG$6 = {
    rad_long: 10,
    rad_short: 6,
    cant: 5,
    // init_angle: -Math.PI / 2,
    init_angle: 0,
    filled: true,
    closed: true
  };

  class Star extends Path {
    constructor(cx, cy, cant, rl, rs, col) {
      super([], col);
      this.loadConfig(CONFIG$6);
      this.center = new Point(cx, cy);
      this.rad_long = rl || this.rad_long;
      this.rad_short = rs || this.rad_short;
      this.cant = cant || this.cant;
      this.generatePoints();
    }

    generatePoints() {
      this.objects.length = 0;

      let cant = this.cant;
      let step = Math.PI / cant;
      let center = this.center;
      let r1 = this.rad_long;
      let r2 = this.rad_short;
      let arg0 = this.init_angle;

      for (let i = 0, j = 0, maxi = cant << 1; i < maxi; i += 1, j = 1 - j) {
        this.objects.push(
          center.add(
            Point.fromPolar(interpolate(r1, r2, j), arg0 + step * i)
          )
        );
      }

    }
  }



  var geometry = /*#__PURE__*/Object.freeze({
    Point: Point,
    Path: Path,
    Dot: Dot,
    Line: Line,
    Triangle: Triangle,
    Rectangle: Rectangle,
    Circle: Circle,
    Star: Star
  });

  function smooth(t, inflection=10.0) {
    let error = sigmoid(-inflection / 2);
    let val = ( sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error);
    return clip(val, 0, 1);
  }

  let CONFIG$7 = {
    "duration": ANIMATION_DURATION,
    "rate_func": smooth,
    "name": null,
    "remover": false,
    "lag_ratio": ANIMATION_LAG_RATIO,
    "suspend_mobject_updating": true,
  };

  class Animation {
    constructor(object) {
      this.object = object;
      this.loadConfig(CONFIG$7);
    }

    loadConfig(config) {
      for (let i in config) {
        if ( config.hasOwnProperty(i) ) {
          this[i] = config[i];
        }
      }
    }

    begin() {
      this.starting_object = this.create_starting_object();
      // if ( this.suspend_mobject_updating ) {
      //   this.object.suspend_updating();
      // }
      this.interpolate(0);
    }

    finish() {
      this.interpolate(1);
      // if ( this.suspend_mobject_updating ) {
      //   this.object.resume_updating();
      // }
      console.log('Finish:Animation');
    }

    create_starting_object() {
      return this.object.clone();
    }

    interpolate() {
      /**
       * To be implemented in derivated classes
       */
    }

    get_duration() {
      return this.duration;
    }

  }

  const CONFIG$8 = {
    easing: 'linear'
  };

  class Transform extends Animation {
    constructor(object, target, duration, easing) {
      super(object);
      this.loadConfig(CONFIG$8);
      this.target = target;
      this.duration = duration || this.duration;
      this.easing = easing || this.easing;
      this.init_easing();
      // console.log(this.duration);
      // console.log(this.object, this.target);
    }

    init_easing() {
      this.easing = getEasing(this.easing);
    }

    begin() {
      this.target = this.create_target();
      // console.log(this.target);
      this.target_copy = this.target.clone();
      this.object.align_points(this.target_copy);
      this.object_copy = this.object.clone();
      // console.log(this.object_copy, this.object);
      super.begin();

      /// Allow Dot to change it's type when animation begins
      if ( this.object instanceof Dot ) {
        this.object.__proto__ = this.target.__proto__;
      }

      if ( !this.target.closed ) {
        this.object.closed = this.target.closed;
      }
      if ( this.target.filled ) {
        this.object.filled = this.target.filled;
      }

    }

    finish() {
      this.object.mutate(this.target);
    }

    create_target() {
      return this.target;
    }

    check_target_mobject_validity() {
      if ( this.target == null ) {
        let cname = this.constructor.name;
        throw new TypeError(`${cname}.create_target not properly implemented`);
      }
    }

    interpolate(alpha) {
      this.object.interpolateBetween(this.object_copy, this.target_copy, alpha, this.easing);
      // this.object.interpolate(this.target_copy, alpha);
    }
  }

  class Animator {
    constructor() {
    }

    static begin_animations(animations) {
      for (let i = 0, maxi = animations.length; i < maxi; i += 1) {
        animations[i].begin();
      }
    }

    static async progress_through_animations(animations) {
      // console.log('ANIMATIONS: ', animations);
      return new Promise((resolve) => {
        let t0 = performance.now();
        // let last = performance.now();
        let alpha;

        let run = (t) => {
          let alphas = [];

          for (let i = 0, maxi = animations.length; i < maxi; i += 1) {
            alpha = (t - t0) / ( animations[i].get_duration() || ANIMATION_DURATION );
            animations[i].interpolate(alpha);
            alphas.push(alpha);
          }

          let minAlpha = Math.min.apply(null, alphas);

          if ( minAlpha >= 1 ) {
            return resolve();
          }

          requestAnimationFrame(run);
        };

        run(performance.now());
      });
    }

    static finish_animations(animations) {
      for (let i = 0, maxi = animations.length; i < maxi; i += 1) {
        animations[i].finish();
      }
    }

    static async play() {
      let animations = [];
      for (let i = 0, maxi = arguments.length; i < maxi; i += 1) {
        animations.push( arguments[i] );
      }
      // console.log('BEGIN ANIMATIONS');
      Animator.begin_animations(animations);
      // console.log('PROGRESS');
      await Animator.progress_through_animations(animations);
      // console.log('FINISH');
      Animator.finish_animations(animations);
    }

    static async wait(time) {
      return new Promise((resolve) => {
        let total = time || DEFAULT_WAIT;
        let tf = performance.now() + total;
        let rec = (t) => {
          if ( t >= tf) {
            return resolve();
          }
          requestAnimationFrame(rec);
        };
        rec(performance.now());
      });
    }
  }

  // CONFIG = {
    //     "camera_class": Camera,
    //     "camera_config": {},
    //     "file_writer_config": {},
    //     "skip_animations": False,
    //     "always_update_mobjects": False,
    //     "random_seed": 0,
    //     "start_at_animation_number": None,
    //     "end_at_animation_number": None,
    //     "leave_progress_bars": False,
    // }

    // def __init__(self, **kwargs):
    //     Container.__init__(self, **kwargs)
    //     self.camera = self.camera_class(**self.camera_config)
    //     self.file_writer = SceneFileWriter(
    //         self, **self.file_writer_config,
    //     )

    //     self.mobjects = []
    //     # TODO, remove need for foreground mobjects
    //     self.foreground_mobjects = []
    //     self.num_plays = 0
    //     self.time = 0
    //     self.original_skipping_status = self.skip_animations
    //     if self.random_seed is not None:
    //         random.seed(self.random_seed)
    //         np.random.seed(self.random_seed)

  let k = Object.keys(geometry);

  for (let i = 0; i < k.length; i += 1) {
    // createFactory(k[i], geometry[ k[i] ]);
    window[ k[i] ] = geometry[ k[i] ];
  }

  // createFactory('Animator', Animator);
  // createFactory('Color', Color);
  // createFactory('Transform', Transform);

  window.Animator = Animator;
  window.Color = Color;

  window.Transform = function(object, target, duration, path_func) {
    return new Transform(object, target, duration, path_func);
  };

}());
