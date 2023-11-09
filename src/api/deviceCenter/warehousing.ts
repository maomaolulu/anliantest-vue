import request from '@/utils/request'
// ------------------------------------------------------ 仪器入库 ------------------------------------------------------
// 采购信息列表
export const equipPurchaseLis = (data: any) => {
    return request({
        url: '/data/equip/list/purchase',
        method: 'get',
        params: data,
    })
}
// 仪器设备类型一级类目
export const equipCategory = (data: any) => {
    return request({
        url: '/data/equip/getDropdownList/category',
        method: 'get',
        params: data,
    })
}
// 用户列表
export const listUser = (data: any) => {
    return request({
        url: '/system/user/listUser',
        method: 'get',
        params: data,
    })
}
// 仪器设备采购入库
export const equipAddPurchase = (data: any) => {
    return request({
        url: '/data/equip/add/warehouse',
        method: 'post',
        data: data,
    })
}
// 入库记录列表
export const equipWarehouseLis = (data: any) => {
    return request({
        url: '/data/equip/list/warehouse',
        method: 'get',
        params: data,
    })
}