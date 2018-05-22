import Vue from 'vue';

const addFileUpload = data => Vue.axios.post('/common/app-file-upload', data);

const addAppUpload = data => Vue.axios.post('/common/app-upload', data);

const appUploadList = data => Vue.axios.post('/common/app-upload-list', data);

export default {
    addFileUpload,
    addAppUpload,
    appUploadList,
};
