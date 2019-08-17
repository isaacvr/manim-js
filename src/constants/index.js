import { Point } from '../geometry/Point';

const UP = new Point(0, 1, 0);
const DOWN = new Point(0, -1, 0);
const LEFT = new Point(-1, 0, 0);
const RIGHT = new Point(1, 0, 0);
const OUT = new Point(0, 0, -1);
const IN = new Point(0, 0, 1);

const CIRCLE_POINTS = 100;

const ANIMATION_DURATION = 1000;
const ANIMATION_LAG_RATIO = 0;

const DEFAULT_WAIT = 1000;

const PI = 3.141592653589793;
const TAU = PI * 2;

export {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  OUT,
  IN,
  CIRCLE_POINTS,
  ANIMATION_DURATION,
  ANIMATION_LAG_RATIO,
  DEFAULT_WAIT,
  PI,
  TAU
};