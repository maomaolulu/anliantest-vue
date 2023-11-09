import request from '@/utils/request'
// 进度管理分页
export function mangePage(query) {
  return request({
    url: '/file/progress_manage/listPage',
    method: 'get',
    params: query
  })
}
// 删除进度管理
export function mangePageDel(query) {
    return request({
      url: '/file/progress_manage/del',
      method: 'DELETE',
      data: query
    })
  }
  // 新增进度管理
export function fileExport(query) {
    return request({
      url: '/file/progress_manage/save',
      method: 'post',
      data: query
    })
  }