import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import menus from '../../../menus';

import {
    SET_AUTHORITIES,
    SET_TOKEN,
    SET_USERINFO,
    CLERN_TOKEN,
    CLERN_USERINFO,
    SET_PUBLIC_KEY,
    SET_DEFAULT_ACTIVE,
} from '../../mutation-types';

const initState = {
    authorities: [],
    token: '',
    userName: '',
    userCode: '',
    userInfo: {
        id: '',
        userName: '',
        userCode: '',
    },
    menus,
    publicData: {
        publicKey: '',
        rsaId: '',
    },
    defaultActive: '', // 显示的菜单栏
};

const mutations = {
    [SET_AUTHORITIES](state, data) {
        Vue.set(state, 'authorities', data);
    },
    [SET_TOKEN](state, data) {
        Vue.set(state, 'token', data);
    },
    [SET_USERINFO](state, data) {
        Vue.set(state.userInfo, 'userName', data.userName);
        Vue.set(state.userInfo, 'userCode', data.userCode);
        Vue.set(state.userInfo, 'id', data.id);
    },
    [CLERN_TOKEN](state) {
        Vue.set(state, 'token', initState.token);
    },
    [CLERN_USERINFO](state) {
        Vue.set(state.userInfo, 'userName', initState.userInfo.userName);
        Vue.set(state.userInfo, 'userCode', initState.userInfo.userCode);
        Vue.set(state.userInfo, 'id', initState.userInfo.id);
    },
    [SET_PUBLIC_KEY](state, data) {
        Vue.set(state, 'publicData', data);
    },
    [SET_DEFAULT_ACTIVE](state, data) {
        Vue.set(state, 'defaultActive', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
