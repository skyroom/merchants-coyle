import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_APP_UPLOAD_LIST,
} from '../../mutation-types';

const initState = {
    appUploadList: [],
};

const mutations = {
    [SET_APP_UPLOAD_LIST](state, data) {
        Vue.set(state, 'appUploadList', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
