const path = require('path');
const config = require('../config/index.js');
const utils = require('./utils.js');

const projectRoot = path.resolve(__dirname, '../');
// console.log('当前的环境是 ', process.env.NODE_ENV);
module.exports = {
    // entry: Object.keys(config.entrances)
    //     .filter(entryName => Object.hasOwnProperty.call(config.entrances, entryName)
    //     && config.entrances[entryName].isEntrance)
    //     .reduce((o, entryName) => Object.assign({}, o, {
    //         [entryName.substring(1, entryName.length)]: path.join(config.entrances[entryName].folder, 'index.js'),
    //     }), {}),
    /*
     ** windows用户切换以下入口
     */
    entry: {
      index: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        'app/index.js',
      ],
    },
    // entry: 'app/index.js',
    output: {
        path: config.assetsRoot,
        publicPath: config.assetsPublicPath,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            app: path.resolve(__dirname, '../app'),
            // 'assets': path.resolve(__dirname, '../app/assets'),
            'vue$': 'vue/dist/vue.common.js',
            components: path.resolve(__dirname, '../app/components'),
        },
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')],
    },
    module: {
        // preLoaders: [{
        //     test: /\.vue$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/,
        // }, {
        //     test: /\.js$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/,
        // }],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue',
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/,
        }, {
            test: /\.json$/,
            loader: 'json',
        }, {
            test: /\.html$/,
            loader: 'vue-html',
        }, {
            test: /\.less$/,
            loader: 'less',
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]'),
            },
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
            },
        }],
    },
    eslint: {
        formatter: require('eslint-friendly-formatter'),
    },
    vue: {
        loaders: utils.cssLoaders(),
        less: 'css!less',
        postcss: [
            require('autoprefixer')({
                browsers: ['last 2 versions'],
                remove: false,
            }),
        ],
    },
};
