import Vue from 'vue';

const getEntryList = condition => Vue.axios.post('/warehouse/warehouseEntrySearch', condition);
const getEntryDetail = id => Vue.axios.get(`/warehouse/warehouseEntryDetailSearch/${id}`);
const getEntryListkey = condition => Vue.axios.post('/warehouse/warehouseEntryExport', condition);
const setEntryStatus = idArr => Vue.axios.post('/warehouse/warehouseEntryEditStatus', { idArr });
const getEntryDetailKey = id => Vue.axios.get(`/warehouse/warehouseEntryDetailExport/${id}`);
export default {
    getEntryList,
    getEntryDetail,
    getEntryListkey,
    setEntryStatus,
    getEntryDetailKey,
};
