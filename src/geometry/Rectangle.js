import { Path } from './Path';
import { Point } from './Point';
import { RIGHT, UP } from '../constants';

const CONFIG = {
  closed: true,
  filled: true,
};

class Rectangle extends Path {

  constructor(x, y, w, h, col) {
    super([], col);
    this.loadConfig(CONFIG);
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

export { Rectangle };