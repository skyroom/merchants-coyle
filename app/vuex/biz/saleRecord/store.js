import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_RECORD_KEY,
    SET_RECORD_LIST,
} from '../../mutation-types';

const initState = {
    saleRecordList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    saleRecordKey: '',
};

const mutations = {

    [SET_RECORD_LIST](state, data) {
        Vue.set(state.saleRecordList, 'itemList', data.itemList);
        Vue.set(state.saleRecordList, 'paging', data.paging);
    },
    [SET_RECORD_KEY](state, data) {
        Vue.set(state, 'saleRecordKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
