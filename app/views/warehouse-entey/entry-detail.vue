<template>
    <div id="entry-detail">
        <gz-list
                :loading="loading"
                :colNameMap="colNameMap"
                :originData="viewData"
                :maxCacheSize="5"
                :pageShow="pageShow"
                >
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="exportHandler"  :loading="exportLoading">导出</el-button>
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
        key: 'entryNumber',
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
        key: 'areaName',
        displayName: '产地',
        minWidth: 250,
    },
    {
        key: 'sumGrossWeight',
        displayName: '毛重',
        width: 120,
    },
    {
        key: 'sumWeight',
        displayName: '净重',
        width: 120,
    },
    {
        key: 'price',
        displayName: '采购单价',
        width: 120,
    },
    {
        key: 'amount',
        displayName: '采购金额',
        width: 120,
    },
    {
        key: 'yield',
        displayName: '出成率',
        width: 100,
    },
    {
        key: 'status_f',
        displayName: '状态',
    },
    {
        key: 'entryTime',
        displayName: '入库时间',
        width: 200,
    },
    {
        key: 'submitUserName',
        displayName: '创建人',
        width: 150,
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
        };
    },
    computed: {
        ...mapGetters(['entryDetail', 'entryDetailKey']),
        viewData() {
            return this.formatViewData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.getEntryDetail(this.$route.params.id).catch((err) => {
            listMethodBase.errorTip(err.message || err);
        });
    },
    methods: {
        ...mapActions(['getEntryDetail', 'getEntryDetailKey']),
        formatViewData() {
            return this.entryDetail.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    auditTime: listMethodBase.formatTime(item.auditTime),
                    entryTime: listMethodBase.formatTime(item.entryTime),
                });
                return targetItem;
            });
        },
        statusMap(val) {
            if (val === 0) {
                return '待出库';
            } else if (val === 1) {
                return '已出库';
            } else if (val === -1) {
                return '已作废';
            } else if (val === 2) {
                return '已收货';
            }
            return '未知';
        },
        exportHandler() {
            this.exportLoading = true;
            this.getEntryDetailKey(this.$route.params.id).then(() => {
                this.downloadUrl = this.exportUrl(this.entryDetailKey);
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


<style lang="less">

</style>
