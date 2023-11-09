<template>
  <div class='recordLis'>
    <el-form class="top_self" :model="query" size="default" @submit.prevent="search_get_lis">
      <el-input v-model="query.companyName" placeholder="公司名称" class="input_self" clearable />
      <el-input v-model="query.equipCode" placeholder="设备编号" class="input_self" clearable />
      <el-input v-model="query.goodsName" placeholder="设备名称" class="input_self" clearable />
      <el-date-picker v-model="query.createTime" type="date" placeholder="入库时间" format="YYYY-MM-DD"
        value-format="YYYY-MM-DD" class="input_self" clearable />
      <el-button type="primary" icon="Search" @click="search_get_lis">搜索</el-button>
      <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
    </el-form>
    <div class="main_table" ref="main_table">
      <el-table :data="data_lis" style="width: 100%" :height="tableHeight" border>
        <el-table-column type="index" label="序号" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="equipCode" label="设备编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="labelCode" label="标签编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="goodsName" label="设备名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="model" label="规格型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="companyId" label="公司名称" header-align="center" align="center">
          <template #default="scope">
            <template v-if="deptObj[scope.row.companyId]">
              {{deptObj[scope.row.companyId].deptName}}
            </template>
            <template v-else>
              {{scope.row.companyId}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="chargeDeptId" label="责任部门" header-align="center" align="center">
          <template #default="scope">
            <template v-if="deptObj[scope.row.chargeDeptId]">
              {{deptObj[scope.row.chargeDeptId].deptName}}
            </template>
            <template v-else>
              {{scope.row.chargeDeptId}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseAmount" label="入库数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="warehouseType" label="入库类型" header-align="center" align="center">
          <template #default="scope">
            {{warehouseType[scope.row.warehouseType]}}
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="入库人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="入库时间" header-align="center" align="center">
          <template #default="scope">
            {{parseTime(scope.row.createTime)}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="query.pageNum"
      :page-sizes="[50, 100, 200, 500]" :page-size="query.pageSize" :total="query.totalCount"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>
<script>
import { listDept, getCompany } from "@/api/system/dept.ts"
import { equipWarehouseLis } from "@/api/deviceCenter/warehousing.ts"
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 50,
        totalCount: 0,
      },
      data_lis: [],
      warehouseType: {
        0: '直接入库',
        1: '采购入库',
      },
      companyObj: {},
      deptObj: {},
      tableHeight: 0,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.getCompanyLis()
    this.getDeptLis()
  },
  beforeDestroy() { },
  methods: {
    init() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.main_table.offsetHeight
      })
      this.get_lis()
    },
    // 获取公司列表
    getCompanyLis(cb) {
      getCompany().then(res => {
        if (res.code != 200) {
          this.$message.error(res.msg)
          cb && cb(false)
          return
        }
        let companyObj = {}
        for (let i = 0; i < res.data.length; i++) {
          companyObj[res.data[i].deptId] = res.data[i]
        }
        this.companyObj = companyObj
        cb && cb(true)
      })
    },
    // 获取部门列表
    getDeptLis(cb) {
      listDept().then(res => {
        if (res.code != 200) {
          this.$message.error(res.msg)
          cb && cb(false)
          return
        }
        let deptObj = {}
        for (let i = 0; i < res.data.length; i++) {
          deptObj[res.data[i].deptId] = res.data[i]
        }
        this.deptObj = deptObj
        cb && cb(true)
      })
    },
    // 搜索列表
    search_get_lis() {
      this.query.pageNum = 1
      this.get_lis()
    },
    refresh_get_lis() {
      this.query = {
        pageNum: 1,
        pageSize: 50,
        totalCount: 0,
      }
      this.get_lis()
    },
    sizeChangeHandle(val) {
      this.query.pageSize = val
      this.query.pageNum = 1
      this.get_lis()
    },
    currentChangeHandle(val) {
      this.query.pageNum = val
      this.get_lis()
    },
    // 获取列表
    get_lis(cb) {
      let params = JSON.parse(JSON.stringify(this.query))
      equipWarehouseLis(params).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.data_lis = res.rows
        this.query.totalCount = res.total
        cb && cb()
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.recordLis {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .top_self {
    position: relative;
    width: 100%;
    margin-bottom: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    :deep(.input_self) {
      width: 160px;
      margin-right: 10px;
      margin-bottom: 6px;
    }
    .right_btn {
      position: absolute;
      right: 0;
    }
  }
  .main_table {
    flex: 1;
    margin-bottom: 6px;
  }
}
</style>