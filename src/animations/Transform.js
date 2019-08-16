import { Animation } from './Animation';
import { getPath } from '../utils/paths';
import { ANIMATION_DURATION } from '../constants';
import { Dot } from '../geometry/Dot';

const CONFIG = {
  path_func: 'straight_path'
};

class Transform extends Animation {
  constructor(object, target, duration, path_func) {
    super(object);
    this.loadConfig(CONFIG);
    this.target = target;
    this.duration = duration || this.duration;
    this.path_func = path_func || this.path_func;
    // console.log('PATH_FUNC = ', this.path_func, path_func);
    this.init_path_func();
    // console.log(this.duration);
    // console.log(this.object, this.target);
  }

  init_path_func() {
    this.path_func = getPath(this.path_func);
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
    this.object.interpolateBetween(this.object_copy, this.target_copy, alpha, this.path_func);
    // this.object.interpolate(this.target_copy, alpha);
  }
}

export { Transform };