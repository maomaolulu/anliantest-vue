import { type App } from "vue"
import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'

// const install = function(Vue) {
//   Vue.directive('hasRole', hasRole)
//   Vue.directive('hasPermi', hasPermi)
// }

// if (window.Vue) {
//   window['hasRole'] = hasRole
//   window['hasPermi'] = hasPermi
//   Vue.use(install); // eslint-disable-line
// }

// export default install
// export default function directive(app){
//     app.directive('hasPerm', hasPerm)
//   }
// function directive(app) {
// 	app.directive('hasPermi', hasPermi)
//     app.directive('hasRole', hasRole)
// }
export function loadDirectives(app: App) {
    app.directive("hasPermi", hasPermi)
}