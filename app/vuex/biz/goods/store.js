import Vue from 'vue';
import actions from './actions';
import getters from './getters';
import {
    SET_GOODSCATEGORY_LIST,
    SET_GOODS_LIST,
    SET_GOODS_DETAIL,
    SET_GOODSUNIT_LIST,
} from '../../mutation-types';

const initState = {
    goodsCategoryList: [],
    goodsCategoryDetail: {
        id: '',
        name: '',
    },
    goodsList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    goodsDetail: {
        id: 0,
        name: '',
        shortName: '',
        description: '',
        hotKey: '',
        catalogId: '',
        status: 0,
        productLevelArry: [],
    },
    goodsUnitList: [],
};

const mutations = {
    [SET_GOODSCATEGORY_LIST](state, data) {
        Vue.set(state, 'goodsCategoryList', data);
    },
    [SET_GOODS_LIST](state, data) {
        Vue.set(state.goodsList, 'itemList', data.itemList);
        Vue.set(state.goodsList, 'paging', data.paging);
    },
    [SET_GOODS_DETAIL](state, data) {
        Vue.set(state, 'goodsDetail', data);
    },
    [SET_GOODSUNIT_LIST](state, data) {
        Vue.set(state, 'goodsUnitList', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
