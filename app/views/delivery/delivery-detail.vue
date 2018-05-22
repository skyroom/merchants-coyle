<template>
    <div id="delivery-detail">
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

const colNameMap = [
    {
        key: 'deliveryNumber',
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
        width: 120,
    },
    {
        key: 'areaName',
        displayName: '产地',
        minWidth: 250,
    },
    {
        key: 'sumWeight',
        displayName: '净重',
        width: 100,
    },
    {
        key: 'quantity',
        displayName: '件数',
        width: 100,
    },
    {
        key: 'weight',
        displayName: '件量',
        width: 100,
    },
    {
        key: 'price',
        displayName: '采购单价',
        width: 100,
    },
    {
        key: 'cost',
        displayName: '到岸价',
        width: 150,
    },
    {
        key: 'sumCost',
        displayName: '到岸总额',
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
        ...mapGetters(['deliveryDetail', 'deliveryDetailKey']),
        viewData() {
            return this.deliveryDetail;
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.getDeliveryDetail(this.$route.params.id)
        .catch((err) => {
            this.$notify({
                message: err.message || err,
                type: 'warning',
            });
        });
    },
    methods: {
        ...mapActions(['getDeliveryDetail', 'getDeliveryDetailKey']),
        exportHandler() {
            this.exportLoading = true;
            this.getDeliveryDetailKey(this.$route.params.id).then(() => {
                this.downloadUrl = this.exportUrl(this.deliveryDetailKey);
            }).then(() => {
                this.$refs.downloadDOM.click();
                this.exportLoading = false;
            }).catch((err) => {
                this.exportLoading = false;
                this.$notify({
                    message: err.message || err,
                    type: 'warning',
                });
            });
        },
    },
};
</script>


<style lang="less">

</style>
