import request from '@/utils/request'
// 查询项目类型管理列表
export function getProjectMangeLis(query) {
  return request({
    url: '/data/project_type/listPage',
    method: 'get',
    params: query
  })
}
// 新增项目类型管理
export function projectTypeSave(data) {
  return request({
    url: '/data/project_type/save',
    method: 'post',
    data: data
  })
}
//   修改项目类型管理
export function projectTypeUpdate(data) {
  return request({
    url: '/data/project_type/update',
    method: 'post',
    data: data
  })
}
//   删除项目类型管理数据
export function projectTypeDel(data) {
  return request({
    url: '/data/project_type/del',
    method: 'delete',
    data: data
  })
}
//   流程配置表分页
export function getProcessLis(query) {
  return request({
    url: '/data/process_configuration/listPage',
    method: 'get',
    params: query
  })
}
// 编辑流程配置表
export function processUpdate(query) {
  return request({
    url: '/data/process_configuration/update',
    method: 'post',
    data: query
  })
}
// 合同类别分页
export function contractTypeLis(query) {
  return request({
    url: '/data/contract_type/typeListPage',
    method: 'get',
    params: query
  })
}
// 新增合同类型
export function contractTypeSave(query) {
  return request({
    url: '/data/contract_type/save',
    method: 'post',
    data: query
  })
}
// 修改合同类型
export function contractTypeUpdate(query) {
  return request({
    url: '/data/contract_type/update',
    method: 'post',
    data: query
  })
}
// 删除合同类型
export function contractTypeDel(query) {
  return request({
    url: '/data/contract_type/del',
    method: 'delete',
    data: query
  })
}
// 获取事业部下拉框
export function businessUnitList(query) {
  return request({
    url: '/system/dropdown/businessUnitList',
    method: 'get',
    params: query
  })
}
// 事业部下一级分类
export function businessLis(query) {
  return request({
    url: '/data/contract_type/typeList',
    method: 'get',
    params: query
  })
}