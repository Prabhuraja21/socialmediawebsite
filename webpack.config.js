const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./frontend-js/main.js",
  output: {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    static: "./public",
    hot: true,
    liveReload: true,
    port: 3000,
  },
  
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
