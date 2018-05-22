<template>
    <div id="adjustment-invoice-detail">
        <gz-list
            ref="adjustmentInvoiceDetail"
            :loading="loading"
            @getData="getListHanlder"
            :form="searchForm"
            :colNameMap="colNameMap"
            :originPaging="originPaging"
            :originData="viewData.detailList"
            :pageShow="pageShow"
            >
            <el-form label-position="top" :model="searchForm" label-width="100px" slot="searchForm">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="损益单号：">
                            <span v-text="viewData.fnumber"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="损益日期：">
                            <span v-text="viewData.fBizDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型：">
                            <span v-text="viewData.fbizName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="仓库/市场：">
                            <span v-text="viewData.warehouseName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <span v-text="viewData.status"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人：">
                            <span v-text="viewData.createUserName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间：">
                            <span v-text="viewData.createDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认人：">
                            <span v-text="viewData.auditUserName"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="公司：">
                            <span v-text="viewData.fstorageOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="部门：">
                            <span v-text="viewData.fadminOrgUnitName"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认时间：">
                            <span v-text="viewData.auditDate"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注：">
                            <span v-text="viewData.fdescription"></span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                损益明细
            </div>
        </gz-list>
        <div class="button-handler">
            <el-button
                type="success"
                @click="invalidHandler"
                :disabled="adjustmentInvoiceDetail.status !== 0"
                v-if="checkAuth('adjust-invalid')"
                >作废</el-button>
            <el-button
                type="primary"
                @click="submitFinanceHandler"
                :disabled="adjustmentInvoiceDetail.status !== 0"
                v-if="checkAuth('adjust-submit')"
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

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        return {
            colNameMap: [
                {
                    key: 'fmaterialId',
                    displayName: '商品编号',
                    minWidth: 220,
                },
                {
                    key: 'fmaterialName',
                    displayName: '商品名称',
                    width: 120,
                },
                {
                    key: 'upc',
                    displayName: 'UPC编号',
                    width: 130,
                },
                {
                    key: 'fmaterialModel',
                    displayName: '规格/等级',
                    width: 130,
                },
                {
                    key: 'funitName',
                    displayName: '单位',
                    width: 100,
                },
                {
                    key: 'fqty',
                    displayName: '数量',
                    width: 100,
                },
                // {
                //     key: 'fbaseUnitName',
                //     displayName: '基本计量单位',
                //     width: 130,
                // },
                // {
                //     key: 'fbaseQty',
                //     displayName: '基本数量',
                //     width: 100,
                // },
                // {
                //     key: 'fassistUnitName',
                //     displayName: '辅助计量单位',
                //     width: 130,
                // },
                // {
                //     key: 'fassistQty',
                //     displayName: '辅助数量',
                //     width: 100,
                // },
                {
                    key: 'flot',
                    displayName: '批次',
                    width: 120,
                },
                {
                    key: 'fmfg',
                    displayName: '生成日期',
                    width: 130,
                },
                {
                    key: 'fexp',
                    displayName: '到期日期',
                    width: 130,
                },
                {
                    key: 'fisPresent_f',
                    displayName: '是否赠品',
                    width: 100,
                },
                {
                    key: 'funitLoss',
                    displayName: '单位损耗成本',
                    width: 130,
                },
                {
                    key: 'floss',
                    displayName: '损耗成本',
                    width: 100,
                },
                {
                    key: 'fremark',
                    displayName: '备注',
                    width: 150,
                },
            ],
            pageShow: false, // 隐藏分页
            originPaging: { // 默认显示0 隐藏分页
                total: 0,
            },
            loading: false,
            searchForm: {
                fnumber: '', // 损益单号
                fbizDate: '', // 损益日期
                fbizTypeId: '', // 损益类型
                warehouseName: '', // 仓库/市场
                fstatus: '', // 状态
                createDate: '', // 创建时间
                createUserName: '', // 创建人
                auditUserName: '', // 确认人
                auditDate: '', // 确认时间
                type: '', // 业务类型
                fdescription: '', // 备注
            },
            thisCondition: {},
            funitIdOptions: [], // 商品单位列表
        };
    },
    computed: {
        ...mapGetters([
            'adjustmentInvoiceDetail',
            'purchaseList',
            'purchaseKey'
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
            this.$set(this, 'thisCondition', {
                fbizTypeId: this.$route.query.fbizTypeId,
                fid: this.$route.query.fid,
            });
            this.$refs.adjustmentInvoiceDetail.queryHandler();
        })
        .catch((err) => {
            listMethodBase.errorTip(err.msg || err);
        });
    },
    methods: {
        ...mapActions([
            'getAdjustmentInvoiceDetail',
            'invalidAdjustmentInvoice',
            'getPurchaseList',
            'getPurchaseKey',
            'setPurchaseStatus',
            'submitAdjustmentInvoice',
            'dictionarySearch',
        ]),
        getListHanlder() {
            this.loading = true;
            this.getAdjustmentInvoiceDetail({
                // paging: params.paging,
                fbizTypeId: this.thisCondition.fbizTypeId,
                fid: this.thisCondition.fid,
            }).then(() => {
                this.loading = false;
                // 这里判断 业务类型 盘亏出库没有 单位损耗成本 和 损耗成本 字段
                /* eslint-disable max-len */
                if (this.adjustmentInvoiceDetail.fbizName === '盘亏出库') {
                    let funitLossIndex = -1;
                    this.colNameMap.forEach((item, index) => {
                        if (item.key === 'funitLoss') {
                            funitLossIndex = index;
                        }
                    });
                    if (funitLossIndex !== -1) {
                        this.colNameMap.splice(funitLossIndex, 1);
                    }
                    let flossIndex = -1;
                    this.colNameMap.forEach((item, index) => {
                        if (item.key === 'floss') {
                            flossIndex = index;
                        }
                    });
                    if (flossIndex !== 1) {
                        this.colNameMap.splice(flossIndex, 1);
                    }
                }
            }).catch((err) => {
                this.loading = false;
                listMethodBase.errorTip(err.message || err);
            });
        },
        // 转化getter里面的数据用于界面显示
        formatVieData() {
            const target = Object.assign({}, this.adjustmentInvoiceDetail, {
                status: this.statusMap(this.adjustmentInvoiceDetail.status),
                fBizDate: listMethodBase.formatDate(this.adjustmentInvoiceDetail.fBizDate),
                createDate: listMethodBase.formatTime(this.adjustmentInvoiceDetail.createDate),
                auditDate: listMethodBase.formatTime(this.adjustmentInvoiceDetail.auditDate),
                /* eslint-disable max-len */
                fstorageOrgUnitName: this.fstorageOrgUnitIdMap(this.adjustmentInvoiceDetail.fstorageOrgUnitId),
                fadminOrgUnitName: this.fadminOrgUnitIdMap(this.adjustmentInvoiceDetail.fadminOrgUnitId),
            });
            target.detailList = target.detailList.map((item) => {
                const targetItem = Object.assign({}, item, {
                    funitName: this.funitIdMap(item.funitId),
                    fbaseUnitName: this.funitIdMap(item.fbaseUnitId),
                    fassistUnitName: this.funitIdMap(item.fassistUnitId),
                    fmfg: listMethodBase.formatDate(item.fmfg),
                    fexp: listMethodBase.formatDate(item.fexp),
                    fisPresent_f: this.fIsPresentMap(item.fisPresent),
                });
                return targetItem;
            });
            return target;
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
        fIsPresentMap(statu) {
            switch (statu) {
                case 0:
                    return '否';
                case 1:
                    return '是';
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
        goBack() {
            this.$router.go(-1);
        },
        invalidHandler() {
            this.$confirm('你确定要作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // TODO 这里请求作废接口
                this.invalidAdjustmentInvoice({
                    fid: this.adjustmentInvoiceDetail.fid,
                    fbizTypeId: this.adjustmentInvoiceDetail.fbizTypeId,
                })
                .then(() => {
                    listMethodBase.successTip('作废成功');
                    this.$refs.adjustmentInvoiceDetail.queryHandler();
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
            })
            .then(() => {
                // TODO 这里请求提交财务接口
                this.submitAdjustmentInvoice({
                    fid: this.adjustmentInvoiceDetail.fid,
                    fbizTypeId: this.adjustmentInvoiceDetail.fbizTypeId,
                })
                .then(() => {
                    listMethodBase.successTip('提交成功');
                    this.$refs.adjustmentInvoiceDetail.queryHandler();
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
    #adjustment-invoice-detail {
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
