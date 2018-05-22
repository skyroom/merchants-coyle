import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_ENTRY_DETAIL,
    SET_ENTRY_LIST,
    SET_ENTRY_KEY,
    SET_ENTRY_DETAIL_KEY,
} from '../../mutation-types';

const initState = {
    entryList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    entryDetail: [],
    entryKey: '',
    entryDetailKey: '',
};

const mutations = {

    [SET_ENTRY_LIST](state, data) {
        Vue.set(state.entryList, 'itemList', data.itemList);
        Vue.set(state.entryList, 'paging', data.paging);
    },
    [SET_ENTRY_DETAIL](state, data) {
        Vue.set(state, 'entryDetail', data);
    },
    [SET_ENTRY_KEY](state, data) {
        Vue.set(state, 'entryKey', data);
    },
    [SET_ENTRY_DETAIL_KEY](state, data) {
        Vue.set(state, 'entryDetailKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
