const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../config');
const utils = require('./utils.js');
const baseWebpackConfig = require('./webpack.base.js');
// var env = process.env.NODE_ENV === 'testing' ?
//     require('../config/test.env') :
//     config.env

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders({
            sourceMap: config.SourceMap,
            extract: true,
        }),
    },
    devtool: config.SourceMap ? '#source-map' : false,
    output: {
        path: config.assetsRoot,
        filename: utils.assetsPath('/js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('/js/[id].[chunkhash].js'),
    },
    vue: {
        loaders: utils.cssLoaders({
            sourceMap: config.SourceMap,
            extract: true,
        }),
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/workflow/production.html
        new webpack.DefinePlugin({
            __env_config__: config.env,
            'process.env': config.env,
            __biz_config__: JSON.stringify(config.biz),
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('/css/[name].[contenthash].css')),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //   filename: process.env.NODE_ENV === 'testing'
        //     ? 'index.html'
        //     : config.index,
        //   template: './app/pages/index/page.jade',
        //   inject: true,
        //   minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        //   },
        //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //   chunksSortMode: 'dependency'
        // }),
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
            // favicon: path.resolve(__dirname, '../public/img/logo-48.png'),
        }),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            minChunks(module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            },
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'libcss',
        //     minChunks: function(module, count) {
        //
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.css$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         )
        //     }
        // }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: [],
        }),
        // new ExtractTextPlugin(path.join(config.assetsSubDirectory, '[name].[contenthash].css')),
    ],
});

// for (let entry_name in config.entrances) {
//     console.log(entry_name)
//     if (config.entrances.hasOwnProperty(entry_name)) {
//         let temp = config.entrances[entry_name]
//         webpackConfig.plugins.push(
//             new HtmlWebpackPlugin({
//                 filename: temp.file_name,
//                 // template: temp.folder + "/page.jade",
//                 template: temp.folder + "/" + entry_name + ".jade",
//                 inject: true,
//                 minify: {
//                     removeComments: true,
//                     collapseWhitespace: true,
//                     removeAttributeQuotes: true
//                         // more options:
//                         // https://github.com/kangax/html-minifier#options-quick-reference
//                 },
//                 // necessary to consistently work with multiple chunks via CommonsChunkPlugin
//                 chunksSortMode: 'dependency'
//             })
//         )
//     }
// }

// for (let entry_name in config.entrances) {
//     let temp = config.entrances[entry_name]
//     if (config.entrances.hasOwnProperty(entry_name) && temp.is_entrance) {
//         webpackConfig.plugins.push(
//             new HtmlWebpackPlugin({
//                 filename: temp.filename,
//                 template: temp.folder + "/page.jade",
//                 inject: true,
//                 chunks: temp.is_vue_app ? [entry_name.substring(1, entry_name.length)] :
//                            other_page_chunks
//                 chunks: [entry_name.substring(1, entry_name.length),'lib'],
//                 minify: {
//                     removeComments: true,
//                     collapseWhitespace: true,
//                     removeAttributeQuotes: true
//                         // more options:
//                         // https://github.com/kangax/html-minifier#options-quick-reference
//                 },
//                 // necessary to consistently work with multiple chunks via CommonsChunkPlugin
//                 chunksSortMode: 'dependency'
//             })
//         )
//     }
// }

if (config.Gzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                `\\.(${
                config.GzipExtensions.join('|')
                })$`
            ),
            threshold: 10240,
            minRatio: 0.8,
        })
    );
}

module.exports = webpackConfig;
