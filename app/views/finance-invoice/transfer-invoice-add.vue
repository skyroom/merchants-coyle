<template>
    <div id="transfer-invoice-add">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="调拨日期：">
                        <el-date-picker
                            v-model="addForm.fBizDate"
                            style="width:100%"
                            type="date"
                            placeholder="调拨日期"
                            :editable="false"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="调出仓库/市场：" prop="tranferOutStoreWarehouseId">
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
                    <el-form-item label="调入仓库/市场：" prop="tranferInStoreWarehouseId">
                        <dictionary-search
                            :type="5"
                            placeholder="请输入仓库名称"
                            ref="dictionaryWarehouseIn"
                            @searchChange="searchWarehouseInChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="公司：" prop="fStorageOrgUnitID">
                        <el-select style="width:100%" v-model="addForm.fStorageOrgUnitID" placeholder="请选择">
                            <el-option
                                v-for="item in fstorageOrgUnitIdOptions"
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
                    <el-form-item label="部门：" prop="fAdminOrgUnitID">
                        <el-select style="width:100%" v-model="addForm.fAdminOrgUnitID" placeholder="请选择">
                            <el-option
                                v-for="item in fadminOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="调出公司：" prop="fIssueStorageOrgUnitId">
                        <el-select style="width:100%" v-model="addForm.fIssueStorageOrgUnitId" placeholder="请选择">
                            <el-option
                                v-for="item in fstorageOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="调入公司：" prop="fReceiptStorageOrgUnitId">
                        <el-select style="width:100%" v-model="addForm.fReceiptStorageOrgUnitId" placeholder="请选择">
                            <el-option
                                v-for="item in fstorageOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
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
            <span class="line-title">调拨明细</span>
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
                ref="productDetail"
            ></product-detail>
        </div>
        <div class="button-handler">
            <el-button
                type="success"
                @click="saveHandler(1)"
                v-if="checkAuth('tranfer-in-stock-create')"
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
import ProductDetail from './product-detail';
import DictionarySearch from './dictionary-search';
import CompanyCommon from './company-common';

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        return {
            addForm: {
                fBizDate: new Date(), // 调拨日期
                tranferOutStoreWarehouseId: '', // 调出仓库/市场id
                tranferInStoreWarehouseId: '', // 调入仓库/市场id
                fDescription: '', // 备注
                fStorageOrgUnitID: '', // 库存组织(公司ID)
                fAdminOrgUnitID: '', // 部门
                fIssueStorageOrgUnitId: '', // 调出库存组织
                fReceiptStorageOrgUnitId: '', // 调入库存组织
            },
            addFormRules: {
                tranferOutStoreWarehouseId: [
                    { type: 'string', required: true, message: '请选择调出仓库/市场', trigger: 'change' }
                ],
                tranferInStoreWarehouseId: [
                    { type: 'string', required: true, message: '请选择调入仓库/市场', trigger: 'change' }
                ],
                fStorageOrgUnitID: [
                    { type: 'string', required: true, message: '请选择公司', trigger: 'change' }
                ],
                fIssueStorageOrgUnitId: [
                    { type: 'string', required: true, message: '请选择调出公司', trigger: 'change' }
                ],
                fReceiptStorageOrgUnitId: [
                    { type: 'string', required: true, message: '请选择调入公司', trigger: 'change' }
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
        [ProductDetail.name]: ProductDetail,
        [DictionarySearch.name]: DictionarySearch,
    },
    mounted() {
    },
    methods: {
        ...mapActions([
            'saveTransferInvoice',
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
            if (this.addForm.tranferOutStoreWarehouseId === this.addForm.tranferInStoreWarehouseId) {
                listMethodBase.errorTip('调出仓库和调入仓库不能相同！');
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
                // fNumber: '20171127095010',
            });
            // TODO 这里请求后端接口
            if (type === 1) {
                // 保存在本地
                this.saveTransferInvoice(params)
                .then(() => {
                    this.$set(this, 'isAutoDirect', true);
                    listMethodBase.successTip('保存成功');
                    this.$router.push('tranfer-in-stock');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            } else if (type === 2) {
                // 提交财务
            }
        },
        searchWarehouseOutChange(id) {
            this.$set(this.addForm, 'tranferOutStoreWarehouseId', id);
        },
        searchWarehouseInChange(id) {
            this.$set(this.addForm, 'tranferInStoreWarehouseId', id);
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
#transfer-invoice-add {
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
