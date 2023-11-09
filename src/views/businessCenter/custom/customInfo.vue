<template>
  <el-dialog title="企业信息" v-model="customInfoVisible" width="60%" :close-on-click-modal="false">
    <div v-if="customInfoVisible">
      <el-card style="margin-bottom:10px;">
        <div>
          <el-form ref="customInfo" :model="customInfo" label-width="160px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="企业名称:">
                  {{customInfo.enterpriseName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社会统一信用代码:">
                  {{customInfo.creditCode}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="客户隶属:">
                  {{customInfo.customerOrder}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务状态:">
                  {{businessStatusType[customInfo.businessStatus]}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="省/市/区:">
                  <span>{{customInfo.province}}</span>
                  <span v-if="customInfo.province&&customInfo.city">/</span>
                  <span>{{customInfo.city}}</span>
                  <span v-if="customInfo.city&&customInfo.district">/</span>
                  <span>{{customInfo.district}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册地址:">
                  {{customInfo.registeredAddress}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="法人代表:">
                  {{customInfo.legalPerson}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="受检地址:">
                  {{customInfo.inspectionAddress}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="行业类别:">
                  {{customInfo.industryCategory}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人员规模:">
                  {{customInfo.staffSize}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="风险类别:">
                  {{customInfo.riskClass}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品信息:">
                  {{customInfo.productInfo}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-table :data="customInfo.contacts" style="width: 100%" border
        v-if="customInfo.advanceId==userInfo.userId||hasPermissions('custom:list:contact')">
        <el-table-column prop="contacterName" label="姓名" align="center" header-align="center"> </el-table-column>
        <el-table-column prop="ifDefault" label="默认" align="center" header-align="center">
          <template #default="scope">
            <el-radio v-model="scope.row.ifDefault" disabled :label="1">{{''}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="contactClass" label="类型" align="center" header-align="center"></el-table-column>
        <el-table-column prop="fixedPhone" label="固定电话" align="center" header-align="center"> </el-table-column>
        <el-table-column prop="mobilePhone" label="移动电话" align="center" header-align="center"> </el-table-column>
        <el-table-column prop="mail" label="邮箱" align="center" header-align="center"> </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import { getCustomDetail } from "@/api/businessCenter/custom.ts"
import { dataStore } from '@/store/modules/app.ts'
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      customInfoVisible: false,
      customInfo: {},
      userInfo: {},
      businessStatusType: {
        0: "待分配",
        1: "待跟进",
        2: "跟进中",
        3: "待合作",
        4: "合作中",
        5: "跟进结束"
      },
      customerStatusType: {
        1: "正常",
        0: "停用",
      },
      contactClassLis: {
        1: '商务',
        2: '财务',
        3: '业务',
        4: 'EHS',
      },
      customerStatusTypeLis: [
        { value: 1, label: '正常' },
        { value: 0, label: '停用' },
      ],
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  beforeDestroy() { },
  methods: {
    init(customerId) {
      this.userInfo = dataStore().userInfo
      getCustomDetail({ customerId: customerId }).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.customInfo = res.data
        this.customInfoVisible = true
      })
    },
  },
};
</script>
<style lang='less' scoped>
</style>