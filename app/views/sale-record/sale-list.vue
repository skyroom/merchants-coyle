<template>
    <div id="saleRecord">
        <gz-list
            ref="saleRecordList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="saleRecordList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :hasCheckbox="'false'"
            :pageShow="pageShow">
            <el-form label-position="left" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNumber" placeholder="订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品名称：">
                            <el-input v-model="searchForm.productName" placeholder="商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款方式：">
                            <el-select style="width: 100%" v-model="searchForm.payWay" placeholder="收款方式">
                                <el-option
                                    v-for="item in pays"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select style="width: 100%" v-model="searchForm.status" placeholder="状态">
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
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.saleUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间:">
                            <el-date-picker
                                    v-model="searchForm.saleStartTime"
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
                                    v-model="searchForm.saleEndTime"
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
                <el-button type="primary" @click="$refs.saleRecordList.queryHandler()" v-if="checkAuth('seller-search')">查询</el-button>
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
        key: 'orderNumber',
        displayName: '订单号',
        width: 220,
    },
    {
        key: 'productName',
        displayName: '商品名称',
        minWidth: 130,
    },
    {
        key: 'levelName',
        displayName: '规格',
        width: 120,
    },
    {
        key: 'origin',
        displayName: '产地',
        width: 200,
    },
    {
        key: 'quantity',
        displayName: '销售件数',
        width: 120,
    },
    {
        key: 'weight',
        displayName: '销售重量',
        width: 120,
    },
    {
        key: 'amount',
        displayName: '销售金额',
        width: 120,
    },
    {
        key: 'payWay_f',
        displayName: '收款方式',
        width: 120,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 120,
    },
    {
        key: 'saleTime',
        displayName: '创建时间',
        width: 200,
    },
    {
        key: 'submitUserName',
        displayName: '创建人',
        width: 80,
    },
];
const status = [
    {
        value: null,
        label: '全部状态'
    },
    {
        value: 1,
        label: '销售中'
    },
    {
        value: 2,
        label: '售卖结束'
    },
    {
        value: -1,
        label: '已作废'
    }
];
const pays = [
    {
        value: null,
        label: '全部'
    },
    {
        value: 0,
        label: '现金'
    },
    {
        value: 1,
        label: '代销',
    }
];
export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            pays,
            status,
            pageShow: true,
            loading: true,
            exportLoading: false,
            purchaseIds: [],
            searchForm: {
                orderNumber: '',
                productName: '',
                payWay: '',
                status: null,
                saleUserName: '',
                saleStartTime: '',
                saleEndTime: '',
            },
            thisCondition: {},
            downloadUrl: '',
        };
    },
    computed: {
        ...mapGetters([
            'saleRecordList',
            'saleRecordKey'
        ]),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.saleRecordList.queryHandler();
    },
    methods: {
        ...mapActions([
            'getSaleRecordList',
            'getSaleRecordKey',
        ]),
        // 将form里面的数据处理转存
        formDataSave() {
            const thisCondiction = Object.assign({}, this.searchForm, {
                saleStartTime: listMethodBase.formatTime(this.searchForm.saleStartTime) || '',
                saleEndTime: listMethodBase.formatTime(this.searchForm.saleEndTime) || '',
            });
            this.$set(this, 'thisCondition', thisCondiction);
            return listMethodBase.isTimeError(thisCondiction.saleStartTime,
                thisCondiction.saleEndTime);
        },
        getListHanlder(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getSaleRecordList({
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
            return this.saleRecordList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    payWay_f: item.payWay === 0 ? '现金' : '代销',
                    saleTime: listMethodBase.formatTime(item.saleTime) || '',
                });
                return targetItem;
            });
        },
        statusMap(val) {
            if (val === 1) {
                return '销售中';
            } else if (val === 2) {
                return '售卖结束';
            } else if (val === -1) {
                return '作废';
            }
            return '未知';
        },
        // 导出按钮点击触发函数
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = true;
            this.getSaleRecordKey(this.thisCondition)
            .then(() => {
                this.downloadUrl = this.exportUrl(this.saleRecordKey);
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
