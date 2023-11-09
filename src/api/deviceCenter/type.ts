import request from '@/utils/request'
// ------------------------------------------------------ 仪器类型 ------------------------------------------------------
// 仪器类型列表
export const equipCategoryLis = (data: any) => {
    return request({
        url: '/data/equip/list/category',
        method: 'get',
        params: data,
    })
}
// 新增仪器类型
export const equipCategoryAdd = (data: any) => {
    return request({
        url: '/data/equip/add/category',
        method: 'post',
        data: data,
    })
}
// 编辑仪器类型
export const equipCategoryEdit = (data: any) => {
    return request({
        url: '/data/equip/edit/category',
        method: 'post',
        data: data,
    })
}
// 编辑仪器类型
export const equipCategoryDel = (data: any) => {
    return request({
        url: '/data/equip/delete/category/' + data.id,
        method: 'delete',
        data: data,
    })
}