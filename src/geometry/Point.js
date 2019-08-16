import { getPath } from '../utils/paths';
import { clip } from '../utils/math';

class Point {

  constructor(X, Y, Z) {
    if ( X instanceof Point ) {
      this.x = X.x;
      this.y = X.y;
      this.z = X.z;
    } else {
      this.x = X || 0;
      this.y = Y || 0;
      this.z = Z || 0;
    }
  }

  static fromPolar(abs, arg) {
    let tAbs = Math.abs(abs);
    let x = tAbs * Math.cos(arg);
    let y = tAbs * Math.sin(arg);
    return new Point(x, y, 0);
  }

  static fromSpherical(abs, theta, phi) {
    let tAbs = Math.abs(abs);
    let x = tAbs * Math.sin(theta) * Math.cos(phi);
    let y = tAbs * Math.sin(theta) * Math.sin(phi);
    let z = tAbs * Math.cos(theta);
    return new Point(x, y, z);
  }

  static isPoint(p) {
    return p instanceof Point;
  }

  add(p) {
    return new Point(this.x + p.x, this.y + p.y, this.z + p.z);
  }

  sub(p) {
    return new Point(this.x - p.x, this.y - p.y, this.z - p.z);
  }

  mul(s) {
    return new Point(this.x * s, this.y * s, this.z * s);
  }

  div(s) {
    return new Point(this.x / s, this.y / s, this.z / s);
  }

  dot(p) {
    return this.x * p.x + this.y * p.y + this.z * p.z;
  }

  cross(p) {
    let x1 = ( this.y * p.z - p.y * this.z );
    let y1 = -( this.x * p.z - p.x * this.z );
    let z1 = ( this.x * p.y - p.x * this.y );
    return new Point(x1, y1, z1);
  }

  abs() {
    return Math.sqrt( this.dot(this) );
  }

  angleTo(p) {
    let l1 = this.abs();
    let l2 = p.abs();
    let cr = this.dot(p);
    return Math.acos( cr / (l1 * l2) );
  }

  mid(p) {
    return this.add(p).div(2);
  }

  clone() {
    return new Point(this.x, this.y, this.z);
  }

  interpolate(p1, alpha, interp) {
    let intp = (typeof interp === 'function') ? interp : getPath(interp);
    let np = intp(this, p1, clip(alpha, 0, 1));
    this.x = np.x;
    this.y = np.y;
    this.z = np.z;
    return this;
  }
}

export { Point };