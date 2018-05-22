import saleRecordService from '../../../services/saleRecordService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_RECORD_LIST,
    SET_RECORD_KEY,
} from '../../mutation-types';

const getSaleRecordList = ({ commit, state }, condition) => (
    saleRecordService.getSaleRecordList(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_RECORD_LIST))
    .catch(err => Promise.reject(err))
);
const getSaleRecordKey = ({ commit, state }, condition) => (
    saleRecordService.getSaleRecordKey(condition)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_RECORD_KEY))
    .catch(err => Promise.reject(err))
);
export default {
    getSaleRecordList,
    getSaleRecordKey,
};
