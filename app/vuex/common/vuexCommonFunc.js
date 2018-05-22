
module.exports = {
    backDataPromise(data, code, message, commit, mutationType) {
        if (code === '0') {
            if (mutationType) {
                commit(mutationType, data);
            }
            return Promise.resolve(data);
        }
        return Promise.reject(message);
    }
};
