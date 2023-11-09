import request from '@/utils/request'
// ------------------------------------------------------ 检定管理 ------------------------------------------------------
// 检定记录列表
export const getRepairCheck = (data: any) => {
    return request({
        url: '/data/equip/repair/check',
        method: 'get',
        params: data,
    })
}
// 检定仪器
export const haveRepairCheck = (data: any) => {
    return request({
        url: '/data/equip/repair/have',
        method: 'get',
        params: data,
    })
}