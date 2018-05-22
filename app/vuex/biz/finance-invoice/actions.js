import financeInvoiceService from '../../../services/financeInvoiceService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_WAREHOUSE_INVOICE_LIST,
    SET_WAREHOUSE_INVOICE_DETAIL,
    SET_WAREHOUSE_INVOICE_SUB_DETAIL,
    SET_TRANSFER_INVOICE_LIST,
    SET_TRANSFER_INVOICE_DETAIL,
    SET_TRANSFER_INVOICE_SUB_DETAIL,
    SET_SALEOUT_INVOICE_LIST,
    SET_SALEOUT_INVOICE_DETAIL,
    SET_SALEOUT_INVOICE_SUB_DETAIL,
    SET_ADJUSTMENT_INVOICE_LIST,
    SET_ADJUSTMENT_INVOICE_DETAIL,
} from '../../mutation-types';

/* **** 采购入库单 **** */

// 采购入库单获取列表
const getWarehouseInvoiceList = ({ commit, state }, condition) => (
    financeInvoiceService.getWarehouseInvoiceList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_WAREHOUSE_INVOICE_LIST))
    .catch(err => Promise.reject(err))
);

// 采购入库单获取主数据详情
const getWarehouseInvoiceDetail = ({ commit, state }, id) => (
    financeInvoiceService.getWarehouseInvoiceDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_WAREHOUSE_INVOICE_DETAIL))
    .catch(err => Promise.reject(err))
);

// 采购入库单获取子数据详情
const getWarehouseInvoiceSubDetail = ({ commit, state }, id) => (
    financeInvoiceService.getWarehouseInvoiceSubDetail(id)
    .then(({ data, code, message }) =>
        /* eslint-disable max-len */
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_WAREHOUSE_INVOICE_SUB_DETAIL))
    .catch(err => Promise.reject(err))
);

// 采购入库单作废
const invalidWarehouseInvoice = ({ commit, state }, id) => (
    financeInvoiceService.invalidWarehouseInvoice(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 采购入库单保存本地
const saveWarehouseInvoice = ({ commit }, params) => (
    financeInvoiceService.saveWarehouseInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 采购入库单提交财务
const submitWarehouseInvoice = ({ commit }, params) => (
    financeInvoiceService.submitWarehouseInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

/* **** 采购入库单 **** */


/* **** 调拨单 **** */

// 调拨单获取列表
const getTransferInvoiceList = ({ commit, state }, condition) => (
    financeInvoiceService.getTransferInvoiceList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_TRANSFER_INVOICE_LIST))
    .catch(err => Promise.reject(err))
);

// 调拨单获取主数据详情
const getTransferInvoiceDetail = ({ commit, state }, id) => (
    financeInvoiceService.getTransferInvoiceDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_TRANSFER_INVOICE_DETAIL))
    .catch(err => Promise.reject(err))
);

// 调拨单获取子数据详情
const getTransferInvoiceSubDetail = ({ commit, state }, params) => (
    financeInvoiceService.getTransferInvoiceSubDetail(params)
    .then(({ data, code, message }) =>
        /* eslint-disable max-len */
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_TRANSFER_INVOICE_SUB_DETAIL))
    .catch(err => Promise.reject(err))
);

// 调拨单作废
const invalidTransferInvoice = ({ commit, state }, id) => (
    financeInvoiceService.invalidTransferInvoice(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 调拨单保存本地
const saveTransferInvoice = ({ commit }, params) => (
    financeInvoiceService.saveTransferInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 调拨单提交财务
const submitTransferInvoice = ({ commit }, params) => (
    financeInvoiceService.submitTransferInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

/* **** 调拨单 **** */


/* **** 销售出库单 **** */

// 销售出库单获取列表
const getSaleoutInvoiceList = ({ commit, state }, condition) => (
    financeInvoiceService.getSaleoutInvoiceList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALEOUT_INVOICE_LIST))
    .catch(err => Promise.reject(err))
);

// 销售出库单获取主数据详情
const getSaleoutInvoiceDetail = ({ commit, state }, id) => (
    financeInvoiceService.getSaleoutInvoiceDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALEOUT_INVOICE_DETAIL))
    .catch(err => Promise.reject(err))
);

// 销售出库单获取子数据详情
const getSaleoutInvoiceSubDetail = ({ commit, state }, params) => (
    financeInvoiceService.getSaleoutInvoiceSubDetail(params)
    .then(({ data, code, message }) =>
        /* eslint-disable max-len */
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_SALEOUT_INVOICE_SUB_DETAIL))
    .catch(err => Promise.reject(err))
);

// 销售出库单作废
const invalidSaleoutInvoice = ({ commit, state }, id) => (
    financeInvoiceService.invalidSaleoutInvoice(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 销售出库单保存本地
const saveSaleoutInvoice = ({ commit }, params) => (
    financeInvoiceService.saveSaleoutInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 销售出库单提交财务
const submitSaleoutInvoice = ({ commit }, params) => (
    financeInvoiceService.submitSaleoutInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

/* **** 销售出库单 **** */


/* **** 损益单 **** */

// 损益单获取列表
const getAdjustmentInvoiceList = ({ commit, state }, condition) => (
    financeInvoiceService.getAdjustmentInvoiceList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ADJUSTMENT_INVOICE_LIST))
    .catch(err => Promise.reject(err))
);

// 损益单获取详情
const getAdjustmentInvoiceDetail = ({ commit, state }, id) => (
    financeInvoiceService.getAdjustmentInvoiceDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ADJUSTMENT_INVOICE_DETAIL))
    .catch(err => Promise.reject(err))
);

// 损益单作废
const invalidAdjustmentInvoice = ({ commit, state }, id) => (
    financeInvoiceService.invalidAdjustmentInvoice(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 损益单保存本地
const saveAdjustmentInvoice = ({ commit }, params) => (
    financeInvoiceService.saveAdjustmentInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

// 损益单提交财务
const submitAdjustmentInvoice = ({ commit }, params) => (
    financeInvoiceService.submitAdjustmentInvoice(params)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

/* **** 损益单 **** */

// 字典查询
const dictionarySearch = ({ commit }, params) => (
    financeInvoiceService.dictionarySearch(params)
    .then(data => data)
    .catch(err => Promise.reject(err))
);

export default {
    // 采购入库单
    getWarehouseInvoiceList,
    getWarehouseInvoiceDetail,
    getWarehouseInvoiceSubDetail,
    invalidWarehouseInvoice,
    saveWarehouseInvoice,
    submitWarehouseInvoice,
    // 调拨入库单
    getTransferInvoiceList,
    getTransferInvoiceDetail,
    getTransferInvoiceSubDetail,
    invalidTransferInvoice,
    saveTransferInvoice,
    submitTransferInvoice,
    // 销售出库单
    getSaleoutInvoiceList,
    getSaleoutInvoiceDetail,
    getSaleoutInvoiceSubDetail,
    invalidSaleoutInvoice,
    saveSaleoutInvoice,
    submitSaleoutInvoice,
    // 损益单
    getAdjustmentInvoiceList,
    getAdjustmentInvoiceDetail,
    invalidAdjustmentInvoice,
    saveAdjustmentInvoice,
    submitAdjustmentInvoice,
    // 字典查询
    dictionarySearch,
};
