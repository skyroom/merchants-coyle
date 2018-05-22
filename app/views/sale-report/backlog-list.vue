<template>
    <div id="saleOrder">
        <gz-list
            ref="saleOrderList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="saleOrderList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :hasCheckbox="'true'"
            :checkboxHandler="checkboxHandler"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="left" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNumber" placeholder="订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="市场：">
                            <el-input v-model="searchForm.marketName" placeholder="市场"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.submitUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select v-model="searchForm.status" placeholder="全部状态">
                                <el-option
                                        v-for="item in status"
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
                    <el-form-item label="创建时间：">
                        <el-date-picker
                                v-model="searchForm.startTime"
                                type="datetime"
                                style="width: 100%"
                                placeholder="创建时间从"
                                :editable="false">
                        </el-date-picker>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至：">
                            <el-date-picker
                                    v-model="searchForm.endTime"
                                    type="datetime"
                                    placeholder="至"
                                    style="width: 100%"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="收款日：">
                        <el-date-picker
                                v-model="searchForm.receiveStartTime"
                                type="date"
                                style="width: 100%"
                                placeholder="收款日从"
                                :editable="false">
                        </el-date-picker>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至：">
                            <el-date-picker
                                    v-model="searchForm.receiveEndTime"
                                    type="date"
                                    style="width: 100%"
                                    placeholder="至"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="$refs.saleOrderList.queryHandler()">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <el-button type="primary" @click="changeStatus" v-if="checkAuth('seller-edit-status')" >作废</el-button>
                <a ref="downloadDOM" :href="downloadUrl" download="采购单列表" v-show></a>
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

const colNameMap = [
    {
        displayName: '操作',
        type: 'statusButton',
        width: 80,
    },
    {
        key: 'orderNumber',
        displayName: '订单号',
        width: 220,
    },
    {
        key: 'goodsNumber',
        displayName: '品种数',
        width: 120,
    },
    {
        key: 'saleAmount',
        displayName: '销售总额',
        width: 120,
    },
    {
        key: 'agencyFee',
        displayName: '代办费',
        width: 120,
    },
    {
        key: 'otherFeeAmount',
        displayName: '其他费用总和',
        width: 150,
    },
    {
        key: 'consignmentAmount',
        displayName: '代销金额',
        width: 120,
    },
    {
        key: 'cashAmount',
        displayName: '现金收款',
        width: 120,
    },
    {
        key: 'payment',
        displayName: '应回款',
        width: 120,
    },
    {
        key: 'payDay',
        displayName: '账期',
        width: 120,
    },
    {
        key: 'receiveDate',
        displayName: '收款日',
        width: 200,
    },
    {
        key: 'marketName',
        displayName: '市场',
        width: 120,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 120,
    },
    {
        key: 'submitUserName',
        displayName: '创建人',
        width: 120,
    },
    {
        key: 'submitTime',
        displayName: '创建时间',
        width: 200,
    },
    {
        key: 'auditTime',
        displayName: '修改时间',
        width: 200,
    },
    {
        key: 'auditUserName',
        displayName: '修改人',
        width: 120,
    },

];
const status = [
    {
        value: null,
        label: '全部',
    },
    {
        value: 3,
        label: '待回款',
    },
    {
        value: 4,
        label: '已回款',
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
                valiateFunc: () => this.checkAuth('backlog-detail'),
            }],
            pageShow: true,
            loading: true,
            exportLoading: false,
            saleOrderIds: [],
            searchForm: {
                orderNumber: '',
                marketName: '',
                submitUserName: '',
                status: null,
                startTime: '',
                endTime: '',
                receiveStartTime: '',
                receiveEndTime: '',
            },
            thisCondition: {},
            downloadUrl: '',
            status,
        };
    },
    computed: {
        ...mapGetters([
            'saleOrderList',
        ]),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.saleOrderList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getSaleOrderList',
            'getBacklogKey',
            'setSaleOrderStatus'
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                startTime: listMethodBase.formatTime(this.searchForm.startTime) || '',
                endTime: listMethodBase.formatTime(this.searchForm.endTime) || '',
                receiveStartTime: listMethodBase.formatTime(this.searchForm.receiveStartTime) || '',
                receiveEndTime: listMethodBase.formatTime(this.searchForm.receiveEndTime) || '',
            });
            this.$set(this, 'thisCondition', thisCondiction);
            return listMethodBase.isTimeError(thisCondiction.startTime,
                thisCondiction.endTime) ||
                listMethodBase.isTimeError(thisCondiction.receiveStartTime,
                    thisCondiction.receiveEndTime);
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getSaleOrderList({
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
            return this.saleOrderList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    receiveDate: listMethodBase.formatDate(item.receiveDate),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    auditTime: listMethodBase.formatTime(item.auditTime),
                });
                return targetItem;
            });
        },
        statusMap(val) {
            if (val === 3) {
                return '待回款';
            } else if (val === 4) {
                return '已回款';
            } else if (val === -1) {
                return '已作废';
            }
            return '未知';
        },
        // 单选以后回调将选中的项存入data
        checkboxHandler(val) {
            this.saleOrderIds = val.map(item => item);
        },
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/backlog-detail/${args[1].id}`);
        },
        // 导出按钮点击触发函数
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = true;
            this.getBacklogKey(this.thisCondition)
            .then((data) => {
                this.downloadUrl = this.exportUrl(data);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                this.exportLoading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 作废按钮点击触发函数
        changeStatus() {
            if (listMethodBase.isNoSelectedRow(this.saleOrderIds)) return;
            if (listMethodBase.isFalseDate(-1, this.saleOrderIds, 'status', '您选择的数据已有作废的订单！')) return;
            this.$confirm('你确定要作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const ids = this.saleOrderIds.map(item => item.id);
                this.setSaleOrderStatus(ids).then(() => {
                    listMethodBase.successTip();
                    this.getListHanlder(this.$refs.saleOrderList.queryCondition);
                }).catch((err) => {
                    listMethodBase.errorTip(err.message || err);
                });
            }).catch(() => {
            });
        },
    },
};
</script>


<style lang="less" scoped>
    .handler-toolbar-inner {
    }
</style>
