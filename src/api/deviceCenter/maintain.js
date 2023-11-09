import request from '@/utils/request'
// ------------------------------------------------------ 维修记录 ------------------------------------------------------
// 在用设备
export const getRepairUse = () => {
  return request({
    url: '/data/equip/repair/use',
    method: 'get'
  })
}
