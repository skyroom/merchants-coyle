import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_MERCHANTS_LIST,
    SET_MERCHANTS_DETAIL,
} from '../../mutation-types';

const initState = {
    merchantsList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    merchantsDetail: {
        id: 0,
        name: '',
        phone: '',
        type: '',
        marketName: '',
        marketIdArr: [],
        status: 0,
    },
};

const mutations = {
    [SET_MERCHANTS_LIST](state, data) {
        Vue.set(state.merchantsList, 'itemList', data.itemList);
        Vue.set(state.merchantsList, 'paging', data.paging);
    },
    [SET_MERCHANTS_DETAIL](state, data) {
        Vue.set(state, 'merchantsDetail', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
