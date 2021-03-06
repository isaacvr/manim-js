/// Add some stuff to numjs

nj.linspace = nj.linspace || function linspace(start, stop, elements, dtype) {

  let num = ~~elements;

  if ( num <= 0 ) {
    return nj.array([], dtype);
  } else if ( num === 1 ) {
    return nj.array([start], dtype);
  }

  return nj.arange(start, stop, (stop - start) / (num - 1), dtype).slice([ num ]);

}

import * as geometry from './geometry';
import { Transform } from './animations/Transform';
import { Animator } from './animator/Animator';
import { Color } from './Color';

let k = Object.keys(geometry);

for (let i = 0; i < k.length; i += 1) {
  // createFactory(k[i], geometry[ k[i] ]);
  window[ k[i] ] = geometry[ k[i] ];
}

// createFactory('Animator', Animator);
// createFactory('Color', Color);
// createFactory('Transform', Transform);

window.Animator = Animator;
window.Color = Color;
window.Transform = Transform;