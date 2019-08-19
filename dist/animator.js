(function () {
  'use strict';

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

  /**
   *
   * @param { number } n
   * @description
   * Newthon iterative method for the squared root
   */

  function clip(val, a, b) {
    return max( a, min(val, b) );
  }

  function abs(x) {
    return Math.abs(x);
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
    if ( abs(x) > 1e-9 ) {
      return sin(x) / x;
    }
    return 1;
  }

  function tan(x) {
    return Math.tan(x);
  }

  function euclidMCD(a, b) {
    return ( b == 0 ) ? a : euclidMCD(b, a % b);
  }

  function rotationMatrix(ang) {
    let mat = [
      [ Math.cos(ang), Math.sin(ang), 0],
      [ Math.sin(-ang), Math.cos(ang), 0],
      [ 0, 0, 1]
    ];

    return nj.array(mat);
  }

  function straight_path(A, B, alpha) {
    if ( typeof A === 'number' ) {
      return A * (1 - alpha) + B * alpha;
    } else if ( A.multiply ) {
      return A.multiply(1 - alpha).add( B.multiply(alpha) );
    }

    return B;
  }

  function arc_path(A, B, alpha, arc_angle = Math.PI / 3) {
    if ( typeof A === 'number' ) {
      return straight_path(A, B, alpha);
    }
    let center = A.add(B).divide(2);
    // console.log('DOT: ', center.shape, [3, 3]);
    let cvector = center.subtract(A).dot(rotationMatrix(Math.PI / 2)).divide( tan( arc_angle / 2 ) );
    let Cx = center.add(cvector);
    let CA = A.subtract( Cx );
    // console.log('DOT: ', CA.shape, [ 3, 3 ]);
    let res = CA.dot( rotationMatrix( arc_angle * alpha ) ).add(Cx);
    return res;
  }

  function getPath(name) {
    switch( name ) {
      case 'straight_path': {
        return straight_path;
      }
      case 'arc_path': {
        return arc_path;
      }
    }

    return straight_path;
  }

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

    interpolate(col, alpha, easing) {
      let pathType = getPath('straight_path');
      let easingType = ( typeof easing === 'function' ) ? easing : getEasing(easing);
      // let alp = clip(alpha, 0, 1);
      // let alp = alpha;
      this.r = adjust( pathType(this.r, col.r, easingType(alpha)) );
      this.g = adjust( pathType(this.g, col.g, easingType(alpha)) );
      this.b = adjust( pathType(this.b, col.b, easingType(alpha)) );
      this.a = pathType(this.a, col.a, easingType(alpha));
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

  function interpolate(start, end, alpha, ease, path, arc) {
    let pathFunc = ( typeof path === 'function' ) ? path : getPath(path);
    let easingFunc = ( typeof ease === 'function' ) ? ease : getEasing(ease);

    // console.log('PATH: ', pathFunc.name, '  EASE: ', easingFunc.name);

    return pathFunc(start, end, easingFunc(alpha), arc);
  }

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

  const CONFIG$1 = {
    closed: true,
    filled: true,
  };

  class Dot extends Path {
    constructor(x, y, z, col) {
      super([ [x, y, z] ], col);
      this.loadConfig(CONFIG$1);
      // console.log('Dot constructor: ', this.objects.get(0, 0));
    }

    get x() {
      return this.objects.get(0, 0);
    }

    get y() {
      return this.objects.get(0, 1);
    }

    get z() {
      return this.objects.get(0, 2);
    }

  }

  const CONFIG$2 = {
    closed: false,
    filled: false,
  };

  class Line extends Path {
    constructor(a, b, col) {
      let ini = ( Array.isArray(a) ) ? [ a[0], a[1], a[2] ] : [ 0, 0, 0 ];
      let fin = ( Array.isArray(b) ) ? [ b[0], b[1], b[2] ] : [ 0, 0, 0 ];
      super([ ini, fin ], col);
      this.loadConfig(CONFIG$2);
    }

    get p1() {
      return this.objects.slice([0, 1]);
    }

    // set p1(p) {
    //   this.objects[0] = p.clone();
    // }

    get p2() {
      return this.objects.slice([1, 2]);
    }

    // set p2(p) {
    //   this.objects[1] = p.clone();
    // }
  }

  const CONFIG$3 = {
    closed: true,
    filled: true,
  };

  class Triangle extends Path {
    constructor(x1, y1, x2, y2, x3, y3, col) {
      super([
        [ x1, y1, 0 ],
        [ x2, y2, 0 ],
        [ x3, y3, 0 ],
        [ x1, y1, 0 ],
      ], col);
      this.loadConfig(CONFIG$3);
    }
  }

  const UP = nj.array([0, 1, 0]);
  const DOWN = nj.array([0, -1, 0]);
  const LEFT = nj.array([-1, 0, 0]);
  const RIGHT = nj.array([1, 0, 0]);
  const OUT = nj.array([0, 0, -1]);
  const IN = nj.array([0, 0, 1]);

  const CENTER = nj.array([0, 0, 0]);

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
      let p = ( types([x, y]) === 'nn' ) ? nj.array([x, y, 0]) : CENTER;
      let objs = [];
      let width = w || 1;
      let height = h || 1;
      objs.push( p.clone().tolist() );
      objs.push( p.add( RIGHT.multiply(w) ).tolist() );
      objs.push( p.add( RIGHT.multiply(w) ).add( UP.multiply(h) ).tolist() );
      objs.push( p.add( UP.multiply(h) ).tolist() );
      objs.push( p.clone().tolist() );
      super(objs, col);
      this.loadConfig(CONFIG$4);
      this.width = width;
      this.height = height;
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
      this.center = ( types([ cx, cy ]) === 'nn' ) ? nj.array([cx, cy, 0]) : CENTER;
      this.rad = ( types([rad]) === 'n' ) ? rad : 1;
      this.generatePoints();
    }

    generatePoints() {
      let tau = Math.PI * 2;
      let angs = nj.linspace(0, tau, CIRCLE_POINTS);
      let x = nj.cos( angs ).multiply( this.rad ).add( this.center.get(0) );
      let y = nj.sin( angs ).multiply( this.rad ).add( this.center.get(1) );
      let z = nj.zeros( CIRCLE_POINTS );
      this.objects = nj.stack([ x, y, z ]).transpose();
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
      this.center = ( types([cx, cy]) === 'nn' ) ? nj.array([cx, cy, 0]) : CENTER;
      this.rad_long = rl || this.rad_long;
      this.rad_short = rs || this.rad_short;
      this.cant = cant || this.cant;
      this.generatePoints();
    }

    generatePoints() {
      let tau = Math.PI * 2;
      let total = this.cant * 2;
      let angs = nj.linspace(0, tau, total + 1).slice([total]);
      // console.log(angs.toString());
      let evens = nj.arange( total ).mod(2);
      let odds = nj.arange( total ).add(1).mod(2);
      let xe = nj.cos( angs ).multiply( this.rad_short ).add( this.center.get(0) ).multiply( evens );
      let ye = nj.sin( angs ).multiply( this.rad_short ).add( this.center.get(1) ).multiply( evens );
      let xo = nj.cos( angs ).multiply( this.rad_long ).add( this.center.get(0) ).multiply( odds );
      let yo = nj.sin( angs ).multiply( this.rad_long ).add( this.center.get(1) ).multiply( odds );
      let x = xe.add(xo);
      let y = ye.add(yo);
      let z = nj.zeros( total );
      this.objects = nj.stack([ x, y, z ]).transpose();
    }
  }



  var geometry = /*#__PURE__*/Object.freeze({
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
    easing: 'linear',
    path: 'straight_path'
  };

  class Transform extends Animation {
    constructor(object, target, duration, easing, path, arg) {
      super(object);
      this.loadConfig(CONFIG$8);
      this.target = target;
      this.duration = duration || this.duration;
      this.easing = easing || this.easing;
      this.path = path || this.path;
      this.arg = arg || this.arg;
      this.init_easing();
      this.init_path();
      // console.log(this.duration);
      // console.log(this.object, this.target);
    }

    init_easing() {
      // console.log('EASING: ', this.easing);
      this.easing = getEasing(this.easing);
    }

    init_path() {
      // console.log('PATH: ', this.easing);
      this.path = getPath(this.path);
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

      // if ( !this.target.closed ) {
      // this.object.closed = this.target.closed;
      // }

      this.object.closed = true;

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
      this.object.interpolateBetween(
        this.object_copy,
        this.target_copy,
        alpha,
        this.easing,
        this.path,
        this.arg
      );
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

  /// Add some stuff to numjs

  nj.linspace = nj.linspace || function linspace(start, stop, elements, dtype) {

    let num = ~~elements;

    if ( num <= 0 ) {
      return nj.array([], dtype);
    } else if ( num === 1 ) {
      return nj.array([start], dtype);
    }

    return nj.arange(start, stop, (stop - start) / (num - 1), dtype).slice([ num ]);

  };

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
  window.Transform = Transform;

}());
