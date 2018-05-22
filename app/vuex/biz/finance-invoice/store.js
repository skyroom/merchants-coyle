import Vue from 'vue';
import actions from './actions';
import getters from './getters';
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

const initState = {
    // 采购入库单
    warehouseInvoiceList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    warehouseInvoiceDetail: {},
    warehouseInvoiceSubDetail: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    // 调拨单
    transferInvoiceList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    transferInvoiceDetail: {},
    transferInvoiceSubDetail: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    // 销售出库单
    saleoutInvoiceList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    saleoutInvoiceDetail: {},
    saleoutInvoiceSubDetail: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    // 损益单
    adjustmentInvoiceList: {
        paging: {
            total: 0,
            pageSize: 1,
            pageIndex: 10,
        },
        itemList: [],
    },
    adjustmentInvoiceDetail: {
        fnumber: '', // 损益单号
        fbizDate: '', // 损益日期
        fbizTypeId: '', // 损益类型
        WarehouseName: '', // 仓库/市场
        fstatus: '', // 状态
        createDate: '', // 创建时间
        createUserName: '', // 创建人
        auditUserName: '', // 确认人
        auditDate: '', // 确认时间
        type: '', // 业务类型
        fdescription: '', // 备注
        detailList: [], // 商品明细
    },
};

const mutations = {
    // 采购入库单
    [SET_WAREHOUSE_INVOICE_LIST](state, data) {
        Vue.set(state.warehouseInvoiceList, 'itemList', data.itemList);
        Vue.set(state.warehouseInvoiceList, 'paging', data.paging);
    },
    [SET_WAREHOUSE_INVOICE_DETAIL](state, data) {
        Vue.set(state, 'warehouseInvoiceDetail', data);
    },
    [SET_WAREHOUSE_INVOICE_SUB_DETAIL](state, data) {
        Vue.set(state.warehouseInvoiceSubDetail, 'itemList', data.itemList);
        Vue.set(state.warehouseInvoiceSubDetail, 'paging', data.paging);
    },
    // 调拨单
    [SET_TRANSFER_INVOICE_LIST](state, data) {
        Vue.set(state.transferInvoiceList, 'itemList', data.itemList);
        Vue.set(state.transferInvoiceList, 'paging', data.paging);
    },
    [SET_TRANSFER_INVOICE_DETAIL](state, data) {
        Vue.set(state, 'transferInvoiceDetail', data);
    },
    [SET_TRANSFER_INVOICE_SUB_DETAIL](state, data) {
        Vue.set(state.transferInvoiceSubDetail, 'itemList', data.itemList);
        Vue.set(state.transferInvoiceSubDetail, 'paging', data.paging);
    },
    // 销售出库单
    [SET_SALEOUT_INVOICE_LIST](state, data) {
        Vue.set(state.saleoutInvoiceList, 'itemList', data.itemList);
        Vue.set(state.saleoutInvoiceList, 'paging', data.paging);
    },
    [SET_SALEOUT_INVOICE_DETAIL](state, data) {
        Vue.set(state, 'saleoutInvoiceDetail', data);
    },
    [SET_SALEOUT_INVOICE_SUB_DETAIL](state, data) {
        Vue.set(state.saleoutInvoiceSubDetail, 'itemList', data.itemList);
        Vue.set(state.saleoutInvoiceSubDetail, 'paging', data.paging);
    },
    // 损益单
    [SET_ADJUSTMENT_INVOICE_LIST](state, data) {
        Vue.set(state.adjustmentInvoiceList, 'itemList', data.itemList);
        Vue.set(state.adjustmentInvoiceList, 'paging', data.paging);
    },
    [SET_ADJUSTMENT_INVOICE_DETAIL](state, data) {
        Vue.set(state, 'adjustmentInvoiceDetail', data);
    },
};

export default {
    state: initState,
    mutations,
    actions,
    getters,
};
