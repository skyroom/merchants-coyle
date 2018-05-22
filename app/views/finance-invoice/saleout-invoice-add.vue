<template>
    <div id="saleout-invoice-add">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="销售日期：" prop="fBizDate">
                        <el-date-picker
                            v-model="addForm.fBizDate"
                            style="width:100%"
                            type="date"
                            placeholder="销售日期"
                            :editable="false"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="顾客名称：" prop="fCustomerID">
                        <dictionary-search
                            :type="1"
                            placeholder="请输入顾客名称"
                            ref="dictionaryCustomer"
                            @searchChange="searchCustomerChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="出库仓库/市场：" prop="fWarehouseID">
                        <dictionary-search
                            :type="5"
                            placeholder="请输入仓库名称"
                            ref="dictionaryWarehouseOut"
                            @searchChange="searchWarehouseOutChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="支付方式：" prop="fPaymentTypeID">
                        <el-select style="width:100%" v-model="addForm.fPaymentTypeID" placeholder="请选择">
                            <el-option
                                v-for="item in fPaymentTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="商品总金额(元)：">
                        <el-input :disabled="true" v-model="addForm.fAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="订单总金额(元)：" prop="orderAmount" required>
                        <el-input
                            @change="orderTotalAmountChangeHandler"
                            v-model.trim="addForm.orderAmount"
                            auto-complete="off"
                            placeholder="订单总金额(元)"
                            ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="优惠金额(元)：">
                        <el-input :disabled="true" v-model.trim="addForm.discountAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="销售渠道：" prop="channel">
                        <el-select style="width:100%" v-model="addForm.channel" placeholder="请选择">
                            <el-option
                                v-for="item in channelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="订单来源：" prop="sourceSystem">
                        <el-select style="width:100%" v-model="addForm.sourceSystem" placeholder="请选择">
                            <el-option
                                v-for="item in sourceSystemOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="币种：" prop="fCurrencyID">
                        <el-select style="width:100%" v-model="addForm.fCurrencyID" placeholder="请选择">
                            <el-option
                                v-for="item in fCurrencyOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="公司：" prop="fStorageOrgUnitID">
                        <el-select style="width:100%" v-model="addForm.fStorageOrgUnitID" placeholder="请选择">
                            <el-option
                                v-for="item in fstorageOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="部门：" prop="fAdminOrgUnitID">
                        <el-select style="width:100%" v-model="addForm.fAdminOrgUnitID" placeholder="请选择">
                            <el-option
                                v-for="item in fadminOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="备注：">
                        <el-input type="textarea" auto-complete="off" :rows="2" v-model.trim="addForm.fDescription" placeholder="备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="line">
            <span class="line-title">出库明细</span>
            <span class="line-button">
                <el-button type="primary" @click="addProduct">添加商品</el-button>
            </span>
        </div>
        <div class="product-detail">
            <product-detail
                :hasFloss="false"
                :hasFunitLoss="false"
                :hasFdiscountAmount="false"
                @productChange="productChangeHandler"
                ref="productDetail"
            ></product-detail>
        </div>
        <div class="button-handler">
            <el-button
                type="success"
                @click="saveHandler(1)"
                v-if="checkAuth('sale-out-stock-create')"
                >保存本地</el-button>
            <!-- <el-button type="primary" @click="saveHandler(2)">提交财务</el-button> -->
            <el-button type="info" @click="goBack">返回</el-button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Auth from '../auth';
import BaseComponent from '../base';
// import List from '../../components/biz/list';
import listMethodBase from '../../components/biz/listMethodBase';
import DictionarySearch from './dictionary-search';
import ProductDetail from './product-detail';
import CompanyCommon from './company-common';

const sourceSystemOptions = [
    {
        value: 1001,
        label: '海信下行',
    },
    {
        value: 2001,
        label: '海信上行',
    },
    {
        value: 3001,
        label: 'B2B',
    }
];

// 支付方式
const fPaymentTypeOptions = [
    {
        value: 1,
        label: '现销',
    },
];

// 币种
const fCurrencyOptions = [
    {
        value: 1,
        label: '人民币',
    },
    {
        value: 2,
        label: '美元',
    },
    {
        value: 3,
        label: '港币',
    }
];

const channelOptions = [
    {
        value: 1,
        label: '外贸',
    },
    {
        value: 2,
        label: '东南区销售',
    },
    {
        value: 3,
        label: '云上妙鲜',
    },
    {
        value: 4,
        label: '西北区销售',
    },
    {
        value: 5,
        label: '鲜花业务',
    },
    {
        value: 6,
        label: '精品推广',
    },
];

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        const validateWarehouseTotalAmount = (rule, value, callback) => {
            if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
                callback(new Error('订单总金额必须是数字且最多两位小数'));
            } else {
                callback();
            }
        };
        return {
            fCurrencyOptions, // 币种列表
            fPaymentTypeOptions, // 支付方式列表
            channelOptions, // 销售渠道列表
            sourceSystemOptions, // 订单来源列表
            addForm: {
                fBizDate: new Date(), // 销售日期
                fCustomerID: '', // 顾客名称id
                fCustomerName: '', // 顾客名称
                fWarehouseID: '', // 出库仓库/市场id
                fWarehouseName: '', // 出库仓库/市场 name
                fWarehouseNumber: '', // 出库仓库/市场 number
                fAmount: '', // 商品总金额
                orderAmount: '', // 订单总金额
                discountAmount: '', // 优惠金额
                fPaymentTypeID: '', // 支付方式
                fCurrencyID: '', // 币种
                channel: '', // 销售渠道
                fDescription: '', // 备注
                sourceSystem: '', // 订单来源
                fStorageOrgUnitID: '', // 公司
                fAdminOrgUnitID: '', // 部门
            },
            addFormRules: {
                fWarehouseID: [
                    { type: 'string', required: true, message: '请选择出库仓库/市场', trigger: 'change' }
                ],
                fCustomerID: [
                    { type: 'string', required: true, message: '请选择顾客姓名', trigger: 'change' }
                ],
                orderAmount: [
                    { validator: validateWarehouseTotalAmount, trigger: 'blur' }
                ],
                fPaymentTypeID: [
                    { type: 'number', required: true, message: '请选择支付方式', trigger: 'change' }
                ],
                fCurrencyID: [
                    { type: 'number', required: true, message: '请选择币种', trigger: 'change' }
                ],
                channel: [
                    { type: 'number', required: true, message: '请选择销售渠道', trigger: 'change' }
                ],
                sourceSystem: [
                    { type: 'number', required: true, message: '请选择订单来源', trigger: 'change' }
                ],
                fStorageOrgUnitID: [
                    { type: 'string', required: true, message: '请选择公司', trigger: 'change' }
                ],
                fAdminOrgUnitID: [
                    { type: 'string', required: true, message: '请选择部门', trigger: 'change' }
                ],
            },
            isAutoDirect: false, // 是否能够自动跳转
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    components: {
        [DictionarySearch.name]: DictionarySearch,
        [ProductDetail.name]: ProductDetail,
    },
    mounted() {
    },
    methods: {
        ...mapActions([
            'saveSaleoutInvoice',
            'submitSaleoutInvoice',
        ]),
        addProduct() {
            this.$refs.productDetail.addProduct();
        },
        saveHandler(type) {
            // type  1,保存在本地   2,提交财务
            // 判断是否有商品明细
            if (this.$refs.productDetail.productTableData.length === 0) {
                listMethodBase.errorTip('请先添加明细！');
                return;
            }
            // 判断商品明细是否全部确认
            /* eslint-disable max-len */
            const isAllConfirm = this.$refs.productDetail.productTableData.every(item => item.isEdit === false);
            if (!isAllConfirm) {
                listMethodBase.errorTip('请先确认明细！');
                return;
            }
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    // console.log('我通过验证');
                    if (type === 1) {
                        // 保存在本地
                        this.submitData(type);
                    } else if (type === 2) {
                        // 提交财务
                        this.$confirm('将数据提交给财务后不可更改，确认提交吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submitData(type);
                        });
                    }
                } else {
                    listMethodBase.errorTip('您填写的数据有误！');
                }
            });
        },
        goBack() {
            this.$router.go(-1);
        },
        submitData(type) {
            // 处理参数
            const params = Object.assign({}, {
                detailList: this.$refs.productDetail.productTableData.map((item) => {
                    const target = {
                        fMaterialID: item.fmaterialId,
                        fMaterialName: item.fmaterialName,
                        fMaterialModel: item.fmaterialModel,
                        upc: item.upc,
                        fUnitID: item.funitId,
                        fQty: item.fqty,
                        fBaseUnitID: item.fbaseUnitId,
                        fBaseQty: item.fbaseQty,
                        fAssistUnitID: item.fassistUnitId,
                        fAssistQty: item.fassistQty,
                        fTaxRate: item.ftaxRate,
                        fTaxPrice: item.ftaxPrice,
                        fRemark: item.fremark,
                        fLot: item.flot, // 批次
                        fMfg: listMethodBase.formatDate(item.fmfg), // 生成日期
                        fExp: listMethodBase.formatDate(item.fexp), // 到期日期
                        fIsPresent: item.fisPresent, // 是否赠品
                        fWarehouseID: this.addForm.fWarehouseID, // 仓库id
                        fWarehouseNumber: this.addForm.fWarehouseNumber, // 仓库number
                        fWarehouseName: this.addForm.fWarehouseName, // 仓库name
                    };
                    return target;
                }),
                ...this.addForm,
            }, {
                fBizDate: listMethodBase.formatDate(this.addForm.fBizDate),
                // fNumber: '100000022222',
            });
            // TODO 这里请求后端接口
            if (type === 1) {
                // 保存在本地
                this.saveSaleoutInvoice(params)
                .then(() => {
                    this.$set(this, 'isAutoDirect', true);
                    listMethodBase.successTip('保存成功');
                    this.$router.push('sale-out-stock');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            } else if (type === 2) {
                // 提交财务
            }
        },
        orderTotalAmountChangeHandler(value) {
            if (/^\d+(\.\d{1,2})?$/.test(value)) {
                this.$set(this.addForm, 'discountAmount', ((this.addForm.fAmount * 100) - (this.addForm.orderAmount * 100)) / 100);
            }
        },
        searchWarehouseOutChange(id, productSearchData) {
            this.$set(this.addForm, 'fWarehouseID', id);
            this.$set(this.addForm, 'fWarehouseName', (() => {
                let fWarehouseName = '';
                productSearchData.forEach((item) => {
                    if (item.fId === id) {
                        fWarehouseName = item.fName;
                    }
                });
                return fWarehouseName;
            })());
            this.$set(this.addForm, 'fWarehouseNumber', (() => {
                let fWarehouseNumber = '';
                productSearchData.forEach((item) => {
                    if (item.fId === id) {
                        fWarehouseNumber = item.fNumber;
                    }
                });
                return fWarehouseNumber;
            })());
        },
        searchCustomerChange(id, productSearchData) {
            this.$set(this.addForm, 'fCustomerID', id);
            this.$set(this.addForm, 'fCustomerName', (() => {
                let fCustomerName = '';
                productSearchData.forEach((item) => {
                    if (item.fId === id) {
                        fCustomerName = item.fName;
                    }
                });
                return fCustomerName;
            })());
        },
        productChangeHandler() {
            // 计算商品总金额和入库总金额
            /* eslint-disable max-len */
            const sum = this.$refs.productDetail.productTableData.reduce((preSum, y) => preSum + (y.ftaxPrice * 100 * y.fqty), 0);
            // console.log('计算 ', sum / 100);
            this.$set(this.addForm, 'fAmount', (sum / 100).toFixed(2));
            this.$set(this.addForm, 'orderAmount', (sum / 100).toFixed(2));
            this.$set(this.addForm, 'discountAmount', (((this.addForm.fAmount * 100) - (this.addForm.orderAmount * 100)) / 100)).toFixed(2);
        },
    },
    beforeRouteLeave(to, from, next) {
        if (this.isAutoDirect) {
            next();
        } else {
            this.$confirm('您的数据还没有保存，确定要离开吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            .then(() => {
                next();
            })
            .catch(() => {
            });
        }
    },
};
</script>


<style lang="less">
#saleout-invoice-add {
    padding: 20px;
    .line {
        padding-bottom: 5px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
        .line-title {
            // float: left;
            vertical-align: middle;
        }
        .line-button {
            float: right;
        }
        &:after {
            content: "";
            display: block;
            clear: both;
        }
    }
    .edit-product.el-table {
        .cell {
            padding-left: 5px;
            padding-right: 5px;
        }
    }
    .button-handler {
        padding-top: 20px;
    }
}
</style>
