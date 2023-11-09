import request from '@/utils/request'

// 地址列表
export function addressLis(query) {
  return request({
    url: '/system/address/getRegions',
    method: 'get',
    params: query
  })
}
// 拉取高德第三方接口数据更新
export function synchronizationData(query) {
  return request({
    url: '/third/amap/synchronizationData',
    method: 'get',
    params: query
  })
}
