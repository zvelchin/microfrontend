const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { AngularWebpackPlugin } = require("@ngtools/webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "../tsconfig.json"), []);

module.exports = function (mode) {
  const IS_DEV = mode === "development";

  const plugins = [
    new webpack.ProvidePlugin({ process: "process/browser" }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets", to: "src/assets" }],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, "../tsconfig.json"),
      },
    }),
    new AngularWebpackPlugin({
      tsconfig: path.resolve(__dirname, "../tsconfig.json"),
    }),
    new webpack.ProgressPlugin(),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, "doesnotexist/")
    ),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.resolve(__dirname, "../src")
    ),
    new ModuleFederationPlugin({
      name: "test",
      filename: "remoteEntry.js",
      exposes: {
        "./TestModule": path.resolve(
          __dirname,
          "../src/app/test/test.module.ts"
        ),
      },

      shared: share({
        "@angular/core": {
          requiredVersion: "auto",
          eager: true,
          singleton: true,
        },
        "@angular/common": {
          requiredVersion: "auto",
          eager: true,
          singleton: true,
        },
        "@angular/common/http": {
          requiredVersion: "auto",
          eager: true,
          singleton: true,
        },
        "@angular/router": {
          requiredVersion: "auto",
          eager: true,
          singleton: true,
        },
        "@angular/forms": {
          requiredVersion: "auto",
          eager: true,
          singleton: true,
        },

        ...sharedMappings.getDescriptors(),
      }),
    }),
  ];

  if (IS_DEV) {
    plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
      })
    );
  }

  return plugins;
};
