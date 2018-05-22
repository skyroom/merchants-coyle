<template lang="html">
    <div id="category">
        <el-row :gutter="30">
            <el-col :lg="12" :md="12" :sm="24" :xs="24" class="box">
                <el-row :gutter="20" class="top-line">
                    <el-col :span="18">
                        <input
                            placeholder="请输入类别名称"
                            v-model.trim="categoryName"
                            class="search-input"
                            v-on:keyup.13="searchCategory"
                            >
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="searchCategory" v-if="checkAuth('category-search')">搜索</el-button>
                    </el-col>
                </el-row>
                <div>
                    <el-button type="primary" @click="resetAddForm" v-if="checkAuth('category-add')">新增类别</el-button>
                </div>
                <el-row :gutter="20" class="top-line">
                    <el-col :span="24">
                        <span>只显示有效类别</span>
                        <el-switch on-text="" off-text="" v-model="categoryListStatus" @change="changeCategoryListStatus"></el-switch>
                    </el-col>
                </el-row>
                <div class="tree-box" v-if="checkAuth('category-search')">
                    <el-tree
                        ref="tree"
                        v-if="showTree"
                        :data="goodsCategoryList"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                        :highlight-current="true"
                        :auto-expand-parent="false"
                        node-key="id"
                        :expand-on-click-node="true"
                        class="category-tree"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        :default-expand-all="defaultExpandAll"
                        >
                    </el-tree>
                </div>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xs="24" class="box">
                <div class="standard">类别信息</div>
                <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="120px"  labelPosition="left" v-if="checkAuth('category-edit')">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="商品类别名称" prop="name">
                                <el-input v-model.trim="editForm.name" :disabled="isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="拼音码">
                                <el-input v-model.trim="editForm.hotKey" :disabled="isDisabled" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="编号">
                                <el-input v-model.trim="editForm.code" :disabled="isDisabled" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="描述">
                                <el-input v-model.trim="editForm.descripton" :disabled="isDisabled" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="状态">
                                <el-switch on-text="有效" off-text="无效" v-model="editForm.status" :disabled="isDisabled"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <el-button type="primary" @click="save" :disabled="isDisabled">保存</el-button>
                            <!-- v-if="checkAuth('category-edit')" -->
                        </el-col>
                    </el-row>
                </el-form>
                <el-dialog title="新增类别" v-model="addPanelStatus" size="small" class="new-category">
                    <el-form :model="addform" :rules="addFormRules" ref="addform">
                        <div class="add-new-line">
                            <span>新增类别所在的父类：</span>
                            <template v-for="(item, index) in  currentName" v-if="showCurrentName">
                                <span class="currentName">{{item}}</span>
                                <span v-if="index!==currentName.length-1">-</span>
                            </template>
                            <span v-if="!showCurrentName" class="currentName">顶级类别</span>
                            <el-tooltip class="item" effect="dark" content="点击取消将添加顶级类别" placement="top" v-if="showCurrentName">
                                <el-button @click="addTopCategory">取消</el-button>
                            </el-tooltip>
                        </div>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item prop="name" label="类别名称">
                                    <el-input v-model.trim="addform.name" :maxlength="10"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="拼音码">
                                    <el-input v-model.trim="addform.hotKey" :maxlength="10"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="编号">
                                    <el-input v-model.trim="addform.code" :maxlength="10"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="描述">
                                    <el-input v-model.trim="addform.descripton" :maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addPanelStatus = false">取 消</el-button>
                        <el-button type="primary" @click="addCategories">确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { Tree, Form, FormItem, Input, Switch, Button, Table } from 'element-ui';
import { mapGetters, mapActions } from 'vuex';
import { isEqual } from 'lodash';
import List from '../../components/biz/list';
import BaseComponent from '../base';
import Auth from '../auth';

export default {
    mixins: [Auth],
    extends: BaseComponent,
    data() {
        return {
            showCurrentName: false,
            showTree: true,
            defaultExpandAll: false,
            loading: true,
            isInit: false,
            categoryListStatus: true,
            defaultProps: {
                label: 'name',
                children: 'children',
            },
            isDisabled: true,
            lastCondition: {
                id: 0,
                name: '',
                descripton: '',
                status: 0,
            },
            categoryName: '',
            currentName: [],
            currentId: 0,
            parentId: 0,
            dialogVisible: false,
            addPanelStatus: false,
            addFormRules: {
                name: [
                    { required: true, message: '请输入商品类别名称', trigger: 'blur,change' },
                ],
            },
            editFormRules: {
                name: [
                    { required: true, message: '请输入商品类别名称', trigger: 'blur,change' },
                ],
            },
            editForm: {
                id: 0,
                descripton: '',
                name: '',
                status: false,
                hotKey: '',
                code: '',
            },
            addform: {
                id: '',
                descripton: '',
                name: '',
                hotKey: '',
                code: '',
            },
            options: [{
                value: 0,
                label: '否',
            }, {
                value: 1,
                label: '是',
            }],
        };
    },
    computed: {
        ...mapGetters([
            'goodsCategoryList',
            'goodsCategoryDetail',
        ]),
    },
    components: {
        [Tree.name]: Tree,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Switch.name]: Switch,
        [Button.name]: Button,
        [List.name]: List,
        [Table.name]: Table,
    },
    methods: {
        ...mapActions([
            'getGoodsCategoryList',
            'editGoodsCategory',
            'addGoodsCategory',
            'getGoodsCategoryDetail',
        ]),
        resetAddForm() {
            this.$set(this, 'parentId', this.currentId);
            if (this.currentId) {
                this.$set(this, 'showCurrentName', true);
                this.getGoodsCategoryDetail(this.currentId)
                .then((data) => {
                    this.$set(this, 'currentName', data.name);
                });
            } else {
                this.$set(this, 'showCurrentName', false);
            }
            if (this.$refs.addform && this.$refs.addform.resetFields) {
                this.$refs.addform.resetFields();
            }
            this.addPanelStatus = true;
            this.$set(this.addform, 'descripton', '');
            this.$set(this.addform, 'name', '');
            this.$set(this.addform, 'hotKey', '');
            this.$set(this.addform, 'code', '');
        },
        getCategoryListHandler(query, callback) {
            this.getGoodsCategoryList(query)
            .then(() => {
                if (callback) {
                    callback();
                }
                this.$set(this, 'currentId', 0);
                this.$set(this.editForm, 'id', 0);
                this.$set(this.editForm, 'name', '');
                this.$set(this.editForm, 'descripton', '');
                this.$set(this.editForm, 'status', false);
                this.$set(this.editForm, 'hotKey', '');
                this.$set(this.editForm, 'code', '');
                this.$set(this, 'isDisabled', true);
                this.$refs.editForm.resetFields();
            })
            .catch((err) => {
                this.$notify({
                    title: '错误',
                    message: err.message || err,
                    type: 'error',
                });
            });
        },
        searchCategory() {
            this.showTree = false;
            this.getCategoryListHandler({
                name: this.categoryName || '',
                status: this.categoryListStatus ? 1 : null,
            }, () => {
                if (this.categoryName === '') {
                    this.$set(this, 'defaultExpandAll', false);
                    this.showTree = true;
                } else {
                    this.$set(this, 'defaultExpandAll', true);
                    this.showTree = true;
                }
                this.$set(this, 'currentId', 0);
            });
        },
        changeCategoryListStatus(value) {
            this.getCategoryListHandler({
                status: value ? 1 : null,
                name: this.categoryName || '',
            });
        },
        handleNodeClick(data) {
            this.$set(this, 'currentId', data.id);
            this.$set(this.editForm, 'name', data.name);
            this.$set(this.editForm, 'descripton', data.descripton || '');
            this.$set(this.editForm, 'id', data.id);
            this.$set(this.editForm, 'status', data.status === 1 ? Boolean(1) : Boolean(''));
            this.$set(this.editForm, 'hotKey', data.hotKey || '');
            this.$set(this.editForm, 'code', data.code || '');
            this.$set(this.lastCondition, 'id', data.id);
            this.$set(this.lastCondition, 'name', data.name);
            this.$set(this.lastCondition, 'status', data.status);
            this.$set(this.lastCondition, 'descripton', data.descripton || '');
            this.$set(this.lastCondition, 'hotKey', data.hotKey || '');
            this.$set(this.lastCondition, 'code', data.code || '');
            this.$set(this, 'isDisabled', false);
        },
        addCategories() {
            // 新增类别
            this.$refs.addform.validate((valid) => {
                if (!valid) {
                    this.$notify({
                        title: '错误',
                        message: '请检查您的输入是否正确',
                        type: 'error',
                    });
                    return;
                }
                const category = {
                    name: this.addform.name,
                    descripton: this.addform.descripton,
                    id: this.parentId,
                    hotKey: this.addform.hotKey,
                    code: this.addform.code,
                };
                this.addGoodsCategory(category)
                .then(() => {
                    this.getCategoryListHandler({
                        name: this.categoryName || '',
                        status: this.categoryListStatus ? 1 : null,
                    });
                    this.$notify({
                        title: '成功',
                        message: '添加商品分类成功',
                        type: 'success',
                    });
                    this.$set(this, 'addPanelStatus', false);
                }).catch((error) => {
                    this.$notify({
                        title: '错误',
                        message: error.message || error,
                        type: 'error',
                    });
                });
            });
        },
        save() {
            // 编辑分类
            if (this.currentId === 0) {
                this.$notify({
                    title: '错误',
                    message: '请先选择一个类别再保存',
                    type: 'error',
                });
                return 0;
            }
            this.$refs.editForm.validate((valid) => {
                if (!valid) {
                    this.$notify({
                        title: '错误',
                        message: '请检查您的输入是否正确',
                        type: 'error',
                    });
                } else {
                    const query = {
                        name: this.editForm.name,
                        descripton: this.editForm.descripton || '',
                        status: this.editForm.status ? 1 : 0,
                        hotKey: this.editForm.hotKey || '',
                        id: this.editForm.id,
                        code: this.editForm.code || '',
                    };
                    // console.log(query);
                    // console.log(this.lastCondition);
                    if (isEqual(query, this.lastCondition)) { /*  eslint max-len: ["error", 200]  */
                        this.$notify({
                            title: '错误',
                            message: '您还没有做任何修改',
                            type: 'error',
                        });
                        return 0;
                    }
                    this.editGoodsCategory(Object.assign({}, query, { id: Number(query.id) }))
                    .then(() => {
                        this.$notify({
                            title: '成功',
                            message: '修改商品分类成功',
                            type: 'success',
                        });
                        this.getCategoryListHandler({
                            name: this.categoryName || '',
                            status: this.categoryListStatus ? 1 : null,
                        });
                        this.$set(this.lastCondition, 'id', this.editForm.id);
                        this.$set(this.lastCondition, 'name', query.name);
                        this.$set(this.lastCondition, 'status', query.status);
                        this.$set(this.lastCondition, 'descripton', query.descripton || '');
                        this.$set(this.lastCondition, 'hotKey', query.hotKey || '');
                        this.$set(this.lastCondition, 'code', query.code || '');
                        this.$set(this.editForm, 'id', 0);
                        this.$set(this.editForm, 'name', '');
                        this.$set(this.editForm, 'descripton', '');
                        this.$set(this.editForm, 'status', false);
                        this.$set(this.editForm, 'hotKey', '');
                        this.$set(this.editForm, 'code', '');
                        this.$set(this, 'isDisabled', true);
                        this.$refs.editForm.resetFields();
                    })
                    .catch((err) => {
                        this.$notify({
                            title: '错误',
                            message: err.message || err,
                            type: 'error',
                        });
                    });
                }
                return 0;
            });
            return 0;
        },
        addTopCategory() {
            this.$set(this, 'showCurrentName', !this.showCurrentName);
            this.$set(this, 'parentId', 0);
        },
    },
    mounted() {
        this.getGoodsCategoryList({
            name: '',
            status: this.categoryListStatus ? 1 : null,
        })
        .then(() => {
            this.$set(this, 'loading', false);
            if (this.goodsCategoryList.length === 0) {
                this.$set(this, 'isInit', false);
            } else {
                this.$set(this, 'isInit', true);
            }
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

<style lang="less" scoped>
#category {
    .add-new-line {
        font-size: 16px;
        .currentName{
            display: inline-block;
            padding: 6px 4px;
            border: 1px solid #20a0ff;
            border-radius: 4px;
            color: #20a0ff;
            margin-right: 10px;
            margin-left: 10px;
        }
        span{
            font-size: 14px;
        }
    }
    .box{
        padding: 0 20px !important;
    }
    .tree-box{
        border:1px solid #d1dbe5;
        max-height: 640px;
        overflow-y: scroll;
        .category-tree{
            border:0;
        }
    }
    .standard{
        border-bottom: 1px solid #ccc;
        line-height: 46px;
        font-size: 20px;
        font-weight: bold;
        color: #777;
        margin: 20px 0 72px;
        &.specification{
            margin-bottom: 30px;
        }
    }
    .new-category{
        padding: 60px 0;
        .el-col{
            text-align: center;
            line-height: 36px;
        }
    }
    #rootCategory{
        text-align: left;
    }
    .el-col span{
        font-size: 14px;
    }
    .top-line{
        margin-top: 30px;
        margin-bottom: 15px;
    }
    .tableList{
        margin-top: 10px;
    }
    .maring20{
        margin-bottom: 20px;
    }
    .standard-name{
        line-height: 35px;
        font-Size: 14px;
        min-width: 100px;
    }
    .search-input{
        width: 100%;
        height: 31px;
        line-height: 31px;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        padding-left: 10px;
    }
    .el-button+.el-button{
        margin-left: 0px;
    }
}
</style>
