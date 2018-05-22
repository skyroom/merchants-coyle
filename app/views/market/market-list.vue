<template>
<div id="market-list">
    <gz-list
    ref="marketList"
    @getData="getMarketListHandler"
    :form="searchForm"
    :originData="marketListFormat"
    :originPaging="marketListPagingFormat"
    :colNameMap="colNameMap"
    @cellClick="cellClick"
    :loading="loading"
    :pageShow="pageShow"
    :operation="operation"
    @operation-click="operationClickHandler"
    >
        <el-form ref="searchForm" :model="searchForm" label-width="90px" slot="searchForm" label-position="left">
            <el-row :gutter="20">
                <el-col :span="11">
                    <el-form-item label="地区：" style="width:100%">
                        <el-col :span="24">
                            <el-cascader
                                v-model="region"
                                placeholder="选择地区"
                                @change="handleItemChange"
                                :options="regionTreeList"
                                change-on-select
                                clearable
                                :props="typeProps"
                                style="width:100%"
                                >
                            </el-cascader>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="市场名称：">
                        <el-input v-model.trim="searchForm.marketName" placeholder="市场名称"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="状态：">
                        <el-select v-model="searchForm.status" placeholder="全部状态">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
            </el-row>
        </el-form>
        <div slot="handlerToolbar">
            <el-row>
                <el-button type="primary" @click="getSearch()" v-if="checkAuth('market-search')">查询</el-button>
                <el-button type="primary" @click="marketExportHandler()" :loading="exportLoading" v-if="checkAuth('market-search')">导出</el-button>
                <el-button type="primary" @click="addHandler" v-if="checkAuth('market-add')">新建</el-button>
                <a ref="downloadDOM" :href="downloadUrl" v-show>导出</a>
            </el-row>
        </div>
    </gz-list>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="small">
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" label-width="100px" label-position="left">
            <el-form-item label="市场名称：" prop="name">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.name" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="市场简称：" prop="shortName">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.shortName" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="地区：" style="width:100%" prop="region">
                <el-col :span="16">
                    <el-cascader
                        v-model="modifyForm.region"
                        placeholder="选择地区"
                        :options="regionTreeList"
                        @active-item-change="handleItemChange"
                        :props="typeProps"
                        style="width:100%"
                        >
                    </el-cascader>
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
import { cloneDeep } from 'lodash';
import {
    mapGetters,
    mapActions,
} from 'vuex';
import List from '../../components/biz/list';
import BaseComponent from '../base';
import Auth from '../auth';

const colNameMap = [{
    displayName: '操作',
    type: 'statusButton',
    width: 150,
},
{
    key: 'areaName',
    displayName: '地区',
    minWidth: 160,
},
{
    key: 'marketName',
    displayName: '市场名称',
    width: 140,
},
{
    key: 'shortName',
    displayName: '简称',
    width: 140,
},
{
    key: 'hotKey',
    displayName: '拼音码',
    width: 100,
},
{
    key: 'status_f',
    displayName: '状态',
    width: 80,
},
{
    key: 'createUserName',
    displayName: '创建人',
    width: 100,
},
{
    key: 'createTime_f',
    displayName: '创建时间',
    width: 180,
},
{
    key: 'updateUserName',
    displayName: '修改人',
    width: 100,
},
{
    key: 'updateTime_f',
    displayName: '修改时间',
    width: 180,
}];
export default {
    extends: BaseComponent,
    mixins: [Auth],
    components: {
        [List.name]: List,
    },
    data() {
        const validateType = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('请选择类别'));
            } else {
                callback();
            }
        };
        return {
            currentRegion: {},
            region: [],
            downloadUrl: '',
            exportLoading: false,
            searchForm: {
                marketName: '',
                cityCode: '',
                districtCode: '',
                proviceCode: '',
                // status: 2,
                all: 0,
            },
            loading: false,
            pageShow: false,
            typeArray: [],
            colNameMap,
            operation: [{
                text: '编辑',
                buttonType: 'primary',
                valiateFunc: () => this.checkAuth('market-edit'),
            }, {
                text: '启用',
                buttonType: 'primary',
                valiateFunc: (status) => {
                    if (status === 0 && this.checkAuth('market-edit')) {
                        return true;
                    }
                    return false;
                },
                param: 'status',
            }, {
                text: '禁用',
                buttonType: 'danger',
                valiateFunc: (status) => {
                    if (status === 1 && this.checkAuth('market-edit')) {
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
            typeProps: {
                value: 'sysNo',
                label: 'name',
                children: 'children',
            },
            dialogTitle: '',
            mode: '',
            multipleSelection: [],
            dialogFormVisible: false,
            modifyForm: {
                areaId: 0,
                name: '',
                shortName: '',
                region: [],
            },
            modifyFormRules: {
                name: [{
                    required: true,
                    message: '请输入市场名称',
                    trigger: 'blur,change',
                }],
                region: [{
                    required: true,
                    message: '请选择市场地区',
                    trigger: 'blur,change',
                    validator: validateType,
                }],
            },
            regionTreeList: [],
        };
    },
    computed: {
        ...mapGetters([
            'marketList',
            'regionList',
        ]),
        marketListFormat() {
            return this.marketList.itemList.map((item) => {
                const targetItem = Object.assign({}, item);
                targetItem.status_f = this.statusMap[targetItem.status];
                if (item.createTime) {
                    targetItem.createTime_f = item.createTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                if (item.updateTime) {
                    targetItem.updateTime_f = item.updateTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                return targetItem;
            });
            // return this.marketList.itemList;
        },
        marketListPagingFormat() {
            if (this.marketList.paging === null) {
                const pagingTemp = {
                    total: 0,
                };
                return pagingTemp;
            }
            return this.marketList.paging;
        },
    },
    methods: {
        ...mapActions([
            'getMarketList',
            'addMarket',
            'editMarket',
            'changeMarketStatus',
            'getMarketDetail',
            'marketExport',
            'getRegionThreeList',
            'marketExport',
        ]),
        cellClick(row, column) {
            if (column.label !== '操作') return;
            // this.$router.push(`/helpDetail/edit/${row.id}`);
        },
        getMarketListHandler(queryCondition) {
            this.$set(this, 'loading', true);
            this.$set(this, 'pageShow', false);
            const queryConditionQuery = cloneDeep(queryCondition);
            queryConditionQuery.condition.proviceCode = String(this.region[0] || '');
            queryConditionQuery.condition.cityCode = String(this.region[1] || '');
            queryConditionQuery.condition.districtCode = String(this.region[2] || '');
            this.getMarketList(queryConditionQuery)
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
            this.$refs.marketList.queryHandler();
        },
        addHandler() {
            if (this.$refs.modifyForm && this.$refs.modifyForm.resetFields) {
                this.$refs.modifyForm.resetFields();
            }
            this.$set(this, 'mode', 'add');
            this.$set(this.modifyForm, 'areaId', '');
            this.$set(this.modifyForm, 'name', '');
            this.$set(this.modifyForm, 'shortName', '');
            this.$set(this.modifyForm, 'region', []);
            this.$set(this, 'dialogFormVisible', true);
            this.$set(this, 'dialogTitle', '销售市场添加');
        },
        saveHandler() {
            this.$refs.modifyForm.validate((valid) => {
                if (valid) {
                    if (this.mode === 'add') {
                        const dataQuery = cloneDeep(this.modifyForm);
                        dataQuery.areaId = String(dataQuery.region[dataQuery.region.length - 1]);
                        delete dataQuery.id;
                        delete dataQuery.region;
                        this.addMarket(dataQuery)
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success',
                            });
                            this.$set(this, 'dialogFormVisible', false);
                            this.$refs.marketList.queryHandler();
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
                        dataQuery.areaId = dataQuery.region[dataQuery.region.length - 1];
                        dataQuery.marketName = dataQuery.name;
                        delete dataQuery.region;
                        this.editMarket({
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
                            this.getMarketListHandler(this.$refs.marketList.queryCondition);
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
                this.$set(this.modifyForm, 'id', args[1].id || 0);
                this.$set(this.modifyForm, 'name', args[1].marketName || '');
                this.$set(this.modifyForm, 'shortName', args[1].shortName || '');
                this.$set(this.modifyForm, 'region', [Number(args[1].proviceCode), Number(args[1].cityCode), Number(args[1].districtCode)]);
                this.handleItemChange([Number(args[1].proviceCode)], () => {
                    this.handleItemChange([Number(args[1].proviceCode), Number(args[1].cityCode)]);
                });
                this.$set(this, 'dialogFormVisible', true);
                this.$set(this, 'dialogTitle', '销售市场编辑');
                this.$set(this, 'mode', 'edit');
            } else if (args[2] === 1) {
                this.changeMarketStatus({
                    id: [args[1].id],
                    status: 1,
                })
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                    this.getMarketListHandler(this.$refs.marketList.queryCondition);
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            } else if (args[2] === 2) {
                this.changeMarketStatus({
                    id: [args[1].id],
                    status: 0,
                })
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                    this.getMarketListHandler(this.$refs.marketList.queryCondition);
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
        handleItemChange(val, callback) {
            if (val.length === 3) return;
            this.getRegionThreeListHandle({
                level: val.length,
                sysNo: val[val.length - 1],
            }, val, callback);
        },
        getRegionThreeListHandle(query, val, callback) {
            this.searchInsertObject(this.regionTreeList, val[val.length - 1]); /*  eslint max-len: ["error", 200]  */
            // if (this.currentRegion.children && this.currentRegion.children.length) return 0;
            this.getRegionThreeList(query)
            .then((data) => {
                this.currentRegion.children = data.map((item) => {
                    const targetItem = item;
                    if (val.length !== 2) {
                        targetItem.children = [];
                    }
                    return targetItem;
                });
                if (callback) {
                    callback();
                }
            })
            .catch((err) => {
                this.$notify({
                    title: '错误',
                    message: err.message || err,
                    type: 'error',
                });
            });
            return 0;
        },
        searchInsertObject(array, targetSysNo) {
            return array.forEach((item) => {
                if (item.sysNo === targetSysNo) {
                    this.$set(this, 'currentRegion', item);
                } else if (item.children && item.children.length) {
                    this.searchInsertObject(item.children, targetSysNo);
                }
            });
        },
        marketExportHandler() {
            this.exportLoading = true;
            const queryConditionQuery = cloneDeep(this.$refs.marketList.queryCondition.condition);
            queryConditionQuery.proviceCode = String(this.region[0] || '');
            queryConditionQuery.cityCode = String(this.region[1] || '');
            queryConditionQuery.districtCode = String(this.region[2] || '');
            queryConditionQuery.all = 1;
            this.marketExport(queryConditionQuery)
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
        this.$refs.marketList.queryHandler();
        this.getRegionThreeList({
            level: 0,
            sysNo: 0,
        })
        .then((data) => {
            this.regionTreeList = data.map((item) => {
                const targetItem = item;
                targetItem.children = [];
                targetItem.level = 1;
                return targetItem;
            });
        })
        .catch((err) => {
            this.$notify({
                title: '错误',
                message: err.message || err,
                type: 'error',
            });
        });
    },
};
</script>
<style lang='less' scoped>
#market-list {

}
</style>
