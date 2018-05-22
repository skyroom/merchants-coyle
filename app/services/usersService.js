import Vue from 'vue';

const getUsersList = data => Vue.axios.post('/user/search', data);

const addUsers = data => Vue.axios.post('/user/add', data);

const editUsers = (id, data) => Vue.axios.put(`/user/edit/${id}`, data);

const changeUsersStatus = data => Vue.axios.post('/user/editStatus', data);

const getUsersDetail = id => Vue.axios.get(`/user/${id}`);

const usersExport = data => Vue.axios.post('/user/export', data);

export default {
    getUsersList,
    addUsers,
    editUsers,
    getUsersDetail,
    changeUsersStatus,
    usersExport,
};
