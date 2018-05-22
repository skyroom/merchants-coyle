
import merchantsService from '../../../services/merchantsService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_MERCHANTS_LIST,
    SET_MERCHANTS_DETAIL,
} from '../../mutation-types';

const getMerchantsList = (
    { commit, state },
    queryData
) => (
    merchantsService.getMerchantsList(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_MERCHANTS_LIST))
    .catch(err => Promise.reject(err))
);

const addMerchants = (
    { commit, state },
    queryData
) => (
    merchantsService.addMerchants(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const editMerchants = (
    { commit, state },
    { id, queryData }
) => merchantsService.editMerchants(id, queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err));

const changeMerchantsStatus = (
    { commit, state },
    queryData
) => (
    merchantsService.changeMerchantsStatus(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getMerchantsDetail = (
    { commit, state },
    id
) => (
    merchantsService.getMerchantsDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_MERCHANTS_DETAIL))
    .catch(err => Promise.reject(err))
);

const usersExport = (
    { commit, state },
    queryData
) => (
    merchantsService.usersExport(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

export default {
    getMerchantsList,
    addMerchants,
    editMerchants,
    getMerchantsDetail,
    changeMerchantsStatus,
    usersExport,
};
