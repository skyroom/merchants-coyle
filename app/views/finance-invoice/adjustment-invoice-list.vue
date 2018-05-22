<template>
    <div id="adjustment-invoice-list">
        <gz-list
            ref="adjustmentInvoiceList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="adjustmentInvoiceList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="损益单号：">
                            <el-input v-model="searchForm.fnumber" placeholder="损益单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="损益日期起：">
                            <el-date-picker
                                v-model="searchForm.fBizDateBegin"
                                style="width:100%"
                                type="date"
                                placeholder="损益日期起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="损益日期止：">
                            <el-date-picker
                                v-model="searchForm.fBizDateEnd"
                                style="width:100%"
                                type="date"
                                placeholder="损益日期止"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型：">
                            <el-select style="width:100%" v-model="searchForm.fbizTypeId" placeholder="全部">
                                <el-option
                                    v-for="item in fbizTypeIdOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="仓库/市场：">
                            <dictionary-search
                                :type="5"
                                placeholder="请输入仓库/市场名称"
                                ref="dictionaryWarehouse"
                            ></dictionary-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认时间起：">
                            <el-date-picker
                                v-model="searchForm.auditDateBegin"
                                style="width:100%"
                                type="datetime"
                                placeholder="确认时间起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认时间止：">
                            <el-date-picker
                                v-model="searchForm.auditDateEnd"
                                style="width:100%"
                                type="datetime"
                                placeholder="确认时间止"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select style="width:100%" v-model="searchForm.status">
                                <el-option
                                    v-for="item in statusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.createUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间起：">
                            <el-date-picker
                                v-model="searchForm.createDateBegin"
                                style="width:100%"
                                type="datetime"
                                placeholder="创建时间起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间止：">
                            <el-date-picker
                                v-model="searchForm.createDateEnd"
                                style="width:100%"
                                type="datetime"
                                placeholder="创建时间止"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button
                    type="primary"
                    @click="$refs.adjustmentInvoiceList.queryHandler()"
                    v-if="checkAuth('adjust-search')"
                    >查询</el-button>
                <el-button
                    type="primary"
                    @click="goToAdd"
                    v-if="checkAuth('adjust-insert')"
                    >录入损益单</el-button>
            </div>
        </gz-list>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Auth from '../auth';
import BaseComponent from '../base';
import List from '../../components/biz/list';
import listMethodBase from '../../components/biz/listMethodBase';
import DictionarySearch from './dictionary-search';

const colNameMap = [
    {
        displayName: '操作',
        type: 'statusButton',
        width: 80,
    },
    {
        key: 'fnumber',
        displayName: '损益单号',
        minWidth: 220,
    },
    {
        key: 'fbizDate',
        displayName: '损益日期',
        width: 120,
    },
    {
        key: 'fbizName',
        displayName: '业务类型',
        width: 120,
    },
    {
        key: 'warehouseName',
        displayName: '仓库/市场',
        width: 120,
    },
    {
        key: 'sku',
        displayName: 'SKU个数',
        width: 120,
    },
    {
        key: 'status',
        displayName: '状态',
        width: 120,
    },
    {
        key: 'createUserName',
        displayName: '创建人',
        width: 120,
    },
    {
        key: 'createDate',
        displayName: '创建时间',
        width: 180,
    },
    {
        key: 'auditUserName',
        displayName: '确认人',
        width: 120,
    },
    {
        key: 'auditDate',
        displayName: '确认时间',
        width: 180,
    },
];

const statusOptions = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 0,
        label: '待确认',
    },
    {
        value: 1,
        label: '已确认',
    },
    {
        value: -1,
        label: '已作废',
    }
];

const fbizTypeIdOptions = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 'Nz878AEgEADgAABGwKg/GiQHQ1w=',
        label: '盘盈入库',
    },
    {
        value: 'N5d2igEgEADgAAB0wKg/GiQHQ1w=',
        label: '盘亏出库',
    },
];

export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            operation: [{
                text: '详情',
                key: 'detail',
                valiateFunc: () => this.checkAuth('adjust-detail'),
            }],
            pageShow: true,
            loading: true,
            searchForm: {
                fnumber: '', // 损益单号
                fBizDateBegin: '', // 损益日期开始
                fBizDateEnd: '', // 损益日期开结束
                fbizTypeId: null, // 业务类型
                warehouseId: '', // 仓库/市场id
                auditDateBegin: '', // 确认时间开始
                auditDateEnd: '', // 确认时间结束
                status: null, // 订单状态
                createUserName: '', // 创建人
                createDateBegin: '', // 创建时间开始
                createDateEnd: '', // 创建时间结束
            },
            thisCondition: {},
            statusOptions, // 状态列表
            fbizTypeIdOptions, // 业务类型列表
        };
    },
    computed: {
        ...mapGetters([
            'adjustmentInvoiceList',
            'purchaseList',
            'purchaseKey'
        ]),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
        [DictionarySearch.name]: DictionarySearch,
    },
    mounted() {
        this.$refs.adjustmentInvoiceList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getAdjustmentInvoiceList',
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus',
            'dictionarySearch',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                fBizDateBegin: listMethodBase.formatDate(this.searchForm.fBizDateBegin) || '',
                fBizDateEnd: listMethodBase.formatDate(this.searchForm.fBizDateEnd) || '',
                auditDateBegin: listMethodBase.formatTime(this.searchForm.auditDateBegin) || '',
                auditDateEnd: listMethodBase.formatTime(this.searchForm.auditDateEnd) || '',
                createDateBegin: listMethodBase.formatTime(this.searchForm.createDateBegin) || '',
                createDateEnd: listMethodBase.formatTime(this.searchForm.createDateEnd) || '',
            });
            this.$set(this, 'thisCondition', thisCondiction);
            /* eslint-disable max-len */
            if (listMethodBase.isTimeError(thisCondiction.fBizDateBegin, thisCondiction.fBizDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.auditDateBegin, thisCondiction.auditDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.createDateBegin, thisCondiction.createDateEnd)) {
                return true;
            }
            return false;
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            // TODO 获取损益单列表
            // 赋值仓库/市场id
            this.thisCondition.warehouseId = this.$refs.dictionaryWarehouse.searchValue;
            this.getAdjustmentInvoiceList({
                paging: params.paging,
                condition: this.thisCondition
            })
            .then(() => {
                this.loading = false;
                this.pageShow = true;
            })
            .catch((err) => {
                this.loading = false;
                this.pageShow = true;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            return this.adjustmentInvoiceList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status: this.statusMap(item.status),
                    fbizDate: listMethodBase.formatDate(item.fbizDate),
                    createDate: listMethodBase.formatTime(item.createDate),
                    auditDate: listMethodBase.formatTime(item.auditDate),
                });
                return targetItem;
            });
        },
        statusMap(status) {
            switch (status) {
                case 0:
                    return '待确认';
                case -1:
                    return '已作废';
                case 1:
                    return '已确认';
                default:
                    return '未知';
            }
        },
        // fbizTypeMap(status) {
        //     switch (status) {
        //         case 'Nz878AEgEADgAABGwKg/GiQHQ1w=':
        //             return '盘盈入库';
        //         case 'N5d2igEgEADgAAB0wKg/GiQHQ1w=':
        //             return '盘亏出库';
        //         default:
        //             return '未知';
        //     }
        // },
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/adjustment-invoice-detail/${args[1].sysId}?fbizTypeId=${args[1].fbizTypeId}&fid=${args[1].fid}`);
        },
        goToAdd() {
            this.$router.push('/adjustment-invoice-add');
        },
    },
};
</script>


<style lang="less" scoped>
    #adjustment-invoice-list {
    }
</style>
