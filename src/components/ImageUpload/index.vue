<template>
    <div class="component-upload-image">
        <el-upload
            multiple
            :action="uploadImgUrl"
            list-type="picture-card"
            
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :limit="limit"
            :on-error="handleUploadError"
            :data="upData"
            ref="imageUpload"
            :on-remove="handleDelete"
            :show-file-list="true"
            :headers="headers"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :class="{ hide: this.fileList.length >= this.limit ||isHide}"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <!-- 上传提示 -->
            <template #tip v-if="showTip">
                <div class="el-upload__tip">
                    请上传
                    <template v-if="fileSize">
                        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
                    </template>
                    <template v-if="fileType">
                        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
                    </template>
                    的文件
                </div>
            </template>
        </el-upload>

        <img-view ref="imgView"/>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import ImgView from '../ImgView'
export default {
    props: {
        value: [String, Object, Array],
        // 图片数量限制
        limit: {
            type: Number,
            default: 5,
        },
        //控制是否隐藏
        isHide: {
            type: Boolean,
            default: false,
        },
        // 大小限制(MB)
        fileSize: {
            type: Number,
            default: 5,
        },
        // 文件类型, 例如['png', 'jpg', 'jpeg']
        fileType: {
            type: Array,
            default: () => ['png', 'jpg', 'jpeg'],
        },
        // 是否显示提示
        isShowTip: {
            type: Boolean,
            default: true,
        },
        //额外参数
        upData: [Object],
    },
    components: {
      ImgView
    },
    data() {
        return {
            number: 0,
            uploadList: [],
            dialogImageUrl: '',
            dialogVisible: false,
            hideUpload: false,
            uploadImgUrl: import.meta.env.VITE_API_URL + '/file/minio/upload', // 上传的图片服务器地址
            headers: {
                Token: 'Bearer ' + getToken(),
            },
            fileList: [],
            imgsData: [],
        };
    },
    watch: {
        value: {
            handler(val) {
            //   console.log(val,'valvalval')
                if (val) {
                    // 然后将数组转为对象数组
                    val.forEach((item) => {
                        this.fileList.push({ name: item.fileName, url: import.meta.env.VITE_APIIMG_URL + item.preUrl ,id:item.id});
                    });
                    this.fileList=this.arrSome(this.fileList,'id')
                    this.imgsData = val;
                } else {
                    this.fileList = [];
                    this.imgsData = [];
                }
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        // 是否显示提示
        showTip() {
            return this.isShowTip && (this.fileType || this.fileSize);
        },
    },
    methods: {
        // 上传前loading加载
        handleBeforeUpload(file) {
            console.log(this.fileList.length);
            if (this.fileList.length > this.limit) {
                this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
                return false;
            }

            let isImg = false;
            if (this.fileType.length) {
                let fileExtension = '';
                if (file.name.lastIndexOf('.') > -1) {
                    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
                }
                isImg = this.fileType.some((type) => {
                    if (file.type.indexOf(type) > -1) return true;
                    if (fileExtension && fileExtension.indexOf(type) > -1) return true;
                    return false;
                });
            } else {
                isImg = file.type.indexOf('image') > -1;
            }
            if (!isImg) {
                this.$message.error(`文件格式不正确, 请上传${this.fileType.join('/')}图片格式文件!`);
                return false;
            }
            if (this.fileSize) {
                const isLt = file.size / 1024 / 1024 < this.fileSize;
                if (!isLt) {
                    this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
                    return false;
                }
            }
            this.$modal.loading('正在上传图片，请稍候...');
            this.number++;
        },
        // 上传成功回调
        handleUploadSuccess(res, file) {
            if (res.code === 200) {
                this.fileList.push({ name: res.data.url[0].fileName, url: import.meta.env.VITE_APIIMG_URL + res.data.url[0].preUrl,id:res.data.url[0].id });
                this.imgsData.push(res.data.url[0]);
                this.$emit('input', this.imgsData);
                this.$modal.closeLoading();
                // this.uploadedSuccessfully();
            } else {
                // this.number--;
                this.$modal.closeLoading();
                this.$message.error(res.msg);
                this.$refs.imageUpload.handleRemove(file);
                // this.uploadedSuccessfully();
            }
        },
        // 删除图片
        handleDelete(file) {
            console.log(file)
            console.log(this.imgsData)
            this.imgsData.map((item, i) => {
                if (item.id == file.id) {
                    this.imgsData.splice(i, 1);
                }
            });
            this.$emit('input', this.imgsData);
        },
        // 上传失败
        handleUploadError() {
            this.$message.error('上传图片失败，请重试');
            this.$modal.closeLoading();
        },
        // 上传结束处理
        uploadedSuccessfully() {
            if (this.number > 0 && this.uploadList.length === this.number) {
                this.fileList = this.fileList.concat(this.uploadList);
                this.uploadList = [];
                this.number = 0;
                this.$emit('input', this.imgsData);
                this.$modal.closeLoading();
                console.log(this.fileList);
            }
        },
        // 预览
        handlePictureCardPreview(file) {
            // this.dialogImageUrl = file.url;
            // this.dialogVisible = true;
            this.$refs.imgView.show({url:file.url})
        },
        // 对象转成指定字符串分隔
        listToString(list, separator) {
            let strs = '';
            separator = separator || ',';
            for (let i in list) {
                if (list[i].url) {
                    strs += list[i].url.replace(this.baseUrl, '') + separator;
                }
            }
            return strs != '' ? strs.substr(0, strs.length - 1) : '';
        },
    },
};
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep(.el-upload--picture-card) {
    width: 120px !important;
    height: 120px !important;
}
::v-deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 120px !important;
    height: 120px !important;
}
::v-deep(.hide .el-upload--picture-card) {
    display: none;
}

</style>

