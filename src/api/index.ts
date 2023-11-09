import request from '@/utils/request'
// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}
// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}
// 登录方法
export function login(username:string, password:string, code:any, uuid:any) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { username, password, code, uuid,type:'pc' }
  })
}
// 获取路由
export const getRouters = () => {
  return request({
    url: '/system/menu/getRouters',
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}
//查询字典
export function getDictMap() {
  return request({
    url: '/anliantest-system/dict/data/getDictMap' ,
    method: 'get'
  })
}
