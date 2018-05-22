const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const entranceSetting = require('../config/entrance.js');

const pageVueText = `<template lang='jade'>
</template>
<script>
</script>
<style lang='less'>
</style>
`;

function checkPageVue(url) {
    const theUrl = path.resolve(__dirname, url);
    const pagePath = theUrl.substring(0, theUrl.lastIndexOf('/'));
    if (!fs.existsSync(pagePath)) {
        mkdirp.sync(pagePath);
    }
    if (!fs.existsSync(theUrl)) {
        fs.writeFileSync(theUrl, pageVueText);
        console.log(`${theUrl}不存在，已创建`);
    }
}

// 通过 "./config/entrance.js" 自动生成 "./app/router-setting.js"
// 如果 "./config/entrance.js" 中的某一项其配置is_vue_page_component为true，则其相对应的page文件夹，如果没有page.vue则会自动生成
const generate = () => {
    const routerSettingFilePath = path.resolve(__dirname, '../app/router-setting.js');

    const routes = Object.keys(entranceSetting)
    .map((url) => {
        if (entranceSetting[url].isVuePageComponent) {
            checkPageVue(`../app/pages${url}.vue`);
        }
        return url;
    })
//     .filter(url => (
//         Object.prototype.hasOwnProperty.call(entranceSetting, url)
//         && entranceSetting[url].isVueLazyLoad
//         && entranceSetting[url].isVuePageComponent
//     ))
//     .reduce((s, url) => (
//         `${s}{
//     path: '${url}',
//     component: (resolve) => {
//         require.ensure(['./pages${url}/page.vue'], resolve);
//     },
// },`
//     ), '');
//     if(fs.existsSync(routerSettingFilePath)) return;
//     fs.writeFileSync(routerSettingFilePath, `export default [
//         ${routes}
//     ]`);
};

module.exports = generate;
