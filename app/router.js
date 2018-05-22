import VueRouter from 'vue-router';
// components
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

// import Layout from './views/layout';
const Layout = reslove => require(['./views/layout'], reslove);

// import Login from './views/login';

// import Index from './views/index';
const Index = reslove => require(['./views/index'], reslove);

// import ErrorPage from './views/error';
const ErrorPage = reslove => require(['./views/error'], reslove);

// import PurchaseList from './views/purchase/purchase-list';
// const PurchaseList = reslove => require(['./views/purchase/purchase-list'], reslove);

// import purchaseDetail from './views/purchase/purchase-detail';
// const purchaseDetail = reslove => require(['./views/purchase/purchase-detail'], reslove);

// import WarehouseEntryList from './views/warehouse-entey/entery-list';
// const WarehouseEntryList = reslove => require(['./views/warehouse-entey/entery-list'], reslove);

// import warehouseEntryDetail from './views/warehouse-entey/entry-detail';
// const warehouseEntryDetail = reslove => require(['./views/warehouse-entey/entry-detail'], reslove);

// import processingList from './views/processing/processing-list';
// const processingList = reslove => require(['./views/processing/processing-list'], reslove);

// import processingDetail from './views/processing/processing-detail';
// const processingDetail = reslove => require(['./views/processing/processing-detail'], reslove);

// import deliveryList from './views/delivery/delivery-list';
// const deliveryList = reslove => require(['./views/delivery/delivery-list'], reslove);

// import deliveryDetail from './views/delivery/delivery-detail';
// const deliveryDetail = reslove => require(['./views/delivery/delivery-detail'], reslove);

// import saleRecordList from './views/sale-record/sale-list';
// const saleRecordList = reslove => require(['./views/sale-record/sale-list'], reslove);

// import saleReportList from './views/sale-report/saleReport-list';
// const saleReportList = reslove => require(['./views/sale-report/saleReport-list'], reslove);

// import saleOrderList from './views/sale-report/saleOrder-list';
// const saleOrderList = reslove => require(['./views/sale-report/saleOrder-list'], reslove);

// import saleOrderDetail from './views/sale-report/saleOrder-detail';
// const saleOrderDetail = reslove => require(['./views/sale-report/saleOrder-detail'], reslove);

// import GoodsCategory from './views/goods/goods-category';
// const GoodsCategory = reslove => require(['./views/goods/goods-category'], reslove);

// import Goods from './views/goods/goods-list';
// const Goods = reslove => require(['./views/goods/goods-list'], reslove);

// import Market from './views/market/market-list';
// const Market = reslove => require(['./views/market/market-list'], reslove);

// import Users from './views/users/users-list';
// const Users = reslove => require(['./views/users/users-list'], reslove);

// import backLog from './views/sale-report/backlog-list';
// const backLog = reslove => require(['./views/sale-report/backlog-list'], reslove);

// import backLogDetail from './views/sale-report/backlog-detail';
// const backLogDetail = reslove => require(['./views/sale-report/backlog-detail'], reslove);

// import AppUploadList from './views/app-upload/app-upload-list';
// const AppUploadList = reslove => require(['./views/app-upload/app-upload-list'], reslove);

// import AddAppUpload from './views/app-upload/add-app-upload';
// const AddAppUpload = reslove => require(['./views/app-upload/add-app-upload'], reslove);

// 采购入库单列表
// const warehouseEntryInvoiceList = reslove => require(['./views/finance-invoice/warehouse-entry-invoice-list'], reslove);

// 录入采购入库单
// const warehouseEntryInvoiceAdd = reslove => require(['./views/finance-invoice/warehouse-entry-invoice-add'], reslove);

// 采购入库单详情
// const warehouseEntryInvoiceDetail = reslove => require(['./views/finance-invoice/warehouse-entry-invoice-detail'], reslove);

// 调拨入库单列表
// const transferInvoiceList = reslove => require(['./views/finance-invoice/transfer-invoice-list'], reslove);

// 调拨入库单详情
// const transferInvoiceDetail = reslove => require(['./views/finance-invoice/transfer-invoice-detail'], reslove);

// 录入调拨入库单
// const transferInvoiceAdd = reslove => require(['./views/finance-invoice/transfer-invoice-add'], reslove);

// 销售出库单列表
// const saleoutInvoiceList = reslove => require(['./views/finance-invoice/saleout-invoice-list'], reslove);

// 销售出库单详情
// const saleoutInvoiceDetail = reslove => require(['./views/finance-invoice/saleout-invoice-detail'], reslove);

// 录入销售出库单
// const saleoutInvoiceAdd = reslove => require(['./views/finance-invoice/saleout-invoice-add'], reslove);

// 损益单列表
// const adjustmentInvoiceList = reslove => require(['./views/finance-invoice/adjustment-invoice-list'], reslove);

// 损益单详情
// const adjustmentInvoiceDetail = reslove => require(['./views/finance-invoice/adjustment-invoice-detail'], reslove);

// 录入损益单
// const adjustmentInvoiceAdd = reslove => require(['./views/finance-invoice/adjustment-invoice-add'], reslove);

// 商户列表
const merchantsList = reslove => require(['./views/merchants/merchants-list'], reslove);

const router = new VueRouter({
    routes: [{
        path: '/error/:num',
        component: ErrorPage,
    },
    {
        path: '/',
        redirect: 'index',
        component: Layout,
        meta: {
            // requiresAuth: true,
            keepAlive: false,
        },
        children: [{
            path: '/index',
            component: Index,
        },
        {
            path: '/error/:num',
            component: ErrorPage,
            meta: {
                breadcrumbs: [{
                    name: '错误页面',
                }],
                keepAlive: false,
            },
        },

        {
            path: '/merchants-list',
            component: merchantsList,
            meta: {
                breadcrumbs: [{
                    name: '商户列表',
                }],
                keepAlive: false,
            },
        },

        // {
        //     path: '/category-search',
        //     component: GoodsCategory,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '类目管理',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: 'purchase-search',
        //     component: PurchaseList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '采购单列表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'purchase-detail/:id',
        //     component: purchaseDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '采购单列表',
        //             to: '/purchase-search',
        //         }, {
        //             name: '采购单详情',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: 'warehouseEntry-search',
        //     component: WarehouseEntryList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '入库单列表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'warehouseEntry-search-detail/:id',
        //     component: warehouseEntryDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '入库单列表',
        //             to: '/warehouseEntry-search',
        //         }, {
        //             name: '入库单详情',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'processingorder-search',
        //     component: processingList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '加工单列表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'processing-detail/:Id',
        //     component: processingDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '加工单列表',
        //             to: '/processingorder-search',
        //         }, {
        //             name: '加工单详情',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'deliveryorder-search',
        //     component: deliveryList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '发货单列表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'deliveryorder-search-detail/:id',
        //     component: deliveryDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '发货单列表',
        //             to: '/deliveryorder-search',
        //         }, {
        //             name: '发货单明细',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'seller-detail-search',
        //     component: saleRecordList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '销售记录',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'product-report',
        //     component: saleReportList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '商品销售报表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'backlog',
        //     component: backLog,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '回款记录',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'backlog-detail/:id',
        //     component: backLogDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '回款记录',
        //             to: '/backlog',
        //         }, {
        //             name: '回款记录详情',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'seller-search',
        //     component: saleOrderList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '订单销售报表',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: 'seller-detail/:id',
        //     component: saleOrderDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '订单销售报表',
        //             to: '/seller-search',
        //         }, {
        //             name: '订单销售报表详情',
        //         }],
        //         keepAlive: false,
        //     }
        // },
        // {
        //     path: '/error/:num',
        //     component: ErrorPage,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '错误页面',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/product-search',
        //     component: Goods,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '商品管理',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/market-search',
        //     component: Market,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '销售市场管理',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/user-search',
        //     component: Users,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '用户管理',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/add-app-upload',
        //     component: AddAppUpload,
        //     meta: {
        //         breadcrumbs: [{
        //             name: 'app列表',
        //             to: '/app-upload',
        //         }, {
        //             name: 'app添加',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/app-upload',
        //     component: AppUploadList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: 'app列表',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/purchase-in-stock',
        //     component: warehouseEntryInvoiceList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '采购入库单列表',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/warehouse-entry-invoice-add',
        //     component: warehouseEntryInvoiceAdd,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '采购入库单列表',
        //             to: '/purchase-in-stock',
        //         }, {
        //             name: '录入采购入库单',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/warehouse-entry-invoice-detail/:id',
        //     component: warehouseEntryInvoiceDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '采购入库单列表',
        //             to: '/purchase-in-stock',
        //         }, {
        //             name: '采购入库单详情',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/tranfer-in-stock',
        //     component: transferInvoiceList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '调拨单列表',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/transfer-invoice-detail/:id',
        //     component: transferInvoiceDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '调拨单列表',
        //             to: '/tranfer-in-stock',
        //         }, {
        //             name: '调拨单详情',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/transfer-invoice-add',
        //     component: transferInvoiceAdd,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '调拨单列表',
        //             to: '/tranfer-in-stock',
        //         }, {
        //             name: '录入调拨单',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/sale-out-stock',
        //     component: saleoutInvoiceList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '销售出库单列表',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/saleout-invoice-detail/:id',
        //     component: saleoutInvoiceDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '销售出库单列表',
        //             to: '/sale-out-stock',
        //         }, {
        //             name: '销售出库单详情',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/saleout-invoice-add',
        //     component: saleoutInvoiceAdd,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '销售出库单列表',
        //             to: '/sale-out-stock',
        //         }, {
        //             name: '录入销售出库单',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/adjust-search',
        //     component: adjustmentInvoiceList,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '损益单列表',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/adjustment-invoice-detail/:id',
        //     component: adjustmentInvoiceDetail,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '损益单列表',
        //             to: '/adjust-search',
        //         }, {
        //             name: '损益单详情',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        // {
        //     path: '/adjustment-invoice-add',
        //     component: adjustmentInvoiceAdd,
        //     meta: {
        //         breadcrumbs: [{
        //             name: '损益单列表',
        //             to: '/adjust-search',
        //         }, {
        //             name: '录入损益单',
        //         }],
        //         keepAlive: false,
        //     },
        // },
        ],
    }],
    mode: 'history',
});
// authorization verify
router.beforeEach((to, from, next) => {
    if (to.fullPath === '/') {
        next({
            path: '/index',
        });
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
        const sessionToken = localStorage.getItem('token') || sessionStorage.getItem('token');    // eslint-disable-line no-undef
        if (!sessionToken) {
            next({
                path: '/login',
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
        next();
    } else {
        next();
    }
});
export default router;
