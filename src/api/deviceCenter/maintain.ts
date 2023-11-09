import request from '@/utils/request'
// ------------------------------------------------------ 维修记录 ------------------------------------------------------
// 在用设备
export const getRepairUse = (data: any) => {
    return request({
        url: '/data/equip/repair/use',
        method: 'get',
        params: data,
    })
}
// 维修列表
export const getRepairList = (data: any) => {
    return request({
        url: '/data/equip/repair/list',
        method: 'get',
        params: data,
    })
}
// 新增维修记录
export const addRepairList = (data: any) => {
    return request({
        url: '/data/equip/repair',
        method: 'post',
        data: data,
    })
}
// 删除维修记录
export const delRepairList = (data: any) => {
    return request({
        url: '/data/equip/repair/' + data.id + '/' + data.equipId,
        method: 'delete',
        data: data,
    })
}
// 编辑维修记录
export const editRepairList = (data: any) => {
    return request({
        url: '/data/equip/repair',
        method: 'put',
        data: data,
    })
}
// 完成维修
export const completeRepair = (data: any) => {
    return request({
        url: '/data/equip/repair/complete',
        method: 'post',
        data: data,
    })
}
