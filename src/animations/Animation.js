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

  interpolate() {
    /**
     * To be implemented in derivated classes
     */
  }

  get_duration() {
    return this.duration;
  }

}

export { Animation };