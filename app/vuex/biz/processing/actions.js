
import processService from '../../../services/processService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_PROCESSING_DETAIL,
    SET_PROCESSING_LIST,
    SET_PROCESS_DETAIL_KEY,
    SET_PROCESS_KEY
} from '../../mutation-types';

const getProcessList = ({ commit, state }, condition) => (
    processService.getProcessList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PROCESSING_LIST))
    .catch(err => Promise.reject(err))
);
const getProcessDetail = ({ commit, state }, id) => (
    processService.getProcessDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PROCESSING_DETAIL))
    .catch(err => Promise.reject(err))
);
const getProcessListKey = ({ commit, state }, condition) => (
    processService.getProcessListKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PROCESS_KEY))
    .catch(err => Promise.reject(err))
);
const getProcessDetailKey = ({ commit, state }, id) => (
    processService.getProcessDetailKey(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_PROCESS_DETAIL_KEY))
    .catch(err => Promise.reject(err))
);
const setProcessStatus = ({ commit, state }, id) => (
    processService.setProcessStatus(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);
export default {
    getProcessList,
    getProcessDetail,
    getProcessListKey,
    getProcessDetailKey,
    setProcessStatus,
};
