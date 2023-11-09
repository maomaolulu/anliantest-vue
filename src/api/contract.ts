import request from '@/utils/request'
// 合同类型下拉
export function dropDownContractType(query: any) {
    return request({
        url: '/data/data/dropdown/dropDownContractType',
        method: 'get',
        params: query
    })
}
// 根据公司id查询条款类型
export function selectByCompanyId(query: any) {
    return request({
        url: '/project/contractTermType/selectByCompanyId',
        method: 'get',
        params: query
    })
}
// 根据条款类型查询条款分页
export function listByTermTypeId(query: any) {
    return request({
        url: '/project/contractTerm/listByTermTypeId',
        method: 'get',
        params: query
    })
}
// 合同范本分页
export function contract_sample_lis(query: any) {
    return request({
        url: '/project/contract_sample/listPage',
        method: 'get',
        params: query
    })
}
// 预览合同范本/
export function previewList(query: any) {
    return request({
        url: '/project/contract_sample/previewList',
        method: 'get',
        params: query
    })
}
// 新增合同范本
export function contract_sample_save(query: any) {
    return request({
        url: '/project/contract_sample/save',
        method: 'post',
        data: query
    })
}
// 停用合同范本
export function deactivate(query: any) {
    return request({
        url: '/project/contract_sample/deactivate',
        method: 'post',
        data: query
    })
}
// 删除合同范本
export function contract_sample_remove(query: any) {
    return request({
        url: '/project/contract_sample/remove',
        method: 'post',
        data: query
    })
}
// 启用合同范本创 建
export function startUsing(query: any) {
    return request({
        url: '/project/contract_sample/startUsing',
        method: 'post',
        data: query
    })
}
// 合同条款类型列表查询
export function contractTermTypelis(query: any) {
    return request({
        url: '/project/contractTermType/list',
        method: 'get',
        params: query
    })
}
// 新增合同条款类型
export function contractTermType_insert(query: any) {
    return request({
        url: '/project/contractTermType/insert',
        method: 'post',
        data: query
    })
}
// 编辑合同条款类型
export function contractTermType_update(query: any) {
    return request({
        url: '/project/contractTermType/update',
        method: 'put',
        data: query
    })
}
// 校验是否存在关联条款
export function contractTermType_check(query: any) {
    return request({
        url: '/project/contractTermType/check',
        method: 'get',
        params: query
    })
}
// 删除合同条款类型
export function contractTermType_remove(query: any) {
    return request({
        url: '/project/contractTermType/remove?id='+query.id,
        method: 'put',

    })
}
// 条款列表查询
export function contractTerm_list(query: any) {
    return request({
        url: '/project/contractTerm/list',
        method: 'get',
        params: query
    })
}
// 不分页供新建条款时使用的字段列表查询
export function contractField_list(query: any) {
    return request({
        url: '/project/contractField/getList',
        method: 'get',
        params: query
    })
}
// 新增条款
export function contractTerm_insert(query: any) {
    return request({
        url: '/project/contractTerm/insert',
        method: 'post',
        data: query
    })
}
// 编辑条款
export function contractTerm_update(query: any) {
    return request({
        url: '/project/contractTerm/update',
        method: 'put',
        data: query
    })
}
// 条款详情查询
export function contractTerm_info(query: any) {
    return request({
        url: '/project/contractTerm/info',
        method: 'get',
        params: query
    })
}
// 校验是否存在关联合同范本
export function contractTerm_check(query: any) {
    return request({
        url: '/project/contractTerm/check',
        method: 'get',
        params: query
    })
}
// 删除条款
export function contractTerm_remove(query: any) {
    return request({
        url: '/project/contractTerm/remove?id='+query.id,
        method: 'put',
        data: query
    })
}
// 编辑条款状态，停用/启用
export function contractTerm_updateStatus(query: any) {
    return request({
        url: '/project/contractTerm/updateStatus',
        method: 'put',
        data: query
    })
}