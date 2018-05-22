<template>
    <div id="warehouse-entry-invoice-list">
        <gz-list
            ref="warehouseInvoiceList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="warehouseInvoiceList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="入库单号：">
                            <el-input v-model="searchForm.fNumber" placeholder="采购单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库日期起：">
                            <el-date-picker
                                v-model="searchForm.fBizDateBegin"
                                style="width:100%"
                                type="date"
                                placeholder="入库日期起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库日期止：">
                            <el-date-picker
                                v-model="searchForm.fBizDateEnd"
                                style="width:100%"
                                type="date"
                                placeholder="入库日期止"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商：">
                            <dictionary-search
                                :type="4"
                                placeholder="请输入供应商名称"
                                ref="dictionarySupplier"
                            ></dictionary-search>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="入库仓库：">
                            <dictionary-search
                                :type="5"
                                placeholder="请输入仓库名称"
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
                        <el-form-item label="采购渠道：">
                            <el-select style="width:100%" v-model="searchForm.channel">
                                <el-option
                                    v-for="item in channelOptions"
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
                    @click="$refs.warehouseInvoiceList.queryHandler()"
                    v-if="checkAuth('purchase-in-stock')"
                    >查询</el-button>
                <el-button
                    type="primary"
                    @click="goToAdd"
                    v-if="checkAuth('purchase-in-stock-create')"
                    >录入采购入库单</el-button>
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
        key: 'fNumber',
        displayName: '入库单号',
        minWidth: 220,
    },
    {
        key: 'fBizDate',
        displayName: '入库日期',
        width: 120,
    },
    {
        key: 'fSupplierName',
        displayName: '供应商',
        width: 120,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 120,
    },
    {
        key: 'fWarehouseName',
        displayName: '入库仓库',
        width: 120,
    },
    {
        key: 'totalMoney',
        displayName: '入库总金额',
        width: 140,
    },
    {
        key: 'skuCount',
        displayName: 'sku个数',
        width: 140,
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
    {
        key: 'channel',
        displayName: '采购渠道',
        width: 150,
    },
    {
        key: 'purchaseId',
        displayName: '关联采购单号',
        width: 180,
    },
    {
        key: 'createDate',
        displayName: '创建时间',
        width: 180,
    },
    {
        key: 'createUserName',
        displayName: '创建人',
        width: 120,
    },
];

const channelOptions = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 1,
        label: '大宗采购',
    },
    {
        value: 2,
        label: '妙鲜采购',
    },
    {
        value: 3,
        label: '鲜花采购',
    }
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

export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            operation: [{
                text: '详情',
                key: 'detail',
                valiateFunc: () => this.checkAuth('purchase-in-stock-detail'),
            }],
            pageShow: true,
            loading: true,
            searchForm: {
                fNumber: '', // 入库单号
                fBizDateBegin: '', // 入库日期开始
                fBizDateEnd: '', // 入库日期结束
                fSupplierId: '', // 供应商
                fWarehouseID: '', // 入库仓库
                createUserName: '', // 创建人
                createDateBegin: '', // 创建时间开始
                createDateEnd: '', // 创建时间结束
                auditDateBegin: '', // 确认时间开始
                auditDateEnd: '', // 确认时间结束
                channel: null, // 采购渠道
                status: null, // 订单状态
            },
            thisCondition: {},
            warehouseIDOptions: [], // 仓库列表
            channelOptions, // 采购渠道
            statusOptions, // 状态列表
        };
    },
    computed: {
        ...mapGetters([
            'warehouseInvoiceList',
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
        this.$refs.warehouseInvoiceList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getWarehouseInvoiceList',
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus',
            'dictionarySearch',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                createDateBegin: listMethodBase.formatTime(this.searchForm.createDateBegin) || null,
                createDateEnd: listMethodBase.formatTime(this.searchForm.createDateEnd) || null,
                auditDateBegin: listMethodBase.formatTime(this.searchForm.auditDateBegin) || null,
                auditDateEnd: listMethodBase.formatTime(this.searchForm.auditDateEnd) || null,
                fBizDateBegin: listMethodBase.formatDate(this.searchForm.fBizDateBegin) || null,
                fBizDateEnd: listMethodBase.formatDate(this.searchForm.fBizDateEnd) || null,
                fNumber: this.searchForm.fNumber || null,
                createUserName: this.searchForm.createUserName || null,
            });
            this.$set(this, 'thisCondition', thisCondiction);
            /* eslint-disable max-len */
            if (listMethodBase.isTimeError(thisCondiction.createDateBegin, thisCondiction.createDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.auditDateBegin, thisCondiction.auditDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.auditDateBegin, thisCondiction.auditDateEnd)) {
                return true;
            }
            return false;
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            // TODO 获取采购单入库列表
            // 赋值供应商id
            this.thisCondition.fSupplierId = this.$refs.dictionarySupplier.searchValue || null;
            // 赋值仓库id
            this.thisCondition.fWarehouseID = this.$refs.dictionaryWarehouse.searchValue || null;
            this.getWarehouseInvoiceList({
                paging: params.paging,
                condition: this.thisCondition
            }).then(() => {
                this.loading = false;
                this.pageShow = true;
            }).catch((err) => {
                this.loading = false;
                this.pageShow = true;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            return this.warehouseInvoiceList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    channel: this.channelMap(item.channel),
                    fBizDate: listMethodBase.formatDate(item.fBizDate),
                    auditDate: listMethodBase.formatTime(item.auditDate),
                    createDate: listMethodBase.formatTime(item.createDate),
                });
                return targetItem;
            });
        },
        statusMap(statu) {
            switch (statu) {
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
        channelMap(statu) {
            switch (statu) {
                case 1:
                    return '大宗采购';
                case 2:
                    return '妙鲜采购';
                case 3:
                    return '鲜花采购';
                default:
                    return '未知';
            }
        },
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/warehouse-entry-invoice-detail/${args[1].sysId}`);
        },
        goToAdd() {
            this.$router.push('/warehouse-entry-invoice-add');
        },
    },
};
</script>


<style lang="less" scoped>
    #warehouse-entry-invoice-list {
    }
</style>
