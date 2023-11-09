<template>
  <el-dialog :title="editType==1?'新增跟进记录':'编辑跟进记录'" v-model="editInfoVisible" width="50%" :close-on-click-modal="false"
    class="addAdvance">
    <div>
      <el-form ref="editInfoForm" :model="editInfoForm" :rules="editInfoRules" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="跟进日期" prop="advanceDate">
              <el-date-picker v-model="editInfoForm.advanceDate" type="date" placeholder="跟进日期" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="跟进方式" prop="advancePattern">
              <el-select v-model="editInfoForm.advancePattern" placeholder="跟进方式">
                <el-option v-for="item,k in advancePatternType" :key="k" :label="item" :value="Number(k)">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="图像资料">
              <div>
                <el-upload class="avatar-uploader" action="/prod-api/file/minio/upload" list-type="picture-card"
                  :on-success="handleSuccess" :before-upload="beforeUpload" :on-preview="handlePreview"
                  :on-remove="handleRemove" :on-error="uploadError" :file-list="fileList" accept :data="uploadParams"
                  :headers="uploadHeaders">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
                <div>{{"文件不超过10MB"}}</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="跟进信息">
              <el-input v-model="editInfoForm.advanceInformation" placeholder="跟进信息" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="editInfoVisible = false">取 消</el-button>
      <el-button type="primary" @click="editInfoSubmit" :loading="submitLoading">确 定</el-button>
    </template>
  </el-dialog>
  <el-dialog title="预览" v-model="previewVisible" width="75%">
    <el-image style="width: 70vw; height: 60vh" :src="previewUrl" :fit="'contain'"></el-image>
  </el-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
import { addAdvanceRecord, updateAdvanceRecord } from "@/api/businessCenter/advance"
export default {
  emits: ['refreshLis'],
  name: '',
  props: {},
  components: {},
  data() {
    return {
      editType: '', // 1:新增,2:编辑
      editInfoVisible: false,
      editInfoForm: {},
      advancePatternType: {
        108: "电话沟通",
        109: "现场拜访",
      },
      fileList: [],
      uploadHeaders: {},
      uploadParams: {
        bucketName: 'al-advance-file',
      },
      previewUrl: '',
      previewVisible: false,
      editInfoRules: {
        advanceDate: [{ required: true, message: '请选择', trigger: 'change' }],
        advancePattern: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      submitLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.uploadHeaders = { Token: 'Bearer ' + getToken() }
  },
  beforeDestroy() { },
  methods: {
    init(type, info) {
      if (type == 1) {
        this.editType = 1
        this.editInfoForm = {
          advanceDate: '',
          advancePattern: '',
          advanceInformation: '',
          taskId: info,
        }
        this.fileList = []
        this.editInfoVisible = true
      }
      if (type == 2) {
        this.editType = 2
        this.editInfoForm = info
        this.fileList = info.sysAttachmentList || []
        let imgApi = import.meta.env.VITE_APIIMG_URL
        if (info.sysAttachmentList) {
          for (let i = 0; i < info.sysAttachmentList.length; i++) {
            info.sysAttachmentList[i].url = imgApi + info.sysAttachmentList[i].preUrl
          }
        }
        this.editInfoVisible = true
      }
    },
    editInfoSubmit() {
      this.$refs.editInfoForm.validate((valid, err) => {
        if (valid) {
          this.submitLoading = true
          if (this.editType == 1) {
            let params = JSON.parse(JSON.stringify(this.editInfoForm))
            params.sysAttachmentList = this.fileList
            addAdvanceRecord(params).then(res => {
              this.submitLoading = false
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('新增成功')
              this.editInfoVisible = false
              this.$emit('refreshLis')
            }).catch(err => {
              this.submitLoading = false
            })
          } else if (this.editType == 2) {
            let params = JSON.parse(JSON.stringify(this.editInfoForm))
            params.sysAttachmentList = this.fileList
            updateAdvanceRecord(params).then(res => {
              this.submitLoading = false
              if (res.code != 200) {
                return this.$message.error(res.msg)
              }
              this.$message.success('编辑成功')
              this.editInfoVisible = false
              this.$emit('refreshLis')
            }).catch(err => {
              this.submitLoading = false
            })
          }
        } else {
          console.log(err);
        }
      })
    },
    // 图片上传
    uploadError(error) {
      this.$message.error('上传失败')
    },
    handleRemove(file, fileList) {
      console.log(file);
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
      console.log(file);
      let isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      let isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('仅支持 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
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
</style>