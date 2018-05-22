<template>
    <div id="saleReport">
        <gz-list
            ref="saleReportList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="saleReportList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :hasCheckbox="'false'"
            :pageShow="pageShow">
            <el-form label-position="left" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="7">
                        <el-form-item label="商品名称：">
                            <el-input v-model="searchForm.goodsName" placeholder="商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="时间:">
                            <el-date-picker
                                    v-model="searchForm.startTime"
                                    type="datetime"
                                    style="width: 100%"
                                    placeholder="起始时间从"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="至：">
                            <el-date-picker
                                    v-model="searchForm.endTime"
                                    type="datetime"
                                    style="width: 100%"
                                    placeholder="至"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="$refs.saleReportList.queryHandler()">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading">导出</el-button>
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
        key: 'productName',
        displayName: '商品名称',
        width: 120,
    },
    {
        key: 'levelName',
        displayName: '规格',
        width: 120,
    },
    {
        key: 'grossWeight',
        displayName: '毛重',
        width: 120,
    },
    {
        key: 'weight',
        displayName: '净重',
        width: 120,
    },
    {
        key: 'saleWeight',
        displayName: '销售重量',
        width: 120,
    },
    {
        key: 'purchasePrice',
        displayName: '采购价',
        width: 120,
    },
    {
        key: 'processCost',
        displayName: '加工费',
        width: 120,
    },
    {
        key: 'freight',
        displayName: '运费',
        width: 120,
    },
    {
        key: 'salePrice',
        displayName: '销售金额',
        width: 120,
    },
    {
        key: 'agentFee',
        displayName: '代办费',
        width: 120,
    },
    {
        key: 'otherFee',
        displayName: '其他销售费用',
        width: 200,
    },
    {
        key: 'grossProfit',
        displayName: '毛利润',
        width: 120,
    },
    {
        key: 'warehouseYield',
        displayName: '入库出成率',
        width: 120,
    },
    {
        key: 'deliveryYield',
        displayName: '出库出成率',
        width: 120,
    },
];
export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            pageShow: true,
            loading: true,
            exportLoading: false,
            searchForm: {
                goodsName: '',
                startTime: '',
                endTime: '',
            },
            thisCondition: {},
            downloadUrl: '',
        };
    },
    computed: {
        ...mapGetters([
            'saleReportList',
            'saleReportKey',
        ]),
        viewData() {
            return this.saleReportList.itemList;
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.saleReportList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getSaleReportList',
            'getSaleReportKey',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                startTime: listMethodBase.formatTime(this.searchForm.startTime) || '',
                endTime: listMethodBase.formatTime(this.searchForm.endTime) || '',
            });
            this.$set(this, 'thisCondition', thisCondiction);
            return listMethodBase.isTimeError(thisCondiction.startTime,
                thisCondiction.endTime);
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getSaleReportList({
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
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = true;
            this.getSaleReportKey(this.thisCondition)
            .then(() => {
                this.downloadUrl = this.exportUrl(this.saleReportKey);
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
    .handler-toolbar-inner {
    }
</style>
