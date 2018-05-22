import Vue from 'vue';

const getGoodsCategoryList = data => Vue.axios.post('/product/catalogSearch', data);

const addGoodsCategory = data => Vue.axios.post('/product/categoryInsert', data);

const editGoodsCategory = data => Vue.axios.post('/product/categoryEdit', data);

const getGoodsCategoryDetail = id => Vue.axios.get(`/product/productCatalogSearchParentNameById/${id}`);

const getGoodsList = data => Vue.axios.post('/product/productSearch', data);

const addGoods = data => Vue.axios.post('/product/productInsert', data);

const editGoods = data => Vue.axios.post('/product/productEdit', data);

const changeGoodsStatus = data => Vue.axios.post('/product/productStatusEdit', data);

const getGoodsDetail = id => Vue.axios.get(`/product/${id}`);

export default {
    getGoodsCategoryList,
    addGoodsCategory,
    editGoodsCategory,
    getGoodsCategoryDetail,
    getGoodsList,
    addGoods,
    editGoods,
    getGoodsDetail,
    changeGoodsStatus,
};
