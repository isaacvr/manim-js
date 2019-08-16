import { Path } from "./Path";
import { Point } from "./Point";
import { interpolate } from "../utils/bezier";

const CONFIG = {
  rad_long: 10,
  rad_short: 6,
  cant: 5,
  // init_angle: -Math.PI / 2,
  init_angle: 0,
  filled: true,
  closed: true
};

class Star extends Path {
  constructor(cx, cy, cant, rl, rs, col) {
    super([], col);
    this.loadConfig(CONFIG);
    this.center = new Point(cx, cy);
    this.rad_long = rl || this.rad_long;
    this.rad_short = rs || this.rad_short;
    this.cant = cant || this.cant;
    this.generatePoints();
  }

  generatePoints() {
    this.objects.length = 0;

    let cant = this.cant;
    let step = Math.PI / cant;
    let center = this.center;
    let r1 = this.rad_long;
    let r2 = this.rad_short;
    let arg0 = this.init_angle;

    for (let i = 0, j = 0, maxi = cant << 1; i < maxi; i += 1, j = 1 - j) {
      this.objects.push(
        center.add(
          Point.fromPolar(interpolate(r1, r2, j), arg0 + step * i)
        )
      );
    }

  }
}

export { Star };