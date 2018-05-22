
import marketService from '../../../services/marketService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_MARKET_LIST,
    SET_MARKET_DETAIL,
} from '../../mutation-types';

const getMarketList = (
    { commit, state },
    queryData
) => (
    marketService.getMarketList(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_MARKET_LIST))
    .catch(err => Promise.reject(err))
);

const addMarket = (
    { commit, state },
    queryData
) => (
    marketService.addMarket(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const editMarket = (
    { commit, state },
    { id, queryData }
) => marketService.editMarket(id, queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err));

const changeMarketStatus = (
    { commit, state },
    queryData
) => (
    marketService.changeMarketStatus(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getMarketDetail = (
    { commit, state },
    id
) => (
    marketService.getMarketDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_MARKET_DETAIL))
    .catch(err => Promise.reject(err))
);

const marketExport = (
    { commit, state },
    queryData
) => (
    marketService.marketExport(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

export default {
    getMarketList,
    addMarket,
    editMarket,
    getMarketDetail,
    changeMarketStatus,
    marketExport,
};
