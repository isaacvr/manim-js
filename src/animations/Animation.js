import { ANIMATION_DURATION, ANIMATION_LAG_RATIO } from '../constants';
import { smooth } from '../utils/rate_functions';

let CONFIG = {
  "duration": ANIMATION_DURATION,
  "rate_func": smooth,
  "name": null,
  "remover": false,
  "lag_ratio": ANIMATION_LAG_RATIO,
  "suspend_mobject_updating": true,
}

class Animation {
  constructor(object) {
    this.object = object;
    this.loadConfig(CONFIG);
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

  get_all_mobjects() {
    return [ this.object, this.starting_object ];
  }

  update_mobjects(dt) {
    for ( mob in this.get_all_mobjects_to_update() ) {
      mob.update(dt);
    }
  }

  get_all_mobjects_to_update() {
    return this.get_all_mobjects().filter(e => e != this.object);
  }

  interpolate(alpha) {
    // alpha = np.clip(alpha, 0, 1);
    // this.interpolate_mobject( this.rate_func(alpha) );
  }

  update(alpha) {
    this.interpolate(alpha);
  }

  // interpolate_mobject(alpha) {
  //   families = list(this.get_all_families_zipped())
  //   for (let i, mobs in enumerate(families) ) {
  //     sub_alpha = this.get_sub_alpha(alpha, i, len(families))
  //     this.interpolate_submobject(*mobs, sub_alpha);
  //   }
  // }

  interpolate_submobject(submobject, starting_sumobject, alpha) {

  }

  get_sub_alpha(alpha, index, num_submobjects) {
    lag_ratio = this.lag_ratio;
    full_length = (num_submobjects - 1) * lag_ratio + 1;
    value = alpha * full_length;
    lower = index * lag_ratio;
    return np.clip((value - lower), 0, 1);
  }

  set_duration(duration) {
    this.duration = duration;
    return this
  }

  get_duration() {
    return this.duration;
  }

  set_rate_func(rate_func) {
    this.rate_func = rate_func;
    return this;
  }

  get_rate_func() {
    return this.rate_func;
  }

  set_name(name) {
    this.name = name;
    return this;
  }

  is_remover() {
    return this.remover;
  }
}

export { Animation };