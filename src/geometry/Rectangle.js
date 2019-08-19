import { Path } from './Path';
import { RIGHT, UP, CENTER } from '../constants';
import { types } from '../utils/arrays';

const CONFIG = {
  closed: true,
  filled: true,
};

class Rectangle extends Path {

  constructor(x, y, w, h, col) {
    let p = ( types([x, y]) === 'nn' ) ? nj.array([x, y, 0]) : CENTER;
    let objs = [];
    let width = w || 1;
    let height = h || 1;
    objs.push( p.clone().tolist() );
    objs.push( p.add( RIGHT.multiply(w) ).tolist() );
    objs.push( p.add( RIGHT.multiply(w) ).add( UP.multiply(h) ).tolist() );
    objs.push( p.add( UP.multiply(h) ).tolist() );
    objs.push( p.clone().tolist() );
    super(objs, col);
    this.loadConfig(CONFIG);
    this.width = width;
    this.height = height;
  }

  get p() {
    return this.objects[0];
  }

}

export { Rectangle };