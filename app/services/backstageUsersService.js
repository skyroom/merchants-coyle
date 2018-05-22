import Vue from 'vue';

// const login = ({
//     userName,
//     password,
//     keepLogin,
//     rsaId
// }) => Vue.axios.post('/backstage-users/login', {
//     userName,
//     password,
//     keepLogin,
//     rsaId,
// });

const login = data => Vue.axios.get(`/backstage-users/login?code=${data.code}&state=${data.state}`);

const getAuthorities = () => Vue.axios.get('/backstage-users/auth');

const getSayHi = data => Vue.axios.get('/common/say-hi', { params: data });

const getPublicData = () => Vue.axios.get('backstage-users/public-key');

export default {
    login,
    getAuthorities,
    getSayHi,
    getPublicData
};
