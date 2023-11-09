import { getDicts } from "@/api/index";
import { dataStore } from '@/store/modules/app.ts'
import { fileExport } from "@/api/otherCenter";
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
export default {
  install(app: any) {
    //全部环境变量
    app.config.globalProperties.selfEnv = () => {
      console.log(import.meta.env.VITE_APIIMG_URL)
      return import.meta.env.VITE_APIIMG_URL

    }
    // 表单选项的子组件校验数字格式   定时任务
    app.config.globalProperties.checkNum = (value, minLimit, maxLimit) => {
      // 检查必须为整数
      value = Math.floor(value);
      if (value < minLimit) {
        value = minLimit;
      } else if (value > maxLimit) {
        value = maxLimit;
      }
      return value;
    }
    //数组根据参数去重
    app.config.globalProperties.arrSome = (arr, id) => {
      console.log(arr)
      let some = [];
      arr.forEach(el => {
        if (!some.some(e => e[id] == el[id])) {
          some.push(el);
        }
      });
      return some
    }

    //转树形
    app.config.globalProperties.handleTree = (data, id, parentId, children) => {
      console.log(data, 'sadsadsadsa')
      let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
      };
      var childrenListMap = {};
      var nodeIds = {};
      var tree = [];

      for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
          childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
      }
      for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
          tree.push(d);
        }
      }
      for (let t of tree) {
        adaptToChildrenList(t);
      }
      function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
          o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
          for (let c of o[config.childrenList]) {
            adaptToChildrenList(c);
          }
        }
      }
      return tree;
    }

    // 添加日期范围
    app.config.globalProperties.addDateRange = (params, dateRange, propName) => {
      let search = params;
      search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
      dateRange = Array.isArray(dateRange) ? dateRange : [];
      if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
      } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
      }
      return search;
    }

    //重置表单
    app.config.globalProperties.resetForm = (page, refName) => {
      if (page.$refs[refName]) {
        page.$refs[refName].resetFields();
      }
    }

    // 日期格式化
    app.config.globalProperties.parseTime = (time, pattern) => {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        } else if (typeof time === 'string') {
          time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    }

    //根据类型获取字典数据
    app.config.globalProperties.getDict = async (type: string) => {
      var res = await getDicts(type);
      const obj = {}
      res.data.forEach((item: any) => {
        item['value'] = Number(item.dictValue)
        item['label'] = item.dictLabel;
        obj[item['value']] = item
      })
      return obj
    }

    //数组转字段对象
    app.config.globalProperties.arrToMap = (arr: any, key: any) => {
      var obj = {}
      arr.forEach(item => {
        obj[item[key]] = item
      })
      return obj
    }

    // 判断是否拥有按钮权限
    app.config.globalProperties.hasPermissions = (val: string) => {
      let permissions = dataStore().permissions
      if (permissions.includes(val)) {
        return true
      }
      return false
    }
    
    //全局通知后台导出接口
    app.config.globalProperties.exportFile=(data:any)=>{
      fileExport(data).then(res=>{
        if(res.code==200){
          ElMessage({ message: '新增成功,请至导出进度查看下载', type: 'success' })
        }
      })
    }
  }
}