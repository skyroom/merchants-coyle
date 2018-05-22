<template>
    <div id="purchase">
        <gz-list
            ref="purchaseList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="purchaseList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :hasCheckbox="'true'"
            :checkboxHandler="checkboxHandler"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="left" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="采购单号：">
                            <el-input v-model="searchForm.orderNumber" placeholder="采购单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.userNumber" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select style="width:100%" v-model="searchForm.status" placeholder="全部状态">
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
                                    v-model="searchForm.purchaseStartTime"
                                    style="width:100%"
                                    type="datetime"
                                    placeholder="创建时间从"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至：">
                            <el-date-picker
                                    v-model="searchForm.purchaseEndTime"
                                    type="datetime"
                                    style="width:100%"
                                    placeholder="至"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="$refs.purchaseList.queryHandler()" v-if="checkAuth('purchase-search')">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading" v-if="checkAuth('purchase-search')">导出</el-button>
                <el-button type="primary" @click="changeStatus" v-if="checkAuth('purchase-edit-status')">作废</el-button>
                <a ref="downloadDOM" :href="downloadUrl" download="采购单明细" v-show></a>
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
        displayName: '采购单号',
        minWidth: 220,
    },
    {
        key: 'goodsNumber',
        displayName: '品种数',
        width: 120,
    },
    {
        key: 'totalWeight',
        displayName: '总重量',
        width: 120,
    },
    {
        key: 'totalPrice',
        displayName: '总价格',
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
        width: 150,
    },
    {
        key: 'submitTime',
        displayName: '创建时间',
        width: 180,
    },
    {
        key: 'audiTime',
        displayName: '作废时间',
        width: 180,
    },
    {
        key: 'auditUserName',
        displayName: '修改人',
        width: 90,
    },
];
const status = [
    {
        value: null,
        label: '全部状态'
    },
    {
        value: 0,
        label: '已完成'
    },
    {
        value: -1,
        label: '已作废'
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
                valiateFunc: () => this.checkAuth('purchase-detail'),
            }],
            pageShow: true,
            loading: true,
            exportLoading: false,
            purchaseIds: [],
            searchForm: {
                orderNumber: '',
                userNumber: '',
                status: null,
                purchaseStartTime: '',
                purchaseEndTime: '',
            },
            thisCondition: {},
            downloadUrl: '',
            status,
        };
    },
    computed: {
        ...mapGetters([
            'purchaseList',
            'purchaseKey'
        ]),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.purchaseList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus'
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                purchaseStartTime: listMethodBase.formatTime(this.searchForm.purchaseStartTime) || '',
                purchaseEndTime: listMethodBase.formatTime(this.searchForm.purchaseEndTime) || '',
            });
            this.$set(this, 'thisCondition', thisCondiction);
            return listMethodBase.isTimeError(thisCondiction.purchaseStartTime,
                thisCondiction.purchaseEndTime);
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getPurchaseList({
                paging: params.paging,
                condition: this.thisCondition
            }).then(() => {
                this.loading = false;
                this.pageShow = true;
            }).catch((err) => {
                this.loading = false;
                this.pageShow = true;
                this.$notify({
                    message: err.message || err,
                    type: 'warning',
                });
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            return this.purchaseList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    purchaseTime: listMethodBase.formatTime(item.purchaseTime),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    audiTime: listMethodBase.formatTime(item.audiTime),
                });
                return targetItem;
            });
        },
        statusMap(statu) {
            switch (statu) {
                case 0:
                    return '已完成';
                case -1:
                    return '已作废';
                default:
                    return '未知';
            }
        },
        // 单选以后回调将选中的项存入data
        checkboxHandler(val) {
            this.purchaseIds = val.map(item => item);
        },
        // 详情按钮点击触发函数
        clickToCheck(args) {
            this.$router.push(`/purchase-detail/${args[1].id}`);
        },
        // 导出按钮点击触发函数
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = true;
            this.getPurchaseKey(this.thisCondition)
            .then(() => {
                this.downloadUrl = this.exportUrl(this.purchaseKey);
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
            if (listMethodBase.isNoSelectedRow(this.purchaseIds)) return;
            if (listMethodBase.isFalseDate(-1, this.purchaseIds, 'status', '您选择的数据已有作废的订单！')) return;
            this.$confirm('你确定要作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const idArr = this.purchaseIds.map(item => item.id);
                this.setPurchaseStatus(idArr).then(() => {
                    listMethodBase.successTip();
                    this.getListHanlder(this.$refs.purchaseList.queryCondition);
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
