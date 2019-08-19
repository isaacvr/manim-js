import { types } from '../utils/arrays';
import { interpolate } from '../utils/bezier';
import { getPath } from '../utils/paths';
import { getEasing } from '../utils/easing';

function adjust(val) {
  return nj.clip( ~~val, 0, 255 ).get(0);
}

class Color {
  constructor(a, b, c, d, e) {
    let tp = types([ a, b, c, d, e ]);

    this.color = nj.random(4).multiply(255);
    this.color.set(0, adjust( this.color.get(0) ) );
    this.color.set(1, adjust( this.color.get(1) ) );
    this.color.set(2, adjust( this.color.get(2) ) );
    this.color.set(3, 1);

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
    this.color.set(0, adjust(r));
    this.color.set(1, adjust(g));
    this.color.set(2, adjust(b));
  }

  fromRGBA(r, g, b, a) {
    this.fromRGB(r, g, b);
    this.color.set(3, nj.clip(a, 0, 1).get(0));
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

  interpolate(col, alpha, easing) {
    let pathType = getPath('straight_path');
    let easingType = ( typeof easing === 'function' ) ? easing : getEasing(easing);
    let temp = interpolate(this.color, col.color, alpha, easingType, pathType).tolist();
    temp = temp.map((e, p) => ((p < 3) ? adjust(e) : e));
    temp[3] = nj.clip(temp[3], 0, 1).get(0);
    this.color = nj.array(temp);
    return this;
  }

  clone() {
    let res = new Color(0, 0, 0);
    res.color = this.color.clone();
    return res;
  }

  toHex() {
    let temp = this.color.tolist();
    temp[3] = adjust(temp[3] * 255);
    let res = temp.map(e => ('00' + e.toString(16)).substr(-2, 2));
    return '#' + res.join('');
  }
}

export { Color };