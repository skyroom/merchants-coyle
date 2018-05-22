import Vue from 'vue';

const getProcessList = condition => Vue.axios.post('/ProcessingOrder/ProcessingOrderSearch', condition);
const getProcessDetail = id => Vue.axios.get(`/ProcessingOrder/ProcessingOrderDetailSearch/${id}`);
const getProcessListKey = condition => Vue.axios.post('/ProcessingOrder/ProcessingOrderExport', condition);
const getProcessDetailKey = id => Vue.axios.get(`/ProcessingOrder/ProcessingOrderDetailExport/${id}`);
export default {
    getProcessDetail,
    getProcessList,
    getProcessListKey,
    getProcessDetailKey,
};
