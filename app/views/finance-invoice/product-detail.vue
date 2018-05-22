<template lang="html">
    <div id="product-detail">
        <el-table
            class="edit-product"
            :data="productTableData"
            style="width: 100%"
            border
            stripe="stripe"
            highlight-current-row
            >
            <el-table-column
                prop="number"
                label="序号"
                width="70"
                align="center"
                >
            </el-table-column>
            <el-table-column
                label="商品编号"
                width="180"
                align="center"
                >
                <template scope="scope">
                    <el-input :disabled="true" auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.fmaterialId"></el-input>
                    <span v-else v-text="scope.row.fmaterialId"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                min-width="180"
                align="center"
                >
                <template scope="scope">
                    <el-select
                        v-if="scope.row.isEdit"
                        v-model="scope.row.fmaterialId"
                        filterable
                        remote
                        auto-complete="off"
                        placeholder="请输入商品名称"
                        :remote-method="searchProductByName"
                        @change="searchProductChange"
                        :loading="loading"
                        >
                        <el-option
                            v-for="item in productSearchData"
                            :key="item.fNumber"
                            :label="item.fName"
                            :value="item.fNumber">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.fmaterialName"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="规格/等级"
                width="180"
                align="center"
                >
                <template scope="scope">
                    <el-input :disabled="true" auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.fmaterialModel"></el-input>
                    <span v-else v-text="scope.row.fmaterialModel"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="UPC编号"
                width="180"
                align="center"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.upc"></el-input>
                    <span v-else v-text="scope.row.upc"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="计量单位"
                width="120"
                align="center"
                >
                <template scope="scope">
                    <el-select v-if="scope.row.isEdit" style="width:100%" v-model="scope.row.funitId" placeholder="计量单位" @change="funitIdChange">
                        <el-option
                            v-for="item in funitIdOptions"
                            :key="item.fId"
                            :label="item.fName"
                            :value="item.fId">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.funitName"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="数量"
                width="100"
                align="center"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" :maxlength="9" v-model.trim="scope.row.fqty">
                    </el-input>
                    <span v-else v-text="scope.row.fqty"></span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="基本计量单位"
                width="120"
                align="center"
                >
                <template scope="scope">
                    <el-select v-if="scope.row.isEdit" style="width:100%" v-model="scope.row.fbaseUnitId" placeholder="基本计量单位" @change="fbaseUnitIdChange">
                        <el-option
                            v-for="item in funitIdOptions"
                            :key="item.fId"
                            :label="item.fName"
                            :value="item.fId">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.fbaseUnitName"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="基本数量"
                width="100"
                align="center"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" :maxlength="9" v-model.trim="scope.row.fbaseQty">
                    </el-input>
                    <span v-else v-text="scope.row.fbaseQty"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="辅助计量单位"
                width="120"
                align="center"
                >
                <template scope="scope">
                    <el-select
                        v-if="scope.row.isEdit"
                        style="width:100%"
                        v-model="scope.row.fassistUnitId"
                        placeholder="辅助计量单位"
                        @change="fassistUnitIDChange"
                        >
                        <el-option
                            v-for="item in funitIdOptions"
                            :key="item.fId"
                            :label="item.fName"
                            :value="item.fId">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.fassistUnitName"></span>
                </template>
            </el-table-column>
            <el-table-column
                label=" 辅助数量"
                width="100"
                align="center"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" :maxlength="9" v-model.trim="scope.row.fassistQty">
                    </el-input>
                    <span v-else v-text="scope.row.fassistQty"></span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="税率(%)"
                width="100"
                align="center"
                v-if="hasFtaxRate"
                >
                <template scope="scope">
                    <el-select
                        v-model="scope.row.ftaxRate"
                        v-if="scope.row.isEdit"
                        placeholder="请选择"
                        @change="ftaxRateChange(scope.row.ftaxRate, scope.row)"
                        >
                        <el-option
                            v-for="item in ftaxRateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.ftaxRate_f"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="含税单价(元)"
                width="100"
                align="center"
                v-if="hasFtaxPrice"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.ftaxPrice"></el-input>
                    <span v-else v-text="scope.row.ftaxPrice"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="优惠金额(元)"
                width="130"
                align="center"
                v-if="hasFdiscountAmount"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.fdiscountAmount"></el-input>
                    <span v-else v-text="scope.row.fdiscountAmount"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="批次"
                width="100"
                align="center"
                v-if="hasFlot"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.flot"></el-input>
                    <span v-else v-text="scope.row.flot"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="生产日期"
                width="150"
                align="center"
                v-if="hasFmfg"
                >
                <template scope="scope">
                    <el-date-picker
                        v-if="scope.row.isEdit"
                        v-model="scope.row.fmfg"
                        style="width:100%"
                        type="date"
                        placeholder="生成日期"
                        :editable="false"
                        @change="fmfgChangeHandler(scope.row.fmfg, scope.row)"
                        >
                    </el-date-picker>
                    <span v-else v-text="scope.row.fmfg_f"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="到期日期"
                width="150"
                align="center"
                v-if="hasFexp"
                >
                <template scope="scope">
                    <el-date-picker
                        v-if="scope.row.isEdit"
                        v-model="scope.row.fexp"
                        style="width:100%"
                        type="date"
                        placeholder="到期日期"
                        :editable="false"
                        @change="fexpChangeHandler(scope.row.fexp, scope.row)"
                        >
                    </el-date-picker>
                    <span v-else v-text="scope.row.fexp_f"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="是否赠品"
                width="120"
                align="center"
                v-if="hasFisPresent"
                >
                <template scope="scope">
                    <el-select
                        v-model="scope.row.fisPresent"
                        v-if="scope.row.isEdit"
                        placeholder="请选择"
                        @change="fisPresentChange(scope.row.fisPresent, scope.row)"
                        >
                        <el-option
                            v-for="item in fisPresentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-else v-text="scope.row.fisPresent_f"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="单位损耗成本"
                width="150"
                align="center"
                v-if="hasFunitLoss"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.funitLoss"></el-input>
                    <span v-else v-text="scope.row.funitLoss"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="损耗成本"
                width="150"
                align="center"
                v-if="hasFloss"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.floss"></el-input>
                    <span v-else v-text="scope.row.floss"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                width="150"
                align="center"
                >
                <template scope="scope">
                    <el-input auto-complete="off" v-if="scope.row.isEdit" v-model.trim="scope.row.fremark">
                    </el-input>
                    <span v-else v-text="scope.row.fremark"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150"
                align="center"
                >
                <template scope="scope">
                    <el-button type="success" size="small" v-if="scope.row.isEdit" @click="changeRowStatus(scope.row, 'confirm')">确认</el-button>
                    <el-button size="small" v-else type="info" @click="changeRowStatus(scope.row, 'edit')">编辑</el-button>
                    <el-button size="small" type="warning" @click="deleteProduct(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { debounce } from 'lodash';
import listMethodBase from '../../components/biz/listMethodBase';

export default {
    name: 'product-detail',
    props: {
        hasFtaxRate: {
            type: Boolean,
            default: () => true,
        },
        hasFtaxPrice: {
            type: Boolean,
            default: () => true,
        },
        hasFlot: {
            type: Boolean,
            default: () => true,
        },
        hasFmfg: {
            type: Boolean,
            default: () => true,
        },
        hasFexp: {
            type: Boolean,
            default: () => true,
        },
        hasFisPresent: {
            type: Boolean,
            default: () => true,
        },
        hasFunitLoss: { // 单位损耗成本
            type: Boolean,
            default: () => true,
        },
        hasFloss: { // 损耗成本
            type: Boolean,
            default: () => true,
        },
        hasFdiscountAmount: {
            type: Boolean,
            default: () => true,
        },
    },
    data() {
        return {
            productTableData: [], // 表格列表数据
            productSearchData: [], // 查询商品时数据
            funitIdOptions: [], // 单位列表数据
            loading: false,
            fisPresentOptions: [{
                value: 1,
                label: '是',
            }, {
                value: 0,
                label: '否',
            }],
            ftaxRateOptions: [{
                value: 1,
                label: '0',
            }, {
                value: 2,
                label: '3',
            }, {
                value: 3,
                label: '6',
            }, {
                value: 4,
                label: '11',
            }, {
                value: 5,
                label: '13',
            }, {
                value: 6,
                label: '17',
            }],
        };
    },
    methods: {
        ...mapActions([
            'dictionarySearch',
        ]),
        changeRowStatus(row, type) {
            // type   'confirm',确认操作     'edit',编辑操作
            if (type === 'confirm') {
                if (!row.fmaterialId) {
                    listMethodBase.errorTip('商品名称不能为空');
                    return;
                }
                if (!row.funitId) {
                    listMethodBase.errorTip('计量单位不能为空');
                    return;
                }
                if (!row.fqty) {
                    listMethodBase.errorTip('数量不能为空');
                    return;
                }
                if (!/^[1-9][0-9]{0,8}$/.test(row.fqty)) {
                    listMethodBase.errorTip('数量必须为非0正整数');
                    return;
                }
                // if (!row.fbaseUnitId) {
                //     listMethodBase.errorTip('基本单位不能为空');
                //     return;
                // }
                // if (!row.fbaseQty) {
                //     listMethodBase.errorTip('基本数量不能为空');
                //     return;
                // }
                // if (!/^[1-9][0-9]{0,8}$/.test(row.fbaseQty)) {
                //     listMethodBase.errorTip('基本数量必须为非0正整数');
                //     return;
                // }
                // if (!row.fassistUnitId) {
                //     listMethodBase.errorTip('辅助单位不能为空');
                //     return;
                // }
                // if (!row.fassistQty) {
                //     listMethodBase.errorTip('辅助数量不能为空');
                //     return;
                // }
                // if (!/^[1-9][0-9]{0,8}$/.test(row.fassistQty)) {
                //     listMethodBase.errorTip('辅助数量必须为非0正整数');
                //     return;
                // }
                if (this.hasFmfg && this.hasFexp) {
                    if (listMethodBase.isTimeError(row.fmfg, row.fexp, '生成日期不能大于到期日期', 'error')) {
                        return;
                    }
                }
                if (this.hasFtaxRate) {
                    if (!row.ftaxRate) {
                        listMethodBase.errorTip('税率不能为空');
                        return;
                    }
                    // if (!/^\d+(\.\d{1,2})?$/.test(row.ftaxRate)) {
                    //     listMethodBase.errorTip('税率必须为数字且最多两位小数');
                    //     return;
                    // }
                }
                if (this.hasFtaxPrice) {
                    if (!row.ftaxPrice || row.ftaxPrice === '0') {
                        listMethodBase.errorTip('含税单价不能为空且不能为0');
                        return;
                    }
                    if (!/^\d+(\.\d{1,2})?$/.test(row.ftaxPrice)) {
                        listMethodBase.errorTip('含税单价必须为数字且最多两位小数');
                        return;
                    }
                }
                if (this.hasFdiscountAmount) {
                    if (!/^\d+(\.\d{1,2})?$/.test(row.fdiscountAmount) && row.fdiscountAmount) {
                        listMethodBase.errorTip('优惠金额必须为数字且最多两位小数');
                        return;
                    }
                }
                if (this.hasFunitLoss) {
                    if (!/^\d+(\.\d{1,2})?$/.test(row.funitLoss) && row.funitLoss) {
                        listMethodBase.errorTip('单位损耗成本必须为数字且最多两位小数');
                        return;
                    }
                }
                if (this.floss) {
                    if (!/^\d+(\.\d{1,2})?$/.test(row.floss) && row.floss) {
                        listMethodBase.errorTip('损耗成本必须为数字且最多两位小数');
                        return;
                    }
                }
                this.$set(row, 'isEdit', false);
                this.$set(this, 'productSearchData', []);
                // 赋值基本单位和辅助单位
                this.$set(row, 'fbaseUnitId', row.funitId);
                this.$set(row, 'fbaseQty', row.fqty);
                this.$set(row, 'fassistUnitId', row.funitId);
                this.$set(row, 'fassistQty', row.fqty);
                // 发起商品变化事件 用于更新商品总金额和入库总金额
                this.$emit('productChange');
            } else if (type === 'edit') {
                this.$set(row, 'isEdit', true);
                this.$set(this, 'productSearchData', []);
            }
        },
        addProduct() {
            const isAllConfirm = this.productTableData.every(item => item.isEdit === false);
            if (!isAllConfirm) {
                listMethodBase.errorTip('请先确认明细之后再添加！');
                return;
            }
            // 损益单没有 ftaxRate 和 ftaxPrice
            this.productTableData.push({
                number: this.productTableData.length + 1,
                fmaterialId: '', // 商品id
                fmaterialName: '', // 商品名字
                fmaterialModel: '', // 规格
                upc: '', // upc数量
                funitId: '', // 计量单位id
                funitName: '', // 计量单位名字
                fqty: '', // 数量
                fbaseUnitId: '', // 基本计量单位id
                fbaseUnitName: '', // 基本计量单位名字
                fbaseQty: '', // 基本数量
                fassistUnitId: '', // 辅助计量单位id
                faaseUnitName: '', // 辅助计量单位名字
                fassistQty: '', // 辅助数量
                ftaxRate: '', // 税率(%) id
                ftaxRate_f: '', // 税率(%) name
                ftaxPrice: '', // 含税单价
                flot: '', // 批次
                fmfg: '', // 生成日期
                fexp: '', // 到期日期
                fisPresent: '', // 是否赠品 id
                fisPresent_f: '', // 是否赠品 name
                funitLoss: '', // 单位损耗成本
                floss: '', // 损耗成本
                fdiscountAmount: '', // 优惠金额
                fremark: '', // 备注
                isEdit: true,
            });
        },
        deleteProduct(row) {
            this.$confirm('确认要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.productTableData.splice(row.number - 1, 1);
                this.productTableData.forEach((item, index) => {
                    /* eslint-disable no-param-reassign */
                    item.number = index + 1;
                });
                this.$set(this, 'productSearchData', []);
                // 发起商品变化事件 用于更新商品总金额和入库总金额
                this.$emit('productChange');
            })
            .catch(() => {
            });
        },
        searchProductByName(name) {
            this.$set(this, 'loading', true);
            if (!name) {
                this.$set(this, 'productSearchData', []);
                return;
            }
            debounce(() => {
                this.dictionarySearch({
                    type: 3,
                    keyword: name,
                })
                .then((data) => {
                    this.$set(this, 'loading', false);
                    this.$set(this, 'productSearchData', data);
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            }, 500)();
        },
        searchProductChange(id) {
            this.productSearchData.forEach((item) => {
                if (item.fNumber === id) {
                    /* eslint-disable max-len */
                    this.productTableData[this.productTableData.length - 1].fmaterialName = item.fName;
                    this.productTableData[this.productTableData.length - 1].fmaterialModel = item.fSpec;
                }
            });
        },
        funitIdChange(val) {
            this.funitIdOptions.forEach((item) => {
                if (item.fId === val) {
                    this.productTableData[this.productTableData.length - 1].funitName = item.fName;
                }
            });
        },
        fbaseUnitIdChange(val) {
            this.funitIdOptions.forEach((item) => {
                if (item.fId === val) {
                    this.productTableData[this.productTableData.length - 1].fbaseUnitName = item.fName;
                }
            });
        },
        fassistUnitIDChange(val) {
            this.funitIdOptions.forEach((item) => {
                if (item.fId === val) {
                    this.productTableData[this.productTableData.length - 1].fassistUnitName = item.fName;
                }
            });
        },
        fexpChangeHandler(val, row) {
            this.$set(row, 'fexp_f', listMethodBase.formatDate(row.fexp));
        },
        fmfgChangeHandler(val, row) {
            this.$set(row, 'fmfg_f', listMethodBase.formatDate(row.fmfg));
        },
        fisPresentChange(val, row) {
            this.$set(row, 'fisPresent_f', (() => {
                if (val === 1) {
                    return '是';
                } else if (val === 0) {
                    return '否';
                }
                return '未知';
            })());
        },
        ftaxRateChange(val, row) {
            this.$set(row, 'ftaxRate_f', (() => {
                if (val === 1) {
                    return '0';
                } else if (val === 2) {
                    return '3';
                } else if (val === 3) {
                    return '6';
                } else if (val === 4) {
                    return '11';
                } else if (val === 5) {
                    return '13';
                } else if (val === 6) {
                    return '17';
                }
                return '未知';
            })());
        },
    },
    mounted() {
        // 获取商品所有单位
        this.dictionarySearch({ type: 6, keyword: '' })
        .then((data) => {
            this.$set(this, 'funitIdOptions', data);
        })
        .catch((err) => {
            listMethodBase.errorTip(err.msg || err);
        });
    },
};
</script>

<style lang="less">
#product-detail {

}
</style>
