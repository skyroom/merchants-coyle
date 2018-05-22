<template lang="html">
    <div class="wrapper">
        <gz-header :title="title" :userInfo="userInfo" @signOut="logout"></gz-header>
        <div class="sidebar">
            <gz-sidebar :menus="menus"></gz-sidebar>
        </div>
        <div class="main">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in breadcrumbs" :to="{ path: item.to }">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Breadcrumb } from 'element-ui';
import Header from '../components/biz/header';
import Sidebar from '../components/biz/sidebar';
import baseUrl from '../baseUrl';

export default {
    data() {
        return {
            title: '蔚为大观点餐平台',
            loginBaseUrl: `${baseUrl.loginBaseUrl}/oauth2/authorize?client_id=${baseUrl.clientId}&response_type=code&redirect_uri=${baseUrl.nodeUrl}&state=1`,
            userInfo: {
                userDisplayName: '',
            },
        };
    },
    // "element-ui": "~1.3.*",
    components: {
        [Header.name]: Header,
        [Sidebar.name]: Sidebar,
        [Breadcrumb.name]: Breadcrumb,
    },
    computed: {
        ...mapGetters([
            'token',
            'userDisplayName',
            'breadcrumbs',
            'authorities',
            'menus',
        ]),
        // userInfo() {
        //     return {
        //         userDisplayName: this.userDisplayName,
        //     };
        // },
    },
    methods: {
        ...mapActions([
            'getAuthorities',
            'signOut',
            'setBreadcrumbs',
            'getRegionList',
            'login',
            'setDefaultActive',
        ]),
        logout() {
            this.signOut()
            .then(() => {
                location.href = this.loginBaseUrl;    // eslint-disable-line no-undef
            });
        },
        checkLogin() {
            // if (this.$route.query && this.$route.query.code && this.$route.query.state) {
            //     this.login(this.$route.query)
            //     .then((data) => {
            //         localStorage.setItem('token', data.token);    // eslint-disable-line no-undef
            //         localStorage.setItem('userName', data.userinfo.userName);    // eslint-disable-line no-undef
            //         this.userInfo.userDisplayName = data.userinfo.userName;
            //         localStorage.setItem('userCode', data.userinfo.userCode);    // eslint-disable-line no-undef
            //         localStorage.setItem('id', data.userinfo.id);    // eslint-disable-line no-undef
            //         this.$router.replace('/index');
            //         return this.getAuthorities(data);
            //     }, (err) => {
            //         if (err) {
            //             this.$notify({
            //                 title: '错误',
            //                 message: err.message || err,
            //                 type: 'error',
            //             });
            //         } else {
            //             this.$notify({
            //                 title: '错误',
            //                 message: '登录失败',
            //                 type: 'error',
            //             });
            //         }
            //         setTimeout(() => { // eslint-disable-line no-undef
            //             location.href = this.loginBaseUrl;    // eslint-disable-line no-undef
            //         }, 3000);
            //         // this.$router.replace('/error/');
            //     })
            //     .then(() => {
            //         // 获取到权限后开始设置菜单栏
            //         this.setDefaultActive(this.$route.path === '/index' ? '/' : this.$route.path);
            //     }, (err) => {
            //         this.$notify({
            //             title: '错误',
            //             message: err.message || err,
            //             type: 'error',
            //         });
            //     });
            // } else if (this.token) {
            //     this.getAuthorities()
            //     .then(() => {
            //         // 获取到权限后开始设置菜单栏
            //         this.setDefaultActive(this.$route.path === '/index' ? '/' : this.$route.path);
            //     })
            //     .catch((err) => {
            //         this.$notify({
            //             title: '错误',
            //             message: err.message || err,
            //             type: 'error',
            //         });
            //     });
            // } else {
            //     location.href = this.loginBaseUrl;    // eslint-disable-line no-undef
            // }
        },
    },
    mounted() {
        // this.checkLogin();
        this.userInfo.userDisplayName = localStorage.getItem('userName'); // eslint-disable-line no-undef
    },
    beforeMount() {
        // this.checkLogin();
    },
    created() {
        this.checkLogin(); // 使用此处
    },
    beforeCreate() {
        // this.checkLogin();
    },
    watch: {
        $route: {
            // 当路由变化时 设置菜单栏
            handler() {
                console.log('路由发生变化')
                this.setDefaultActive(this.$route.path === '/index' ? '/' : this.$route.path);
            },
            deep: true,
        },
    },
};
</script>

<style lang="less">
html, body {
     height: 100%;
     font-family: "Helvetica Neue","Luxi Sans","DejaVu Sans",Tahoma,"Hiragino Sans GB","Microsoft Yahei",sans-serif;
}
.wrapper {
    min-height: 100%;
    position: relative;
}
.el-breadcrumb {
    padding: 10px 10px;
}
.page-content {
    padding: 20px;
}
.pagination-bar {
    margin-top: 20px;
    text-align: center;
}
a {
    text-decoration: none;
    color: inherit
}
.sidebar{
    width: 230px;
    position: absolute;
    top: 50px;
    left: 0px;
    bottom: 0px;
    background-color: #545c64;
}
.main {
    margin-left: 230px;
    padding: 0 10px 10px 10px;
}
.date-separator .el-form-item__label {
    text-align: center;
}
body {
    margin: 0px;
    padding: 0px;
}
</style>
