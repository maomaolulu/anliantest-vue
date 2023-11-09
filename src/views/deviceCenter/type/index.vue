<template>
  <div class='myPage10'>
    <div class="myPageTop45">
      <el-form :model="query" size="default" @submit.prevent="get_lis">
      <el-input v-model="query.categoryName" placeholder="类型" class="selfSerchInput mm10" clearable />
      <el-button type="primary" icon="Search" class="mm10" @click="get_lis">搜索</el-button>
      <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
      <el-button type="primary" icon="Plus" @click="addInfo" plain >新增</el-button>
    </el-form>
    </div>
    <div class="myCenter45">
      <el-table :data="data_lis" style="width: 100%" height="100%" border row-key="id" default-expand-all
        :tree-props="{ children: 'chidren'}" size="small">
        <el-table-column type="index" label="序号" width="55" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="categoryName" label="类型" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="updateBy" label="维护人" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="updateTime" label="维护时间" header-align="center" align="center">
          <template #default="scope">
            {{parseTime(scope.row.updateTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
          <template #default="scope">
            {{parseTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="editInfo(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="delInfo(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="editInfoType==1?'新增':'编辑'" v-model="editInfoVisible" width="50%" :close-on-click-modal="false">
      <div v-if="editInfoVisible">
        <el-form ref="editInfoForm" :model="editInfoForm" :rules="editInfoRules" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="上级类型" prop="parentId">
                <el-cascader :options="rel_data_lis" v-model="editInfoForm.parentId" placeholder="上级类型"
                  :props="typeProps" style="width:360px" :show-all-levels="false">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="类型" prop="categoryName">
                <el-input v-model="editInfoForm.categoryName" placeholder="类型" style="width:360px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="editInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfoSubmit" :loading="loading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>

import {
  equipCategoryLis,
  equipCategoryAdd,
  equipCategoryEdit,
  equipCategoryDel,
} from "@/api/deviceCenter/type.ts";
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      query: {
        categoryName: '',
      },
      data_lis: [],
      rel_data_lis: [],
      tableHeight: 0,

      editInfoType: '', // 1:新增,2:编辑
      editInfoVisible: false,
      editInfoForm: {},
      typeProps: {
        emitPath: false,
        value: 'id',
        label: 'categoryName',
        children: 'chidren',
      },
      editInfoRules: {
        categoryName: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.get_lis()

  },
  beforeDestroy() { },
  methods: {
    delInfo(row) {
      this.$confirm('确定删除该类型及其下属的所有类型？', '提示').then(() => {
        equipCategoryDel({ id: row.id }).then(res => {
          if (res.code != 200) {
            return this.$message.error(res.msg)
          }
          this.$message.success('删除成功')
          this.get_lis()
        })
      })
    },
    editInfoSubmit() {
      this.loading = true
      if (this.editInfoType == 1) {
        this.$refs.editInfoForm.validate((valid, err) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.editInfoForm))
            params.parentId = params.parentId || 0
            equipCategoryAdd(params).then(res => {
              this.loading = false
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('新增成功')
              this.get_lis()
              this.editInfoVisible = false
            }).catch(err => {
              console.log(err);
              this.loading = false
            })
          } else {
            console.log(err);
          }
        })
      } else if (this.editInfoType == 2) {
        this.$refs.editInfoForm.validate((valid, err) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.editInfoForm))
            params.parentId = params.parentId || 0
            equipCategoryEdit(params).then(res => {
              this.loading = false
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('编辑成功')
              this.get_lis()
              this.editInfoVisible = false
            }).catch(err => {
              console.log(err);
              this.loading = false
            })
          } else {
            console.log(err);
          }
        })
      }
    },
    editInfo(row) {
      this.editInfoForm = JSON.parse(JSON.stringify(row))
      this.editInfoType = 2
      this.editInfoVisible = true
    },
    addInfo() {
      this.editInfoForm = {
        parentId: '',
        categoryName: '',
      }
      this.editInfoType = 1
      this.editInfoVisible = true
    },
    refresh_get_lis() {
      this.query = {
        categoryName: '',
      }
      this.get_lis()
    },
    // 获取列表
    get_lis() {
      let params = JSON.parse(JSON.stringify(this.query))
      equipCategoryLis(params).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.data_lis = res.data
        if (!params.categoryName) {
          this.rel_data_lis = res.data
        } else {
          this.get_all_lis()
        }
      })
    },
    get_all_lis() {
      equipCategoryLis().then(res => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.rel_data_lis = res.data
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.deviceType {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px 20px 10px;
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
      width: 210px;
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