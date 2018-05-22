// file_name => 通过webpack构建出来的html文件名，其js路径默认为 {folder}+ "./index.js"
// is_vue_page_component => 如果为vue page component 则自动检查对应的./app/pages#{key}是否有对应的page.vue,如果没有则生成
// is_vue_lazy_load => 如果同时为is_vue_page_component,
//   则会将异步加载的代码写入./app/router-setting.js,这个router-setting.js是动态生成的
// is_landing_page,is_vue_app => 区分landing page和vue app，目的是采用不同的优化策略
// is_entrance => 是否是webpack的一个入口文件
// serve_by_nginx => 如果是true，则不会生成在和后端公用的router.js中

const defaultConfig = {
    fileName: null,
    isVuePageComponent: false,
    isVueLazyLoad: false,
    isLandingPage: false,
    isVueApp: false,
    isEntrance: false,
    serveByNginx: false,
    folder: './app',
};

const entrance = {
    '/index': {
        isEntrance: true,
        filename: 'index.html',
        isVueLazyLoad: true,
        isVuePageComponent: true,
        folder: './app',
    },
    '/login': {
        isVueLazyLoad: true,
        isVuePageComponent: true,
        folder: './app',
    },
};

module.exports = Object.keys(entrance).reduce((s, url) => Object.assign({}, s, {
    [url]: Object.assign({}, defaultConfig, entrance[url]),
}), {});
