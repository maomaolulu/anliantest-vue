import request from '@/utils/request'
// ------------------------------------------------------ 客户管理 ------------------------------------------------------
// 获取客户信息列表
export const getCustomLis = (data: any) => {
    return request({
        url: '/project/customCustomer/listWithPage',
        method: 'get',
        params: data,
    })
}
// 获取客户信息详情
export const getCustomDetail = (data: any) => {
    return request({
        url: '/project/customCustomer/getCompanyAndContact',
        method: 'get',
        params: data,
    })
}
// 客户信息新增
export const customAdd = (data: any) => {
    return request({
        url: '/project/customCustomer/newCustomer',
        method: 'put',
        data: data,
    })
}
// 客户信息修改
export const customUpdate = (data: any) => {
    return request({
        url: '/project/customCustomer/updateCustomer',
        method: 'post',
        data: data,
    })
}
// 客户信息查询是否可删除
export const checkIfRelate = (data: any) => {
    return request({
        url: '/project/customCustomer/checkIfRelate',
        method: 'get',
        params: data,
    })
}
// 客户信息删除
export const deleteCustomer = (data: any) => {
    return request({
        url: '/project/customCustomer/deleteCustomer',
        method: 'get',
        params: data,
    })
}
// 省市区数据获取
export const getAddressLis = (data: any) => {
    return request({
        url: '/system/address/getIdAndName',
        method: 'get',
        params: data,
    })
}
// 客户信息分配业务员
export const customAllocation = (data: any) => {
    return request({
        url: '/project/advance/task/allocation',
        method: 'post',
        data: data,
    })
}
