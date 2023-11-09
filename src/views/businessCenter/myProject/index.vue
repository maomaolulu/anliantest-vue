<template>
  <div class='myPorject'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="projectTableAll">
        <projectTable ref="projectTableAll" @showAdvanceLis="showAdvanceLis"></projectTable>
      </el-tab-pane>
      <el-tab-pane label="待跟进" name="projectTable1">
        <projectTable ref="projectTable1" :businessStatus="1" @showAdvanceLis="showAdvanceLis"></projectTable>
      </el-tab-pane>
      <el-tab-pane label="跟进中" name="projectTable2">
        <projectTable ref="projectTable2" :businessStatus="2" @showAdvanceLis="showAdvanceLis"></projectTable>
      </el-tab-pane>
      <el-tab-pane label="待合作" name="projectTable3">
        <projectTable ref="projectTable3" :businessStatus="3" @showAdvanceLis="showAdvanceLis"></projectTable>
      </el-tab-pane>
      <el-tab-pane label="合作中" name="projectTable4">
        <projectTable ref="projectTable4" :businessStatus="4" @showAdvanceLis="showAdvanceLis"></projectTable>
      </el-tab-pane>
    </el-tabs>
    <advanceLis ref="advanceLis"></advanceLis>
  </div>
</template>
<script>
import advanceLis from './advanceLis.vue';
import projectTable from "./projectTable.vue";
export default {
  name: '',
  props: {},
  components: {
    projectTable,
    advanceLis,
  },
  data() {
    return {
      activeName: 'projectTableAll',
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.handleClick()
  },
  beforeDestroy() { },
  methods: {
    handleClick() {
      this.$nextTick(() => {
        this.$refs[this.activeName].init()
      })
    },
    showAdvanceLis(info) {
      this.$refs.advanceLis.init(info.taskId)
    },
  },
};
</script>
<style lang='scss' scoped>
.myPorject {
  width: 100%;
  height: 100%;
  padding: 20px 20px 10px;
  background: #fff;
  position: relative;
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