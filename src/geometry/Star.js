import { Path } from "./Path";
import { CENTER } from "../constants";
import { types } from "../utils/arrays";

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
    this.center = ( types([cx, cy]) === 'nn' ) ? nj.array([cx, cy, 0]) : CENTER;
    this.rad_long = rl || this.rad_long;
    this.rad_short = rs || this.rad_short;
    this.cant = cant || this.cant;
    this.generatePoints();
  }

  generatePoints() {
    let tau = Math.PI * 2;
    let total = this.cant * 2;
    let angs = nj.linspace(0, tau, total + 1).slice([total]);
    // console.log(angs.toString());
    let evens = nj.arange( total ).mod(2);
    let odds = nj.arange( total ).add(1).mod(2);
    let xe = nj.cos( angs ).multiply( this.rad_short ).add( this.center.get(0) ).multiply( evens );
    let ye = nj.sin( angs ).multiply( this.rad_short ).add( this.center.get(1) ).multiply( evens );
    let xo = nj.cos( angs ).multiply( this.rad_long ).add( this.center.get(0) ).multiply( odds );
    let yo = nj.sin( angs ).multiply( this.rad_long ).add( this.center.get(1) ).multiply( odds );
    let x = xe.add(xo);
    let y = ye.add(yo);
    let z = nj.zeros( total );
    this.objects = nj.stack([ x, y, z ]).transpose();
  }
}

export { Star };