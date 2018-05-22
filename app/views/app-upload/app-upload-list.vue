<template lang='html'>
    <div class="banner">
        <div class="search">
            <div class="btn">
                <el-button type="primary" @click="add" v-if="checkAuth('app-upload')">添加</el-button>
            </div>
        </div>
        <div class="topset">
            <div class="list">
                <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    :data="appUploadListFormat"
                    border
                    max-height="600"
                    style="width: 100%"
                    >
                    <el-table-column
                        prop="id"
                        label="APP编号"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="APP名称"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="APP描述"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="extInfo"
                        label="扩展信息"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="os_f"
                        label="操作系统"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="version"
                        label="版本"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="isForce_f"
                        label="强制更新"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="path"
                        label="地址"
                        width="200"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createTime_f"
                        label="创建时间"
                        width="180">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- <div class="block page">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                v-show="pageShow"
                :current-page="bannerList.paging.pageIndex"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="bannerList.paging.total"
                :page-size='10'>
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BaseComponent from '../base';
    import Auth from '../auth';

    export default {
        extends: BaseComponent,
        mixins: [Auth],
        data() {
            return {
                // query: {
                //     paging: {
                //         pageIndex: 1,
                //         pageSize: 10,
                //     },
                //     condition: {
                //         title: '',
                //         status: 2
                //     },
                // },
                loading: true,
                // pageShow: true,
                isForceMap: {
                    0: '否',
                    1: '是',
                },
                osMap: {
                    0: 'IOS',
                    1: 'Android',
                },
            };
        },
        mounted() {
            this.getAppUploadListHandle();
        },
        computed: {
            ...mapGetters([
                'appUploadList',
            ]),
            appUploadListFormat() {
                return this.appUploadList.map((item) => {
                    const targetItem = Object.assign({}, item);
                    targetItem.os_f = this.osMap[targetItem.os];
                    targetItem.isForce_f = this.isForceMap[targetItem.isForce];
                    targetItem.createTime_f = targetItem.createTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                    return targetItem;
                });
            },
        },
        methods: {
            ...mapActions([
                'getAppUploadList',
            ]),
            getAppUploadListHandle() {
                this.loading = true;
                this.pageShow = false;
                this.$store.dispatch('getAppUploadList')
                .then(() => {
                    this.loading = false;
                    this.pageShow = true;
                });
            },
            add() {
                this.$router.push('/add-app-upload');
            },
        },
    };
</script>

<style lang='less'>
    .banner {
        padding: 30px;
        .el-table {
            th, td {
                text-align: center;
            }
        }
        .el-pagination {
            white-space: nowrap;
            padding: 2px 0px;
            color: #48576a;
            margin: 0 auto;
        }
        .topset {
            margin-top: 50px;
        }
        .search {
            .el-date-editor.el-input {
                width: 100%;
            }
            .el-button {
                margin-left: 10px;
            }
        }
        .el-select {
            width: 100%
        }
    }
</style>
