import { defineStore } from 'pinia';
import store from "@/store"
import { getInfo, logout, login, getRouters } from '@/api/index'
import { objlistUser } from '@/api/system/user'
import { getDeptlis,getCompany } from '@/api/system/dept'
import { getDictMap} from '@/api/index'

import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
// import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import Cookies from 'js-cookie'

// 创建 Pinia Store
export const dataStore = defineStore('app', {
    state: () => {
        return {
            msg: 'hello pinia',
            num: 0,
            title: '',

            token: getToken(),
            expires_in: '',
            avatar: '',
            userName: '',
            userInfo: {},
            roles: [],
            permissions: [],

            routes: [],
            addRoutes: [],
            defaultRoutes: [],
            topbarRouters: [],
            sidebarRouters: [],


            sidebarLogo: true,
            opened: true,
            sideTheme: 'theme-dark',
            theme: '#409EFF',

            device: 'desktop',
            topNav: true,
            sidebar: {
                opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
                withoutAnimation: false,
                hide: false
            },


            visitedViews: [],
            iframeViews: [],


            allUsers:{},//所有用户映射
            allDepts:{},//所有部门映射
            oldAllDepts:[],//原所有部门
            allCompanys:{},//所有公司映射
            dictMap:{},//所有字典映射
        }
    },
    getters: {
        addNum(): number {
            return this.num + 10
        },
        addNum2(number) {
            return (number: number) => this.num + number
        },

        toggleSideBarHide(status) {
            return (status: boolean) => this.sidebar.hide = status
        },
        setSidelbarRouters(arr) {
            console.log(arr)
            this.sidebar.sidebarRouters = arr
        }

    },
    actions: {
        actionFun() {
            // console.log("我是store中actions的方法")
        },
        //设置标题
        setTitle(str: string) {
            this.title = str
        },
        //获取用户信息
        getInfo() {
            var _this = this;
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.user
                    const avatar = user.avatar;
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        _this.roles = res.roles;
                        _this.permissions = res.permissions;
                    } else {
                        _this.roles = ['ROLE_DEFAULT']
                    }
                    _this.userInfo = user;
                    _this.userName = res.userName;
                    _this.avatar = avatar;
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 生成路由
        GenerateRoutes() {
            var _this = this;
            return new Promise(resolve => {
                // 向后端请求路由数据
                getRouters().then(res => {
                    const sdata = JSON.parse(JSON.stringify(res.data))
                    const rdata = JSON.parse(JSON.stringify(res.data))
                    const sidebarRoutes = filterAsyncRouter(sdata)
                    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
                    const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
                    rewriteRoutes.push({ path: '/:catchAll(.*)*', redirect: '/404', hidden: true })
                    asyncRoutes.forEach((route) => {
                        router.addRoute(route);
                    })
                    _this.addRoutes = rewriteRoutes
                    _this.routes = constantRoutes.concat(rewriteRoutes)
                    _this.defaultRoutes = constantRoutes.concat(constantRoutes.concat(sidebarRoutes))
                    _this.topbarRouters = sidebarRoutes
                    _this.sidebarRouters = constantRoutes.concat(sidebarRoutes)
                    console.log(_this.sidebarRouters)
                    resolve(rewriteRoutes)

                })
            })
        },
        //登录
        Login(userInfo) {
            // console.log(userInfo)
            const reg = /\s+/g;
            const username = userInfo.username.replace(reg, '');
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            var _this = this;
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid).then(res => {
                    let data = res.data
                    setToken(data.access_token)
                    _this.token = data.access_token
                    setExpiresIn(data.expires_in)
                    _this.expires_in = data.expires_in
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 退出系统
        logOutUser() {
            // console.log(this.token)
            var _this = this;
            // console.log(_this)
            return new Promise((resolve, reject) => {
                logout(_this.token).then(() => {
                    _this.token = '2222222';
                    _this.roles = [];
                    _this.permissions = [];
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        toggleSideBar() {
            // console.log(this.sidebar.hide)
            if (this.sidebar.hide) {
                return false;
            }
            this.sidebar.opened = !this.sidebar.opened;
            // console.log(this.sidebar.opened)
            this.sidebar.withoutAnimation = false
            if (this.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
        },
        //获取所有用户
        getAllData() {
            objlistUser().then(res => { 
                res.data.list.forEach((item) => {
                    this.allUsers[item.userId] = item;
                });
            })
            getDeptlis().then(res => { 
                this.oldAllDepts=res
                res.forEach((item) => {
                    this.allDepts[item.deptId] = item;
                });
            })
            getCompany().then((res) => {
                res.data.forEach((item) => {
                    this.allCompanys[item.deptId] = item;
                });
            });
            getDictMap().then(res=>{
                let obj={}
                for(let k in res.data){
                    let lis=res.data[k];
                    let info={}
                    lis.forEach(item=>{
                        info[item.dictValue]=item
                    })
                    obj[k]=info
                }
                this.dictMap=obj
            })
        }

    }
});

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    const arr = asyncRouterMap.filter(route => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            // Layout ParentView 组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = InnerLink
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
    return arr
}
function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}
// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
    const res = []
    routes.forEach(route => {
        // if (route.permissions) {
        //     if (auth.hasPermiOr(route.permissions)) {
        //         res.push(route)
        //     }
        // } else if (route.roles) {
        //     if (auth.hasRoleOr(route.roles)) {
        //         res.push(route)
        //     }
        // }
        res.push(route)
    })
    return res
}

const modules = import.meta.glob('../../views/**/*.vue')
export const loadView = (view) => {
    return modules[`../../views/${view}.vue`]
}
/** 在 setup 外使用 */
export function dataStoreHook() {
    return dataStore(store)
}