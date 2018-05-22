import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_SALE_REPORT_LIST,
    SET_SALE_REPORT_KEY,
    SET_SALE_ORDER_LIST,
    SET_SALE_ORDER_DETAIL,
    SET_SALE_ORDER_KEY,
    SET_SALE_ORDER_DETAIL_KEY,
} from '../../mutation-types';

const initState = {
    saleReportList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    saleOrderList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    saleOrderDetail: [],
    saleReportKey: '',
    saleOrderKey: '',
    saleOrderDetailKey: '',
};

const mutations = {

    [SET_SALE_REPORT_LIST](state, data) {
        Vue.set(state.saleReportList, 'itemList', data.itemList);
        Vue.set(state.saleReportList, 'paging', data.paging);
    },
    [SET_SALE_ORDER_LIST](state, data) {
        Vue.set(state.saleOrderList, 'itemList', data.itemList);
        Vue.set(state.saleOrderList, 'paging', data.paging);
    },
    [SET_SALE_ORDER_DETAIL](state, data) {
        Vue.set(state, 'saleOrderDetail', data);
    },
    [SET_SALE_REPORT_KEY](state, data) {
        Vue.set(state, 'saleReportKey', data);
    },
    [SET_SALE_ORDER_KEY](state, data) {
        Vue.set(state, 'saleOrderKey', data);
    },
    [SET_SALE_ORDER_DETAIL_KEY](state, data) {
        Vue.set(state, 'saleOrderDetailKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
