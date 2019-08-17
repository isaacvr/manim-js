// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: {
    file: './dist/animator.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({
      extensions: [ '.js', '.coffee' ],
      ignoreGlobal: false,
      sourceMap: false,
      ignore: [ 'conditional-runtime-dependency' ]
    })
  ]
};