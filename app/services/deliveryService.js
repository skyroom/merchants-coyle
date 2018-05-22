import Vue from 'vue';

const getDeliveryList = condition => Vue.axios.post('/deliveryOrder/deliveryOrderSearch', condition);
const getDeliveryDetail = id => Vue.axios.get(`/deliveryOrder/deliveryDetailSearch/${id}`);
const getDeliveryKey = condition => Vue.axios.post('/deliveryOrder/deliveryOrderExport', condition);
const getDeliveryDetailKey = id => Vue.axios.get(`/deliveryOrder/deliveryDetailExport/${id}`);
const setDeliveryStatus = idArr => Vue.axios.post('/deliveryOrder/deliveryEditStatus', { idArr });
export default {
    getDeliveryList,
    getDeliveryDetail,
    getDeliveryKey,
    getDeliveryDetailKey,
    setDeliveryStatus,
};
