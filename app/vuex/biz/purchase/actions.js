import purchaseService from '../../../services/purchaseService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_PURCHASE_LIST,
    SET_PURCHASE_DETAIL,
    SET_PURCHASE_KEY,
    SET_PURCHASE_DETAIL_KEY,
} from '../../mutation-types';

const getPurchaseList = ({ commit, state }, condition) => (
    purchaseService.getPurchaseList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PURCHASE_LIST))
    .catch(err => Promise.reject(err))
);
const getPurchaseDetail = ({ commit, state }, condition) => (
    purchaseService.getPurchaseDetail(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PURCHASE_DETAIL))
    .catch(err => Promise.reject(err))
);
const getPurchaseKey = ({ commit, state }, condition) => (
    purchaseService.getPurchaseKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PURCHASE_KEY))
    .catch(err => Promise.reject(err))
);
const getPurchaseDetailKey = ({ commit }, id) => (
    purchaseService.getPurchaseDetailKey(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PURCHASE_DETAIL_KEY))
    .catch(err => Promise.reject(err))
);
const setPurchaseStatus = ({ commit }, ids) => (
    purchaseService.setPurchaseStatus(ids)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);
export default {
    getPurchaseList,
    getPurchaseDetail,
    getPurchaseKey,
    getPurchaseDetailKey,
    setPurchaseStatus
};
