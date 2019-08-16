import { ANIMATION_DURATION, DEFAULT_WAIT } from "../constants";

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

export { Animator };

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
