import moment from 'moment';
import { Notification } from 'element-ui';

moment.locale('zh-cn');
export default {
    isNoSelectedRow(selectedList) {
        if (selectedList.length === 0) {
            Notification({
                title: '提示',
                message: '请至少选择一条数据',
                type: 'warning',
            });
            return true;
        }
        return false;
    },
    isSingleSelected(selectedList) {
        if (selectedList.length > 1) {
            this.$alert('只能选择一条记录进行操作，请重新选择', '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
        return true;
    },
    pickerOptions() {
        const options = {
            shortcuts: [{
                text: '今天',
                onClick(picker) {
                    picker.$emit('pick', new Date());
                }
            }, {
                text: '昨天',
                onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - (3600 * 1000 * 24));
                    picker.$emit('pick', date);
                }
            }, {
                text: '一周前',
                onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
                    picker.$emit('pick', date);
                }
            }]
        };
        return options;
    },
    formatAddress(originData) {
        return Object.keys(originData).reduce((str, key) => str + (originData[key].name || ''), '');
    },
    formatTime(originTime) {
        if (!originTime) return null;
        // return moment(new Date(originTime)).format('YYYY-MM-DD HH:mm:ss');
        return moment(originTime).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDate(originTime) {
        if (!originTime) return null;
        return moment(originTime).format('YYYY-MM-DD');
    },
    isTimeError(startTime, endTime, msg = '请选择正确的时间范围', tipType = 'warning') {
        if (!startTime) {
            return false;
        }
        if (!endTime) {
            return false;
        }
        if (startTime > endTime) {
            if (tipType === 'warning') {
                Notification({
                    title: '提示',
                    message: msg,
                    type: 'warning',
                });
            }
            if (tipType === 'error') {
                Notification({
                    title: '提示',
                    message: msg,
                    type: 'error',
                });
            }
            return true;
        }
        return false;
    },
    isFalseDate(status, rowArray, param, msg = '您选择的数据有误！') {
        let isFalse = false;
        rowArray.forEach((item) => {
            if (item[param] === status) {
                isFalse = true;
            }
        });
        if (isFalse) {
            Notification({
                title: '提示',
                message: msg,
                type: 'warning',
            });
        }
        return isFalse;
    },
    warningTip(msg) {
        Notification({
            title: '警告',
            message: msg,
            type: 'warning'
        });
    },
    errorTip(msg) {
        Notification({
            title: '错误',
            message: msg,
            type: 'error'
        });
    },
    successTip(msg = '操作成功') {
        Notification({
            title: '成功',
            message: msg,
            type: 'success'
        });
    },
};
