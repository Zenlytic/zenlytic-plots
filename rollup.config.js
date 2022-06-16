import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import packageJSON from './package.json';
const input = './src/index.js';
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, '.min.js');

export default [
  // CommonJS
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
    ],
  },
  // UMD
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
      sourcemap: true,
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
