module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const newWebpackConfig = Object.assign({}, webpackConfig);

          newWebpackConfig.output.filename = "js/[name].js";
          newWebpackConfig.output.chunkFilename = "js/[name].chunk.js";
          newWebpackConfig.optimization.runtimeChunk = false;
          newWebpackConfig.optimization.splitChunks = {
            cacheGroups: {
              default: false,
            },
          };
          // modify MiniCssExtractPlugin
          newWebpackConfig.plugins[4].options.filename = "themes/default/[name].css";
          newWebpackConfig.plugins[4].options.chunkFilename =
            "themes/default/[name].chunk.css";

          // modify media files
          const moduleRules = newWebpackConfig.module.rules[1].oneOf;
          newWebpackConfig.module.rules[1].oneOf[moduleRules.length - 1].options.name =
            "themes/default/[name].[ext]";

          // Enable the following line to see all config options
          // console.log(require("util").inspect(newWebpackConfig, { depth: null }));

          return newWebpackConfig;
        },
      },
    },
  ],
};
