import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
// import run from '@rollup/plugin-run';
import commonjs from '@rollup/plugin-commonjs';

import packageJSON from './package.json';
const input = './src/index.js';
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, '.min.js');

const dev = process.env.NODE_ENV !== 'production';

export default [
  {
    input,
    output: {
      file: packageJSON.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
      // dev && run(),
    ],
  },
  {
    input,
    output: {
      file: minifyExtension(packageJSON.main),
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
      terser(),
      // dev && run(),
    ],
  },
  {
    input,
    output: {
      file: packageJSON.browser,
      format: 'umd',
      sourcemap: true,
      name: 'zenlyticPlots',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
    ],
  },
  {
    input,
    output: {
      file: minifyExtension(packageJSON.browser),
      format: 'umd',
      sourcemap: true,
      name: 'zenlyticPlots',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
      terser(),
    ],
  },
  {
    input,
    output: {
      file: packageJSON.module,
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
    ],
  },
  {
    input,
    output: {
      file: minifyExtension(packageJSON.module),
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      external(),
      nodeResolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.node'] }),
      commonjs(),
      terser(),
    ],
  },
];
