<template>
    <div id="delivery">
        <gz-list
            ref="deliveryList"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="deliveryList.paging"
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
                            <el-input v-model="searchForm.deliveryNumber" placeholder="订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号：">
                            <el-input v-model="searchForm.plateNumber" placeholder="车牌号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收货人姓名：">
                            <el-input v-model="searchForm.receiverName" placeholder="收货人姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收货人手机：">
                            <el-input v-model="searchForm.receiverPhone" placeholder="收货人手机"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="司机电话：">
                            <el-input v-model="searchForm.driverPhone" placeholder="司机电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.submitUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
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
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select style="width: 100%" v-model="searchForm.status" placeholder="全部状态">
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
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="$refs.deliveryList.queryHandler()">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <el-button type="primary" @click="changeStatus" v-if="checkAuth('deliveryorder-edit')">作废</el-button>
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
            key: 'deliveryNumber',
            displayName: '订单号',
            width: 220,
        },
        {
            key: 'catalogCount',
            displayName: '品种数',
            width: 120,
        },
        {
            key: 'cost',
            displayName: '到岸总额',
            width: 120,
        },
        {
            key: 'carriageFee',
            displayName: '运费',
            width: 120,
        },
        {
            key: 'plateNumber',
            displayName: '车牌号',
            width: 120,
        },
        {
            key: 'driverName',
            displayName: '司机姓名',
            width: 120,
        },
        {
            key: 'driverPhone',
            displayName: '司机电话',
            width: 130,
        },
        {
            key: 'vehicleModel',
            displayName: '车辆型号',
            width: 120,
        },
        {
            key: 'receiverPhone',
            displayName: '收货人电话',
            width: 120,
        },
        {
            key: 'receiverName',
            displayName: '收货人姓名',
            width: 120,
        },
        {
            key: 'marketName',
            displayName: '收货市场',
            width: 120,
        },
        {
            key: 'status_f',
            displayName: '状态',
            width: 120,
        },
        {
            key: 'deliveryTime',
            displayName: '发货时间',
            width: 180,
        },
        {
            key: 'submitUserName',
            displayName: '创建人',
            width: 120,
        },
        {
            key: 'submitTime',
            displayName: '创建时间',
            width: 180,
        },
        {
            key: 'auditTime',
            displayName: '作废时间',
            width: 180,
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
            label: '全部状态'
        },
        {
            value: 1,
            label: '已发货'
        },
        {
            value: -1,
            label: '作废'
        },
        {
            value: 2,
            label: '已签收'
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
                    valiateFunc: () => this.checkAuth('deliveryorder-search-detail'),
                }],
                status,
                pageShow: true,
                loading: true,
                exportLoading: false,
                deliveryIds: [],
                searchForm: {
                    deliveryNumber: '',
                    plateNumber: '',
                    driverPhone: '',
                    receiverPhone: '',
                    receiverName: '',
                    status: null,
                    submitUserName: '',
                    submitTimeStart: '',
                    submitTimeEnd: '',
                },
                thisCondition: {},
                downloadUrl: '',
            };
        },
        computed: {
            ...mapGetters([
                'deliveryList',
                'deliveryKey'
            ]),
            viewData() {
                return this.formatVieData();
            },
        },
        components: {
            [List.name]: List,
        },
        mounted() {
            this.$refs.deliveryList.queryHandler();
        },
        methods: {
            ...mapActions([
                'getDeliveryList',
                'getDeliveryKey',
                'setDeliveryStatus'
            ]),
            formDataSave() {
                const thisCondiction = Object.assign({}, this.searchForm, {
                    submitTimeStart: listMethodBase.formatTime(this.searchForm.submitTimeStart) || '',
                    submitTimeEnd: listMethodBase.formatTime(this.searchForm.submitTimeEnd) || '',
                });
                this.$set(this, 'thisCondition', thisCondiction);
                return listMethodBase.isTimeError(thisCondiction.submitTimeStart,
                    thisCondiction.submitTimeEnd);
            },
            getListHanlder(params) {
                if (this.formDataSave()) return;
                this.loading = true;
                this.pageShow = false;
                this.getDeliveryList({
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
            formatVieData() {
                return this.deliveryList.itemList.map((item) => {
                    const targetItem = Object.assign({}, item, {
                        status_f: this.statusMap(item.status),
                        deliveryTime: listMethodBase.formatTime(item.deliveryTime) || '',
                        submitTime: listMethodBase.formatTime(item.submitTime) || '',
                        auditTime: listMethodBase.formatTime(item.auditTime) || '',
                    });
                    return targetItem;
                });
            },
            statusMap(val) {
                if (val === 1) {
                    return '已发货';
                } else if (val === -1) {
                    return '作废';
                } else if (val === 2) {
                    return '已签收';
                }
                return '未知';
            },
            checkboxHandler(val) {
                this.deliveryIds = val.map(item => item);
            },
            clickToCheck(args) {
                this.$router.push(`/deliveryorder-search-detail/${args[1].id}`);
            },
            exportHandler() {
                if (this.formDataSave()) return;
                this.exportLoading = true;
                this.getDeliveryKey(this.thisCondition)
                    .then(() => {
                        this.downloadUrl = this.exportUrl(this.deliveryKey);
                    }).then(() => {
                        this.$refs.downloadDOM.click();
                        this.exportLoading = false;
                    }).catch((err) => {
                        this.exportLoading = false;
                        listMethodBase.errorTip(err.message || err);
                    });
            },
            changeStatus() {
                if (listMethodBase.isNoSelectedRow(this.deliveryIds)) return;
                if (listMethodBase.isFalseDate(-1, this.deliveryIds, 'status', '您选择的数据已有作废的订单！')) return;
                this.$confirm('你确定要作废吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const ids = this.deliveryIds.map(item => item.id);
                    this.setDeliveryStatus(ids).then(() => {
                        listMethodBase.successTip();
                        this.getListHanlder(this.$refs.deliveryList.queryCondition);
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
</style>
