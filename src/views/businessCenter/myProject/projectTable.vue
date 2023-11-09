<template>
  <div class='projectTable'>
    <el-form class="top_self" :model="query" size="default" @submit.prevent="search_get_lis">
      <el-input v-model="query.taskCode" placeholder="业务编号" class="input_self" clearable />
      <el-input v-model="query.customerOrder" placeholder="客户隶属" class="input_self" clearable />
      <el-input v-model="query.enterpriseName" placeholder="企业名称" class="input_self" clearable />
      <el-input v-model="query.contacterName" placeholder="联系人" class="input_self" clearable />
      <el-input v-model="query.mobilePhone" placeholder="联系电话" class="input_self" clearable />
      <el-button type="primary" icon="Search" @click="search_get_lis">搜索</el-button>
      <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
    </el-form>
    <div class="subBtn">
      <el-button type="success" icon="Plus" @click="addCustom" v-if="hasPermissions('custom:list:add')">新增</el-button>
    </div>
    <div class="main_table" ref="main_table">
      <el-table :data="data_lis" style="width: 100%" height="100%" border size="small">
        <el-table-column type="index" label="序号" width="55" align="center" header-align="center"></el-table-column>
        <el-table-column prop="taskCode" label="业务编号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="customerOrder" label="客户隶属" align="center" header-align="center"></el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" align="center" header-align="center"></el-table-column>
        <el-table-column prop="registeredAddress" label="注册地址" align="center" header-align="center"></el-table-column>
        <el-table-column prop="contacterName" label="联系人" align="center" header-align="center"></el-table-column>
        <el-table-column prop="mobilePhone" label="联系电话" align="center" header-align="center"></el-table-column>
        <el-table-column prop="businessStatus" label="业务状态" align="center" header-align="center">
          <template #default="scope">
            {{businessStatusType[scope.row.businessStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template #default="scope">
            <el-button type="primary" link @click="addAdvanceRecord(scope.row)"
              v-if="[1].includes(scope.row.businessStatus)">跟进</el-button>
            <el-button type="primary" link @click="showAdvanceLis(scope.row)"
              v-if="[2,3,4].includes(scope.row.businessStatus)">跟进详情</el-button>
            <el-button type="primary" link @click="finishInfo(scope.row)"
              v-if="[2].includes(scope.row.businessStatus)">完成</el-button>
            <el-button type="primary" link @click="editCustomInfo(scope.row)"
              v-if="[2].includes(scope.row.businessStatus)">编辑</el-button>
            <el-dropdown trigger="click" style="margin-left:10px;padding:2px;"
              @command="(e)=>{return dropdownClick(e,scope.row)}" v-if="[1,2,3,4,5].includes(scope.row.businessStatus)">
              <el-button type="primary" link>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="showCustomInfo">企业信息</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="query.pageNum"
      :page-sizes="[50, 100, 200, 500]" :page-size="query.pageSize" :total="query.totalCount"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <el-dialog title="跟进完成" v-model="finishInfoVisible" width="50%" :close-on-click-modal="false">
      <div v-if="finishInfoVisible">
        <el-form ref="finishForm" :model="finishForm" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="跟进结果" prop="advanceResult" :rules="[{required:true,message:'请选择',trigger:'change'}]">
                <el-radio-group v-model="finishForm.advanceResult">
                  <el-radio :label="1">已成单</el-radio>
                  <el-radio :label="0">未成单</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="finishInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishInfoSubmit">确 定</el-button>
      </template>
    </el-dialog>
    <addAdvance ref="addAdvance" @refreshLis="get_lis"></addAdvance>
    <editCustom ref="editCustom" @refreshLis="get_lis"></editCustom>
    <customInfo ref="customInfo"></customInfo>
  </div>
</template>
<script>
import { getAdvanceLis, updateAdvanceTask } from "@/api/businessCenter/advance.ts"
import { dataStore } from '@/store/modules/app.ts'
import addAdvance from './addAdvance.vue'
import editCustom from '../custom/editCustom.vue'
import customInfo from '../custom/customInfo.vue';
export default {
  emits: ['showAdvanceLis'],
  name: '',
  props: {
    businessStatus: Number,
  },
  components: {
    addAdvance,
    editCustom,
    customInfo,
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
      finishInfoVisible: false,
      finishForm: {},
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.userInfo = dataStore().userInfo
    this.query.userId = this.userInfo.userId
    this.query.businessStatus = this.businessStatus
  },
  beforeDestroy() { },
  methods: {
    init() {
      this.get_lis()
    },
    addCustom() {
      this.$refs.editCustom.init(1, this.userInfo.userId)
    },
    finishInfoSubmit() {
      let params = this.finishForm
      this.$refs.finishForm.validate((valid, err) => {
        if (valid) {
          updateAdvanceTask(params).then(res => {
            if (res.code != 200) {
              return this.$message.error(res.msg)
            }
            this.$message.success('操作成功')
            this.finishInfoVisible = false
            this.get_lis()
          })
        } else {
          console.log(err);
        }
      })
    },
    finishInfo(row) {
      this.finishForm = {
        taskId: row.taskId,
        advanceResult: '',
      }
      this.finishInfoVisible = true
    },
    dropdownClick(val, row) {
      if (val == "showCustomInfo") {
        this.$refs.customInfo.init(row.customerId)
      }
    },
    editCustomInfo(row) {
      this.$refs.editCustom.init(2, row.customerId)
    },
    addAdvanceRecord(row) {
      this.$refs.addAdvance.init(1, row.taskId)
    },
    showAdvanceLis(row) {
      this.$emit('showAdvanceLis', row)
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
.projectTable {
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
    .input_self {
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