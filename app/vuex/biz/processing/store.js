import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_PROCESSING_DETAIL,
    SET_PROCESSING_LIST,
    SET_PROCESS_DETAIL_KEY,
    SET_PROCESS_KEY,
} from '../../mutation-types';

const initState = {

    processList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    processDetail: [],
    processListKey: '',
    processDetailKey: '',
};

const mutations = {
    [SET_PROCESSING_LIST](state, data) {
        Vue.set(state.processList, 'itemList', data.itemList);
        Vue.set(state.processList, 'paging', data.paging);
    },
    [SET_PROCESSING_DETAIL](state, data) {
        Vue.set(state, 'processDetail', data);
    },
    [SET_PROCESS_KEY](state, data) {
        Vue.set(state, 'processListKey', data);
    },
    [SET_PROCESS_DETAIL_KEY](state, data) {
        Vue.set(state, 'processDetailKey', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
