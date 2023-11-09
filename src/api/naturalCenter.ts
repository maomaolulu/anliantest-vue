import request from '@/utils/request'
// 获取检测标准/法律法规列表
export function getLawLis(query) {
  return request({
    url: '/data/substancetestlaw/list',
    method: 'get',
    params: query
  })
}
//   新增检测标准/法律法规
export function lawAdd(query) {
  return request({
    url: '/data/substancetestlaw/insert',
    method: 'post',
    data: query
  })
}
// 修改检测标准/法律法规
export function lawUpdate(query) {
  return request({
    url: '/data/substancetestlaw/update',
    method: 'put',
    data: query
  })
}
//   删除检测标准/法律法规
export function lawDel(query) {
  return request({
    url: '/data/substancetestlaw/delete',
    method: 'delete',
    params: query
  })
}

// 获取危害因素列表
export function getSubstanceInfo(query) {
  return request({
    url: '/data/substanceInfo/list',
    method: 'get',
    params: query
  })
}
//   新增危害因素
export function substanceAdd(query) {
  return request({
    url: '/data/substanceInfo/addSubstance',
    method: 'post',
    data: query
  })
}
//   修改危害因素信息
export function substanceUpdate(query) {
  return request({
    url: '/data/substanceInfo/updateSubstance',
    method: 'put',
    data: query
  })
}
//   删除危害因素信息
export function substanceDel(query) {
  return request({
    url: '/data/substanceInfo/deleteSubstance',
    method: 'put',
    params: query
  })
}
//   获取物质不同条件限值列表
export function getSubstancelimit(query) {
  return request({
    url: '/data/substancestatelimit/getBySubstanceId',
    method: 'get',
    params: query
  })
}
//   逻辑删除危害因素限值
export function substancelimitDel(query) {
  return request({
    url: '/data/substancestatelimit/deleteLimit',
    method: 'put',
    params: query
  })
}
//   新增危害因素限值
export function substancelimitAdd(query) {
  return request({
    url: '/data/substancestatelimit/addLimit',
    method: 'post',
    data: query
  })
}
//   修改危害因素限值
export function substancelimitUpdate(query) {
  return request({
    url: '/data/substancestatelimit/updateLimit',
    method: 'put',
    data: query
  })
}
//   获取检测方法分页列表
export function getTestMenthodLis(query) {
  return request({
    url: '/data/substancetestmethod/listPage',
    method: 'get',
    params: query
  })
}
// 物质检测方法：危害因素下拉
export function substanceInfoDropdownList(data) {
  return request({
    url: '/data/data/dropdown/substanceInfoDropdownList',
    method: 'get',
    params: data
  })
}
// 物质检测方法:检测对象、标准号、标准名下拉框
export function dropdownList(data) {
  return request({
    url: '/data/data/dropdown/dropdownList',
    method: 'get',
    params: data
  })
}
// 新增检测方法
export function substancetestmethodSave(query) {
  return request({
    url: '/data/substancetestmethod/save',
    method: 'post',
    data: query
  })
}
//   修改检测方法
export function substancetestmethodUpdate(query) {
  return request({
    url: '/data/substancetestmethod/update',
    method: 'post',
    data: query
  })
}
// 删除检测方法
export function substancetestmethodDel(data) {
  return request({
    url: '/data/substancetestmethod/del',
    method: 'delete',
    data: data
  })
}
