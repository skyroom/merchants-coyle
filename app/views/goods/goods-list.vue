<template>
<div id="goods-list">
    <gz-list
    ref="goodsList"
    @getData="getGoodsListHandler"
    :form="searchForm"
    :originData="goodsListFormat"
    :originPaging="goodsListPagingFormat"
    :colNameMap="colNameMap"
    @cellClick="cellClick"
    :loading="loading"
    :pageShow="pageShow"
    :operation="operation"
    @operation-click="operationClickHandler"
    >
         <el-form ref="searchForm" :model="searchForm" label-width="90px" slot="searchForm" label-position="left">
            <el-row :gutter="21">
                <el-col :span="8">
                    <el-form-item label="商品类别：" style="width:100%">
                        <el-col :span="24">
                            <el-cascader
                                style="width:100%"
                                :options="goodsCategoryListTree"
                                v-model="typeArray"
                                :props="typeProps"
                                change-on-select
                                clearable
                                >
                            </el-cascader>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="商品名称：">
                        <el-input v-model.trim="searchForm.name" placeholder="商品名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态：">
                        <el-select v-model="searchForm.status" placeholder="全部状态">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="handlerToolbar">
            <el-row>
                <el-button type="primary" @click="getSearch()" v-if="checkAuth('product-search')">查询</el-button>
                <el-button type="primary" @click="addHandler" v-if="checkAuth('product-add')">新建</el-button>
            </el-row>
        </div>
    </gz-list>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="small">
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" label-width="100px" label-position="left">
            <el-form-item label="商品名称：" prop="name">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.name" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="商品类别：" prop="typeArray">
                <el-col :span="16">
                    <el-cascader
                        :options="goodsCategoryListTree"
                        v-model="modifyForm.typeArray"
                        :props="typeProps"
                        style="width:70%"
                        >
                    </el-cascader>
                </el-col>
            </el-form-item>
            <el-form-item label="商品简称：">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.shortName" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="商品编号：">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.code" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="标准代号：">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.standardCode" auto-complete="off" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="拼音码：">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.hotKey" :maxlength="25"> </el-input>
                </el-col>
            </el-form-item>
            <el-form-item required v-for="(domain, index) in modifyForm.productLevel" :label="'商品等级'+ (index + 1)" :key="index">
                <el-col :span="4">
                    <el-form-item
                    :prop="'productLevel.' + index + '.name'"
                    :rules="{
                        required: true, message: '等级不能为空', trigger: 'blur'
                    }"
                    >
                        <el-input v-model.trim="domain.name" auto-complete="off" :maxlength="25" placeholder="等级名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="text-align: center">-</el-col>
                <el-col :span="5">
                    <el-form-item
                    >
                        <el-input v-model.trim="domain.description" auto-complete="off" :maxlength="25" placeholder="描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="text-align: center">-</el-col>
                <el-col :span="3">
                    <el-form-item
                    >
                        <el-input v-model.trim="domain.ordinal" auto-complete="off" :maxlength="3" type="number" placeholder="排序"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1">&nbsp;</el-col>
                <el-col :span="9">
                    <el-form-item
                    >
                        <el-switch
                            v-model="domain.status"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            on-text="有效"
                            off-text="无效"
                            size="small"
                            :disabled="domain.hidden"
                            v-show="domain.isEdit === false ? false : true"
                            >
                        </el-switch>
                        <el-button
                            style="margin-left: 10px;"
                            size="small"
                            type="primary"
                            @click="deleteDomains(index)"
                            v-if="!domain.id && index !== 0"
                            >删除</el-button>
                        <el-button
                            style="margin-left: 10px;"
                            size="small" type="primary"
                            @click="addDomains"
                            v-if="index === 0"
                            >增加</el-button>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="描述：">
                <el-col :span="11">
                    <el-input v-model.trim="modifyForm.description" :maxlength="25"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveHandler">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import { cloneDeep } from 'lodash';
import {
    mapGetters,
    mapActions,
} from 'vuex';
import List from '../../components/biz/list';
import BaseComponent from '../base';
import Auth from '../auth';

const colNameMap = [{
    displayName: '操作',
    type: 'statusButton',
    width: 150,
},
{
    key: 'name',
    displayName: '商品名称',
    width: 140,
},
{
    key: 'catalogName',
    displayName: '商品类别',
    minWidth: 150,
},
{
    key: 'status_f',
    displayName: '状态',
    width: 90,
},
{
    key: 'createUserName',
    displayName: '创建人',
    width: 100,
}, {
    key: 'createTime_f',
    displayName: '创建时间',
    width: 180,
},
{
    key: 'updateUserName',
    displayName: '修改人',
    width: 100,
}, {
    key: 'updateTime_f',
    displayName: '修改时间',
    width: 180,
}];
export default {
    extends: BaseComponent,
    mixins: [Auth],
    components: {
        [List.name]: List,
    },
    data() {
        const validateType = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('请选择类别'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            pageShow: false,
            searchForm: {
                name: '',
                catalogId: 0,
                status: 2,
            },
            typeArray: [],
            colNameMap,
            operation: [{
                text: '编辑',
                buttonType: 'primary',
                valiateFunc: () => this.checkAuth('product-edit'),
            }, {
                text: '启用',
                buttonType: 'primary',
                valiateFunc: (status) => {
                    if (status === 0 && this.checkAuth('product-edit')) {
                        return true;
                    }
                    return false;
                },
                param: 'status',
            }, {
                text: '禁用',
                buttonType: 'danger',
                valiateFunc: (status) => {
                    if (status === 1 && this.checkAuth('product-edit')) {
                        return true;
                    }
                    return false;
                },
                param: 'status',
            }],
            options: [
                {
                    value: 2,
                    label: '全部状态',
                }, {
                    value: 0,
                    label: '已禁用',
                }, {
                    value: 1,
                    label: '启用中',
                },
            ],
            statusMap: {
                1: '启用',
                0: '禁用',
            },
            typeProps: {
                value: 'id',
                label: 'name',
            },
            dialogTitle: '',
            mode: '',
            modifyForm: {
                id: 0,
                name: '',
                shortName: '',
                code: '',
                standardCode: '',
                description: '',
                hotKey: '',
                catalogId: 0,
                typeArray: [],
                productLevel: [],
            },
            modifyFormRules: {
                name: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: 'blur,change',
                }],
                typeArray: [{
                    required: true,
                    message: '请选择商品类别',
                    trigger: 'blur,change',
                    validator: validateType,
                }],
            },
            dialogFormVisible: false,
        };
    },
    computed: {
        ...mapGetters([
            'goodsList',
            'goodsCategoryList',
            'goodsDetail',
        ]),
        goodsListFormat() {
            return this.goodsList.itemList.map((item) => {
                const targetItem = Object.assign({}, item);
                targetItem.status_f = this.statusMap[targetItem.status];
                if (item.createTime) {
                    targetItem.createTime_f = item.createTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                if (item.updateTime) {
                    targetItem.updateTime_f = item.updateTime.replace(/T/ig, ' ').replace(/\//ig, '-');
                }
                return targetItem;
            });
            // return this.goodsList.itemList;
        },
        goodsListPagingFormat() {
            if (this.goodsList.paging === null) {
                const pagingTemp = {
                    total: 0,
                };
                return pagingTemp;
            }
            return this.goodsList.paging;
        },
        goodsCategoryListTree() {
            const listTemp = cloneDeep(this.goodsCategoryList);
            return this.createTree(listTemp);
            // return this.goodsCategoryList;
        },
    },
    methods: {
        ...mapActions([
            'getGoodsList',
            'addGoods',
            'getGoodsCategoryList',
            'editGoods',
            'changeGoodsStatus',
            'getGoodsDetail',
            'getGoodsUnitList',
        ]),
        createTree(list) {
            return list.map((item) => {
                const targetItem = item;
                if (item.children && item.children.length === 0) {
                    delete targetItem.children;
                } else if (item.children) {
                    this.createTree(item.children);
                }
                return targetItem;
            });
        },
        cellClick(row, column) {
            if (column.label !== '操作') return;
            // this.$router.push(`/helpDetail/edit/${row.id}`);
        },
        getGoodsListHandler(queryCondition) {
            this.$set(this, 'loading', true);
            this.$set(this, 'pageShow', false);
            const queryConditionQuery = cloneDeep(queryCondition);
            queryConditionQuery.condition.catalogId = Number(queryConditionQuery.condition.catalogId); /*  eslint max-len: ["error", 200]  */
            if (queryConditionQuery.condition.status === 2) {
                queryConditionQuery.condition.status = null;
            }

            this.getGoodsList(queryConditionQuery)
            .then(() => {
                this.$set(this, 'loading', false);
                this.$set(this, 'pageShow', true);
            })
            .catch((err) => {
                this.$notify({
                    title: '错误',
                    message: err.message || err,
                    type: 'error',
                });
            });
        },
        getSearch() {
            this.$set(this.searchForm, 'catalogId', Number(this.typeArray[this.typeArray.length - 1]) || 0);
            this.$refs.goodsList.queryHandler();
        },
        addHandler() {
            if (this.$refs.modifyForm && this.$refs.modifyForm.resetFields) {
                this.$refs.modifyForm.resetFields();
            }
            this.$set(this.modifyForm, 'name', '');
            this.$set(this.modifyForm, 'shortName', '');
            this.$set(this.modifyForm, 'code', '');
            this.$set(this.modifyForm, 'standardCode', '');
            this.$set(this.modifyForm, 'catalogId', '');
            this.$set(this.modifyForm, 'typeArray', []);
            this.$set(this.modifyForm, 'description', '');
            this.$set(this.modifyForm, 'hotKey', '');
            this.$set(this.modifyForm, 'productLevel', [{
                name: '',
                description: '',
                ordinal: 0,
                status: true,
                hidden: true,
                isEdit: false,
            }]);
            this.$set(this, 'dialogFormVisible', true);
            this.$set(this, 'dialogTitle', '商品添加');
            this.$set(this, 'mode', 'add');
        },
        addDomains() {
            this.modifyForm.productLevel.push({
                name: '',
                description: '',
                ordinal: 0,
                status: true,
                hidden: true,
                isEdit: false,
            });
        },
        deleteDomains(index) {
            this.modifyForm.productLevel.splice(index, 1);
        },
        saveHandler() {
            this.$refs.modifyForm.validate((valid) => {
                if (valid) {
                    if (this.mode === 'add') {
                        const dataQuery = cloneDeep(this.modifyForm);
                        dataQuery.catalogId = dataQuery.typeArray[dataQuery.typeArray.length - 1];
                        dataQuery.productLevel.map((item) => {
                            const targetItem = item;
                            targetItem.status = item.status ? 1 : 0;
                            return targetItem;
                        });
                        delete dataQuery.id;
                        delete dataQuery.typeArray;
                        this.addGoods(dataQuery)
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success',
                            });
                            this.$set(this, 'dialogFormVisible', false);
                            this.$refs.goodsList.queryHandler();
                        })
                        .catch((err) => {
                            this.$notify({
                                title: '错误',
                                message: err.message || err,
                                type: 'error',
                            });
                        });
                    } else if (this.mode === 'edit') {
                        const dataQuery = cloneDeep(this.modifyForm);
                        dataQuery.catalogId = dataQuery.typeArray[dataQuery.typeArray.length - 1];
                        dataQuery.productLevel.map((item) => {
                            const targetItem = item;
                            targetItem.status = item.status ? 1 : 0;
                            return targetItem;
                        });
                        delete dataQuery.typeArray;
                        this.editGoods(dataQuery)
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                            });
                            this.$set(this, 'dialogFormVisible', false);
                            this.getGoodsListHandler(this.$refs.goodsList.queryCondition);
                        })
                        .catch((err) => {
                            this.$notify({
                                title: '错误',
                                message: err.message || err,
                                type: 'error',
                            });
                        });
                    }
                } else {
                    this.$notify({
                        title: '提示',
                        message: '您的输入有误！',
                        type: 'warning',
                    });
                }
            });
        },
        operationClickHandler(args) {
            if (args[2] === 0) {
                this.getGoodsDetail(args[1].id)
                .then(() => {
                    this.$set(this.modifyForm, 'id', this.goodsDetail.id);
                    this.$set(this.modifyForm, 'name', this.goodsDetail.name);
                    this.$set(this.modifyForm, 'shortName', this.goodsDetail.shortName || '');
                    this.$set(this.modifyForm, 'description', this.goodsDetail.description || '');
                    this.$set(this.modifyForm, 'hotKey', this.goodsDetail.hotKey || '');
                    this.$set(this.modifyForm, 'typeArray', this.goodsDetail.catalogId || []);
                    this.$set(this.modifyForm, 'status', this.goodsDetail.status);
                    this.$set(this.modifyForm, 'code', this.goodsDetail.code || '');
                    this.$set(this.modifyForm, 'standardCode', this.goodsDetail.standardCode || '');
                    this.$set(this.modifyForm, 'productLevel', cloneDeep(this.goodsDetail.productLevel || []));
                    this.modifyForm.productLevel.map((item) => {
                        const targetItem = item;
                        targetItem.status = item.status === 1 ? Boolean(1) : Boolean('');
                        return targetItem;
                    });
                    this.$set(this, 'dialogFormVisible', true);
                    this.$set(this, 'dialogTitle', '商品编辑');
                    this.$set(this, 'mode', 'edit');
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            } else if (args[2] === 1) {
                this.changeGoodsStatus({
                    id: args[1].id,
                    status: 1,
                })
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                    this.getGoodsListHandler(this.$refs.goodsList.queryCondition);
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            } else if (args[2] === 2) {
                this.changeGoodsStatus({
                    id: args[1].id,
                    status: 0,
                })
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                    });
                    this.getGoodsListHandler(this.$refs.goodsList.queryCondition);
                })
                .catch((err) => {
                    this.$notify({
                        title: '错误',
                        message: err.message || err,
                        type: 'error',
                    });
                });
            }
        },
    },
    mounted() {
        this.$refs.goodsList.queryHandler();
        this.getGoodsCategoryList({
            name: '',
            status: 1,
        })
        .catch((err) => {
            this.$notify({
                title: '错误',
                message: err.message || err,
                type: 'error',
            });
        });
    },
};
</script>
<style lang='less'>

</style>
