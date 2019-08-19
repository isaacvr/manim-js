import { Path } from './Path';

const CONFIG = {
  closed: true,
  filled: true,
};

class Dot extends Path {
  constructor(x, y, z, col) {
    super([ [x, y, z] ], col);
    this.loadConfig(CONFIG);
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

export { Dot };