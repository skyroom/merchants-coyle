export default [
    {
        displayName: "商户服务",
        key: "merchants-server",
        icon: 'el-icon-menu',
        subMenu: [
            {
                displayName: "商户列表",
                key: "merchants-list",
                icon: 'el-icon-goods',
                auth: []
            }
        ]
    },
    {
        displayName: "财务管理",
        key: "finance-search",
        icon: 'el-icon-date',
        subMenu: [
            {
                displayName: "商户结算管理",
                key: "merchants-settle",
                icon: 'el-icon-goods',
                auth: []
            },
        ]
    },
]
