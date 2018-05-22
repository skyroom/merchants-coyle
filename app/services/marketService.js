import Vue from 'vue';

const getMarketList = data => Vue.axios.post('/market/search', data);

const addMarket = data => Vue.axios.post('/market/add', data);

const editMarket = (id, data) => Vue.axios.put(`/market/edit/${id}`, data);

const changeMarketStatus = data => Vue.axios.post('/market/editStatus', data);

const getMarketDetail = id => Vue.axios.get(`/market/${id}`);

const marketExport = data => Vue.axios.post('/market/export', data);

export default {
    getMarketList,
    addMarket,
    editMarket,
    getMarketDetail,
    changeMarketStatus,
    marketExport,
};
