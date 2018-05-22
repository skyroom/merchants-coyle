
import appUploadService from '../../../services/appUploadService';
import {
    SET_APP_UPLOAD_LIST,
} from '../../mutation-types';

const getAppUploadList = (
    { commit },
) => (
    appUploadService.appUploadList()
    .then(({ data }) => {
        commit(SET_APP_UPLOAD_LIST, data);
        return Promise.resolve(data);
    })
    .catch(err => Promise.reject(err))
);

const addAppUpload = (
    { commit },
    data
) => (
    appUploadService.addAppUpload(data)
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err))
);

const addAppFileUpload = (
    { commit },
    data
) => (
    appUploadService.addFileUpload(data)
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err))
);

export default {
    getAppUploadList,
    addAppUpload,
    addAppFileUpload,
};
