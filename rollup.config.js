// import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

export default {
  input: pkg.source,
  output: [
    { file: pkg.module, format: 'es' }
  ],
  plugins: [external(), babel({ babelHelpers: 'bundled' }), del({ targets: ['dist/*'] })],
  external: Object.keys(pkg.peerDependencies),
};
