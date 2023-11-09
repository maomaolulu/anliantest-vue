<template>
  <div class='warehousingLis'>
    <el-form class="top_self" :model="query" size="default" @submit.prevent="search_get_lis">
      <el-input v-model="query.purchaseCode" placeholder="申请单号" class="input_self" clearable />
      <el-input v-model="query.applier" placeholder="申请人" class="input_self" clearable />
      <el-input v-model="query.companyName" placeholder="申请公司" class="input_self" clearable />
      <el-input v-model="query.deptName" placeholder="申请部门" class="input_self" clearable />
      <!-- <el-select v-model="query.companyId" placeholder="申请公司" class="input_self" clearable>
        <el-option v-for="item,k in companyObj" :key="k" :label="item.deptName" :value="Number(k)">
        </el-option>
      </el-select>
      <el-cascader v-model="equipInfo.deptId" :options="deptLis" :props="deptProps" placeholder="申请部门"
        :show-all-levels="false" class="input_self" clearable filterable /> -->
      <el-button type="primary" icon="Search" @click="search_get_lis">搜索</el-button>
      <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
      <el-button type="primary" plain @click="warehouseInfo(2)">直接入库</el-button>
    </el-form>
    <div class="main_table" ref="main_table">
      <el-table :data="data_lis" style="width: 100%" height="100%" border>
        <el-table-column type="index" label="序号" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="purchaseCode" label="申请单号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="companyName" label="申请公司" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" label="申请部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="applier" label="申请人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="payer" label="采购人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="goodsName" label="物品名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="model" label="规格型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actualAmount" label="采购数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remainAmount" label="待入库" header-align="center" align="center"></el-table-column>
        <el-table-column prop="singlePrice" label="采购单价" header-align="center" align="center"></el-table-column>
        <el-table-column prop="arrivedTime" label="到货时间" header-align="center" align="center">
          <template #default="scope">
            {{parseTime(scope.row.arrivedTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="purchaseCode" label="操作" header-align="center" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="warehouseInfo(1,scope.row)">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="query.pageNum"
      :page-sizes="[50, 100, 200, 500]" :page-size="query.pageSize" :total="query.totalCount"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <el-dialog :title="warehouseType==1?'采购入库':'直接入库'" v-model="warehouseVisible" width="70%"
      :close-on-click-modal="false">
      <div v-if="warehouseVisible">
        <el-form ref="equipInfo" :model="equipInfo" label-width="140px"
          :rules="warehouseType==1?editInfoRules:editInfoRules2">
          <template v-if="warehouseType==1">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="申请单号" prop="purchaseCode">
                  <el-input v-model="equipInfo.purchaseCode" placeholder="申请单号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请公司" prop="companyId">
                  <el-select v-model="equipInfo.companyId" placeholder="申请公司" disabled>
                    <el-option v-for="item,k in companyObj" :key="k" :label="item.deptName" :value="Number(k)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="资产类别">
                  <el-input v-model="typeStr" placeholder="资产类别" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类别" prop="equipType">
                  <el-select v-model="equipInfo.equipType" placeholder="设备类别" filterable>
                    <el-option v-for="item,k in equipCategoryObj" :key="k" :label="item.categoryName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="设备编号" prop="equipCode">
                  <el-input v-model="equipInfo.equipCode" placeholder="设备编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="goodsName">
                  <el-input v-model="equipInfo.goodsName" placeholder="设备名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="规格型号" prop="model">
                  <el-input v-model="equipInfo.model" placeholder="规格型号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="equipInfo.unit" placeholder="单位"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="采购时间" prop="purchaseDate">
                  <el-date-picker v-model="equipInfo.purchaseDate" type="date" placeholder="采购时间" disabled
                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="到货时间" prop="arrivedTime">
                  <el-date-picker v-model="equipInfo.arrivedTime" type="date" placeholder="到货时间" disabled
                    format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="待入库数" prop="warehouseAmount">
                  <el-input v-model="equipInfo.warehouseAmount" placeholder="待入库数" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购价格" prop="singlePrice">
                  <el-input v-model="equipInfo.singlePrice" placeholder="采购价格" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="warehouseType==2">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="资产类别">
                  <el-input v-model="typeStr" placeholder="资产类别" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="companyId">
                  <el-select v-model="equipInfo.companyId" placeholder="公司名称" disabled>
                    <el-option v-for="item,k in companyObj" :key="k" :label="item.deptName" :value="Number(k)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="设备编号" prop="equipCode">
                  <el-input v-model="equipInfo.equipCode" placeholder="设备编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类别" prop="equipType">
                  <el-select v-model="equipInfo.equipType" placeholder="设备类别" filterable>
                    <el-option v-for="item,k in equipCategoryObj" :key="k" :label="item.categoryName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="规格型号" prop="model">
                  <el-input v-model="equipInfo.model" placeholder="规格型号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="goodsName">
                  <el-input v-model="equipInfo.goodsName" placeholder="设备名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="采购单价" prop="singlePrice">
                  <el-input v-model="equipInfo.singlePrice" type="number" placeholder="采购价格"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="equipInfo.unit" placeholder="单位"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplier">
                <el-input v-model="equipInfo.supplier" placeholder="供应商"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂家" prop="productCompany">
                <el-input v-model="equipInfo.productCompany" placeholder="生产厂家"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="出厂编号" prop="factoryCode">
                <el-input v-model="equipInfo.factoryCode" placeholder="出厂编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前估值" prop="value">
                <el-input v-model="equipInfo.value" placeholder="当前估值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="责任部门" prop="chargeDeptId">
                <el-cascader v-model="equipInfo.chargeDeptId" :options="deptLis" :props="deptProps" placeholder="责任部门"
                  :show-all-levels="false" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人" prop="chargeId">
                <el-select v-model="equipInfo.chargeId" placeholder="责任人" filterable>
                  <el-option v-for="item,k in userObj" :key="k" :label="item.nickName" :value="Number(k)">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="保管人" prop="keeperId">
                <el-select v-model="equipInfo.keeperId" placeholder="责任人" filterable>
                  <el-option v-for="item,k in userObj" :key="k" :label="item.nickName" :value="Number(k)">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用部门" prop="useDeptId">
                <el-cascader v-model="equipInfo.useDeptId" :options="deptLis" :props="deptProps" placeholder="责任部门"
                  :show-all-levels="false" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="检定/校准" prop="calibration">
                <el-radio-group v-model="equipInfo.calibration">
                  <el-radio :label="'检定'">检定</el-radio>
                  <el-radio :label="'校准'">校准</el-radio>
                  <el-radio :label="'不检定不校准'">不检定不校准</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书有效期" prop="usefulTime">
                <el-date-picker v-model="equipInfo.usefulTime" type="date" placeholder="证书有效期" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="仪器精度" prop="precision">
                <div class="flex_box">
                  <el-input v-model="equipInfo.precision" placeholder="资产类别"></el-input>
                  <el-tooltip content="若读数是2位小数则填2" placement="top" effect="dark">
                    <el-icon>
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="允许误差" prop="allowanceError">
                <el-input v-model="equipInfo.allowanceError" placeholder="允许误差"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测量范围" prop="testRange">
                <el-input v-model="equipInfo.testRange" placeholder="测量范围"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测量范围(系统)" prop="testRangeMin">
                <div class="flex_box">
                  <el-input v-model="equipInfo.testRangeMin" placeholder="最小值"></el-input>
                  <div style="margin:0 10px;"> - </div>
                  <el-input v-model="equipInfo.testRangeMax" placeholder="最大值"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="设备图片" prop="path">
                <div>
                  <el-upload class="avatar-uploader" action="/prod-api/file/minio/upload" list-type="picture-card"
                    :on-success="handleSuccess" :before-upload="beforeUpload" :on-preview="handlePreview"
                    :on-remove="handleRemove" :on-error="uploadError" :file-list="fileList" accept :limit="3"
                    :data="uploadParams" :headers="uploadHeaders">
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-upload>
                </div>
                <div>{{"仅支持.jpg文件上传(<=10MB),至多3张"}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="warehouseVisible = false">取 消</el-button>
        <el-button type="primary" @click="warehouseSubmit" :loading='submitLoading'>确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title=" 预览" v-model="previewVisible">
      <img w-full :src="previewUrl" />
    </el-dialog>
  </div>
</template>
<script>
import { listDept, getCompany } from "@/api/system/dept.ts"
import { equipPurchaseLis, equipCategory, listUser, equipAddPurchase } from "@/api/deviceCenter/warehousing.ts"
import { getToken } from '@/utils/auth'
import { dataStore } from '@/store/modules/app.ts'
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      userInfo: {},
      query: {
        pageNum: 1,
        pageSize: 50,
        totalCount: 0,
      },
      data_lis: [],
      equipInfo: {},
      companyObj: {},
      deptObj: {},
      userObj: {},
      deptLis: [],
      equipCategoryObj: {},
      editInfoRules: {
        equipType: [{ required: true, message: '请选择', trigger: 'change' }],
        equipCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        goodsName: [{ required: true, message: '请输入', trigger: 'blur' }],
        model: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        chargeDeptId: [{ required: true, message: '请选择', trigger: 'change' }],
        chargeId: [{ required: true, message: '请选择', trigger: 'change' }],
        keeperId: [{ required: true, message: '请选择', trigger: 'change' }],
        calibration: [{ required: true, message: '请选择', trigger: 'change' }],
        usefulTime: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      editInfoRules2: {
        equipCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        equipType: [{ required: true, message: '请选择', trigger: 'change' }],
        model: [{ required: true, message: '请输入', trigger: 'blur' }],
        goodsName: [{ required: true, message: '请输入', trigger: 'blur' }],
        singlePrice: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        chargeDeptId: [{ required: true, message: '请选择', trigger: 'change' }],
        chargeId: [{ required: true, message: '请选择', trigger: 'change' }],
        keeperId: [{ required: true, message: '请选择', trigger: 'change' }],
        calibration: [{ required: true, message: '请选择', trigger: 'change' }],
        usefulTime: [{ required: true, message: '请选择', trigger: 'change' }],
      },

      warehouseVisible: false,
      warehouseType: '', // 1:采购入库,2::直接入库
      typeStr: '仪器设备',
      deptProps: {
        emitPath: false,
        value: 'deptId',
        label: 'deptName',
      },
      fileList: [],
      uploadParams: {
        bucketName: 'al-equipment-file',
      },
      uploadHeaders: {},
      previewUrl: '',
      previewVisible: false,
      tableHeight: 0,
      submitLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.userInfo = dataStore().userInfo
    this.uploadHeaders = { Token: 'Bearer ' + getToken() }
  },
  beforeDestroy() { },
  methods: {
    init() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.main_table.offsetHeight
      })
      this.get_lis()
      // this.getCompanyLis()
      // this.getDeptLis()
      // this.getCategoryLis()
    },
    warehouseSubmit() {
      this.submitLoading = true
      if (this.warehouseType == 1) {
        this.$refs.equipInfo.validate((valid, err) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.equipInfo))
            params.sysAttachmentList = this.fileList
            params.warehouseType = 1
            params.oldId = params.id
            params.id = undefined
            equipAddPurchase(params).then(res => {
              this.submitLoading = false
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('入库成功')
              this.get_lis()
              this.warehouseVisible = false
            }).catch(err => {
              this.submitLoading = false
              console.log(err);
            })
          } else {
            this.submitLoading = false
            console.log(err);
          }
        })
      } else if (this.warehouseType == 2) {
        this.$refs.equipInfo.validate((valid, err) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.equipInfo))
            params.sysAttachmentList = this.fileList
            params.warehouseType = 0
            equipAddPurchase(params).then(res => {
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('入库成功')
              this.get_lis()
              this.warehouseVisible = false
            })
          } else {
            console.log(err);
          }
        })
      }
    },
    // 图片上传
    uploadError(error) {
      this.$message.error('上传失败')
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.response.data.url[0].path == this.fileList[i].path) {
          this.fileList.splice(i, 1)
        }
      }
    },
    handlePreview(file) {
      this.previewUrl = URL.createObjectURL(file.raw);
      this.previewVisible = true
    },
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.fileList.push(res.data.url[0])
      }
    },
    beforeUpload(file) {
      let isJPG = file.type === 'image/jpeg';
      let isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('仅支持 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
    // 获取基础信息 用于弹出框下拉
    getBaseLis(cb) {
      let promiseLis = []
      if (!this.equipCategoryObj || !Object.keys(this.equipCategoryObj).length) {
        promiseLis.push(new Promise((reslove, reject) => {
          this.getCategoryLis((res) => {
            res ? reslove(res) : reject(res)
          })
        }))
      }
      if (!this.companyObj || !Object.keys(this.companyObj).length) {
        promiseLis.push(new Promise((reslove, reject) => {
          this.getCompanyLis((res) => {
            res ? reslove(res) : reject(res)
          })
        }))
      }
      if (!this.deptObj || !Object.keys(this.deptObj).length) {
        promiseLis.push(new Promise((reslove, reject) => {
          this.getDeptLis((res) => {
            res ? reslove(res) : reject(res)
          })
        }))
      }
      if (!this.userObj || !Object.keys(this.userObj).length) {
        promiseLis.push(new Promise((reslove, reject) => {
          this.getUserLis((res) => {
            res ? reslove(res) : reject(res)
          })
        }))
      }
      Promise.all(promiseLis).then(() => {
        this.$nextTick(() => {
          cb && cb()
        })
      }).catch(err => {
        console.log(err);
      })
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
    // 获取仪器类别下拉
    getCategoryLis(cb) {
      equipCategory({ categoryName: '现场采样仪器' }).then(res => {
        if (res.code && res.code != 200) {
          this.$message.error(res.msg)
          cb && cb(false)
          return
        }
        let equipCategoryObj = {}
        for (let i = 0; i < res.length; i++) {
          equipCategoryObj[res[i].id] = res[i]
        }
        this.equipCategoryObj = equipCategoryObj
        cb && cb(true)
      })
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
        let toTree = (list, item) => {
          for (let i = 0; i < list.length; i++) {
            if (item.parentId == list[i].deptId) {
              if (!list[i].children) {
                list[i].children = []
              }
              list[i].children.push(item)
              return true
            }
            if (list[i].children && list[i].children.length) {
              if (toTree(list[i].children, item)) {
                return true
              }
            } else {
              list[i].children = null
            }
          }
        }
        for (let i = 0; i < res.data.length; i++) {
          deptObj[res.data[i].deptId] = res.data[i]
          if (toTree(res.data, res.data[i])) {
            res.data.splice(i, 1)
            i--
          }
        }
        this.deptLis = res.data
        this.deptObj = deptObj
        cb && cb(true)
      })
    },
    // 新增入库
    warehouseInfo(type = 1, row) {
      this.getBaseLis(() => {
        if (type == 1) {
          let equipInfo = JSON.parse(JSON.stringify(row))
          for (const key in this.companyObj) {
            if (this.companyObj[key].deptName == this.userInfo.companyName) {
              this.equipInfo.companyId = this.companyObj[key].deptId
              break
            }
          }
          equipInfo.calibration = '校准'
          this.equipInfo = equipInfo
          this.fileList = []
          this.warehouseType = 1
          this.warehouseVisible = true
        } else if (type == 2) {
          let equipInfo = {
            companyId: '',
            equipCode: '',
            equipType: '',
            model: '',
            goodsName: '',
            singlePrice: '',
            unit: '',
            supplier: '',
            productCompany: '',
            factoryCode: '',
            value: '',
            chargeDeptId: '',
            chargeId: '',
            keeperId: '',
            useDeptId: '',
            calibration: '校准',
            usefulTime: '',
            precision: '',
            allowanceError: '',
            testRange: '',
            testRangeMin: '',
            testRangeMax: '',
            path: '',
          }
          this.fileList = []
          for (const key in this.companyObj) {
            if (this.companyObj[key].deptName == this.userInfo.companyName) {
              equipInfo.companyId = this.companyObj[key].deptId
              break
            }
          }
          this.equipInfo = equipInfo
          this.warehouseType = 2
          this.warehouseVisible = true
        }
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
      equipPurchaseLis(params).then(res => {
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
.warehousingLis {
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
  .main_table {
    flex: 1;
    margin-bottom: 6px;
  }
  :deep(.el-form-item__content) {
    .el-input,
    .el-select,
    .el-cascader {
      width: 100%;
    }
  }
  .flex_box {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .el-icon.el-tooltip__trigger {
    font-size: 18px;
    margin-left: 10px;
  }
}
</style>