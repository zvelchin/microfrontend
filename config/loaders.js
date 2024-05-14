const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { dynamicImport } = require("tsimportlib");

module.exports = async function () {
  const linkerPlugin = await dynamicImport(
    "@angular/compiler-cli/linker/babel",
    module
  );

  const tsLoader = {
    test: /\.ts?$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      "angular2-template-loader",
      "@ngtools/webpack",
    ],
    exclude: [/\.(spce|e2e)\.ts$/],
  };

  const htmlLoader = {
    test: /\.html$/,
    include: [path.resolve(__dirname, "../src")],
    use: ["to-string-loader", "html-loader"],
  };

  const cssLoaders = [
    "css-loader",
    { loader: "resolve-url-loader", options: { sourceMap: true } },
    { loader: "sass-loader", options: { sourceMap: true } },
  ];

  const styleLoader = [
    {
      test: /\.(scss|sass)$/,
      include: [/\.(global|import)\.(scss|sass)/],
      use: [MiniCssExtractPlugin.loader, ...cssLoaders],
    },
    {
      test: /\.(scss|sass)$/,
      exclude: [/\.(global|import)\.(scss|sass)/],
      use: ["to-string-loader", ...cssLoaders],
    },
  ];

  const assetLoader = {
    test: /\.(png|jpe?g|gif|woff|woff2|otf|ttf|eot|ico|svg)([\?]?.*)$/,
    type: "asset/resource",
  };

  const mjsLoader = {
    test: /\m?.js/,
    use: [
      {
        loader: "babel-loader",
        options: {
          compact: false,
          plugins: [linkerPlugin.default],
        },
      },
    ],
    resolve: {
      fullySpecified: false,
    },
  };

  return [assetLoader, tsLoader, htmlLoader, mjsLoader, ...styleLoader];
};
