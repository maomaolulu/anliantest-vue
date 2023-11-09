<template>
  <div>
    <el-drawer :withHeader="false" v-model="addVanceLisVisible" :direction="'rtl'" size="100%" :destroy-on-close="true"
      modal-class="advanceLisDrawer">
      <div class="advanceLis" v-if="addVanceLisVisible">
        <el-form class="top_self" :model="query" size="default" @submit.prevent="search_get_lis">
          <el-button type="primary" icon="ArrowLeft" plain @click="turnBack" style="margin-right:10px;">返回</el-button>
          <el-select v-model="query.advancePattern" placeholder="跟进方式" class="input_self" clearable>
            <el-option v-for="item,k in advancePatternType" :key="k" :label="item" :value="k">
            </el-option>
          </el-select>
          <el-date-picker v-model="query.advanceDate" type="date" placeholder="跟进日期" class="input_self"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable />
          <el-button type="primary" icon="Search" @click="search_get_lis">搜索</el-button>
          <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
          <el-button type="success" icon="Plus" @click="addInfo">新增</el-button>
        </el-form>
        <div class="main_table" ref="main_table">
          <el-table :data="data_lis.slice(query.pageSize*(query.pageNum-1),query.pageSize*query.pageNum)"
            style="width: 100%" height="100%" border>
            <el-table-column header-align="center" align="center" type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="advanceDate" label="跟进日期" header-align="center" align="center">
              <!-- <template #default="scope">
                {{parseTime(scope.row.advanceDate)}}
              </template> -->
            </el-table-column>
            <el-table-column prop="advancePattern" label="跟进方式" header-align="center" align="center">
              <template #default="scope">
                {{advancePatternType[scope.row.advancePattern]}}
              </template>
            </el-table-column>
            <el-table-column prop="sysAttachmentList" label="图像资料" header-align="center" align="center">
              <template #default="scope">
                <template v-for="item,index in scope.row.sysAttachmentList" :key="index">
                  <el-image style="width: 75px; height: 75px" :src="item.url" :fit="'fill'" @click="previewImg(item)" />
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="position" label="定位信息" header-align="center" align="center"></el-table-column>
            <el-table-column prop="advanceInformation" label="跟进信息" header-align="center"
              align="center"></el-table-column>
            <el-table-column prop="advanceDate" label="操作" header-align="center" align="center">
              <template #default="scope">
                <el-button type="primary" link @click="editInfo(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
          :current-page="query.pageNum" :page-sizes="[50, 100, 200, 500]" :page-size="query.pageSize"
          :total="query.totalCount" layout="total,  prev, pager, next, jumper"></el-pagination>
        <el-dialog title="预览" v-model="previewVisible" width="75%" :append-to-body="true">
          <el-image style="width: 70vw; height: 60vh" :src="previewUrl" :fit="'contain'"></el-image>
        </el-dialog>
      </div>
    </el-drawer>
    <addAdvance ref="addAdvance" @refreshLis="get_lis"></addAdvance>
  </div>
</template>
<script>
import { getAdvanceDetail } from "@/api/businessCenter/advance.ts"
import addAdvance from './addAdvance.vue';
export default {
  name: '',
  props: {},
  components: {
    addAdvance
  },
  data() {
    return {
      userInfo: {},
      query: {
        pageNum: 1,
        pageSize: 50,
        totalCount: 0,
      },
      data_lis: [],
      tableHeight: 0,
      businessStatusType: {
        0: "待分配",
        1: "待跟进",
        2: "跟进中",
        3: "待合作",
        4: "合作中",
        5: "跟进结束"
      },
      advancePatternType: {
        108: "电话沟通",
        109: "现场拜访",
      },
      taskId: '',
      imgApi: '',
      previewUrl: '',
      previewVisible: false,
      addVanceLisVisible: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    init(taskId) {
      this.taskId = taskId
      if (!taskId) {
        return
      }
      this.addVanceLisVisible = true
      this.get_lis()
    },
    previewImg(item) {
      this.previewUrl = item.url
      this.previewVisible = true
    },
    editInfo(row) {
      this.$refs.addAdvance.init(2, JSON.parse(JSON.stringify(row)))
    },
    addInfo() {
      this.$refs.addAdvance.init(1, this.taskId)
    },
    turnBack() {
      this.addVanceLisVisible = false
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
        businessStatus: this.query.businessStatus,
        userId: this.query.userId,
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
      params.taskId = this.taskId
      getAdvanceDetail(params).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        let imgApi = import.meta.env.VITE_APIIMG_URL
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sysAttachmentList) {
            for (let j = 0; j < res.data[i].sysAttachmentList.length; j++) {
              res.data[i].sysAttachmentList[j].url = imgApi + res.data[i].sysAttachmentList[j].preUrl
            }
          }
        }
        this.data_lis = res.data
        this.query.totalCount = res.data.length
        cb && cb()
      })
    },
  },
};
</script>
<style lang='scss' scoped>
:deep(.advanceLisDrawer) {
  position: absolute !important;
  z-index: 99 !important;
  height: 100%;
  overflow: hidden;
}
.advanceLis {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
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
  .subBtn {
    margin-bottom: 6px;
  }
  .main_table {
    flex: 1;
    margin-bottom: 6px;
    overflow: hidden;
  }
}
</style>