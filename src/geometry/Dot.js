import { Path } from './Path';
import { Point } from './Point';

const CONFIG = {
  closed: true,
  filled: true,
};

class Dot extends Path {
  constructor(x, y, z, col) {
    super([], col);
    this.loadConfig(CONFIG);
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

export { Dot };