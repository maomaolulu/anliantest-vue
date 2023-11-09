import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import App from './App.vue'
import 'virtual:svg-icons-register'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/main.css' //全局自定义通用样式
import { download } from '@/utils/request'

// const pinia = createPinia()
const app = createApp(App)
import store from "@/store"

import './style.css'
// import './components/SvgIcon' // icon
import SvgIcon from "@/components/SvgIcon/index.vue";
// 字典标签组件
import DictTag from '@/components/DictTag'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import { ElTable } from 'element-plus'
// 获取组件的props
const TableProps = ElTable.props
TableProps.size='small'
import router from './router'
import './permission' // permission control
import plugins from './plugins' // plugins
import * as ElIconList from '@element-plus/icons-vue'
import { loadDirectives } from './directive/index' // directive自定义指令
for (const name in ElIconList) {
    app.component(name, ElIconList[name])
}
import returnFun from "@/utils/vue_fun";//自定义挂在vue原型常量
import returnConst from "@/utils/vue_const";//自定义挂在vue原型常量
// 富文本组件
import Editor from "@/components/Editor"
app.config.globalProperties.download = download
app.component('SvgIcon', SvgIcon);
app.component('Editor', Editor)
app.component('DictTag', DictTag)
// 屏蔽警告信息
app.config.warnHandler = (message) => {
    console.log(message);
};
app.use(returnConst)
app.use(returnFun)
app.use(plugins)
app.use(store).use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
loadDirectives(app)
app.mount('#app')
