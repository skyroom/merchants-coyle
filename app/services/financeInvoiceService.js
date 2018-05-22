import Vue from 'vue';

/* **** 采购入库单 **** */

// 采购入库单获取列表
const getWarehouseInvoiceList = condition => Vue.axios.post('/PurchaseInStock/Search', condition);

// 采购入库单获取主数据详情
const getWarehouseInvoiceDetail = id => Vue.axios.post(`/PurchaseInStock/Detail?sysId=${id}`);

// 采购入库单获取子数据详情
const getWarehouseInvoiceSubDetail = ({ condition, paging }) => Vue.axios.post(`/PurchaseInStock/Details?sysId=${condition.sysId}&pageIndex=${paging.pageIndex}&pageSize=${paging.pageSize}`);

// 采购入库单作废
const invalidWarehouseInvoice = id => Vue.axios.post(`/PurchaseInStock/Invalid?id=${id}`);

// 采购入库单保存本地
const saveWarehouseInvoice = params => Vue.axios.post('/PurchaseInStock/Insert', params);

// 采购入库单提交财务
const submitWarehouseInvoice = params => Vue.axios.post(`/PurchaseInStock/Submit?id=${params}`);

/* **** 采购入库单 **** */


/* **** 调拨单 **** */

// 调拨单获取列表
const getTransferInvoiceList = condition => Vue.axios.post('/TranferInStock/Search', condition);

// 调拨单获取主数据详情
const getTransferInvoiceDetail = id => Vue.axios.post(`/TranferInStock/detail?sysId=${id}`);

// 调拨单获取子数据详情
const getTransferInvoiceSubDetail = params => Vue.axios.post('/TranferInStock/details', params);

// 调拨单作废
const invalidTransferInvoice = id => Vue.axios.post(`/TranferInStock/Invalid?sysId=${id}`);

// 调拨单保存本地
const saveTransferInvoice = params => Vue.axios.post('/TranferInStock/Insert', params);

// 调拨单提交财务
const submitTransferInvoice = id => Vue.axios.post(`/TranferInStock/Submit?sysId=${id}`);

/* **** 调拨单 **** */


/* **** 销售出库单 **** */

// 销售出库单获取列表
const getSaleoutInvoiceList = condition => Vue.axios.post('/finance/sale-out-stock/search', condition);

// 销售出库单获取主数据详情
const getSaleoutInvoiceDetail = id => Vue.axios.post(`/finance/sale-out-stock/Detail?sysId=${id}`);

// 销售出库单获取子数据详情
const getSaleoutInvoiceSubDetail = condition => Vue.axios.post('/finance/sale-out-stock/Details', condition);

// 销售出库单作废
const invalidSaleoutInvoice = id => Vue.axios.post(`/finance/sale-out-stock/Invalid?id=${id}`);

// 销售出库单保存本地
const saveSaleoutInvoice = params => Vue.axios.post('/finance/sale-out-stock/create', params);

// 销售出库单提交财务
const submitSaleoutInvoice = id => Vue.axios.post(`/finance/sale-out-stock/send?id=${id}`);

/* **** 销售出库单 **** */


/* **** 损益单 **** */

// 损益单获取列表
const getAdjustmentInvoiceList = condition => Vue.axios.post('/Adjust/Search', condition);

// 损益单获取详情
const getAdjustmentInvoiceDetail = params => Vue.axios.post('/Adjust/Detail', params);

// 损益单作废
const invalidAdjustmentInvoice = ({ fid, fbizTypeId }) => Vue.axios.post(`/Adjust/Invalid?fid=${fid}&fbizTypeId=${fbizTypeId}`);

// 损益单保存本地
const saveAdjustmentInvoice = params => Vue.axios.post('/Adjust/Insert', params);

// 损益单提交财务
const submitAdjustmentInvoice = ({ fid, fbizTypeId }) => Vue.axios.post(`/Adjust/Submit?fid=${fid}&fbizTypeId=${fbizTypeId}`);

/* **** 损益单 **** */

// 字典查询
const dictionarySearch = ({ type, keyword }) => Vue.axios.get(`/dictionary/search/?type=${type}&keyword=${keyword}`);

export default {
    // 采购入库单
    getWarehouseInvoiceList,
    saveWarehouseInvoice,
    getWarehouseInvoiceSubDetail,
    getWarehouseInvoiceDetail,
    invalidWarehouseInvoice,
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
