<template>
<div id="merchants-list">
    <gz-list
    ref="merchantsList"
    @getData="getMerchantsListHandler"
    :form="searchForm"
    :originData="merchantsListFormat"
    :originPaging="merchantsListPagingFormat"
    :colNameMap="colNameMap"
    @cellClick="cellClick"
    :loading="loading"
    :pageShow="pageShow"
    :operation="operation"
    @operation-click="operationClickHandler"
    >
        <el-form ref="searchForm" :model="searchForm" label-width="90px" slot="searchForm" label-position="left">
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="姓名：">
                        <el-input v-model.trim="searchForm.name" placeholder="用户姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="手机号：">
                        <el-input v-model.trim="searchForm.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="handlerToolbar">
            <el-row>
                <el-button type="primary" @click="getSearch()" v-if="checkAuth('user-search')">查询</el-button>
                <el-button type="primary" @click="usersExportHandler()" :loading="exportLoading" v-if="checkAuth('user-search')">导出</el-button>
                <el-button type="primary" @click="addHandler" v-if="checkAuth('user-add')">新建</el-button>
                <a ref="downloadDOM" :href="downloadUrl" v-show></a>
            </el-row>
        </div>
    </gz-list>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="small" top="5%">
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" label-width="100px" label-position="left">
            <el-form-item label="用户姓名：" prop="name">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.name" auto-complete="off" :maxlength="10"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.phone" auto-complete="off" :maxlength="11"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idNumber">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.idNumber" auto-complete="off" :maxlength="18"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="角色：">
                <el-col :span="16">
                    <el-select v-model="modifyForm.type">
                        <el-option
                            v-for="item in rolesOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="附加信息：" prop="attach">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.attach" auto-complete="off"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveHandler">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import { cloneDeep, debounce } from 'lodash';
import {
    mapGetters,
    mapActions,
} from 'vuex';
import List from '../../components/biz/list';
import BaseComponent from '../base';
import Auth from '../auth';

const colNameMap = [
{
    key: 'id',
    displayName: 'ID',
    width: 140,
},
{
    key: 'name',
    displayName: '名称',
    width: 130,
},
{
    key: 'desk',
    displayName: '台桌',
    width: 180,
},
{
    key: 'dish',
    displayName: '菜品',
    width: 80,
},
{
    key: 'persons',
    displayName: '人员',
    minWidth: '150',
},
{
    key: 'vip',
    displayName: '会员',
    width: 70,
},
{
    key: 'vouchers',
    displayName: '代金券',
    width: 100,
},
{
    key: 'comment',
    displayName: '评价',
    width: 180,
},
];

export default {
    extends: BaseComponent,
    mixins: [Auth],
    components: {
        [List.name]: List,
    },
    data() {
        const validateIdnumber = (rule, value, callback) => {
            if (value && !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)|(\s)/.test(value))) {
                callback(new Error('请输入正确的身份证号码'));
            } else {
                callback();
            }
        };
        const validateMarketId = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('请选择销售市场'));
            } else {
                callback();
            }
        };
        return {
            debounce,
            downloadUrl: '',
            exportLoading: false,
            marketData: [],
            marketProps: {
                key: 'id',
                label: 'marketName',
            },
            searchForm: {
                name: '',
                phone: '',
            },
            loading: false,
            pageShow: false,
            typeArray: [],
            colNameMap,
            operation: [{
                text: '编辑',
                buttonType: 'primary',
                valiateFunc: () => this.checkAuth('user-edit'),
            }, {
                text: '启用',
                buttonType: 'primary',
                valiateFunc: (status) => {
                    if (status === 0 && this.checkAuth('user-edit')) {
                        return true;
                    }
                    return false;
                },
                param: 'status',
            }, {
                text: '禁用',
                buttonType: 'danger',
                valiateFunc: (status) => {
                    if (status === 1 && this.checkAuth('user-edit')) {
                        return true;
                    }
                    return false;
                },
                param: 'status',
            }],
            statusMap: {
                1: '启用',
                0: '禁用',
            },
            typeMap: {
                1: '采购员',
                2: '销售员',
            },
            options: [
                {
                    value: 2,
                    label: '全部状态',
                }, {
                    value: 0,
                    label: '已禁用',
                }, {
                    value: 1,
                    label: '启用中',
                },
            ],
            rolesOptions: [{
                value: 1,
                label: '采购员',
            }, {
                value: 2,
                label: '销售员',
            }],
            typeProps: {
                value: 'code',
                label: 'name',
                children: 'children',
            },
            dialogTitle: '',
            mode: '',
            multipleSelection: [],
            dialogFormVisible: false,
            modifyForm: {
                id: 0,
                name: '',
                phone: '',
                type: 1,
                idNumber: '',
                marketId: [],
                attach: '',
            },
            modifyFormRules: {
                name: [{
                    required: true,
                    message: '请输入用户名称',
                    trigger: 'blur,change',
                }],
                marketId: [{
                    trigger: 'blur,change',
                    validator: validateMarketId,
                }],
                phone: [{
                    required: true,
                    message: '请输入正确的手机号',
                    trigger: 'blur',
                    pattern: /^1\d{10}$/,
                }],
                idNumber: [{
                    trigger: 'blur',
                    validator: validateIdnumber,
                }],
            },
        };
    },
    computed: {
        ...mapGetters([
            'merchantsList',
            'marketList',
        ]),
        merchantsListFormat() {
            return this.merchantsList.itemList.map((item) => {
                const targetItem = Object.assign({}, item);
                targetItem.status_f = this.statusMap[targetItem.status];
                targetItem.type_f = this.typeMap[targetItem.type];
                if (item.createTime) {
                    targetItem.createTime_f = item.createTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                if (item.updateTime) {
                    targetItem.updateTime_f = item.updateTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                return targetItem;
            });
            // return this.merchantsList.itemList;
        },
        merchantsListPagingFormat() {
            if (this.merchantsList.paging === null) {
                const pagingTemp = {
                    total: 0,
                };
                return pagingTemp;
            }
            return this.merchantsList.paging;
        },
    },
    methods: {
        ...mapActions([
            'getMerchantsList',
            'addMerchants',
            'editMerchants',
            'changeMerchantsStatus',
            'getMerchantsDetail',
            'usersExport',
            'getRegionThreeList',
            'usersExport',
        ]),
        cellClick(row, column) {
            if (column.label !== '操作') return;
            // this.$router.push(`/helpDetail/edit/${row.id}`);
        },
        getMerchantsListHandler(queryCondition) {
            this.$set(this, 'loading', true);
            this.$set(this, 'pageShow', false);
            const queryConditionQuery = cloneDeep(queryCondition);
            this.getMerchantsList(queryConditionQuery)
            .then(() => {
                this.$set(this, 'loading', false);
                this.$set(this, 'pageShow', true);
            })
            .catch((err) => {
                this.$notify({
                    title: '错误',
                    message: err.message || err,
                    type: 'error',
                });
            });
        },
        getSearch() {
            this.$refs.merchantsList.queryHandler();
        },
        addHandler() {
            if (this.$refs.modifyForm && this.$refs.modifyForm.resetFields) {
                this.$refs.modifyForm.resetFields();
            }
            this.$set(this, 'mode', 'add');
            this.$set(this, 'marketData', []);
            this.$set(this.modifyForm, 'name', '');
            this.$set(this.modifyForm, 'phone', '');
            this.$set(this.modifyForm, 'type', 1);
            this.$set(this.modifyForm, 'idNumber', '');
            this.$set(this.modifyForm, 'marketId', []);
            this.$set(this.modifyForm, 'attach', '');

            this.$set(this, 'dialogFormVisible', true);
            this.$set(this, 'dialogTitle', '用户添加');
            this.$nextTick(() => {
                // if (this.$refs.modifyForm && this.$refs.modifyForm.resetFields) {
                //     this.$refs.modifyForm.resetFields();
                // }
            });
        },
        saveHandler() {
            this.$refs.modifyForm.validate((valid) => {
                if (valid) {
                    if (this.mode === 'add') {
                        const dataQuery = cloneDeep(this.modifyForm);
                        delete dataQuery.id;
                        this.addUsers(dataQuery)
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success',
                            });
                            this.$set(this, 'dialogFormVisible', false);
                            this.$refs.merchantsList.queryHandler();
                        })
                        .catch((err) => {
                            this.$notify({
                                title: '错误',
                                message: err.message || err,
                                type: 'error',
                            });
                        });
                    } else if (this.mode === 'edit') {
                        const dataQuery = cloneDeep(this.modifyForm);
                        this.editUsers({
                            id: dataQuery.id,
                            queryData: dataQuery,
                        })
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                            });
                            this.$set(this, 'dialogFormVisible', false);
                            // this.$refs.merchantsList.queryHandler();
                            this.getMerchantsListHandler(this.$refs.merchantsList.queryCondition);
                        })
                        .catch((err) => {
                            this.$notify({
                                title: '错误',
                                message: err.message || err,
                                type: 'error',
                            });
                        });
                    }
                } else {
                    this.$notify({
                        title: '提示',
                        message: '您的输入有误！',
                        type: 'warning',
                    });
                }
            });
        },
        operationClickHandler(args) {
            if (args[2] === 0) {
                if (this.$refs.modifyForm && this.$refs.modifyForm.resetFields) {
                    this.$refs.modifyForm.resetFields();
                }
                let marketNameArray;
                this.$set(this, 'marketData', []);
                this.$set(this.modifyForm, 'id', args[1].id || 0);
                this.$set(this.modifyForm, 'name', args[1].name || '');
                this.$set(this.modifyForm, 'phone', args[1].phone || '');
                this.$set(this.modifyForm, 'type', args[1].type || 1);
                this.$set(this.modifyForm, 'marketId', args[1].marketIdArr);
                this.$set(this.modifyForm, 'attach', args[1].attach || '');
                this.$set(this.modifyForm, 'idNumber', args[1].idNumber || '');
                this.$set(this, 'dialogFormVisible', true);
                this.$set(this, 'dialogTitle', '用户编辑');
                this.$set(this, 'mode', 'edit');
                if (args[1].marketName) {
                    marketNameArray = args[1].marketName.split(',');
                    this.$set(this, 'marketData', args[1].marketIdArr.map((item, index) => {
                        const targetItem = {};
                        targetItem.id = item;
                        targetItem.marketName = marketNameArray[index];
                        return targetItem;
                    }));
                }
            } else if (args[2] === 1) {
                this.changeUsersStatus({
                    id: [args[1].id],
                    status: 1,
                })
                .then(() => {
                    this.getMerchantsListHandler(this.$refs.merchantsList.queryCondition);
                    // this.$refs.merchantsList.queryHandler();
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            } else if (args[2] === 2) {
                this.changeUsersStatus({
                    id: [args[1].id],
                    status: 0,
                })
                .then(() => {
                    // this.$refs.merchantsList.queryHandler();
                    this.getMerchantsListHandler(this.$refs.merchantsList.queryCondition);
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            }
        },
        searchMarket(name) {
            if (!name) {
                this.$set(this, 'marketData', []);
                return 0;
            }
            debounce(() => {
                this.getMarketList({
                    condition: {
                        marketName: name,
                        cityCode: '',
                        districtCode: '',
                        proviceCode: '',
                        all: 1,
                        status: 1,
                    },
                    paging: {
                        pageSize: 10,
                        pageIndex: 1,
                    }
                })
                .then(() => {
                    this.$set(this, 'marketData', this.marketList.itemList);
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            }, 500)();
            return 0;
        },
        usersExportHandler() {
            this.exportLoading = true;
            this.usersExport(this.$refs.merchantsList.queryCondition.condition)
            .then((data) => {
                this.downloadUrl = this.exportUrl(data);
            })
            .then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            })
            .catch((err) => {
                this.exportLoading = false;
                this.$notify({
                    title: '错误',
                    message: err.message || err,
                    type: 'error',
                });
            });
        },
    },
    mounted() {
        // this.$refs.merchantsList.queryHandler();
    },
};
</script>
<style lang='less' scoped>
#merchants-list {
    .search-row {
        margin-bottom: 20px;
    }
    .searchMarketInput {
        * {
            border-color: #bfcbd9!important;
        }
    }
}
</style>
