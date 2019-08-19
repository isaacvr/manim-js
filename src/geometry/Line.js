import { Path } from './Path';

const CONFIG = {
  closed: false,
  filled: false,
}

class Line extends Path {
  constructor(a, b, col) {
    let ini = ( Array.isArray(a) ) ? [ a[0], a[1], a[2] ] : [ 0, 0, 0 ];
    let fin = ( Array.isArray(b) ) ? [ b[0], b[1], b[2] ] : [ 0, 0, 0 ];
    super([ ini, fin ], col);
    this.loadConfig(CONFIG);
  }

  get p1() {
    return this.objects.slice([0, 1]);
  }

  // set p1(p) {
  //   this.objects[0] = p.clone();
  // }

  get p2() {
    return this.objects.slice([1, 2]);
  }

  // set p2(p) {
  //   this.objects[1] = p.clone();
  // }
}

export { Line };