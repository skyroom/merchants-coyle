import Vue from 'vue';

const getSaleRecordList = condition => Vue.axios.post('/sellerDetail/search', condition);
const getSaleRecordKey = condition => Vue.axios.post('/sellerDetail/export', condition);
export default {
    getSaleRecordList,
    getSaleRecordKey,
};
