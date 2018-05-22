import goodsService from '../../../services/goodsService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_GOODSCATEGORY_LIST,
    SET_GOODS_LIST,
    SET_GOODS_DETAIL,
} from '../../mutation-types';

const getGoodsCategoryList = (
    { commit, state },
    queryData
) => (
    goodsService.getGoodsCategoryList(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_GOODSCATEGORY_LIST))
    .catch(err => Promise.reject(err))
);

const addGoodsCategory = (
    { commit, state },
    queryData
) => (
    goodsService.addGoodsCategory(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const editGoodsCategory = (
    { commit, state },
    queryData
) => (
    goodsService.editGoodsCategory(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getGoodsCategoryDetail = (
    { commit, state },
    id
) => (
    goodsService.getGoodsCategoryDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getGoodsList = (
    { commit, state },
    queryData
) => (
    goodsService.getGoodsList(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_GOODS_LIST))
    .catch(err => Promise.reject(err))
);

const addGoods = (
    { commit, state },
    queryData
) => (
    goodsService.addGoods(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const editGoods = (
    { commit, state },
    queryData
) => goodsService.editGoods(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err));

const changeGoodsStatus = (
    { commit, state },
    queryData
) => (
    goodsService.changeGoodsStatus(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getGoodsDetail = (
    { commit, state },
    id
) => (
    goodsService.getGoodsDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_GOODS_DETAIL))
    .catch(err => Promise.reject(err))
);

export default {
    getGoodsCategoryList,
    addGoodsCategory,
    editGoodsCategory,
    getGoodsCategoryDetail,
    getGoodsList,
    addGoods,
    editGoods,
    getGoodsDetail,
    changeGoodsStatus,
};
