<template>
    <div id="adjustment-invoice-add">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="损益日期：" prop="fbizDate">
                        <el-date-picker
                            v-model="addForm.fbizDate"
                            style="width:100%"
                            type="date"
                            placeholder="损益日期"
                            :editable="false"
                            :clearable="false"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务类型：" prop="fbizTypeId">
                        <el-select style="width:100%" v-model="addForm.fbizTypeId" placeholder="请选择">
                            <el-option
                                v-for="item in fbizTypeIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库/市场：" prop="warehouseNumber">
                        <dictionary-search
                            :type="5"
                            placeholder="请输入仓库/市场名称"
                            ref="dictionaryWarehouse"
                            @searchChange="searchWarehouseChange"
                            :clearable="false"
                        ></dictionary-search>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="公司：" prop="fstorageOrgUnitId">
                        <el-select style="width:100%" v-model="addForm.fstorageOrgUnitId" placeholder="请选择">
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
                    <el-form-item label="部门：" prop="fadminOrgUnitId">
                        <el-select style="width:100%" v-model="addForm.fadminOrgUnitId" placeholder="请选择">
                            <el-option
                                v-for="item in fadminOrgUnitIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="损益原因：">
                        <el-input type="textarea" auto-complete="off" :rows="2" v-model.trim="addForm.fdescription" placeholder="损益原因"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="line">
            <span class="line-title">损益明细</span>
            <span class="line-button">
                <el-button type="primary" @click="addProduct">添加商品</el-button>
            </span>
        </div>
        <div class="product-detail">
            <product-detail
                :hasFtaxRate="false"
                :hasFtaxPrice="false"
                :hasFdiscountAmount="false"
                :hasFunitLoss="addForm.fbizTypeId === 'Nz878AEgEADgAABGwKg/GiQHQ1w='"
                :hasFloss="addForm.fbizTypeId === 'Nz878AEgEADgAABGwKg/GiQHQ1w='"
                ref="productDetail"
            ></product-detail>
        </div>
        <div class="button-handler">
            <el-button
                type="success"
                @click="saveHandler(1)"
                v-if="checkAuth('adjust-insert')"
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

const fbizTypeIdOptions = [
    {
        value: 'Nz878AEgEADgAABGwKg/GiQHQ1w=',
        label: '盘盈入库',
    },
    {
        value: 'N5d2igEgEADgAAB0wKg/GiQHQ1w=',
        label: '盘亏出库',
    },
];

export default {
    mixins: [Auth, CompanyCommon],
    extends: BaseComponent,
    data() {
        return {
            warehouseIDOptions: [], // 仓库列表
            channelOptions, // 采购渠道列表
            funitIdOptions: [], // 商品单位列表
            fbizTypeIdOptions, // 业务类型列表
            addForm: {
                fbizDate: new Date(), // 损益日期
                fbizTypeId: 'Nz878AEgEADgAABGwKg/GiQHQ1w=', // 业务类型
                warehouseId: '', // 仓库/市场 id
                warehouseNumber: '', // 仓库/市场 number
                warehouseName: '', // 仓库/市场 name
                fdescription: '', // 损益原因
                fstorageOrgUnitId: '', // 公司
                fadminOrgUnitId: '', // 部门
            },
            addFormRules: {
                fbizTypeId: [
                    { type: 'string', required: true, message: '请选择业务类型', trigger: 'change' }
                ],
                warehouseNumber: [
                    { type: 'string', required: true, message: '请选择仓库/市场', trigger: 'change' }
                ],
                fstorageOrgUnitId: [
                    { type: 'string', required: true, message: '请选择公司', trigger: 'change' }
                ],
                fadminOrgUnitId: [
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
        // 获取仓库列表
        this.dictionarySearch({ type: 5, keyword: '' })
        .then((data) => {
            this.$set(this, 'warehouseIDOptions', data);
        })
        .catch((err) => {
            listMethodBase.errorTip(err.message || err);
        });
    },
    methods: {
        ...mapActions([
            'saveAdjustmentInvoice',
            'submitAdjustmentInvoice',
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
            // console.log(this.productTableData);
            // 处理参数
            const params = Object.assign({}, {
                detailList: this.$refs.productDetail.productTableData.map((item) => {
                    const target = {
                        fmaterialId: item.fmaterialId, // 物料编码
                        fmaterialName: item.fmaterialName,
                        fmaterialModel: item.fmaterialModel,
                        upc: item.upc,
                        funitId: item.funitId,
                        fqty: item.fqty,
                        fbaseUnitId: item.fbaseUnitId,
                        fbaseQty: item.fbaseQty,
                        fassistUnitId: item.fassistUnitId,
                        fassistQty: item.fassistQty,
                        flot: item.flot, // 批次
                        fmfg: listMethodBase.formatDate(item.fmfg), // 生成日期
                        fexp: listMethodBase.formatDate(item.fexp), // 到期日期
                        fisPresent: item.fisPresent, // 是否赠品
                        funitLoss: item.funitLoss, // 单位损耗成本
                        floss: item.floss, // 损耗成本
                        fwarehouseId: this.addForm.warehouseId, // 仓库id
                        fwarehouseNumber: this.addForm.warehouseNumber, // 仓库number
                        fwarehouseName: this.addForm.warehouseName, // 仓库name
                        fremark: item.fremark,
                    };
                    return target;
                }),
                ...this.addForm,
            }, {
                fbizDate: listMethodBase.formatDate(this.addForm.fbizDate),
                sku: this.$refs.productDetail.productTableData.length,
                // fnumber: '100088888888',
            });
            // TODO 这里请求后端接口
            if (type === 1) {
                // 保存在本地
                this.saveAdjustmentInvoice(params)
                .then(() => {
                    this.$set(this, 'isAutoDirect', true);
                    listMethodBase.successTip('保存成功');
                    this.$router.push('adjust-search');
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            } else if (type === 2) {
                // 提交财务
            }
        },
        searchWarehouseChange(id, productSearchData) {
            this.$set(this.addForm, 'warehouseId', id);
            this.$set(this.addForm, 'warehouseName', (() => {
                let warehouseName = '';
                productSearchData.forEach((item) => {
                    if (item.fId === id) {
                        warehouseName = item.fName;
                    }
                });
                return warehouseName;
            })());
            this.$set(this.addForm, 'warehouseNumber', (() => {
                let warehouseNumber = '';
                productSearchData.forEach((item) => {
                    if (item.fId === id) {
                        warehouseNumber = item.fNumber;
                    }
                });
                return warehouseNumber;
            })());
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
#adjustment-invoice-add {
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
