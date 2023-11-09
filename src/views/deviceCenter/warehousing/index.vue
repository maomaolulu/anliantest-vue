<template>
  <div class='warehousing'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待入库" name="warehousingLis">
        <warehousing-lis ref="warehousingLis"></warehousing-lis>
      </el-tab-pane>
      <el-tab-pane label="入库记录" name="recordLis">
        <record-lis ref="recordLis"></record-lis>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import warehousingLis from "./warehousingLis.vue"
import recordLis from "./recordLis.vue"
export default {
  name: '',
  props: {},
  components: {
    warehousingLis,
    recordLis,
  },
  data() {
    return {
      // activityCount: 0,
      activeName: 'warehousingLis',
    };
  },
  computed: {},
  watch: {},
  created() { },
  activated() {
    // if (this.activityCount !== 0) {
    //   this.handleClick()
    // }
  },
  mounted() {
    this.handleClick()
  },
  beforeDestroy() { },
  methods: {
    handleClick() {
      this.$nextTick(() => {
        this.$refs[this.activeName].init()
        // this.activityCount += 1
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.warehousing {
  width: 100%;
  height: 100%;
  padding: 20px 20px 10px;
  background: #fff;
  :deep(.el-tabs) {
    width: 100%;
    height: 100%;
    .el-tabs__content {
      width: 100%;
      height: calc(100% - 55px);
      .el-tab-pane {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>