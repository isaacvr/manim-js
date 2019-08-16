import { Path } from './Path';
import { Point } from './Point';

const CONFIG = {
  closed: false,
  filled: false,
}

class Line extends Path {
  constructor(a, b, col) {
    super([], col);
    this.loadConfig(CONFIG);
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

export { Line };