import { Path } from './Path';
import { CIRCLE_POINTS } from '../constants';

const CONFIG = {
  closed: true,
  filled: true,
};

class Circle extends Path {
  constructor(cx, cy, rad, col) {
    super([], col);
    this.loadConfig(CONFIG);
    // this.color.a = 1;
    this.objects = [];
    this.center = new Point(cx, cy);
    this.rad = rad;
    this.generatePoints();
    // console.log(this.objects.length);
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

  // clone() {
  //   let res = new Circle(this.center.x, this.center.y, this.rad);
  //   res.objects = [];
  //   res.objects = this.objects.map(e => e.clone());
  //   res.color = this.color.clone();
  //   for (let i in CONFIG) {
  //     res[i] = this[i];
  //   }
  //   return res;
  // }
}

export { Circle };