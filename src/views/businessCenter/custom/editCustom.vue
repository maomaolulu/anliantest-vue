<template>
  <div class='editCustom'>
    <el-dialog :title="editInfoType==1?'新增客户':'编辑客户'" v-model="editInfoVisible" width="50%"
      :close-on-click-modal="false">
      <div v-if="editInfoVisible">
        <el-card>
          <template #header>
            <div>基本信息</div>
          </template>
          <el-form ref="editInfoForm" :model="editInfoForm" label-width="180px" :rules="projectRules">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="企业名称" prop="enterpriseName">
                  <el-input v-model="editInfoForm.enterpriseName" placeholder="企业名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="社会统一信用代码" prop="creditCode">
                  <el-input v-model="editInfoForm.creditCode" placeholder="社会统一信用代码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="省/市/区" prop="province">
                  <div style="width:100%;display:flex;">
                    <el-select v-model="editInfoForm.province" placeholder="省" @change="citySelectChange('province')"
                      filterable clearable :loading="cityLoading">
                      <el-option v-for="item,k in city_lis" :key="k" :label="item.regionName" :value="item.regionName">
                      </el-option>
                    </el-select>
                    <el-select v-model="editInfoForm.city" placeholder="市" @change="citySelectChange('city')" filterable
                      clearable :loading="cityLoading">
                      <template v-if="editInfoForm.province&&city_lis[editInfoForm.province].children">
                        <el-option v-for="item,k in city_lis[editInfoForm.province].children" :key="k"
                          :label="item.regionName" :value="item.regionName">
                        </el-option>
                      </template>
                    </el-select>
                    <el-select v-model="editInfoForm.district" placeholder="区" @change="citySelectChange('district')"
                      filterable clearable :loading="cityLoading">
                      <template
                        v-if="editInfoForm.province&&editInfoForm.city&&city_lis[editInfoForm.province].children[editInfoForm.city].children">
                        <el-option
                          v-for="item,k in city_lis[editInfoForm.province].children[editInfoForm.city].children"
                          :key="k" :label="item.regionName" :value="item.regionName">
                        </el-option>
                      </template>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="注册地址" prop="registeredAddress">
                  <el-input v-model="editInfoForm.registeredAddress" placeholder="注册地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="受检地址" prop="inspectionAddress">
                  <el-input v-model="editInfoForm.inspectionAddress" placeholder="受检地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="客户状态" prop="customerStatus">
                  <el-radio-group v-model="editInfoForm.customerStatus">
                    <el-radio :label="item.value" v-for="item,k in customerStatusTypeLis"
                      :key="k">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card>
          <template #header>
            <div>联系方式</div>
          </template>
          <div class="contactInfo">
            <template v-for="item,index in editInfoForm.contacts" :key="index">
              <el-form ref="contcatInfo" :model="item" label-width="120px" class="contactForm" :rules="contactRules">
                <div class="del" v-if="editInfoForm.contacts.length>1">
                  <el-button type="danger" icon="Delete" link @click="delContact(index)"></el-button>
                </div>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="contacterName">
                      <el-input v-model="item.contacterName" placeholder="姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱" prop="mail">
                      <el-input v-model="item.mail" placeholder="邮箱"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="固定电话" prop="fixedPhone">
                      <el-input v-model="item.fixedPhone" placeholder="固定电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="移动电话" prop="mobilePhone">
                      <el-input v-model="item.mobilePhone" placeholder="移动电话"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="联系人类型" prop="contactClass">
                      <el-select v-model="item.contactClass" placeholder="联系人类型">
                        <el-option v-for="item,k in contactClassLis" :key="k" :label="item" :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否默认" prop="ifDefault">
                      <el-radio-group v-model="item.ifDefault" @change="defaultChange(item)">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
            <div class="add">
              <el-button type="success" link icon="DocumentAdd" @click="addContact(index)"></el-button>
            </div>
          </div>
        </el-card>
      </div>
      <template #footer>
        <el-button @click="editInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfoSubmit" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  customAdd,
  customUpdate,
  getAddressLis,
  getCustomDetail,
} from "@/api/businessCenter/custom.ts"
import { emit } from 'process';
export default {
  emits: ['refreshLis'],
  name: '',
  props: {},
  components: {},
  data() {
    let provinceValid = (rule, value, callback) => {
      if (!this.editInfoForm.province || !this.editInfoForm.city || !this.editInfoForm.district) {
        callback(new Error('请选择省市区'))
      } else {
        callback()
      }
    }
    return {
      editInfoType: '', // 1:新增,2:编辑
      editInfoVisible: false,
      submitLoading: false,
      editInfoForm: {},
      projectRules: {
        enterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        province: [{ required: true, message: '请输入', trigger: 'change' },
        { validator: provinceValid, trigger: 'change' }],
        registeredAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
        customerStatus: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      contactRules: {
        contacterName: [{ required: true, message: '请输入', trigger: 'blur' }],
        ifDefault: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      city_lis: {},
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
      cityLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.getCityLis()
  },
  beforeDestroy() { },
  methods: {
    init(type, info) {
      if (type == 1) {
        this.editInfoType = 1
        this.editInfoForm = {
          customerOrder: "",  // 客户隶属
          enterpriseName: "",  // 企业名称
          province: "",  // 省
          city: "",  // 市
          district: "",  // 区
          advanceTimeStart: "",  // 最近最近合作开始
          advanceTimeEnd: "",  // 最近最近合作结束
          businessStatus: "",  // 业务状态
          customerStatus: 1,  // 客户状态(0: 停用,1: 正常)
          creditCode: "",  // 社会统一信用代码
          registeredAddress: "",  // 注册地址
          inspectionAddress: "",  // 受检地址
          businessPeopleId: info || "",  // 业务员Id
          contacts: [
            {
              contacterName: "",  // 联系人姓名
              ifDefault: 1,  // 是否默认(0:否,1:是)
              contactClass: "",  // 联系人类型
              fixedPhone: "",  // 固定电话
              mobilePhone: "",  // 移动电话
              mail: "",  // 邮箱
            }
          ],
        }
        this.editInfoVisible = true
      } else if (type == 2) {
        let params = {
          customerId: info
        }
        getCustomDetail(params).then(res => {
          if (res.code != 200) {
            return this.$message.error(res.msg)
          }
          res.data.id = info
          if (res.data.city) {
            this.getCityLis(res.data.province, () => {
              if (res.data.district) {
                this.getCityLis(res.data.city, () => {
                  this.editInfoForm = res.data
                  this.editInfoType = 2
                  this.editInfoVisible = true
                })
              } else {
                this.editInfoForm = res.data
                this.editInfoType = 2
                this.editInfoVisible = true
              }
            })
          } else {
            this.editInfoForm = res.data
            this.editInfoType = 2
            this.editInfoVisible = true
          }
        })
      }
    },
    defaultChange(item) {
      for (let i = 0; i < this.editInfoForm.contacts.length; i++) {
        this.editInfoForm.contacts[i].ifDefault = 0
      }
      item.ifDefault = 1
    },
    delContact(index) {
      if (this.editInfoForm.contacts[index].ifDefault == 1) {
        if (index == 0) {
          this.editInfoForm.contacts[1].ifDefault = 1
        } else {
          this.editInfoForm.contacts[0].ifDefault = 1
        }
      }
      this.editInfoForm.contacts.splice(index, 1)
    },
    addContact(index) {
      this.editInfoForm.contacts.push({
        contacterName: "",  // 联系人姓名
        ifDefault: 0,  // 是否默认(0:否,1:是)
        contactClass: "",  // 联系人类型
        fixedPhone: "",  // 固定电话
        mobilePhone: "",  // 移动电话
        mail: "",  // 邮箱
      })
    },
    // 选择省市区
    citySelectChange(type) {
      if (this.editInfoForm[type]) {
        this.getCityLis(this.editInfoForm[type])
      }
      if (type == "province") {
        this.editInfoForm.city = ''
        this.editInfoForm.district = ''
      } else if (type == "city") {
        this.editInfoForm.district = ''
      }
    },
    // 获取省市区数据
    getCityLis(regionName, cb) {
      this.cityLoading = true
      let params = {}
      let selectObj = {}
      let city_lis = JSON.parse(JSON.stringify(this.city_lis))
      if (regionName) {
        let findName = (obj, regionName) => {
          if (obj[regionName]) {
            selectObj = obj[regionName]
            return true
          }
          for (const key in obj) {
            if (obj[key].children) {
              if (findName(obj[key].children, regionName)) {
                return
              }
            }
          }
        }
        findName(city_lis, regionName)
      }
      params.regionParentId = selectObj.id
      getAddressLis(params).then(res => {
        this.cityLoading = false
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        let children = {}
        for (let i = 0; i < res.data.length; i++) {
          children[res.data[i].regionName] = res.data[i]
        }
        if (regionName) {
          selectObj.children = children
        } else {
          city_lis = children
        }
        this.city_lis = city_lis
        cb && cb()
      }).catch(err => {
        console.log(err);
        this.cityLoading = false
      })
    },
    // 新增编辑提交
    editInfoSubmit() {
      let validateAsync = []
      validateAsync.push(new Promise((reslove, reject) => {
        this.$refs.editInfoForm.validate((valid, err) => {
          if (valid) {
            reslove(true)
          } else {
            reject(false)
          }
        })
      }))
      for (let i = 0; i < this.editInfoForm.contacts.length; i++) {
        validateAsync.push(new Promise((reslove, reject) => {
          this.$refs.contcatInfo[i].validate((valid, err) => {
            if (valid) {
              reslove(true)
            } else {
              reject(false)
            }
          })
        }))
      }
      Promise.all(validateAsync).then(res => {
        this.submitLoading = true
        if (this.editInfoType == 1) {
          let params = JSON.parse(JSON.stringify(this.editInfoForm))
          customAdd(params).then(res => {
            this.submitLoading = false
            if (res.code != 200) {
              return this.$message.error(res.msg)
            }
            this.$message.success('新增成功')
            this.$emit('refreshLis')
            this.editInfoVisible = false
          }).catch(err => {
            console.log(err);
            this.submitLoading = false
          })
        } else if (this.editInfoType == 2) {
          let params = JSON.parse(JSON.stringify(this.editInfoForm))
          customUpdate(params).then(res => {
            this.submitLoading = false
            if (res.code != 200) {
              return this.$message.error(res.msg)
            }
            this.$message.success('修改成功')
            this.$emit('refreshLis')
            this.editInfoVisible = false
          }).catch(err => {
            console.log(err);
            this.submitLoading = false
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
  },
};
</script>
<style lang='scss' scoped>
:deep(.el-form-item__content) {
  .el-input,
  .el-select,
  .el-cascader {
    width: 100%;
  }
}
.el-card {
  margin-bottom: 10px;
  .contactInfo {
    position: relative;
  }
  .del {
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 10;
    .el-button {
      font-size: 20px;
    }
  }
  .add {
    display: flex;
    justify-content: flex-end;
    .el-button {
      font-size: 20px;
    }
  }
  .contactInfo {
    .el-form {
      border-bottom: 1px solid #ccc;
      margin-bottom: 6px;
      position: relative;
    }
  }
}
</style>