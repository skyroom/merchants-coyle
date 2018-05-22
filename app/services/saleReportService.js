import Vue from 'vue';

const getSaleReportList = condition => Vue.axios.post('/productReport/search', condition);
const getBacklogKey = condition => Vue.axios.post('/seller/backlog/export', condition);
const getBacklogDetailKey = id => Vue.axios.get(`/seller/backlog/detail/export/${id}`);
const getSaleReportKey = condition => Vue.axios.post('/productReport/export', condition);
const getSaleOrderList = condition => Vue.axios.post('/seller/search', condition);
const getSaleOrderKey = condition => Vue.axios.post('/seller/search/export', condition);
const getSaleOrderDetail = id => Vue.axios.get(`/seller/detail/${id}`);
const getSaleOrderDetailKey = id => Vue.axios.get(`/seller/detail/export/${id}`);
const setSaleOrderStatus = idArr => Vue.axios.post('/seller/editStatus', { idArr });
export default {
    getSaleReportList,
    getSaleReportKey,
    getSaleOrderList,
    getSaleOrderKey,
    getSaleOrderDetail,
    getSaleOrderDetailKey,
    setSaleOrderStatus,
    getBacklogKey,
    getBacklogDetailKey,
};
