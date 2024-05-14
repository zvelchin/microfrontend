const path = require("path");
const plugins = require("./config/plugins");
const loaders = require("./config/loaders");

module.exports = async function (mode) {
  const IS_DEV = mode === "development";

  return {
    entry: {
      polyfills: path.resolve(__dirname, "src/polyfills.ts"),
      vendor: path.resolve(__dirname, "src/vendor.ts"),
      app: path.resolve(__dirname, "src/main.ts"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: IS_DEV ? "[name].js" : "[name].[contenthash].js",
      chunkFilename: IS_DEV ? "[id].js" : "[id].[contenthash].js",
      assetModuleFilename: ({ module }) =>
        module.resourceResolveData.relativePath,
      uniqueName: "test",
      clean: true,
    },
    mode: mode,
    devtool: IS_DEV ? "source-map" : false,
    watch: true,
    watchOptions: {
      ignored: /node_modules|dist/,
      aggregateTimeout: 300,
    },
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
    optimization: {
      runtimeChunk: false,
    },
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".ts", ".js"],
      alias: {
        src: path.resolve(__dirname, "src"),
      },
      fallback: {
        util: require.resolve("util"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/"),
      },
    },
    module: {
      rules: await loaders(),
    },
    stats: IS_DEV ? "errors-only" : { colors: true, reasons: true },
    plugins: plugins(mode),
    node: {
      global: true,
    },
    target: ["web"],
  };
};
