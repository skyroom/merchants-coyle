<template>
    <div id="warehouse_entry_list">
        <gz-list
            ref="entryList"
            hasCheckbox="true"
            :checkboxHandler="checkboxHandler"
            :loading="loading"
            @getData="getListHandler"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="entryList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageshow"
            @operation-click="clickToCheck">
            <el-form label-position="left" label-width="100px" slot="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.entryNumber" placeholder="订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <el-input v-model="searchForm.submitUserName" placeholder="创建人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select  v-model="searchForm.status"  style="width:100%"  placeholder="全部状态">
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
                        <el-form-item label="入库时间：">
                            <el-date-picker
                                    v-model="searchForm.entryTimeStart"
                                    type="datetime"
                                    style="width:100%"
                                    placeholder="入库时间从"
                                    :editable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至：">
                            <el-date-picker
                                    v-model="searchForm.entryTimeEnd"
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
                <el-button type="primary" @click="$refs.entryList.queryHandler()">查询</el-button>
                <el-button type="primary" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <el-button type="primary" @click="changeStatus" v-if="checkAuth('warehouseEntry-edit')" >作废</el-button>
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
        key: 'entryNumber',
        displayName: '订单号',
        minWidth: 220,
    },
    {
        key: 'catalogCount',
        displayName: '品种数',
        width: 110,
    },
    {
        key: 'sumGrossWeight',
        displayName: '毛重',
        width: 110,
    },
    {
        key: 'sumWeight',
        displayName: '净重',
        width: 110,
    },
    {
        key: 'amount',
        displayName: '采购总金额',
        width: 110,
    },
    {
        key: 'status_f',
        displayName: '状态',
        width: 110,
    },
    {
        key: 'entryTime',
        displayName: '入库时间',
        width: 200,
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
        displayName: '修改时间',
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
            operation: [{
                key: 'detail',
                text: '详情',
                valiateFunc: () => this.checkAuth('warehouseEntry-search-detail'),
            }],
            entryIds: [],
            loading: true,
            searchForm: {
                entryNumber: '',
                submitUserName: '',
                status: null,
                entryTimeStart: '',
                entryTimeEnd: '',
            },
            thisCondition: {},
            downloadUrl: '',
            status: [
                {
                    value: null,
                    label: '全部状态'
                },
                {
                    value: 0,
                    label: '待出库'
                },
                {
                    value: 1,
                    label: '已出库'
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
            'entryList',
            'entryDetail',
            'entryKey'
        ]),
        viewData() {
            return this.formatViewData();
        },
    },
    methods: {
        ...mapActions([
            'getEntryList',
            'getEntryDetail',
            'getEntryKey',
            'setEntryStatus'
        ]),
        checkboxHandler(items) {
            this.entryIds = items.map(item => item);
        },
        exportHandler() {
            if (this.formDataSave()) return;
            this.exportLoading = false;
            this.getEntryKey(this.thisCondition).then(() => {
                this.downloadUrl = this.exportUrl(this.entryKey);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                listMethodBase.errorTip(err.message || err);
            });
        },
        statusMap(val) {
            if (val === 0) {
                return '待出库';
            } else if (val === 1) {
                return '已出库';
            } else if (val === -1) {
                return '已作废';
            }
            return '未知';
        },
        changeStatus() {
            if (listMethodBase.isNoSelectedRow(this.entryIds)) return;
            if (listMethodBase.isFalseDate(-1, this.entryIds, 'status')) return;
            this.$confirm('你确定要作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const ids = this.entryIds.map(item => item.id);
                this.setEntryStatus(ids).then(() => {
                    listMethodBase.successTip();
                    this.getListHandler(this.$refs.entryList.queryCondition);
                }).catch((err) => {
                    listMethodBase.errorTip(err.message || err);
                });
            }).catch(() => {
            });
        },
        getListHandler(params) {
            if (this.formDataSave()) return;
            this.loading = true;
            this.pageShow = false;
            this.getEntryList({
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
                entryTimeStart: listMethodBase.formatTime(this.searchForm.entryTimeStart) || '',
                entryTimeEnd: listMethodBase.formatTime(this.searchForm.entryTimeEnd) || '',
            });
            this.$set(this, 'thisCondition', thisCondition);
            return listMethodBase.isTimeError(thisCondition.entryTimeStart,
                    thisCondition.entryTimeEnd);
        },
        formatViewData() {
            return this.entryList.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    entryTime: listMethodBase.formatTime(item.entryTime),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    auditTime: listMethodBase.formatTime(item.auditTime),
                });
                return targetItem;
            });
        },
        clickToCheck(args) {
            this.$router.push(`/warehouseEntry-search-detail/${args[1].id}`);
        }
    },
    mounted() {
        this.$refs.entryList.queryHandler();
    },
};
</script>

<style>
</style>
