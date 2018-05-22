<template>
    <div id="process_list">
        <gz-list
            ref="processList"
            hasCheckbox="true"
            :checkboxHandler="checkboxHandler"
            :loading="loading"
            @getData="getListHandler"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="processList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageshow"
            @operation-click="clickToCheck">
            <el-form label-position="left" label-width="100px" slot="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNumber" placeholder="订单号"></el-input>
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
                                    v-model="searchForm.submitTimeStart"
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
                                    v-model="searchForm.submitTimeEnd"
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
                <el-button type="primary" @click="$refs.processList.queryHandler()">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <a ref="downloadDOM" :href="downloadUrl" download="采购单列表" v-show></a>
            </div>
        </gz-list>
    </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import List from '../../components/biz/list';
import listMethodBase from '../../components/biz/listMethodBase';
import BaseComponent from '../base';
import Auth from '../auth';

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
        key: 'catalogCount',
        displayName: '品种数',
        width: 110,
    },
    {
        key: 'sumWeight',
        displayName: '总重',
    },
    {
        key: 'quantity',
        displayName: '总件数',
        width: 110,
    },
    {
        key: 'amount',
        displayName: '加工总费用',
        width: 110,
    },
    {
        key: 'packingPrice',
        displayName: '装件工费',
        width: 110,
    },
    {
        key: 'sumPackingPrice',
        displayName: '装件总费',
        width: 110,
    },
    {
        key: 'loadAmount',
        displayName: '装重工费',
        width: 110,
    },
    {
        key: 'sumBoxPrice',
        displayName: '泡沫箱总价',
        width: 110,
    },
    {
        key: 'sumBottlePrice',
        displayName: '冰瓶总价',
        width: 110,
    },
    {
        key: 'quiltQuantity',
        displayName: '棉被个数',
        width: 110,
    },
    {
        key: 'quiltPrice',
        displayName: '棉被单价',
        width: 110,
    },
    {
        key: 'quiltAmount',
        displayName: '棉被总价',
        width: 110,
    },
    {
        key: 'otherAmount',
        displayName: '其他费用',
        width: 110,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 110,
    },
    {
        key: 'remark',
        displayName: '备注',
        width: 110,
        ellipsis: true,
    },
    {
        key: 'submitUserName',
        displayName: '创建人',
        width: 110,
    },
    {
        key: 'submitTime',
        displayName: '创建时间',
        width: 200,
    },
    {
        key: 'auditTime',
        displayName: '作废时间',
        width: 200,
    },
    {
        key: 'auditUserName',
        displayName: '修改人',
        width: 110,
    },
];
export default{
    extends: BaseComponent,
    mixins: [Auth],
    data() {
        return {
            colNameMap,
            operation: [
                {
                    key: 'detail',
                    text: '详情',
                    valiateFunc: () => this.checkAuth('processingorder-search-detail'),
                }
            ],
            processIds: [],
            loading: true,
            searchForm: {
                orderNumber: '',
                submitUserName: '',
                status: null,
                submitTimeStart: '',
                submitTimeEnd: '',
            },
            thisCondition: {},
            downloadUrl: '',
            status: [
                {
                    value: null,
                    label: '全部状态'
                },
                {
                    value: 1,
                    label: '正常'
                },
                {
                    value: -1,
                    label: '已作废'
                },
            ],
            exportLoading: false,
            pageshow: true,
        };
    },
    components: {
        [List.name]: List,
    },
    computed: {
        ...mapGetters([
            'processList',
            'processDetail',
            'processListKey']),
        viewData() {
            return this.formatViewData();
        },
    },
    methods: {
        ...mapActions([
            'getProcessList',
            'getProcessDetail',
            'getProcessListKey',
            'setProcessStatus']),
        checkboxHandler(items) {
            this.processIds = items.map(item => item.id);
        },
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = true;
            this.formDataSave();
            this.getProcessListKey(this.thisCondition).then(() => {
                this.downloadUrl = this.exportUrl(this.processListKey);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                this.exportLoading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        getListHandler(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getProcessList({
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
        formDataSave() {
            const thisCondition = Object.assign({}, this.searchForm, {
                submitTimeStart: listMethodBase.formatTime(this.searchForm.submitTimeStart) || '',
                submitTimeEnd: listMethodBase.formatTime(this.searchForm.submitTimeEnd) || '',
            });
            this.$set(this, 'thisCondition', thisCondition);
            return listMethodBase.isTimeError(thisCondition.submitTimeStart,
                thisCondition.submitTimeEnd);
        },
        formatViewData() {
            return this.processList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    auditTime: listMethodBase.formatTime(item.auditTime),
                });
                return targetItem;
            });
        },
        statusMap(val) {
            if (val === -1) {
                return '已作废';
            } else if (val === 1) {
                return '正常';
            } else if (val === 0) {
                return '初始';
            }
            return '未知';
        },
        clickToCheck(args) {
            this.$router.push(`/processing-detail/${args[1].id}`);
        }

    },
    mounted() {
        this.$refs.processList.queryHandler();
    },
};
</script>


<style>
</style>
