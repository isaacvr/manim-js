import { sigmoid } from './math';

function linear(t) {
  return t;
}

function smooth(t, inflection=10.0) {
  let error = sigmoid(-inflection / 2);
  let val = ( sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error);
  return nj.clip(val, 0, 1).get(0, 0);
}

export {
  linear,
  smooth
};