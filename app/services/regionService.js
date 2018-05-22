import Vue from 'vue';

const getRegion = () => Vue.axios.get('/regions');

const getRegionThree = ({ level, sysNo }) => Vue.axios.get(`/common/queryAreal?level=${level}&sysNo=${sysNo}`);

export default {
    getRegion,
    getRegionThree,
};
