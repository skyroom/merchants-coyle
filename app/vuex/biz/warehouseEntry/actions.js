import entryService from '../../../services/entryService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_ENTRY_KEY,
    SET_ENTRY_DETAIL,
    SET_ENTRY_LIST,
    SET_ENTRY_DETAIL_KEY,
} from '../../mutation-types';

const getEntryList = ({ commit, state }, condition) => (
    entryService.getEntryList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ENTRY_LIST))
    .catch(err => Promise.reject(err))
);
const getEntryDetail = ({ commit, state }, id) => (
    entryService.getEntryDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ENTRY_DETAIL))
    .catch(err => Promise.reject(err))
);
const getEntryKey = ({ commit, state }, condition) => (
    entryService.getEntryListkey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ENTRY_KEY))
    .catch(err => Promise.reject(err))
);
const getEntryDetailKey = ({ commit }, id) => (
    entryService.getEntryDetailKey(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_ENTRY_DETAIL_KEY))
    .catch(err => Promise.reject(err))
);
const setEntryStatus = ({ commit, state }, ids) => (
    entryService.setEntryStatus(ids)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);
export default {
    getEntryList,
    getEntryDetail,
    getEntryKey,
    setEntryStatus,
    getEntryDetailKey,
};
