<template>
    <div id="purchase">
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
        key: 'orderNumber',
        displayName: '采购单号',
        width: 220,
    },
    {
        key: 'productName',
        displayName: '商品名称',
        width: 200,
    },
    {
        key: 'specs',
        displayName: '规格',
        width: 100,
    },
    {
        key: 'origin',
        displayName: '产地',
        minWidth: 250,
    },
    {
        key: 'quantity',
        displayName: '重量',
        width: 100,
    },
    {
        key: 'price',
        displayName: '采购价',
        width: 100,
    },
    {
        key: 'time',
        displayName: '采购时间',
        width: 180,
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
        ...mapGetters(['purchaseDetail', 'purchaseDetailKey']),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.getPurchaseDetail(this.$route.params.id).catch((err) => {
            listMethodBase.errorTip(err.message || err);
        });
    },
    methods: {
        ...mapActions(['getPurchaseDetail', 'getPurchaseDetailKey']),
        exportHandler() {
            this.exportLoading = true;
            this.getPurchaseDetailKey(this.$route.params.id).then(() => {
                this.downloadUrl = this.exportUrl(this.purchaseDetailKey);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                this.exportLoading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        formatVieData() {
            return this.purchaseDetail.map((item) => {
                const targetItem = Object.assign({}, item, {
                    time: listMethodBase.formatDate(item.time),
                });
                return targetItem;
            });
        },
    },
};
</script>


<style lang="less">

</style>
