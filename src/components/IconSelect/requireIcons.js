
const all=  import.meta.glob('../../assets/icons/**/*.svg')
// console.log(icons,'ewewewewew')
// const req = require.context('../../assets/icons/svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys()

// const re = /\.\/(.*)\.svg/

// const icons = requireAll(req).map(i => {
//   return i.match(re)[1]
// })
const icons=[]
for(let k in all){
  let ar=k.split('/svg/')
  icons.push(ar[1].replace('.svg',''))
}
console.log(icons)
export default icons
