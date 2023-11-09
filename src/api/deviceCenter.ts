import request from '@/utils/request'
// 设备库存/清单分页
export function equiplistPage(query: any) {
    return request({
        url: '/data/equip_warehouse_record/listPage',
        method: 'get',
        params: query
    })
}
//   设备库存/清单详情
export function equipInfo(query: any) {
    return request({
        url: '/data/equip_warehouse_record/info',
        method: 'get',
        params: query
    })
}
// 获取仪器类型下拉列表
export function equipCategory(query: any) {
    return request({
        url: '/data/equip/getDropdownList/category',
        method: 'get',
        params: query
    })
}
// 修改设备库存
export function equipUpdate(query: any) {
    return request({
        url: '/data/equip_warehouse_record/update',
        method: 'POST',
        data: query
    })
}
// 获取应检定设备列表
export function verificationlis(query: any) {
    return request({
        url: '/data/equip/list/verification',
        method: 'get',
        params: query
    })
}
// 检定设备详情
export function equipwarehouse(query: any) {
    return request({
        url: '/data/equip/info/warehouse',
        method: 'get',
        params: query
    })
}
// 设备送检
export function submissionverification(query: any) {
    return request({
        url: '/data/verification/submission/verification',
        method: 'POST',
        data: query
    })
}
// 设备退检
export function returnverification(query: any) {
    return request({
        url: '/data/verification/return/verification',
        method: 'POST',
        data: query
    })
}
// 证书录入
export function certificateEntrySave(query: any) {
    return request({
        url: '/data/verification/certificateEntry',
        method: 'POST',
        data: query
    })
}
//检定记录列表
export function getverificationlis(query: any) {
    return request({
        url: '/data/verification/list',
        method: 'get',
        params: query
    })
}
// 获取检定记录详情
export function verificationInfo(query: any) {
    return request({
        url: '/data/verification/info',
        method: 'get',
        params: query
    })
}
// 编辑检定记录
export function verificationupdate(query: any) {
    return request({
        url: '/data/verification/update',
        method: 'POST',
        data: query
    })
}
// 设备借出列表
export function lendListPage(query: any) {
    return request({
        url: '/data/equip_borrowing_record/lendListPage',
        method: 'get',
        params: query
    })
}
// 新增设备借用记录
export function lendSave(query: any) {
    return request({
        url: '/data/equip_borrowing_record/save',
        method: 'post',
        data: query
    })
}
// 设备借用记录分页
export function lendrecordlis(query: any) {
    return request({
        url: '/data/equip_borrowing_record/listPage',
        method: 'get',
        params: query
    })
}
// 撤销归还
export function revokeEquipBorrowingRecord(query: any) {
    return request({
        url: '/data/equip_borrowing_record/revokeEquipBorrowingRecord',
        method: 'post',
        data: query
    })
}
// 外部设备借入列表
export function equipExternal(query: any) {
    return request({
        url: '/data/equip_external/listPage',
        method: 'get',
        params: query
    })
}
// 新增外部设备
export function equipsave(query: any) {
    return request({
        url: '/data/equip_external/save',
        method: 'post',
        data: query
    })
}
// 删除外部设备
export function equipDel(query: any) {
    return request({
        url: '/data/equip_external/del',
        method: 'post',
        data: query
    })
}
// 修改外部设备
export function equipExternalUpdate(query: any) {
    return request({
        url: '/data/equip_external/update',
        method: 'post',
        data: query
    })
}
// 新增设备借用记录
export function equip_borrowing_record_save(query: any) {
    return request({
        url: '/data/equip_borrowing_record/save',
        method: 'post',
        data: query
    })
}
//内部设备借用记录
export function equip_borrowing_record_lis(query: any) {
    return request({
        url: '/data/equip_borrowing_record/listPage',
        method: 'get',
        params: query
    })
}
// 外部设备借入记录分页
export function equip_borrowing_record_externalListPage(query: any) {
    return request({
        url: '/data/equip_borrowing_record/externalListPage',
        method: 'get',
        params: query
    })
}
// 撤销归还
export function revokeEquip(query: any) {
    return request({
        url: '/data/equip_borrowing_record/revokeEquipBorrowingRecord',
        method: 'post',
        data: query
    })
}

