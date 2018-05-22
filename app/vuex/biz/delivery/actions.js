import deliveryService from '../../../services/deliveryService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_DELIVERY_DETAIL_KEY,
    SET_DELIVERY_KEY,
    SET_DELIVERY_LIST,
    SET_DELIVERY_DETAIL,
} from '../../mutation-types';

const getDeliveryList = ({ commit, state }, condition) => (
    deliveryService.getDeliveryList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_DELIVERY_LIST))
    .catch(err => Promise.reject(err))
);

const getDeliveryDetail = ({ commit, state }, condition) => (
    deliveryService.getDeliveryDetail(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_DELIVERY_DETAIL))
    .catch(err => Promise.reject(err))
);

const getDeliveryKey = ({ commit, state }, condition) => (
    deliveryService.getDeliveryKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_DELIVERY_KEY))
    .catch(err => Promise.reject(err))
);
const getDeliveryDetailKey = ({ commit }, id) => (
    deliveryService.getDeliveryDetailKey(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_DELIVERY_DETAIL_KEY))
    .catch(err => Promise.reject(err))
);

const setDeliveryStatus = ({ commit, state }, ids) =>
    deliveryService.setDeliveryStatus(ids)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err));

export default {
    getDeliveryList,
    getDeliveryDetail,
    getDeliveryKey,
    getDeliveryDetailKey,
    setDeliveryStatus,
};
