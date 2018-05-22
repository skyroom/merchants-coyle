<template>
    <div id="transfer-invoice-list">
        <gz-list
            ref="transferInvoiceList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="transferInvoiceList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="调拨单号：">
                            <el-input v-model="searchForm.fNumber" placeholder="调拨单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调出仓库/市场：">
                            <dictionary-search
                                :type="5"
                                placeholder="请输入仓库名称"
                                ref="dictionaryWarehouseOut"
                            ></dictionary-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调入仓库/市场：">
                            <dictionary-search
                                :type="5"
                                placeholder="请输入仓库名称"
                                ref="dictionaryWarehouseIn"
                            ></dictionary-search>
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
                        <el-form-item label="调拨日期起：">
                            <el-date-picker
                                v-model="searchForm.fBizDateStart"
                                style="width:100%"
                                type="date"
                                placeholder="调拨日期起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调拨日期止：">
                            <el-date-picker
                                v-model="searchForm.fBizDateEnd"
                                style="width:100%"
                                type="date"
                                placeholder="调拨日期止"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认时间起：">
                            <el-date-picker
                                v-model="searchForm.auditDateStart"
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
                                v-model="searchForm.createDateStart"
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
                    @click="$refs.transferInvoiceList.queryHandler()"
                    v-if="checkAuth('tranfer-in-stock')"
                    >查询</el-button>
                <el-button
                    type="primary"
                    @click="goToAdd"
                    v-if="checkAuth('tranfer-in-stock-create')"
                    >录入调拨单</el-button>
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
        displayName: '调拨单号',
        minWidth: 200,
    },
    {
        key: 'fBizDate',
        displayName: '调拨日期',
        width: 180,
    },
    {
        key: 'tranferOutStoreWarehouseName',
        displayName: '调出仓库/市场',
        width: 180,
    },
    {
        key: 'tranferInStoreWarehouseName',
        displayName: '调入仓库/市场',
        width: 180,
    },
    {
        key: 'skuCount',
        displayName: 'SKU个数',
        width: 110,
    },
    {
        key: 'status',
        displayName: '状态',
        width: 100,
    },
    {
        key: 'createUserName',
        displayName: '创建人',
        width: 130,
    },
    {
        key: 'createDate',
        displayName: '创建时间',
        width: 180,
    },
    {
        key: 'auditUserName',
        displayName: '确认人',
        width: 130,
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

export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            operation: [{
                text: '详情',
                key: 'detail',
                valiateFunc: () => this.checkAuth('tranfer-in-stock-detail'),
            }],
            pageShow: true,
            loading: true,
            searchForm: {
                fNumber: '', // 调拨单号
                tranferOutStoreWarehouseId: '', // 调出仓库/市场
                tranferInStoreWarehouseId: '', // 调入仓库/市场
                status: null, // 状态
                fBizDateStart: '', // 调拨日期开始
                fBizDateEnd: '', // 调拨日期结束
                auditDateStart: '', // 确认时间开始
                auditDateEnd: '', // 确认时间结束
                createUserName: '', // 创建人
                createDateStart: '', // 创建时间开始
                createDateEnd: '', // 创建时间结束
            },
            thisCondition: {},
            statusOptions, // 状态列表
        };
    },
    computed: {
        ...mapGetters([
            'transferInvoiceList',
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
        this.$refs.transferInvoiceList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getTransferInvoiceList',
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                fBizDateStart: listMethodBase.formatDate(this.searchForm.fBizDateStart) || null,
                fBizDateEnd: listMethodBase.formatDate(this.searchForm.fBizDateEnd) || null,
                auditDateStart: listMethodBase.formatTime(this.searchForm.auditDateStart) || null,
                auditDateEnd: listMethodBase.formatTime(this.searchForm.auditDateEnd) || null,
                createDateStart: listMethodBase.formatTime(this.searchForm.createDateStart) || null,
                createDateEnd: listMethodBase.formatTime(this.searchForm.createDateEnd) || null,
            });
            this.$set(this, 'thisCondition', thisCondiction);
            /* eslint-disable max-len */
            if (listMethodBase.isTimeError(thisCondiction.fBizDateStart, thisCondiction.fBizDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.auditDateStart, thisCondiction.auditDateEnd)) {
                return true;
            }
            if (listMethodBase.isTimeError(thisCondiction.createDateStart, thisCondiction.createDateEnd)) {
                return true;
            }
            return false;
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            // 赋值调入仓库id
            this.thisCondition.tranferInStoreWarehouseId = this.$refs.dictionaryWarehouseIn.searchValue || null;
            // 赋值调出仓库id
            this.thisCondition.tranferOutStoreWarehouseId = this.$refs.dictionaryWarehouseOut.searchValue || null;
            // TODO 获取调拨入库单列表
            this.getTransferInvoiceList({
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
            return this.transferInvoiceList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status: this.statusMap(item.status),
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
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/transfer-invoice-detail/${args[1].sysId}`);
        },
        goToAdd() {
            this.$router.push('/transfer-invoice-add');
        },
    },
};
</script>


<style lang="less" scoped>
    #transfer-invoice-list {
    }
</style>
