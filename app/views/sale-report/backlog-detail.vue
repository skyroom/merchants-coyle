<template>
    <div id="saleOrder-detail">
        <gz-list
                :loading="loading"
                :colNameMap="colNameMap"
                :originData="viewData"
                :maxCacheSize="5"
                :pageShow="pageShow"
                >
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="exportHandler"  :loading="exportLoading">导出</el-button>
                <a ref="downloadDOM" :href="downloadUrl" download="销售报表详情" v-show></a>
                <hr/>
                <div class="other">
                    <h4>其他费用明细</h4>
                    <el-row :gutter="20">
                        <el-col :span="6">入场费：{{otherFee.fee1}}</el-col>
                        <el-col :span="6">车位费：{{otherFee.fee2}}</el-col>
                        <el-col :span="6">垃圾清理费：{{otherFee.fee3}}</el-col>
                        <el-col :span="6">检测费：{{otherFee.fee4}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">工费：{{otherFee.fee5}}</el-col>
                        <el-col :span="6">冷藏费：{{otherFee.fee6}}</el-col>
                        <el-col :span="6">其他费用：{{otherFee.otherFee}}</el-col>
                    </el-row>
                </div>
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
        key: 'orderNumber',
        displayName: '订单号',
        width: 220,
    },
    {
        key: 'productName',
        displayName: '商品名称',
        width: 200,
    },
    {
        key: 'levelName',
        displayName: '规格',
        width: 100,
    },
    {
        key: 'origin',
        displayName: '产地',
        minWidth: 250,
    },
    {
        key: 'weight',
        displayName: '净重',
        width: 120,
    },
    {
        key: 'quantity',
        displayName: '件数',
        width: 100,
    },
    {
        key: 'saleQuantity',
        displayName: '销售件数',
        width: 100,
    },
    {
        key: 'saleWeight',
        displayName: '销售重量',
        width: 150,
    },
    {
        key: 'amount',
        displayName: '销售金额',
        width: 150,
    },
    {
        key: 'consignmentAmount',
        displayName: '代销总额',
        width: 150,
    },
    {
        key: 'cashAmount',
        displayName: '现金支付',
        width: 150,
    },
    {
        key: 'saleTime',
        displayName: '创建时间',
        width: 180,
    },
    {
        key: 'submitUserName',
        displayName: '创建人',
        width: 150,
    },
];
export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            pageShow: false,
            loading: false,
            exportLoading: false,
            downloadUrl: '',
            otherFee: {},
            data: [],
        };
    },
    computed: {
        ...mapGetters([
            'saleOrderDetail',
            'saleOrderDetailKey']),
        viewData() {
            this.$set(this, 'otherFee', this.saleOrderDetail);
            return this.data;
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.getSaleOrderDetail(this.$route.params.id).catch((err) => {
            listMethodBase.errorTip(err.message || err);
        }).then(() => {
            this.formatViewData(this.saleOrderDetail);
        });
    },
    methods: {
        ...mapActions([
            'getSaleOrderDetail',
            'getBacklogDetailKey']),
        formatViewData() {
            this.data = this.saleOrderDetail.detailList.map((item) => {
                const targetData = Object.assign({}, item, {
                    saleTime: listMethodBase.formatTime(item.saleTime),
                });
                return targetData;
            });
        },
        exportHandler() {
            this.exportLoading = true;
            this.getBacklogDetailKey(this.$route.params.id).then((data) => {
                this.downloadUrl = this.exportUrl(data);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                this.exportLoading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
    },
};
</script>
<style lang="less" scoped>
    .other {
        margin-top: 30px;
    }
</style>
