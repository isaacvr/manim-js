const UP = nj.array([0, 1, 0]);
const DOWN = nj.array([0, -1, 0]);
const LEFT = nj.array([-1, 0, 0]);
const RIGHT = nj.array([1, 0, 0]);
const OUT = nj.array([0, 0, -1]);
const IN = nj.array([0, 0, 1]);

const CENTER = nj.array([0, 0, 0]);

const CIRCLE_POINTS = 100;

const ANIMATION_DURATION = 1000;
const ANIMATION_LAG_RATIO = 0;

const DEFAULT_WAIT = 1000;

export {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  OUT,
  IN,
  CENTER,
  CIRCLE_POINTS,
  ANIMATION_DURATION,
  ANIMATION_LAG_RATIO,
  DEFAULT_WAIT
};