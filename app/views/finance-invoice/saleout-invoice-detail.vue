<template>
    <div id="saleout-invoice-detail">
        <gz-list
            ref="saleoutInvoiceDetail"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="saleoutInvoiceSubDetail.paging"
            :originData="viewData"
            :pageShow="pageShow"
            >
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="销售单号：">
                            <span v-text="searchForm.fNumber"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="销售日期：">
                            <span v-text="searchForm.fBizDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="顾客名称：">
                            <span v-text="searchForm.fCustomerName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库仓库/市场：">
                            <span v-text="searchForm.fWarehouseName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="商品总金额(元)：">
                            <span v-text="searchForm.fAmount"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单总金额(元)：">
                            <span v-text="searchForm.orderAmount"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="优惠金额(元)：">
                            <span v-text="searchForm.discountAmount"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="支付方式：">
                            <span v-text="searchForm.fPaymentTypeName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="币种：">
                            <span v-text="searchForm.fCurrencyName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <span v-text="searchForm.status"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单来源：">
                            <span v-text="searchForm.sourceSystem"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <span v-text="searchForm.createUserName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="创建时间：">
                            <span v-text="searchForm.createDate"></span>
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
                        <el-form-item label="销售渠道：">
                            <span v-text="searchForm.channel"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="公司：">
                            <span v-text="searchForm.fStorageOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="部门：">
                            <span v-text="searchForm.fAdminOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注：">
                            <span v-text="searchForm.fDescription"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                出库明细
            </div>
        </gz-list>
        <div class="button-handler">
            <el-button
                type="success"
                @click="invalidHandler"
                :disabled="saleoutInvoiceDetail.status !== 0"
                v-if="checkAuth('sale-out-stock-invalid')"
                >作废</el-button>
            <el-button
                type="primary"
                @click="submitFinanceHandler"
                :disabled="saleoutInvoiceDetail.status !== 0"
                v-if="checkAuth('sale-out-stock-send')"
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
        key: 'fLot',
        displayName: '批次',
        width: 100,
    },
    {
        key: 'fMfg',
        displayName: '生产日期',
        width: 130,
    },
    {
        key: 'fExp',
        displayName: '到期日期',
        width: 130,
    },
    {
        key: 'fIsPresent_f',
        displayName: '是否赠品',
        width: 100,
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
            pageShow: false, // 隐藏分页
            originPaging: { // 默认显示0 隐藏分页
                total: 0,
            },
            loading: false,
            searchForm: {
                fNumber: '', // 销售单号
                fBizDate: '', // 销售日期
                fCustomerName: '', // 顾客名称
                fWarehouseName: '', // 出库仓库/市场
                fAmount: '', // 商品总金额
                orderAmount: '', // 订单总金额
                fDiscountAmount: '', // 优惠金额
                fPaymentTypeName: '', // 支付方式
                fCurrencyName: '', // 币种
                status: '', // 状态
                sourceSystem: '', // 订单来源
                channel: '', // 销售渠道
                createUserName: '', // 创建人
                createDate: '', // 创建时间
                auditUserName: '', // 确认人
                auditDate: '', // 确认时间
                fDescription: '', // 备注
            },
            thisCondition: {},
            funitIdOptions: [], // 商品单位列表
        };
    },
    computed: {
        ...mapGetters([
            'saleoutInvoiceDetail',
            'saleoutInvoiceSubDetail',
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
            'getSaleoutInvoiceDetail',
            'getSaleoutInvoiceSubDetail',
            'invalidSaleoutInvoice',
            'submitSaleoutInvoice',
            'dictionarySearch',
        ]),
        initData() {
            this.getInvoiceDetail();
            this.$refs.saleoutInvoiceDetail.queryHandler();
        },
        getInvoiceDetail() {
            this.getSaleoutInvoiceDetail(this.$route.params.id)
            .then(() => {
                this.$set(this, 'searchForm', this.formatSearchFrom(this.saleoutInvoiceDetail));
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
                sourceSystem: this.sourceSystemMap(data.sourceSystem),
                channel: this.channelMap(data.channel),
                fPaymentTypeName: this.fPaymentTypeMap(data.fPaymentTypeID),
                fCurrencyName: this.fCurrencyMap(data.fCurrencyID),
                fStorageOrgUnitName: this.fstorageOrgUnitIdMap(data.fStorageOrgUnitID),
                fAdminOrgUnitName: this.fadminOrgUnitIdMap(data.fAdminOrgUnitID),
            });
            return target;
        },
        getListHanlder(params) {
            this.loading = true;
            this.getSaleoutInvoiceSubDetail({
                paging: params.paging,
                condition: {
                    sysId: this.$route.params.id,
                }
            }).then(() => {
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            return this.saleoutInvoiceSubDetail.itemList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_f: this.statusMap(item.status),
                    purchaseTime: listMethodBase.formatTime(item.purchaseTime),
                    submitTime: listMethodBase.formatTime(item.submitTime),
                    audiTime: listMethodBase.formatTime(item.audiTime),
                    fUnitName: this.funitIdMap(item.fUnitID),
                    fBaseUnitName: this.funitIdMap(item.fBaseUnitID),
                    fAssistUnitName: this.funitIdMap(item.fAssistUnitID),
                    fIsPresent_f: this.fIsPresentMap(item.fIsPresent),
                    fTaxRate: this.ftaxRateMap(item.fTaxRate),
                    fMfg: listMethodBase.formatDate(item.fMfg),
                    fExp: listMethodBase.formatDate(item.fExp),
                });
                return targetItem;
            });
        },
        statusMap(statu) {
            switch (statu) {
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
        sourceSystemMap(channel) {
            switch (channel) {
                case 1001:
                    return '海信下行';
                case 2001:
                    return '海信上行';
                case 3001:
                    return 'B2B';
                default:
                    return '未知';
            }
        },
        fPaymentTypeMap(fPaymentTypeID) {
            switch (fPaymentTypeID) {
                case '1':
                    return '现销';
                default:
                    return '未知';
            }
        },
        fCurrencyMap(fCurrencyID) {
            switch (fCurrencyID) {
                case '1':
                    return '人民币';
                case '2':
                    return '美元';
                case '3':
                    return '港币';
                default:
                    return '未知';
            }
        },
        channelMap(channel) {
            switch (channel) {
                case 1:
                    return '外贸';
                case 2:
                    return '东南区销售';
                case 3:
                    return '云上妙鲜';
                case 4:
                    return '西北区销售';
                case 5:
                    return '鲜花业务';
                case 6:
                    return '精品推广';
                default:
                    return '未知';
            }
        },
        fIsPresentMap(fIsPresent) {
            switch (fIsPresent) {
                case 0:
                    return '否';
                case 1:
                    return '是';
                default:
                    return '未知';
            }
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
                this.invalidSaleoutInvoice(this.saleoutInvoiceDetail.sysId)
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
                this.submitSaleoutInvoice(this.saleoutInvoiceDetail.sysId)
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
    #saleout-invoice-detail {
        .button-handler {
            padding-bottom: 10px;
            padding-top: 10px;
        }
        .handler-toolbar {
            padding-left: 0px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 10px;
        }
    }
</style>
