<template lang="html">
    <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :router="true"
    >
        <el-menu-item index="/">
            <i class="el-icon-news"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu v-for="item in menus" :index="'/' + item.key">
            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.displayName}}</span>
            </template>
            <el-menu-item v-for="sub in item.subMenu" :index="'/' + sub.key">
                <i :class="sub.icon"></i>
                <span slot="title">{{item.displayName}}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui';

export default {
    name: 'gz-sidebar',
    props: {
        menus: Array,
    },

    // <el-submenu index='/store'>
    //         <template slot="title">
    //             <i class="el-icon-menu"></i>
    //             <span slot="title">商户服务</span>
    //         </template>
    //         <el-menu-item index="/store-list">
    //             <i class="el-icon-goods"></i>
    //             <span slot="title">商户列表</span>
    //         </el-menu-item>
    //     </el-submenu>
    //     <el-submenu index='/finance'>
    //         <template slot="title">
    //             <i class="el-icon-menu"></i>
    //             <span slot="title">财务管理</span>
    //         </template>
    //         <el-menu-item index="/store-js-list">
    //             <i class="el-icon-goods"></i>
    //             <span slot="title">商户结算管理</span>
    //         </el-menu-item>
    //     </el-submenu>



    data() {
        return {
            currentPath: '',
            // defaultActive: '',
        };
    },
    // <el-menu 
    //     :default-active="defaultActive"
    //     :unique-opened="true"
    //     :router="true"
    //     background-color="#545c64"
    //     text-color="#fff"
    //     active-text-color="#ffd04b"
    // >
    //     <el-menu-item index="/index">首页</el-menu-item>
    //     <el-menu-item index="/user">用户</el-menu-item>
    //     <el-submenu :index="'/' + item.key" v-for="item in menus">
    //         <template slot="title">{{item.displayName}}</template>
    //         <el-menu-item-group v-if="item.subMenu">
    //             <el-menu-item :index="'/' + sub.key" v-for="sub in item.subMenu">{{sub.displayName}}</el-menu-item>
    //         </el-menu-item-group>
    //     </el-submenu>
    // </el-menu>
    computed: {
        ...mapGetters([
            'defaultActive',
        ]),
        // currentPathBackup() {
        //     console.log('路由发生变化');
        //     this.currentPath = this.$route.path === '/index' ? '/' : this.$route.path;
        //     return this.$route.path === '/index' ? '/' : this.$route.path;
        // },
    },
    methods: {
        ...mapActions([
            'setDefaultActive',
        ]),
    },
    components: {
        [Menu.name]: Menu,
        [Submenu.name]: Submenu,
        [MenuItem.name]: MenuItem,
        [MenuItemGroup.name]: MenuItemGroup,
    },
    mounted () {
        // console.log('当前路由是 ', this.$route.path)
        this.setDefaultActive(this.$route.path === '/index' ? '/' : this.$route.path);
        // this.$set(this, '')
    },
};

</script>

<style lang="less" scroped>
</style>
