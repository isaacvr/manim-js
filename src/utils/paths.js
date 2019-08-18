import { tan } from './math';

function straight_path(A, B, alpha) {
  if ( typeof A === 'number' ) {
    return A * (1 - alpha) + B * alpha;
  } else if ( A.mul ) {
    return A.mul(1 - alpha).add( B.mul(alpha) );
  }

  return B;
}

function arc_path(A, B, alpha, arc_angle = Math.PI / 3) {
  if ( typeof A === 'number' ) {
    return straight_path(A, B, alpha);
  }
  let center = A.mid(B);
  let cvector = center.sub(A).rotate(Math.PI / 2).div( tan( arc_angle / 2 ) );
  let Cx = center.add(cvector);
  let CA = A.sub( Cx );
  let res = CA.rotate( arc_angle * alpha ).add(Cx);
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