<template lang="html">
    <div id="dictionary-search">
        <el-select
            v-model="searchValue"
            filterable
            remote
            auto-complete="off"
            :placeholder="placeholder"
            :remote-method="searchDictionaryByName"
            @change="searchProductChange"
            :clearable="clearable"
            :loading="loading"
            >
            <el-option
                v-for="item in productSearchData"
                :key="item.fId"
                :label="item.fName"
                :value="item.fId">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapActions } from 'vuex';
import listMethodBase from '../../components/biz/listMethodBase';

export default {
    name: 'dictionary-search',
    props: {
        type: {
            type: Number, // 客户1，人员2，物料商品3，供应商4，仓库5，计量单位6
            default: () => 0,
        },
        placeholder: {
            type: String,
            default: () => '请输入商品名称',
        },
        clearable: {
            type: Boolean,
            default: () => true,
        },
    },
    data() {
        return {
            searchValue: '', // 绑定的值
            productSearchData: [], // 查询到的数据
            loading: false,
        };
    },
    methods: {
        ...mapActions([
            'dictionarySearch',
        ]),
        searchDictionaryByName(name) {
            // console.log('商品名称', name);
            this.$set(this, 'loading', true);
            if (!name) {
                this.$set(this, 'productSearchData', []);
                return;
            }
            debounce(() => {
                this.dictionarySearch({
                    type: this.type,
                    keyword: name,
                })
                .then((data) => {
                    this.$set(this, 'loading', false);
                    this.$set(this, 'productSearchData', data);
                })
                .catch((err) => {
                    listMethodBase.errorTip(err.msg || err);
                });
            }, 500)();
        },
        searchProductChange(id) {
            this.$emit('searchChange', id, this.productSearchData);
        },
    },
};
</script>

<style lang="less">
#dictionary-search {

}
</style>
