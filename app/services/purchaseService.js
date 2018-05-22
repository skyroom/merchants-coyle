import Vue from 'vue';

const getPurchaseList = condition => Vue.axios.post('/purchase/search', condition);
const getPurchaseKey = condition => Vue.axios.post('/purchase/search/export', condition);
const setPurchaseStatus = idArr => Vue.axios.post('purchase/editStatus', { idArr });
const getPurchaseDetail = id => Vue.axios.get(`/purchase/detail/${id}`);
const getPurchaseDetailKey = id => Vue.axios.get(`/purchase/detail/export/${id}`);

export default {
    getPurchaseList,
    getPurchaseDetail,
    getPurchaseKey,
    setPurchaseStatus,
    getPurchaseDetailKey
};
