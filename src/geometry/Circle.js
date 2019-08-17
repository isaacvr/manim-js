import { Path } from './Path';
import { Point } from './Point';
import { CIRCLE_POINTS } from '../constants';

const CONFIG = {
  closed: true,
  filled: true,
};

class Circle extends Path {
  constructor(cx, cy, rad, col) {
    super([], col);
    this.loadConfig(CONFIG);
    this.objects = [];
    this.center = new Point(cx, cy);
    this.rad = rad;
    this.generatePoints();
  }

  generatePoints() {
    this.objects.length = 0;
    let dt = 2 * Math.PI / CIRCLE_POINTS;
    for (let i = 0; i < CIRCLE_POINTS; i += 1) {
      let x = this.center.x + this.rad * Math.cos(i * dt);
      let y = this.center.y + this.rad * Math.sin(i * dt);
      this.objects.push(new Point(x, y));
    }
    this.objects.push( this.objects[0].clone() );
  }

}

export { Circle };