import Vue from 'vue';
import Vuex from 'vuex';

import breadcrumbsStore from './biz/breadcrumbs/store';
import authCenterStore from './biz/authCenter/store';
import agentsStore from './biz/agents/store';
import uploadStore from './biz/upload/store';
import regionStore from './common/region/store';
import purchaseStore from './biz/purchase/store';
import goodsStore from './biz/goods/store';
import entryStore from './biz/warehouseEntry/store';
import processStore from './biz/processing/store';
import deliveryStore from './biz/delivery/store';
import saleRecordStore from './biz/saleRecord/store';
import saleReportStore from './biz/saleReport/store';
import marketStore from './biz/market/store';
import usersStore from './biz/users/store';

// 财务对接
import financeInvoiceStore from './biz/finance-invoice/store';

// app上传
import appUploadStore from './biz/app-upload/store';

// 商户列表
import merchantsListStore from './biz/merchants/store';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        breadcrumbs: breadcrumbsStore,
        authCenter: authCenterStore,
        region: regionStore,
        agents: agentsStore,
        upload: uploadStore,
        goods: goodsStore,
        purchase: purchaseStore,
        entry: entryStore,
        process: processStore,
        delivery: deliveryStore,
        saleRecord: saleRecordStore,
        saleReport: saleReportStore,
        market: marketStore,
        users: usersStore,
        appUploadStore,
        financeInvoice: financeInvoiceStore,
        merchantsList: merchantsListStore
    },
    strict: process.env.NODE_ENV !== 'production',
});
