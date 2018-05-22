<template>
    <div id="transfer-invoice-detail">
        <gz-list
            ref="transferInvoiceDetail"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="transferInvoiceSubDetail.paging"
            :originData="viewData"
            :pageShow="pageShow"
            >
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="调拨单号：">
                            <span v-text="searchForm.fNumber"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调拨日期：">
                            <span v-text="searchForm.fBizDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调出仓库/市场：">
                            <span v-text="searchForm.tranferOutStoreWarehouseName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调入仓库/市场：">
                            <span v-text="searchForm.tranferInStoreWarehouseName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <span v-text="searchForm.status"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <span v-text="searchForm.createUserName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间：">
                            <span v-text="searchForm.createDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="公司：">
                            <span v-text="searchForm.fStorageOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="部门：">
                            <span v-text="searchForm.fAdminOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认人：">
                            <span v-text="searchForm.auditUserName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认时间：">
                            <span v-text="searchForm.auditDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注：">
                            <span v-text="searchForm.fDescription"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">

                </el-row> -->
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                调拨明细
            </div>
        </gz-list>
        <div class="button-handler">
            <el-button
                type="success"
                @click="invalidHandler"
                :disabled="transferInvoiceDetail.status !== 0"
                v-if="checkAuth('tranfer-in-stock-invalid')"
                >作废</el-button>
            <el-button
                type="primary"
                @click="submitFinanceHandler"
                :disabled="transferInvoiceDetail.status !== 0"
                v-if="checkAuth('tranfer-in-stock-send')"
                >提交财务</el-button>
            <el-button type="info" @click="goBack">返回</el-button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Auth from '../auth';
import BaseComponent from '../base';
import List from '../../components/biz/list';
import listMethodBase from '../../components/biz/listMethodBase';
import CompanyCommon from './company-common';

const colNameMap = [
    // {
    //     displayName: '操作',
    //     type: 'statusButton',
    //     width: 80,
    // },
    {
        key: 'fMaterialID',
        displayName: '商品编号',
        minWidth: 220,
    },
    {
        key: 'fMaterialName',
        displayName: '商品名称',
        width: 150,
    },
    {
        key: 'fMaterialModel',
        displayName: '规格/等级',
        width: 120,
    },
    {
        key: 'upc',
        displayName: 'UPC编号',
        width: 120,
    },
    {
        key: 'fUnitName',
        displayName: '计量单位',
        width: 100,
    },
    {
        key: 'fQty',
        displayName: '数量',
        width: 100,
    },
    // {
    //     key: 'fBaseUnitName',
    //     displayName: '基本计量单位',
    //     width: 130,
    // },
    // {
    //     key: 'fBaseQty',
    //     displayName: '基本数量',
    //     width: 100,
    // },
    // {
    //     key: 'fAssistUnitName',
    //     displayName: '辅助计量单位',
    //     width: 130,
    // },
    // {
    //     key: 'fAssistQty',
    //     displayName: '辅助数量',
    //     width: 100,
    // },
    {
        key: 'fTaxRate',
        displayName: '税率',
        width: 100,
    },
    {
        key: 'fTaxPrice',
        displayName: '含税单价(元)',
        width: 130,
    },
    {
        key: 'fRemark',
        displayName: '备注',
        width: 150,
    },
];

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        return {
            colNameMap,
            pageShow: true,
            // originPaging: { // 默认显示0 隐藏分页
            //     total: 0,
            // },
            loading: false,
            searchForm: {
                fNumber: '', // 入库单号
                fBizDate: '', // 入库日期
                tranferInStoreWarehouseName: '', // 调拨入库仓库名字
                tranferOutStoreWarehouseName: '', // 调拨出库仓库名字
                auditUserName: '', // 确认人
                auditDate: '', // 确认时间
                createDate: '', // 创建时间
                createUserName: '', // 创建人
                fDescription: '', // 备注
                status: '', // 状态
                fStorageOrgUnitName: '', // 公司名字
                fAdminOrgUnitName: '', // 部门名字
            },
            funitIdOptions: [], // 商品单位列表
        };
    },
    computed: {
        ...mapGetters([
            'transferInvoiceDetail',
            'purchaseList',
            'purchaseKey',
            'transferInvoiceSubDetail',
        ]),
        viewData() {
            return this.formatVieData();
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        // 获取商品所有单位
        this.dictionarySearch({ type: 6, keyword: '' })
        .then((data) => {
            this.$set(this, 'funitIdOptions', data);
            this.initData();
        })
        .catch((err) => {
            listMethodBase.errorTip(err.msg || err);
        });
    },
    methods: {
        ...mapActions([
            'getTransferInvoiceDetail',
            'getTransferInvoiceSubDetail',
            'invalidTransferInvoice',
            'submitTransferInvoice',
            'dictionarySearch',
        ]),
        initData() {
            this.getInvoiceDetail();
            this.$refs.transferInvoiceDetail.queryHandler();
        },
        getInvoiceDetail() {
            this.getTransferInvoiceDetail(this.$route.params.id)
            .then(() => {
                this.$set(this, 'searchForm', this.formatSearchFrom(this.transferInvoiceDetail));
            })
            .catch((err) => {
                listMethodBase.errorTip(err.message || err);
            });
        },
        formatSearchFrom(data) {
            const target = Object.assign({}, data, {
                fBizDate: listMethodBase.formatDate(data.fBizDate),
                createDate: listMethodBase.formatTime(data.createDate),
                auditDate: listMethodBase.formatTime(data.auditDate),
                status: this.statusMap(data.status),
                fStorageOrgUnitName: this.fstorageOrgUnitIdMap(data.fStorageOrgUnitID),
                fAdminOrgUnitName: this.fadminOrgUnitIdMap(data.fAdminOrgUnitID),
            });
            return target;
        },
        getListHanlder(params) {
            this.loading = true;
            this.getTransferInvoiceSubDetail({
                paging: params.paging,
                condition: {
                    sysId: this.$route.params.id,
                },
            })
            .then(() => {
                this.loading = false;
            })
            .catch((err) => {
                this.loading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            return this.transferInvoiceSubDetail.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status: this.statusMap(item.status),
                    createDate: listMethodBase.formatTime(item.createDate),
                    auditDate: listMethodBase.formatTime(item.auditDate),
                    fUnitName: this.funitIdMap(item.fUnitID),
                    fBaseUnitName: this.funitIdMap(item.fBaseUnitID),
                    fAssistUnitName: this.funitIdMap(item.fAssistUnitID),
                    fTaxRate: this.ftaxRateMap(item.fTaxRate),
                });
                return targetItem;
            });
        },
        statusMap(status) {
            switch (status) {
                case 0:
                    return '待确认';
                case -1:
                    return '已作废';
                case 1:
                    return '已确认';
                default:
                    return '未知';
            }
        },
        funitIdMap(funitId) {
            let targetName = '';
            this.funitIdOptions.forEach((item) => {
                if (item.fId === funitId) {
                    targetName = item.fName;
                }
            });
            if (targetName === '') {
                return '未知';
            }
            return targetName;
        },
        ftaxRateMap(ftaxRate) {
            if (ftaxRate === 1) {
                return '0';
            } else if (ftaxRate === 2) {
                return '3';
            } else if (ftaxRate === 3) {
                return '6';
            } else if (ftaxRate === 4) {
                return '11';
            } else if (ftaxRate === 5) {
                return '13';
            } else if (ftaxRate === 6) {
                return '17';
            }
            return '未知';
        },
        goBack() {
            this.$router.go(-1);
        },
        invalidHandler() {
            this.$confirm('你确定要作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // TODO 这里请求作废接口
                this.invalidTransferInvoice(this.transferInvoiceDetail.sysId)
                .then(() => {
                    this.initData();
                    listMethodBase.successTip('作废成功');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            })
            .catch(() => {
            });
        },
        submitFinanceHandler() {
            // 提交财务
            this.$confirm('将数据提交给财务后不可更改，确认提交吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // TODO 这里请求提交财务接口
                this.submitTransferInvoice(this.transferInvoiceDetail.sysId)
                .then(() => {
                    this.initData();
                    listMethodBase.successTip('提交成功');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            })
            .catch(() => {
            });
        },
    },
};
</script>


<style lang="less">
    #transfer-invoice-detail {
        .button-handler {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .handler-toolbar {
            padding-left: 0px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 10px;
        }
    }
</style>
