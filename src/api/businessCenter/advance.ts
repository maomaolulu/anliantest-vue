import request from '@/utils/request'
// ------------------------------------------------------ 跟进管理 ------------------------------------------------------
// 获取跟进管理列表
export const getAdvanceLis = (data: any) => {
    return request({
        url: '/project/advance/record/listTasks',
        method: 'get',
        params: data,
    })
}
// 获取跟进详情
export const getAdvanceDetail = (data: any) => {
    return request({
        url: '/project/advance/getDetail',
        method: 'get',
        params: data,
    })
}
// 人员替换
export const getAdvanceReplace = (data: any) => {
    return request({
        url: '/project/advance/task/replace',
        method: 'post',
        data: data,
    })
}
// 新增跟进任务
export const addAdvanceRecord = (data: any) => {
    return request({
        url: '/project/advance/record/save',
        method: 'put',
        data: data,
    })
}
// 编辑跟进任务
export const updateAdvanceTask = (data: any) => {
    return request({
        url: '/project/advance/task/update',
        method: 'post',
        data: data,
    })
}
// 编辑跟进任务记录
export const updateAdvanceRecord = (data: any) => {
    return request({
        url: '/project/advance/record/edit',
        method: 'put',
        data: data,
    })
}