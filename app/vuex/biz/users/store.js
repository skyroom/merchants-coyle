import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_USERS_LIST,
    SET_USERS_DETAIL,
} from '../../mutation-types';

const initState = {
    usersList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    usersDetail: {
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
    [SET_USERS_LIST](state, data) {
        Vue.set(state.usersList, 'itemList', data.itemList);
        Vue.set(state.usersList, 'paging', data.paging);
    },
    [SET_USERS_DETAIL](state, data) {
        Vue.set(state, 'usersDetail', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
