/* **** 采购入库单 **** */

// 采购入库单获取列表
const warehouseInvoiceList = state => state.warehouseInvoiceList || {};

// 采购入库单获取主数据详情
const warehouseInvoiceDetail = state => state.warehouseInvoiceDetail || {};

// 采购入库单获取子数据详情
const warehouseInvoiceSubDetail = state => state.warehouseInvoiceSubDetail || {};

/* **** 采购入库单 **** */


/* **** 调拨单 **** */

// 调拨单获取列表
const transferInvoiceList = state => state.transferInvoiceList || {};

// 调拨单获取主数据详情
const transferInvoiceDetail = state => state.transferInvoiceDetail || {};

// 调拨单获取子数据详情
const transferInvoiceSubDetail = state => state.transferInvoiceSubDetail || {};

/* **** 调拨单 **** */


/* **** 销售出库单 **** */

// 销售出库单获取列表
const saleoutInvoiceList = state => state.saleoutInvoiceList || {};

// 销售出库单获取主数据详情
const saleoutInvoiceDetail = state => state.saleoutInvoiceDetail || {};

// 销售出库单获取子数据详情
const saleoutInvoiceSubDetail = state => state.saleoutInvoiceSubDetail || {};

/* **** 销售出库单 **** */


/* **** 损益单 **** */

// 损益单获取列表
const adjustmentInvoiceList = state => state.adjustmentInvoiceList || {};

// 损益单获取详情
const adjustmentInvoiceDetail = state => state.adjustmentInvoiceDetail || {};

/* **** 损益单 **** */

export default {
    // 采购入库单
    warehouseInvoiceList,
    warehouseInvoiceDetail,
    warehouseInvoiceSubDetail,
    // 调拨单
    transferInvoiceList,
    transferInvoiceDetail,
    transferInvoiceSubDetail,
    // 销售出库单
    saleoutInvoiceList,
    saleoutInvoiceDetail,
    saleoutInvoiceSubDetail,
    // 损益单
    adjustmentInvoiceList,
    adjustmentInvoiceDetail,
};
