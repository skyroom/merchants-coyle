import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_DELIVERY_DETAIL,
    SET_DELIVERY_LIST,
    SET_DELIVERY_KEY,
    SET_DELIVERY_DETAIL_KEY,
} from '../../mutation-types';

const initState = {
    deliveryList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    deliveryDetail: [],
    deliveryKey: '',
    deliveryDetailKey: '',
};

const mutations = {

    [SET_DELIVERY_LIST](state, data) {
        Vue.set(state.deliveryList, 'itemList', data.itemList);
        Vue.set(state.deliveryList, 'paging', data.paging);
    },
    [SET_DELIVERY_DETAIL](state, data) {
        Vue.set(state, 'deliveryDetail', data);
    },
    [SET_DELIVERY_KEY](state, data) {
        Vue.set(state, 'deliveryKey', data);
    },
    [SET_DELIVERY_DETAIL_KEY](state, data) {
        Vue.set(state, 'deliveryDetailKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
