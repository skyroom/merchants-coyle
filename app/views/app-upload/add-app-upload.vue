<template lang='html'>
    <div>
        <el-form label-position="right" label-width="140px" ref="form" :model="form" :rules="formRules">
            <el-row>
                <el-col :span="9">
                    <el-form-item label="APP标识/编号：" prop="id">
                        <el-input v-model.number="form.id" type="number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="APP名称：" prop="name">
                        <el-input v-model.trim="form.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="APP描述：">
                        <el-input v-model.trim="form.description"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="扩展信息：">
                        <el-input v-model.trim="form.extInfo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="操作系统：">
                        <el-select v-model="form.os">
                            <el-option
                                v-for="item in osList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="版本：">
                        <el-input v-model.trim="form.version"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="强制更新：">
                        <el-select v-model="form.isForce">
                            <el-option
                                v-for="item in isForceList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="上传文件：">
                        <el-upload
                            :action="uploadPath"
                            :on-remove="handleRemoveFile"
                            :on-success="handleSuccessFile"
                            ref="uploadFile"
                            :headers="headers"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>    
            </el-row>
            <el-form-item label="">
                <el-button type="primary" @click="saveDetail">保存</el-button>
                <el-button @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import { cloneDeep } from 'lodash';
    import BaseComponent from '../base';
    import Auth from '../auth';
    import store from '../../vuex/store';
    import GzUploadList from '../../components/biz/gz-upload-list';

    export default {
        extends: BaseComponent,
        mixins: [Auth],
        components: {
            [GzUploadList.name]: GzUploadList,
        },
        data() {
            return {
                osList: [
                    {
                        label: 'IOS',
                        value: 0,
                    },
                    {
                        label: 'Android',
                        value: 1,
                    },
                ],
                isForceList: [
                    {
                        label: '否',
                        value: 0,
                    },
                    {
                        label: '是',
                        value: 1,
                    },
                ],
                fileCurrent: {},
                headers: {
                    token: store.getters.token,
                },
                uploadPath: '/api/common/app-file-upload',
                form: {
                    id: '',
                    name: '',
                    description: '',
                    extInfo: '',
                    os: 0,
                    version: '',
                    hash: '',
                    path: '',
                    isForce: 0,
                    backData: {},
                },
                formRules: {
                    id: [{
                        required: true,
                        trigger: 'blur',
                        type: 'number',
                        message: '请输入APP标识/编号',
                    }],
                    name: [{
                        required: true,
                        trigger: 'blur',
                        message: '请输入APP名称',
                    }],
                },
            };
        },
        computed: {
            ...mapGetters([
                'bannersDetail',
            ]),
        },
        methods: {
            ...mapActions([
                'addAppUpload',
            ]),
            saveDetail() {
                const queryParam = cloneDeep(this.form);
                if (queryParam.backData.hash) {
                    queryParam.path = queryParam.backData.data.accessUrl;
                    queryParam.hash = queryParam.backData.hash;
                    delete queryParam.backData;
                } else {
                    this.$notify({
                        title: '错误',
                        message: '请先上传文件',
                        type: 'error',
                    });
                    return 0;
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.addAppUpload(queryParam)
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: '添加App成功',
                                type: 'success',
                            });
                            this.$router.push('/app-upload');
                        })
                        .catch((err) => {
                            this.$notify({
                                title: '错误',
                                message: err.message || err,
                                type: 'error',
                            });
                        });
                    } else {
                        this.$notify({
                            title: '错误',
                            message: '请检查您的输入是否正确',
                            type: 'error',
                        });
                    }
                });
                return 0;
            },
            handleRemoveFile(file, fileList) {
                if (fileList.length === 0) {
                    this.$set(this, 'fileCurrent', {});
                    this.$set(this.form, 'hash', '');
                    this.$set(this.form, 'path', '');
                }
            },
            handleSuccessFile(response, file, fileList) {
                this.$set(this.form, 'backData', response.data);
                if (fileList.length > 1) {
                    this.$refs.uploadFile.handleRemove(this.fileCurrent);
                }
                this.$set(this, 'fileCurrent', file);
            },
            goback() {
                this.$router.go(-1);
            },
        },
    };
</script>

<style lang='less' scoped>
</style>
