import { Animation } from './Animation';
import { getEasing } from '../utils/easing';
import { Dot } from '../geometry/Dot';

const CONFIG = {
  easing: 'linear'
};

class Transform extends Animation {
  constructor(object, target, duration, easing) {
    super(object);
    this.loadConfig(CONFIG);
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

export { Transform };