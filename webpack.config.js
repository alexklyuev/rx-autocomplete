module.exports = {
  entry: {
    main: [
      "./src/app/main.ts",
    ]
  },
  output: {
    path: __dirname + "/public/dist",
    publicPath: '/dist/',
    filename: '[name].bundle.js',
  },
  devtool: "cheap-eval-source-map",
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.js','.ts'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    },
  },
};
