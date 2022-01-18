module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const newWebpackConfig = Object.assign({}, webpackConfig);

          // Enable the following line to see all config options
          // console.log(require("util").inspect(newWebpackConfig, { depth: null }));

          newWebpackConfig.output.filename = "js/[name].js";
          newWebpackConfig.output.chunkFilename = "js/[name].chunk.js";
          newWebpackConfig.output.assetModuleFilename = "themes/default/[name][ext]";
          newWebpackConfig.optimization.runtimeChunk = false;
          newWebpackConfig.optimization.splitChunks = {
            cacheGroups: {
              default: false,
            },
          };

          // modify MiniCssExtractPlugin
          // the following approach is necessary since the order inside the `plugins`
          // array is not stable
          const MiniCssExtractPlugin = require("mini-css-extract-plugin");
          newWebpackConfig.plugins.forEach((plugin) => {
            if (plugin instanceof MiniCssExtractPlugin) {
              plugin.options.filename = "themes/default/[name].css";
              plugin.options.chunkFilename = "themes/default/[name].chunk.css";
            }
          });

          return newWebpackConfig;
        },
      },
    },
  ],
};
