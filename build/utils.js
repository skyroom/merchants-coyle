'use strict';
// process.env.NODE_ENV = 'dev';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config/index.js');

exports.assetsPath = _path => path.posix.join(config.assetsSubDirectory, _path);

exports.cssLoaders = (options) => {
    options = options || {};
  // generate loader string to be used with extract text plugin
    function generateLoaders(loaders) {
        const sourceLoader = loaders.map((loader) => {
            let extraParamChar;
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?');
                extraParamChar = '&';
            } else {
                loader = `${loader}-loader`;
                extraParamChar = '?';
            }
            return loader + (options.sourceMap ? `${extraParamChar}sourceMap` : '');
        }).join('!');

        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader);
        }
        return ['vue-style-loader', sourceLoader].join('!');
    }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus']),
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = (options) => {
    const loaders = exports.cssLoaders(options);
    return Object.keys(loaders).map(extension => ({
        test: new RegExp(`\\.${extension}$`),
        loader: loaders[extension],
    }));
};
