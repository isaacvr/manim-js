import { tan, rotationMatrix } from './math';

function straight_path(A, B, alpha) {
  if ( typeof A === 'number' ) {
    return A * (1 - alpha) + B * alpha;
  } else if ( A.multiply ) {
    return A.multiply(1 - alpha).add( B.multiply(alpha) );
  }

  return B;
}

function arc_path(A, B, alpha, arc_angle = Math.PI / 3) {
  if ( typeof A === 'number' ) {
    return straight_path(A, B, alpha);
  }
  let center = A.add(B).divide(2);
  // console.log('DOT: ', center.shape, [3, 3]);
  let cvector = center.subtract(A).dot(rotationMatrix(Math.PI / 2)).divide( tan( arc_angle / 2 ) );
  let Cx = center.add(cvector);
  let CA = A.subtract( Cx );
  // console.log('DOT: ', CA.shape, [ 3, 3 ]);
  let res = CA.dot( rotationMatrix( arc_angle * alpha ) ).add(Cx);
  return res;
}

function getPath(name) {
  switch( name ) {
    case 'straight_path': {
      return straight_path;
    }
    case 'arc_path': {
      return arc_path;
    }
  }

  return straight_path;
}

export {
  straight_path,
  arc_path,
  getPath
}