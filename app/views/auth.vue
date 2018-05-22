<script>
import { mapGetters } from 'vuex';
import StaticString from '../baseUrl';

export default {
    computed: {
        ...mapGetters([
            'authorities',
        ]),
    },
    methods: {
        checkAuth(param) {
            return this.authorities && this.authorities.length > 0
            && this.authorities.indexOf(param) !== -1 ? 1 : 0;
//            return param ? 1 : 1;
        },
        exportUrl(key) {
            return `${StaticString.fileUrl}/file/GetFile?systemId=${StaticString.systemId}&fileId=${key}`;
        },
    },
};
</script>
