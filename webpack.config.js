
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'node',
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    library: 'myLib',
    libraryTarget: 'commonjs2',
    globalObject: 'this',
    filename: 'pollapp-node.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
