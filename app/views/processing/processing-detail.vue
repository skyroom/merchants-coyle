<template>
    <div id="progress-detail">
        <gz-list
                :loading="loading"
                :colNameMap="colNameMap"
                :originData="viewData"
                :maxCacheSize="5"
                :pageShow="pageShow"
                >
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="exportHandler"  :loading="exportLoading">导出</el-button>
                <a ref="downloadDOM" :href="downloadUrl" download="加工单明细" v-show></a>
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
        width: 120,
    },
    {
        width: 230,
        key: 'areaName',
        displayName: '产地',
    },

    {
        key: 'amount',
        displayName: '加工总费',
        width: 120,
    },
    {
        key: 'sumWeight',
        displayName: '净重',
        width: 150,
    },
    {
        key: 'quantity',
        displayName: '件数',
    },
    {
        key: 'weight',
        displayName: '件量',
        width: 150,
    },
    {
        key: 'packingAmount',
        displayName: '装件费用',
        width: 150,
    },
    {
        key: 'loadAmount',
        displayName: '装重工费',
        width: 150,
    },

    {
        key: 'boxPrice',
        displayName: '泡沫箱单价',
        width: 150,
    },
    {
        key: 'boxAmount',
        displayName: '泡沫箱总价',
        width: 150,
    },
    {
        key: 'bottleQuantity',
        displayName: '冰瓶总数',
        width: 150,
    },
    {
        key: 'bottlePrice',
        displayName: '冰瓶单价',
        width: 150,
    },
    {
        key: 'bottleAmount',
        displayName: '冰瓶总价',
        width: 150,
    },
    {
        key: 'quiltAmount',
        displayName: '棉被价',
        width: 150,
    },
    {
        key: 'otherFee',
        displayName: '其他费用',
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
        ...mapGetters([
            'processDetail',
            'processDetailKey'
        ]),
        viewData() {
            return this.processDetail;
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.getProcessDetail(this.$route.params.Id).catch((err) => {
            this.loading = false;
            this.pageShow = true;
            listMethodBase.errorTip(err.message || err);
        });
    },
    methods: {
        ...mapActions([
            'getProcessDetail',
            'getProcessDetailKey'
        ]),
        exportHandler() {
            this.exportLoading = true;
            this.getProcessDetailKey(this.$route.params.Id).then(() => {
                this.downloadUrl = this.exportUrl(this.processDetailKey);
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
