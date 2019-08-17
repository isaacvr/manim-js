import { types } from '../utils/arrays';
import { clip } from '../utils/math';
import { getEasing } from '../utils/easing';

function adjust(val) {
  return clip( ~~val, 0, 255 );
}

class Color {
  constructor(a, b, c, d, e) {
    let tp = types([ a, b, c, d, e ]);

    this.r = adjust( Math.random() * 255 );
    this.g = adjust( Math.random() * 255 );
    this.b = adjust( Math.random() * 255 );
    this.a = 1;

    // console.log('TYPES: ', tp);

    switch( tp ) {
      case 'nnnns': {
        if ( e.match(/cmyk/i) ) {
          this.fromCMYK(a, b, c, d);
        } else if ( e.match(/rgba/i) ) {
          this.fromRGBA(a, b, c, d);
        } else {
          throw new TypeError(`Unknown format color ${e}`);
        }
        break;
      }
      case 'nnnnu': {
        this.fromRGBA(a, b, c, d);
        break;
      }
      case 'nnnsu': {
        if ( d.match(/cmy/i) ) {
          this.fromCMY(a, b, c);
        } else if ( d.match(/ryb/i) ) {
          this.fromRYB(a, b, c);
        } else if ( d.match(/hsv/i) ) {
          this.fromHSV(a, b, c);
        } else {
          throw new TypeError(`Unknown format color ${e}`);
        }
        break;
      }
      case 'nnnuu': {
        this.fromRGB(a, b, c);
        break;
      }
      case 'suuuu': {
        this.fromString(a);
        break;
      }
      case 'uuuuu': {
        /// Allow for random generation
        break;
      }
      default: {
        // console.log(arguments);
        throw new TypeError(`Invalid parameters`);
      }
    }
  }

  // fromCMYK(C, M, Y, K) {
  //   throw new ReferenceError('CMYK not supported yet');
  // }

  fromRGB(r, g, b) {
    this.r = adjust(r);
    this.g = adjust(g);
    this.b = adjust(b);
  }

  fromRGBA(r, g, b, a) {
    this.fromRGB(r, g, b);
    this.a = clip(a, 0, 1);
  }

  fromString(s) {
    let rgbaReg = /$rgba\(([0-9]*),([0-9]*),([0-9]*),([0-9]*)\)$/;
    let rgbReg = /^rgb\(([0-9]*),([0-9]*),([0-9]*)\)$/;
    let str = s.replace(/\s/g, '');

    if ( rgbaReg.test(str) ) {
      this.fromRGBA.apply(this, str.replace(rgbaReg, '$1 $2 $3 $4').split(' '));
    } else if ( rgbReg.test(str) ) {
      this.fromRGB.apply(this, str.replace(rgbReg, '$1 $2 $3').split(' '));
    } else {
      throw new TypeError('String format other than rgb() or rgba() not supported yet');
    }
  }

  interpolate(col, alpha, interp) {
    let intp = (typeof interp === 'function') ? interp : getEasing(interp);
    let alp = clip(alpha, 0, 1);
    this.r = adjust( intp(this.r, col.r, alp) );
    this.g = adjust( intp(this.g, col.g, alp) );
    this.b = adjust( intp(this.b, col.b, alp) );
    this.a = intp(this.a, col.a, alp);
    return this;
  }

  clone() {
    let res = new Color(0, 0, 0);
    res.r = this.r;
    res.g = this.g;
    res.b = this.b;
    res.a = this.a;
    return res;
  }

  toHex() {
    let r = ('00' + this.r.toString(16)).substr(-2, 2);
    let g = ('00' + this.g.toString(16)).substr(-2, 2);
    let b = ('00' + this.b.toString(16)).substr(-2, 2);
    let a = ('00' + adjust(this.a * 255).toString(16)).substr(-2, 2);
    return '#' + r + g + b + a;
  }
}

export { Color };