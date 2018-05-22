
const authorities = state => state.authorities || []; // eslint-disable-line no-undef

const token = state => state.token || localStorage.getItem('token') // eslint-disable-line no-undef
    || sessionStorage.getItem('token'); // eslint-disable-line no-undef

const userName = state => state.userName || localStorage.getItem('userName') // eslint-disable-line no-undef
    || sessionStorage.getItem('userName'); // eslint-disable-line no-undef

const userDisplayName = state => state.userDisplayName || sessionStorage.getItem('userDisplayName') // eslint-disable-line no-undef
    || localStorage.getItem('userDisplayName') // eslint-disable-line no-undef
    || state.userName || sessionStorage.getItem('userName') // eslint-disable-line no-undef
    || localStorage.getItem('userName'); // eslint-disable-line no-undef

const menus = state => state.menus.map(menu => (
    menu.subMenu ?
    Object.assign({}, menu, {
        // subMenu: menu.subMenu.filter(sub => state.authorities.indexOf(sub.key) >= 0),
        subMenu: menu.subMenu,
    })
    : menu
)).filter(menu => menu.subMenu.length > 0);

// 用于登录当公钥
const publicData = state => state.publicData;

// 设置菜单栏
const defaultActive = state => state.defaultActive;

export default {
    authorities,
    token,
    userName,
    userDisplayName,
    menus,
    publicData,
    defaultActive,
};
