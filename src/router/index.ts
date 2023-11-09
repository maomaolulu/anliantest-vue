import { createRouter, createWebHistory } from "vue-router";
import Layout from '@/layout'
import { defineAsyncComponent } from 'vue'
// 公共路由
export const constantRoutes: any = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect.vue')
      }
    ],
    meta:{
      title:''
    },
  },
  {
    path: '/login',
    component:() => import('@/views/login.vue'),
    hidden: true,
    meta:{
      title:'登录'
    }
  },
 
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    meta:{
      title:'首页',
      icon: 'dashboard',
    },
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        path: '/404',
        component: () => import('@/views/404.vue'),
        hidden: true,
        meta:{
          title:'404'
        }
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user',activeMenu: '/index' }
      },
      {
        path: 'other',
        component: () => import('@/views/system/user/other/index.vue'),
        name: 'Other',
        meta: { title: '相关链接', icon: 'user',activeMenu: '/index' }
      }
    ]
  }
]
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole.vue'),
        name: 'AuthRole',
        meta: { title: '分配角色1', activeMenu: '/administration/user',noKeep:true }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log.vue'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  // {
  //   path: '/tool/gen-edit',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['tool:gen:edit'],
  //   children: [
  //     {
  //       path: 'index/:tableId(\\d+)',
  //       component: () => import('@/views/tool/gen/editTable'),
  //       name: 'GenEdit',
  //       meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
  //     }
  //   ]
  // }
]



const Router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
// 防止连续点击多次路由报错
// let routerPush = Router.prototype.push;
// let routerReplace = Router.prototype.replace;
// // push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(err => err)
// }
// // replace
// Router.prototype.replace = function push(location) {
//   return routerReplace.call(this, location).catch(err => err)
// }
export default Router