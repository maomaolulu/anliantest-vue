<template>
  <div class='advance'>
    <el-form class="top_self" :model="query" size="default" @submit.prevent="search_get_lis">
      <el-input v-model="query.taskCode" placeholder="业务编号" class="input_self" clearable />
      <el-input v-model="query.customerOrder" placeholder="客户隶属" class="input_self" clearable />
      <el-input v-model="query.enterpriseName" placeholder="企业名称" class="input_self" clearable />
      <el-input v-model="query.advanceName" placeholder="跟进人" class="input_self" clearable />
      <el-select v-model="query.businessStatus" placeholder="业务状态" class="input_self" clearable>
        <el-option v-for="item,k in businessStatusType" :key="k" :label="item" :value="k">
        </el-option>
      </el-select>
      <el-select v-model="query.advanceResult" placeholder="跟进结果" class="input_self" clearable>
        <el-option :label="'未成单'" :value="0"></el-option>
        <el-option :label="'已成单'" :value="1"></el-option>
      </el-select>
      <el-date-picker v-model="query.advanceFirstTime" type="datetimerange" range-separator="~" start-placeholder="首次跟进"
        end-placeholder="首次跟进" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="input_self" style="width:210px"
        clearable />
      <el-date-picker v-model="query.advanceLastTime" type="datetimerange" range-separator="~" start-placeholder="最近跟进"
        end-placeholder="最近跟进" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="input_self" style="width:210px"
        clearable />
      <el-button type="primary" icon="Search" @click="search_get_lis">搜索</el-button>
      <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
    </el-form>
    <div class="subBtn">
      <el-button type="primary" @click="replaceBatch" :disabled="!select_lis.length"
        v-if="hasPermissions('advance:list:replace')">批量替换</el-button>
    </div>
    <div class="main_table" ref="main_table">
      <el-table :data="data_lis" style="width: 100%" height="100%" border @selection-change="selectionChange" size="small">
        <el-table-column type="selection" width="55" align="center" header-align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center" header-align="center"></el-table-column>
        <el-table-column prop="taskCode" label="业务编号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="customerOrder" label="客户隶属" align="center" header-align="center"></el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" align="center" header-align="center"></el-table-column>
        <el-table-column label="省/市/区" align="center" header-align="center">
          <template #default="scope">
            <span>{{scope.row.province}}</span>
            <span v-if="scope.row.province&&scope.row.city">/</span>
            <span>{{scope.row.city}}</span>
            <span v-if="scope.row.city&&scope.row.district">/</span>
            <span>{{scope.row.district}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="advanceName" label="跟进人" align="center" header-align="center"></el-table-column>
        <el-table-column prop="advanceFirstTime" label="首次跟进" align="center" header-align="center">
          <template #default="scope">
            {{parseTime(scope.row.advanceFirstTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="advanceLastTime" label="最近跟进" align="center" header-align="center">
          <template #default="scope">
            {{parseTime(scope.row.advanceLastTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="业务状态" align="center" header-align="center">
          <template #default="scope">
            {{businessStatusType[scope.row.businessStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="advanceResult" label="跟进结果" align="center" header-align="center">
          <template #default="scope">
            {{advanceResultType[scope.row.advanceResult]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template #default="scope">
            <el-button type="primary" link @click="detailInfo(scope.row)">跟进详情</el-button>
            <el-button type="primary" link @click="replaceInfo(scope.row)"
              v-if="scope.row.businessStatus==1">人员替换</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="query.pageNum"
      :page-sizes="[50, 100, 200, 500]" :page-size="query.pageSize" :total="query.totalCount"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <el-dialog title="跟进详情" v-model="infoVisible" width="60%" :close-on-click-modal="false">
      <div>
        <el-table
          :data="info_lis.slice(info_query.pageSize*(info_query.pageNum-1),info_query.pageSize*info_query.pageNum)"
          style="width: 100%" height="500px" border>
          <el-table-column type="index" label="序号" width="55" align="center" header-align="center"></el-table-column>
          <el-table-column prop="advanceDate" label="跟进日期" align="center" header-align="center">
            <template #default="scope">
              {{parseTime(scope.row.advanceDate)}}
            </template>
          </el-table-column>
          <el-table-column prop="advancePattern" label="跟进方式" align="center" header-align="center">
            <template #default="scope">
              {{advancePatternType[scope.row.advancePattern]}}
            </template>
          </el-table-column>
          <el-table-column prop="sysAttachmentList" label="图像资料" align="center" header-align="center">
            <template #default="scope">
              <template v-for="item,index in scope.row.sysAttachmentList" :key="index">
                <el-image style="width: 100px; height: 100px" :src="item.url" :fit="'contain'"
                  @click="previewImg(item)"></el-image>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="定位信息" align="center" header-align="center"></el-table-column>
          <el-table-column prop="advanceInformation" label="跟进信息" align="center"
            header-align="center"></el-table-column>
        </el-table>
        <el-pagination @size-change="infoSizeChange" @current-change="infoCurrentChange"
          :current-page="info_query.pageNum" :page-sizes="[10]" :page-size="info_query.pageSize"
          :total="info_query.totalCount" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </el-dialog>
    <el-dialog :title="showDialogPage?'批量替换':'人员替换'" v-model="replaceVisible" width="60%" :close-on-click-modal="false">
      <div>
        <el-form ref="replaceForm" :model="replaceForm" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="替换为：" prop="userId" :rules="[{required:true,message:'请选择',trigger:'change'}]">
                <el-select v-model="replaceForm.userId" placeholder="业务员" style="width:100%" filterable>
                  <el-option v-for="item,k in userObj" :key="k" :label="item.nickName" :value="Number(k)">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="info_lis.slice(info_query.pageSize*(info_query.pageNum-1),info_query.pageSize*info_query.pageNum)"
        style="width: 100%" max-height="420px" border>
        <el-table-column type="index" label="序号" width="55" align="center" header-align="center"></el-table-column>
        <el-table-column prop="taskCode" label="业务编号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" align="center" header-align="center"></el-table-column>
        <el-table-column prop="advanceName" label="跟进人" align="center" header-align="center"></el-table-column>
      </el-table>
      <template v-if="showDialogPage">
        <el-pagination @size-change="infoSizeChange" @current-change="infoCurrentChange"
          :current-page="info_query.pageNum" :page-sizes="[10]" :page-size="info_query.pageSize"
          :total="info_query.totalCount" layout="total, prev, pager, next, jumper"></el-pagination>
      </template>
      <template #footer>
        <div>
          <el-button @click="replaceVisible = false">取 消</el-button>
          <el-button type="primary" @click="replaceSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="预览" v-model="previewVisible" width="75%">
      <el-image style="width: 70vw; height: 60vh" :src="previewUrl" :fit="'contain'"></el-image>
    </el-dialog>
  </div>
</template>
<script>
import { getAdvanceLis, getAdvanceDetail, getAdvanceReplace } from "@/api/businessCenter/advance.ts"
import { listUser, } from "@/api/deviceCenter/warehousing.ts"
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
      select_lis: [],
      businessStatusType: {
        0: "待分配",
        1: "待跟进",
        2: "跟进中",
        3: "待合作",
        4: "合作中",
        5: "跟进结束"
      },
      infoVisible: false,
      info_lis: [],
      info_query: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
      },
      advancePatternType: {
        108: "电话沟通",
        109: "现场拜访",
      },
      advanceResultType: {
        0: '未成单',
        1: '已成单',
      },
      replaceVisible: false,
      replaceForm: {},
      userObj: {},
      showDialogPage: false,
      previewUrl: '',
      previewVisible: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.get_lis()
    this.getUserLis()
  },
  beforeDestroy() { },
  methods: {
    previewImg(item) {
      this.previewUrl = item.url
      this.previewVisible = true
    },
    replaceSubmit() {
      this.$refs.replaceForm.validate((valid, err) => {
        if (valid) {
          getAdvanceReplace(this.replaceForm).then(res => {
            if (res.code != 200) {
              return this.$message.error(res.msg)
            }
            this.$message.success('分配成功')
            this.get_lis()
            this.replaceVisible = false
          })
        } else {
          console.log(err);
        }
      })
    },
    replaceBatch() {
      let info_lis = []
      for (let i = 0; i < this.select_lis.length; i++) {
        if (this.select_lis[i].businessStatus === 1) {
          info_lis.push(this.select_lis[i])
        } else {
          return this.$message.error('存在不可替换任务，请重新勾选！')
        }
      }
      if (!info_lis.length) {
        return this.$message.error('暂无可分配任务')
      }
      this.info_query.totalCount = info_lis.length
      this.info_lis = info_lis
      this.replaceForm = {
        userId: '',
        tasksList: info_lis,
      }
      this.showDialogPage = true
      this.replaceVisible = true

    },
    replaceInfo(row) {
      let info_lis = []
      info_lis.push(row)
      this.info_query.totalCount = info_lis.length
      this.info_lis = info_lis
      this.replaceForm = {
        userId: '',
        tasksList: [row],
      }
      this.showDialogPage = false
      this.replaceVisible = true
    },
    getUserLis(cb) {
      listUser().then(res => {
        if (res.code != 200) {
          this.$message.error(res.msg)
          cb && cb(false)
          return
        }
        let userObj = {}
        for (let i = 0; i < res.data.list.length; i++) {
          userObj[res.data.list[i].userId] = res.data.list[i]
        }
        this.userObj = userObj
        cb && cb(true)
      })
    },
    infoSizeChange(val) {
      this.info_query.pageSize = val
      this.info_query.pageNum = 1
    },
    infoCurrentChange(val) {
      this.info_query.pageNum = val
    },
    detailInfo(row) {
      let params = {
        taskId: row.taskId
      }
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
        this.info_lis = res.data
        this.info_query.totalCount = res.data.length
        this.infoVisible = true
      })
    },
    selectionChange(val) {
      this.select_lis = val
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
      if (params.advanceFirstTime && params.advanceFirstTime.length) {
        params.advanceFirstTimeStart = params.advanceFirstTime[0]
        params.advanceFirstTimeEnd = params.advanceFirstTime[1]
      }
      delete params.advanceFirstTime
      if (params.advanceLastTime && params.advanceLastTime.length) {
        params.advanceLastTimeStart = params.advanceLastTime[0]
        params.advanceLastTimeEnd = params.advanceLastTime[1]
      }
      delete params.advanceLastTime
      getAdvanceLis(params).then(res => {
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
.advance {
  width: 100%;
  height: 100%;
  padding: 20px 20px 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .top_self {
    position: relative;
    width: 100%;
    margin-bottom: 4px;
    :deep(.input_self) {
      width: 160px;
      margin-right: 10px;
      margin-bottom: 6px;
    }
    .el-button {
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
  :deep(.el-form-item__content) {
    .el-input,
    .el-select,
    .el-cascader {
      width: 100%;
    }
  }
}
</style>