process.env.NODE_ENV = 'dev';

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const baseWebpackConfig = require('./webpack.base');
const config = require('../config/index.js');
const utils = require('./utils.js');


// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders({
            sourceMap: config.cssSourceMap,
        }),
    },
        // eval-source-map is faster for development
    devtool: '#eval-source-map',
    vue: {
        loaders: utils.cssLoaders({
            sourceMap: config.SourceMap,
            // extract: true,
        }),
    },
    plugins: [
        new webpack.DefinePlugin({
            __biz_config__: JSON.stringify(config.biz),
            __env_config__: config.env,
            'process.env': config.env,
        }),
            // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './app/app.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
            },
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
        }),
    ],
});

// Object.keys(config.entrances)
//     .filter(entryName => Object.hasOwnProperty.call(config.entrances, entryName)
//         && config.entrances[entryName].is_entrance)
//     .forEach((entryName) => {
//         const entry = config.entrances[entryName];
//         webpackConfig.plugins.push(
//             new HtmlWebpackPlugin({
//                 filename: entry.filename,
//                 template: `${entry.folder}/page.jade`,
//                 inject: true,
//                 chunks: [entryName.substring(1, entryName.length)],
//             })
//         );
//     });

module.exports = webpackConfig;
