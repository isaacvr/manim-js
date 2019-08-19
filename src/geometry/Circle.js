import { Path } from './Path';
import { CIRCLE_POINTS, CENTER } from '../constants';
import { types } from '../utils/arrays';

const CONFIG = {
  closed: true,
  filled: true,
};

class Circle extends Path {
  constructor(cx, cy, rad, col) {
    super([], col);
    this.loadConfig(CONFIG);
    this.center = ( types([ cx, cy ]) === 'nn' ) ? nj.array([cx, cy, 0]) : CENTER;
    this.rad = ( types([rad]) === 'n' ) ? rad : 1;
    this.generatePoints();
  }

  generatePoints() {
    let tau = Math.PI * 2;
    let angs = nj.linspace(0, tau, CIRCLE_POINTS);
    let x = nj.cos( angs ).multiply( this.rad ).add( this.center.get(0) );
    let y = nj.sin( angs ).multiply( this.rad ).add( this.center.get(1) );
    let z = nj.zeros( CIRCLE_POINTS );
    this.objects = nj.stack([ x, y, z ]).transpose();
  }

}

export { Circle };