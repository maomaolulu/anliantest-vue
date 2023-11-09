<script setup lang="ts">
import {dataStoreHook} from '@/store/modules/app'
let store = dataStoreHook()
// console.log(store.msg,'apapapapapapapapapap') // 访问store中state变量
// console.log(store.addNum) // 访问store中getters计算属性
// store.setTitle('erefdsfds') // 访问store中getters计算属性并传值
// store.getInfo() // 调用store中actions的方法
// console.log(store.getInfo()) // 访问store中getters计算属性

</script>

<template>
    <div id="app">
      <router-view />
    </div>
</template>

<style scoped>
</style>
