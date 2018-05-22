
import usersService from '../../../services/usersService';
import vuexCommonFunc from '../../common/vuexCommonFunc';
import {
    SET_USERS_LIST,
    SET_USERS_DETAIL,
} from '../../mutation-types';

const getUsersList = (
    { commit, state },
    queryData
) => (
    usersService.getUsersList(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_USERS_LIST))
    .catch(err => Promise.reject(err))
);

const addUsers = (
    { commit, state },
    queryData
) => (
    usersService.addUsers(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const editUsers = (
    { commit, state },
    { id, queryData }
) => usersService.editUsers(id, queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err));

const changeUsersStatus = (
    { commit, state },
    queryData
) => (
    usersService.changeUsersStatus(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

const getUsersDetail = (
    { commit, state },
    id
) => (
    usersService.getUsersDetail(id)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message, commit, SET_USERS_DETAIL))
    .catch(err => Promise.reject(err))
);

const usersExport = (
    { commit, state },
    queryData
) => (
    usersService.usersExport(queryData)
    .then(({ data, code, message }) =>
        vuexCommonFunc.backDataPromise(data, code, message))
    .catch(err => Promise.reject(err))
);

export default {
    getUsersList,
    addUsers,
    editUsers,
    getUsersDetail,
    changeUsersStatus,
    usersExport,
};
