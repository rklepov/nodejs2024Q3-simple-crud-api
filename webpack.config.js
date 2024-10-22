// webpack.config.js

import path from 'node:path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default {
  // https://webpack.js.org/configuration/mode/
  mode: 'production',
  // https://webpack.js.org/concepts/targets/
  target: 'node',
  entry: './server.js',
  output: {
    filename: 'server.cjs',
    path: path.resolve(import.meta.dirname, 'dist'),
  },
  plugins: [new CleanWebpackPlugin()],
};

//__EOF__
