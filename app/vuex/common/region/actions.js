import regionService from '../../../services/regionService';
import {
    SET_REGION_LIST,
} from '../../mutation-types';

const getRegionList = ({
    commit,
}) => new Promise((resolve, reject) => {
    regionService.getRegion().then(({
        data,
        code,
        msg,
    }) => {
        if (code === '0') {
            commit(SET_REGION_LIST, data);
            resolve(data);
        } else {
            reject(msg);
        }
    }).catch((error) => {
        reject(error);
    });
});

const getRegionThreeList = ({
    commit,
}, { level, sysNo }) => new Promise((resolve, reject) => {
    regionService.getRegionThree({ level, sysNo })
    .then(({ data, code, message }) => {
        if (code === '0') {
            resolve(data);
        } else {
            reject(message);
        }
    }).catch((error) => {
        reject(error);
    });
});

export default {
    getRegionList,
    getRegionThreeList,
};
