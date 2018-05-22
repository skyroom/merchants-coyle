import saleReportService from '../../../services/saleReportService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_SALE_REPORT_KEY,
    SET_SALE_REPORT_LIST,
    SET_SALE_ORDER_DETAIL_KEY,
    SET_SALE_ORDER_KEY,
    SET_SALE_ORDER_DETAIL,
    SET_SALE_ORDER_LIST,
} from '../../mutation-types';

const getSaleReportList = ({ commit, state }, condition) => (
    saleReportService.getSaleReportList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_REPORT_LIST))
    .catch(err => Promise.reject(err))
);
const getSaleReportKey = ({ commit, state }, condition) => (
    saleReportService.getSaleReportKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_REPORT_KEY))
    .catch(err => Promise.reject(err))
);
const getSaleOrderList = ({ commit, state }, condition) => (
    saleReportService.getSaleOrderList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_ORDER_LIST))
    .catch(err => Promise.reject(err))
);
const getSaleOrderKey = ({ commit, state }, condition) => (
    saleReportService.getSaleOrderKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_ORDER_KEY))
    .catch(err => Promise.reject(err))
);
const getSaleOrderDetail = ({ commit, state }, id) => (
    saleReportService.getSaleOrderDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_ORDER_DETAIL))
    .catch(err => Promise.reject(err))
);
const getSaleOrderDetailKey = ({ commit, state }, id) => (
    saleReportService.getSaleOrderDetailKey(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALE_ORDER_DETAIL_KEY))
    .catch(err => Promise.reject(err))
);
const setSaleOrderStatus = ({ commit, state }, id) => (
    saleReportService.setSaleOrderStatus(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);
const getBacklogKey = ({ commit }, condition) => (
    saleReportService.getBacklogKey(condition)
        .then(({ data, code, message }) =>
            vuexCommonFunc.backDataPromise(data, code, message))
        .catch(err => Promise.reject(err))
);
const getBacklogDetailKey = ({ commit }, id) => (
    saleReportService.getBacklogDetailKey(id)
        .then(({ data, code, message }) =>
            vuexCommonFunc.backDataPromise(data, code, message))
        .catch(err => Promise.reject(err))
);

export default {
    getSaleReportList,
    getSaleReportKey,
    getSaleOrderList,
    getSaleOrderKey,
    getSaleOrderDetail,
    getSaleOrderDetailKey,
    setSaleOrderStatus,
    getBacklogKey,
    getBacklogDetailKey,
};
