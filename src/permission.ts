import router from './router'
// import { createPinia } from 'pinia'

import {dataStoreHook} from '@/store/modules/app'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  let store = dataStoreHook()
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        // store.getInfo()
        store.getAllData()
        store.getInfo().then(() => {
          isRelogin.show = false
          store.GenerateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            accessRoutes.forEach((route) => {
              if (route.redirect=="/404") {
                route.path = "/:catchAll(.*)*"
              }
              router.addRoute(route);
            })
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.logOutUser().then(() => {
            ElMessage.error(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
