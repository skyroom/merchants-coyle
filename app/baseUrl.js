const baseUrlConfig = {
    dev: {
        nodeUrl: 'http://localhost:60000', // node服务器地址
        // nodeUrl: 'http://10.66.18.146:60000', // node服务器地址
        fileUrl: 'http://10.66.30.66:7101', // 文件下载地址
        apiUrl: 'http://10.66.30.66:8001', // api请求地址 用于导出
        loginBaseUrl: 'http://ius-sso.gznb.corp', // 登录地址
        clientId: 'gznsback_sso_test',
        systemId: '9bdf9153-71a5-11e7-92e4-005056b059e0',
    },

    test: {
        nodeUrl: 'http://10.66.30.66:4010',
        fileUrl: 'http://10.66.30.66:7101', // 文件下载地址
        apiUrl: 'http://10.66.30.66:8001',
        loginBaseUrl: 'http://ius-sso.gznb.corp',
        clientId: 'gznsback_sso_test',
        systemId: '9bdf9153-71a5-11e7-92e4-005056b059e0',
    },

    pre: {
        nodeUrl: 'http://ynzs-pre-admin.gznb.corp',
        // nodeUrl: 'http://10.66.141.132:88',
        fileUrl: 'https://fileout-dev4.gznb.com', // 文件下载地址
        apiUrl: 'http://10.66.141.132:89',
        loginBaseUrl: 'http://ius-sso.gznb.corp',
        clientId: 'gznsback_sso_test',
        systemId: '9bdf9153-71a5-11e7-92e4-005056b059e0',
    },

    production: {
        nodeUrl: 'http://ynzs-admin.gznb.corp',
        fileUrl: 'https://fileout-dev4.gznb.com', // 文件下载地址
        apiUrl: 'http://10.66.141.131:89',
        loginBaseUrl: 'https://sso.gznb.com',
        clientId: 'ynzs_sso',
        systemId: '9bdf9153-71a5-11e7-92e4-005056b059e0',
    },
};

module.exports = baseUrlConfig[process.env.NODE_ENV];
