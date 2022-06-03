import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';

const isPrd = (process.env.NODE_ENV === 'production');

const config = {
  input: 'src/scripts/main.js',
  output: {
    file: 'dist/assets/scripts/main.js',
    format: 'iife',
    sourcemap: (isPrd) ? false : 'inline',
    // globals: {
    //   jquery: '$',
    // }
  },
  // external: ['jquery'],
  plugins: (isPrd) ? [
    resolve(),
    buble(),
    commonjs(),
    terser()
  ] : [
    resolve(),
    buble(),
    commonjs(),
  ]
};

export default config
