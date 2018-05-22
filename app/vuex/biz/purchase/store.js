import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_PURCHASE_LIST,
    SET_PURCHASE_DETAIL,
    SET_PURCHASE_KEY,
    SET_PURCHASE_DETAIL_KEY,
} from '../../mutation-types';

const initState = {
    purchaseList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    purchaseDetail: [],
    purchaseKey: '',
    purchaseDetailKey: '',
};

const mutations = {

    [SET_PURCHASE_LIST](state, data) {
        Vue.set(state.purchaseList, 'itemList', data.itemList);
        Vue.set(state.purchaseList, 'paging', data.paging);
    },
    [SET_PURCHASE_DETAIL](state, data) {
        Vue.set(state, 'purchaseDetail', data);
    },
    [SET_PURCHASE_KEY](state, data) {
        Vue.set(state, 'purchaseKey', data);
    },
    [SET_PURCHASE_DETAIL_KEY](state, data) {
        Vue.set(state, 'purchaseDetailKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
