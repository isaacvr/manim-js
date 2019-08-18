import { getEasing } from '../utils/easing';
import { sin, cos, abs, sqrt } from '../utils/math';
import { getPath } from '../utils/paths';

class Point {

  constructor(X, Y, Z) {
    if ( X instanceof Point ) {
      // console.log("Copy from point");
      this.copyFromPoint(X);
    } else if ( Array.isArray(X) ) {
      // console.log("Copy from array");
      this.copyFromArray(X);
    } else {
      // console.log("Copy from raw: ", X, Y, Z);
      this.x = X || 0;
      this.y = Y || 0;
      this.z = Z || 0;
    }
  }

  copyFromPoint(pt) {
    this.x = pt.x;
    this.y = pt.y;
    this.z = pt.z;
  }

  copyFromArray(arr) {
    this.x = arr[0] || 0;
    this.y = arr[1] || 0;
    this.z = arr[2] || 0;
  }

  static fromPolar(len, arg) {
    let tAbs = abs(len);
    let x = tAbs * cos(arg);
    let y = tAbs * sin(arg);
    // console.log(len, arg, x, y);
    return new Point(x, y, 0);
  }

  static fromSpherical(len, theta, phi) {
    let tAbs = abs(len);
    let x = tAbs * sin(theta) * cos(phi);
    let y = tAbs * sin(theta) * sin(phi);
    let z = tAbs * cos(theta);
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
    return sqrt( this.dot(this) );
  }

  angleTo(p) {
    let l1 = this.abs();
    let l2 = p.abs();
    let cr = this.dot(p);
    return Math.acos( cr / (l1 * l2) );
  }

  comp() {
    return new Point(this.x, -this.y, this.z);
  }

  rotate(ang, deg) {
    let angle = ang;
    if ( deg ) {
      angle = angle * Math.PI / 180;
    }
    let rotor = Point.fromPolar(1, angle);
    let nx = this.x * rotor.x - this.y * rotor.y;
    let ny = this.x * rotor.y + rotor.x * this.y;
    return new Point(nx, ny, this.z);
  }

  mid(p) {
    return this.add(p).div(2);
  }

  clone() {
    return new Point(this.x, this.y, this.z);
  }

  interpolate(p1, alpha, easing, path, arg) {
    let easingType = (typeof easing === 'function') ? easing : getEasing( easing );
    let pathType = (typeof path === 'function') ? path : getPath( path );
    let np = pathType(this, p1, easingType( alpha ), arg);
    this.x = np.x;
    this.y = np.y;
    this.z = np.z;
    return this;
  }
}

export { Point };