import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_MARKET_LIST,
    SET_MARKET_DETAIL,
} from '../../mutation-types';

const initState = {
    marketList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    marketDetail: {
        id: 0,
        areaName: '',
        marketName: 0,
        shorttName: '',
        hotKey: 0,
        status: '',
    },
};

const mutations = {
    [SET_MARKET_LIST](state, data) {
        Vue.set(state.marketList, 'itemList', data.itemList);
        Vue.set(state.marketList, 'paging', data.paging);
    },
    [SET_MARKET_DETAIL](state, data) {
        Vue.set(state, 'marketDetail', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
