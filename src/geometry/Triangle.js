import { Path } from './Path';

const CONFIG = {
  closed: true,
  filled: true,
};

class Triangle extends Path {
  constructor(x1, y1, x2, y2, x3, y3, col) {
    super([
      [ x1, y1, 0 ],
      [ x2, y2, 0 ],
      [ x3, y3, 0 ],
      [ x1, y1, 0 ],
    ], col);
    this.loadConfig(CONFIG);
  }
}

export { Triangle };