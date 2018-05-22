<script>
export default {
    data() {
        return {
            fadminOrgUnitIdOptions: [
                {
                    value: '028000101',
                    label: '综合事务部',
                },
                {
                    value: '028000102',
                    label: '品牌管理',
                },
                {
                    value: '028000103',
                    label: '东南销售部',
                },
                {
                    value: '028000104',
                    label: '西北销售部',
                },
                {
                    value: '028000105',
                    label: '采购部',
                },
                {
                    value: '028000106',
                    label: '运营部',
                },
                {
                    value: '028000107',
                    label: '鲜花事业部',
                },
                {
                    value: '028000108',
                    label: '河北邮政事业部',
                },
            ],
            fstorageOrgUnitIdOptions: [
                {
                    value: '0280001',
                    label: '云南云资农业科技发展有限公司',
                },
            ],
        };
    },
    methods: {
        fstorageOrgUnitIdMap(status) {
            switch (status) {
                case '0280001':
                    return '云南云资农业科技发展有限公司';
                default:
                    return '未知';
            }
        },
        fadminOrgUnitIdMap(status) {
            switch (status) {
                case '028000101':
                    return '综合事务部';
                case '028000102':
                    return '品牌管理';
                case '028000103':
                    return '东南销售部';
                case '028000104':
                    return '西北销售部';
                case '028000105':
                    return '采购部';
                case '028000106':
                    return '运营部';
                case '028000107':
                    return '鲜花事业部';
                case '028000108':
                    return '河北邮政事业部';
                default:
                    return '未知';
            }
        },
    },
};
</script>
