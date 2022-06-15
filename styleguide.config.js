const path = require("path");

module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
  },
  title: "Zenlytic Plots",
  styleguideDir: "dist-docs",
  moduleAliases: {
    "zenlytic-plots": path.resolve(__dirname, "src"),
  },
};
