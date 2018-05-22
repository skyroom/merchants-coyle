import Vue from 'vue';

const getMerchantsList = data => Vue.axios.post('/user/search', data);

const addMerchants = data => Vue.axios.post('/user/add', data);

const editMerchants = (id, data) => Vue.axios.put(`/user/edit/${id}`, data);

const changeMerchantsStatus = data => Vue.axios.post('/user/editStatus', data);

const getMerchantsDetail = id => Vue.axios.get(`/user/${id}`);

const usersExport = data => Vue.axios.post('/user/export', data);

export default {
    getMerchantsList,
    addMerchants,
    editMerchants,
    getMerchantsDetail,
    changeMerchantsStatus,
    usersExport,
};
