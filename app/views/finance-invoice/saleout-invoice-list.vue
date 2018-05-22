<template>
    <div id="saleout-invoice-list">
        <gz-list
            ref="saleoutInvoiceList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="saleoutInvoiceList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="销售单号：">
                            <el-input v-model="searchForm.fNumber" placeholder="销售单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库仓库/市场：">
                            <dictionary-search
                                :type="5"
                                placeholder="请输入仓库名称"
                                ref="dictionaryWarehouseOut"
                            ></dictionary-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="顾客名称：">
                            <dictionary-search
                                :type="1"
                                placeholder="请输入顾客名称"
                                ref="dictionaryFCustomer"
                            ></dictionary-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单来源：">
                            <el-select style="width:100%" v-model="searchForm.sourceSystem">
                                <el-option
                                    v-for="item in sourceSystemOptions"
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
                        <el-form-item label="销售日期起：">
                            <el-date-picker
                                v-model="searchForm.fBizDateStart"
                                style="width:100%"
                                type="date"
                                placeholder="销售日期起"
                                :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="销售日期止：">
                            <el-date-picker
                                v-model="searchForm.fBizDateEnd"
                                style="width:100%"
                                type="date"
                                placeholder="销售日期止"
                                :editable="false">
                            </el-date-picker>
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
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.createUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认人：">
                            <el-input v-model="searchForm.auditUserName" placeholder="确认人"></el-input>
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
                        <el-form-item label="销售渠道：" prop="channel">
                            <el-select style="width:100%" v-model="searchForm.channel" placeholder="请选择">
                                <el-option
                                    v-for="item in channelOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button
                    type="primary"
                    @click="$refs.saleoutInvoiceList.queryHandler()"
                    v-if="checkAuth('sale-out-stock')"
                    >查询</el-button>
                <el-button
                    type="primary"
                    @click="goToAdd"
                    v-if="checkAuth('sale-out-stock-create')"
                    >录入销售出库单</el-button>
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
        displayName: '销售单号',
        minWidth: 180,
    },
    {
        key: 'fBizDate',
        displayName: '销售日期',
        width: 180,
    },
    {
        key: 'channel',
        displayName: '销售渠道',
        width: 130,
    },
    {
        key: 'sourceSystem',
        displayName: '订单来源',
        width: 130,
    },
    {
        key: 'fCustomerName',
        displayName: '顾客名称',
        width: 150,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 100,
    },
    {
        key: 'fWarehouseName',
        displayName: '出库仓库/市场',
        width: 180,
    },
    {
        key: 'orderAmount',
        displayName: '订单总金额',
        width: 110,
    },
    {
        key: 'fPaymentTypeID',
        displayName: '支付方式',
        width: 150,
    },
    {
        key: 'skuCount',
        displayName: 'SKU个数',
        width: 110,
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

const channelOptions = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 1,
        label: '外贸',
    },
    {
        value: 2,
        label: '东南区销售',
    },
    {
        value: 3,
        label: '云上妙鲜',
    },
    {
        value: 4,
        label: '西北区销售',
    },
    {
        value: 5,
        label: '鲜花业务',
    },
    {
        value: 6,
        label: '精品推广',
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

// 订单来源
const sourceSystemOptions = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 1001,
        label: '海信下行',
    },
    {
        value: 2001,
        label: '海信上行',
    },
    {
        value: 3001,
        label: 'B2B',
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
                valiateFunc: () => this.checkAuth('sale-out-stock-detail'),
            }],
            pageShow: true,
            loading: true,
            searchForm: {
                fNumber: '', // 销售单号
                fWarehouseID: '', // 出库仓库/市场
                // status: '', // 状态
                fCustomerID: '', // 顾客名称
                sourceSystem: null, // 订单来源
                channel: null, // 销售渠道
                fBizDateStart: '', // 销售日期开始
                fBizDateEnd: '', // 销售日期结束
                createUserName: '', // 创建人
                createDateStart: '', // 创建时间开始
                createDateEnd: '', // 创建时间结束
                auditUserName: '', // 确认人
                auditDateStart: '', // 确认时间开始
                auditDateEnd: '', // 确认时间结束
            },
            thisCondition: {},
            statusOptions, // 状态列表
            channelOptions, // 销售渠道列表
            sourceSystemOptions, // 订单来源列表
        };
    },
    computed: {
        ...mapGetters([
            'saleoutInvoiceList',
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
        this.$refs.saleoutInvoiceList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getSaleoutInvoiceList',
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                fBizDateStart: listMethodBase.formatDate(this.searchForm.fBizDateStart) || '',
                fBizDateEnd: listMethodBase.formatDate(this.searchForm.fBizDateEnd) || '',
                auditDateStart: listMethodBase.formatTime(this.searchForm.auditDateStart) || '',
                auditDateEnd: listMethodBase.formatTime(this.searchForm.auditDateEnd) || '',
                createDateStart: listMethodBase.formatTime(this.searchForm.createDateStart) || '',
                createDateEnd: listMethodBase.formatTime(this.searchForm.createDateEnd) || '',
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
            // 赋值调出仓库id
            this.thisCondition.fWarehouseID = this.$refs.dictionaryWarehouseOut.searchValue || null;
            // 赋值顾客id
            this.thisCondition.fCustomerID = this.$refs.dictionaryFCustomer.searchValue || null;
            // TODO 获取调拨入库单列表
            this.getSaleoutInvoiceList({
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
            return this.saleoutInvoiceList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    channel: this.channelMap(item.channel),
                    sourceSystem: this.sourceSystemMap(item.sourceSystem),
                    fPaymentTypeID: this.fPaymentTypeMap(item.fPaymentTypeID),
                    fBizDate: listMethodBase.formatDate(item.fBizDate),
                    auditDate: listMethodBase.formatTime(item.auditDate),
                    createDate: listMethodBase.formatTime(item.createDate),
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
        channelMap(channel) {
            switch (channel) {
                case 1:
                    return '外贸';
                case 2:
                    return '东南区销售';
                case 3:
                    return '云上妙鲜';
                case 4:
                    return '西北区销售';
                case 5:
                    return '鲜花业务';
                case 6:
                    return '精品推广';
                default:
                    return '未知';
            }
        },
        sourceSystemMap(sourceSystem) {
            switch (sourceSystem) {
                case 1001:
                    return '海信下行';
                case 2001:
                    return '海信上行';
                case 3001:
                    return 'B2B';
                default:
                    return '未知';
            }
        },
        fPaymentTypeMap(fPaymentType) {
            switch (fPaymentType) {
                case '1':
                    return '现销';
                default:
                    return '未知';
            }
        },
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/saleout-invoice-detail/${args[1].sysId}`);
        },
        goToAdd() {
            this.$router.push('/saleout-invoice-add');
        },
    },
};
</script>


<style lang="less" scoped>
    #saleout-invoice-list {
    }
</style>
