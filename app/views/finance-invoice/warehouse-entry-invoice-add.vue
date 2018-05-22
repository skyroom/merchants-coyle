<template>
    <div id="warehouse-entry-invoice-add">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="入库日期：" prop="fBizDate">
                        <el-date-picker
                            v-model="addForm.fBizDate"
                            style="width:100%"
                            type="date"
                            placeholder="入库日期"
                            :editable="false"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商：" prop="fSupplierID">
                        <dictionary-search
                            :type="4"
                            placeholder="请输入供应商名称"
                            ref="dictionarySupplier"
                            @searchChange="searchSupplierChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="入库仓库：" prop="fWarehouseID">
                        <dictionary-search
                            :type="5"
                            placeholder="请输入仓库名称"
                            ref="dictionaryWarehouse"
                            @searchChange="searchWarehouseChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="商品总金额(元)：">
                        <el-input :disabled="true" v-model="addForm.productTotalMoney"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="入库总金额(元)：" prop="inStockTotalMoney">
                        <el-input v-model.trim="addForm.inStockTotalMoney" auto-complete="off" placeholder="入库总金额(元)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="关联采购单号：">
                        <el-input v-model.trim="addForm.purchaseId" auto-complete="off" placeholder="关联采购单号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="采购渠道：" prop="channel">
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
            </el-row>
            <el-row :gutter="20">
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
                <el-col :span="10">
                    <el-form-item label="备注：">
                        <el-input type="textarea" auto-complete="off" :rows="2" v-model.trim="addForm.fDescription" placeholder="备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="line">
            <span class="line-title">入库明细</span>
            <span class="line-button">
                <el-button type="primary" @click="addProduct">添加商品</el-button>
            </span>
        </div>
        <div class="product-detail">
            <product-detail
                :hasFexp="false"
                :hasFmfg="false"
                :hasFlot="false"
                :hasFloss="false"
                :hasFunitLoss="false"
                :hasFdiscountAmount="false"
                :hasFisPresent="false"
                @productChange="productChangeHandler"
                ref="productDetail"
            ></product-detail>
        </div>
        <div class="button-handler">
            <el-button
                type="success"
                @click="saveHandler(1)"
                v-if="checkAuth('purchase-in-stock-create')"
                >保存本地</el-button>
            <!-- <el-button type="primary" @click="saveHandler(2)">提交财务</el-button> -->
            <el-button type="info" @click="goBack">返回</el-button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
// import { cloneDeep } from 'lodash';
import Auth from '../auth';
import BaseComponent from '../base';
// import List from '../../components/biz/list';
import listMethodBase from '../../components/biz/listMethodBase';
import DictionarySearch from './dictionary-search';
import ProductDetail from './product-detail';
import CompanyCommon from './company-common';

const channelOptions = [
    {
        value: 1,
        label: '大宗采购',
    },
    {
        value: 2,
        label: '妙鲜采购',
    },
    {
        value: 3,
        label: '鲜花采购',
    }
];

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        const validateWarehouseTotalAmount = (rule, value, callback) => {
            if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
                callback(new Error('入库总金额必须是数字且最多两位小数'));
            } else {
                callback();
            }
        };
        return {
            channelOptions, // 采购渠道列表
            addForm: {
                fSupplierID: '', // 供应商id
                fWarehouseID: '', // 入库仓库id
                productTotalMoney: '', // 商品总金额
                inStockTotalMoney: '', // 入库总金额
                fDescription: '', // 备注
                fBizDate: new Date(), // 入库时间
                purchaseId: '', // 关联的采购单号
                channel: '', // 采购渠道
                fStorageOrgUnitID: '', // 公司
                fAdminOrgUnitID: '', // 部门
            },
            addFormRules: {
                fSupplierID: [
                    { type: 'string', required: true, message: '请选择供应商', trigger: 'change' }
                ],
                fWarehouseID: [
                    { type: 'string', required: true, message: '请选择入库仓库', trigger: 'change' }
                ],
                inStockTotalMoney: [
                    { validator: validateWarehouseTotalAmount, trigger: 'blur' }
                ],
                channel: [
                    { type: 'number', required: true, message: '请选择采购渠道', trigger: 'change' }
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
            'saveWarehouseInvoice',
            'submitWarehouseInvoice',
            'dictionarySearch',
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
                    };
                    return target;
                }),
                ...this.addForm,
            }, {
                fBizDate: listMethodBase.formatDate(this.addForm.fBizDate),
                // fNumber: '1000000666666',
            });
            // TODO 这里请求后端接口
            if (type === 1) {
                // 保存在本地
                this.saveWarehouseInvoice(params)
                .then(() => {
                    this.$set(this, 'isAutoDirect', true);
                    listMethodBase.successTip('保存成功');
                    this.$router.push('purchase-in-stock');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            } else if (type === 2) {
                // 提交财务
            }
        },
        searchWarehouseChange(id) {
            this.$set(this.addForm, 'fWarehouseID', id);
        },
        searchSupplierChange(id) {
            this.$set(this.addForm, 'fSupplierID', id);
        },
        productChangeHandler() {
            // 计算商品总金额和入库总金额
            /* eslint-disable max-len */
            const sum = this.$refs.productDetail.productTableData.reduce((preSum, y) => preSum + (y.ftaxPrice * 100 * y.fqty), 0);
            // console.log('计算 ', sum / 100);
            this.$set(this.addForm, 'productTotalMoney', (sum / 100).toFixed(2));
            this.$set(this.addForm, 'inStockTotalMoney', (sum / 100).toFixed(2));
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
#warehouse-entry-invoice-add {
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
