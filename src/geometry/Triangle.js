import { Path } from './Path';
import { Point } from './Point';

const CONFIG = {
  closed: true,
  filled: true,
};

class Triangle extends Path {
  constructor(x1, y1, x2, y2, x3, y3, col) {
    super([], col);
    this.loadConfig(CONFIG);
    this.objects = [];
    if ( Point.isPoint(x1) && Point.isPoint(y1) && Point.isPoint(x2) ) {
      this.objects.push( x1.clone() );
      this.objects.push( y1.clone() );
      this.objects.push( x2.clone() );
      this.objects.push( x1.clone() );
    } else {
      this.objects.push( new Point(x1, y1) );
      this.objects.push( new Point(x2, y2) );
      this.objects.push( new Point(x3, y3) );
      this.objects.push( new Point(x1, y1) );
    }
  }
}

export { Triangle };