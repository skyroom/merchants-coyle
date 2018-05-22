'use strict';
process.env.NODE_ENV = 'pre';

const net = require('net')
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const chalk = require('chalk');
const config = require('../config/index.js');
const shell = require('shelljs');
const favicon = require('serve-favicon');
const resolve = file => path.resolve(__dirname, file);

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.env.port;

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.proxyTable;

const app = express();

Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(context, Object.assign({}, options, {
        logLevel: 'debug',
    })));
});

// favicon
app.use(favicon(config.biz.favicon));

// serve pure static assets
app.use('/', express.static(resolve('../dist'), config.env.cache && config.env.cache.assetsCache));

let listenPort = (app, port) => {
    app.listen(port, () => {
        console.log(`服务启动成功 localhost:${port}`);
    })
}

const log = {
    success: function(data, ...args) {
        console.log(chalk.green(data, args))
    },
    error: function(data, ...args) {
        console.log(chalk.red(data, args))
    },
    info: function(data, ...args) {
        console.log(chalk.white(data, args))
    }
}

let killPort = function(port) {
    let promise = new Promise(function(resolve, reject) {
        try {
            let processId = Number(shell.exec(`lsof -t -s TCP:LISTEN -i:${port}`))
            if (processId) {
                log.info(`正在干死进程 ${processId}`)
                shell.exec(`kill ${processId}`, function() {
                    log.success(`成功干死进程 ${processId}`)
                    setTimeout(function() {
                        resolve()
                    }, 1000)
                })
            } else {
                reject('没找到进程，如果是以root权限运行的，需手动杀死进程')
            }
        } catch (e) {
            reject(e)
        }
    })
    return promise
}

let checkPort = function(port) {
    let server = net.createServer().listen(port)
    let promise = new Promise(function(resolve, reject) {
        server.on('listening', function() {
            server.close()
        })
        server.on('error', function(error) {
            let errorMessage = error.code;
            switch (error.code) {
                case 'EADDRINUSE':
                    errorMessage = `端口 ${port} 被占用`;
                    break
                case 'EACCES':
                    errorMessage = `没有权限监听 ${port} 端口`
                    break
            }
            reject(errorMessage)
        })
        server.on('close', function() {
            resolve()
        })
    })

    return promise
}

module.exports = ((port)=>{
    checkPort(port)
        .then(function() {
            listenPort(app, port)
        })
        .catch(function(errorMessage) {
            log.error(errorMessage);
             killPort(port)
                .then(function() {
                    listenPort(app, port)
                })
                .catch(function(error) {
                    log.error('没干死该进程', error)
                });
        });
})(port);
