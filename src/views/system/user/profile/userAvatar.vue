<template>
    <div >
        <div class="user-info-head" @click="editCropper()">
            <img v-bind:src="options.img"  class="img-circle img-lg" />
            <span class="headTitle">上传头像</span>
        </div>
        <el-dialog
            :title="title"
            v-model="open"
            width="800px"
            append-to-body
            @opened="modalOpened"
            @close="closeDialog"
        >
            <el-row>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <vue-cropper
                        ref="cropper"
                        :img="options.img"
                        :info="true"
                        :autoCrop="options.autoCrop"
                        :autoCropWidth="options.autoCropWidth"
                        :autoCropHeight="options.autoCropHeight"
                        :fixedBox="options.fixedBox"
                        :outputType="options.outputType"
                        @realTime="realTime"
                        v-if="visible"
                    />
                </el-col>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <div class="avatar-upload-preview">
                        <img :src="previews.url" :style="previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :lg="2" :sm="3" :xs="3">
                    <el-upload
                        action="#"
                        :http-request="requestUpload"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                    >
                        <el-button size="small" icon="Upload">
                            选择
           
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
                    <el-button icon="Plus" size="small" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                    <el-button icon="Minus" size="small" @click="changeScale(-1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                    <el-button icon="RefreshLeft" size="small" @click="rotateLeft()"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                    <el-button icon="RefreshRight" size="small" @click="rotateRight()"></el-button>
                </el-col>
                <el-col :lg="{ span: 2, offset: 6 }" :sm="2" :xs="2">
                    <el-button type="primary"  @click="uploadImg()">提 交</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { dataStore } from '@/store/modules/app';
import VueCropper from "vue-cropper/src/vue-cropper.vue"
import { uploadAvatar } from '@/api/system/user';
import { debounce } from '@/utils';

export default {
    setup() {
        // initialize the store
        const store = dataStore();
        console.log(store.avatar)
        return { store };
    },
    components: { VueCropper },
    props: {
        user: {
            type: Object,
        },
    },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            // 是否显示cropper
            visible: false,
            // 弹出层标题
            title: '修改头像',
            options: {
                img: '', //裁剪图片的地址
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 200, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                outputType: 'png', // 默认生成截图为PNG格式
            },
            previews: {},
            resizeHandler: null,
        };
    },
    mounted(){
      this.options.img=this.store.avatar
    },
    methods: {
        // 编辑头像
        editCropper() {
            this.open = true;
        },
        // 打开弹出层结束时的回调
        modalOpened() {
            this.visible = true;
            if (!this.resizeHandler) {
                this.resizeHandler = debounce(() => {
                    this.refresh();
                }, 100);
            }
            // window.addEventListener('resize', this.resizeHandler);
        },
        // 刷新组件
        refresh() {
            this.$refs.cropper.refresh();
        },
        // 覆盖默认的上传行为
        requestUpload() {},
        // 向左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 向右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },
        // 图片缩放
        changeScale(num) {
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        // 上传预处理
        beforeUpload(file) {
            if (file.type.indexOf('image/') == -1) {
                this.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。');
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.options.img = reader.result;
                };
            }
        },
        // 上传图片
        uploadImg() {
            this.$refs.cropper.getCropBlob((data) => {
              console.log(data)
                let formData = new FormData();
                formData.append('avatarfile', data);
                console.log(formData.get('avatarfile'))
                uploadAvatar(formData).then((response) => {
                    this.open = false;
                    this.options.img = response.imgUrl;
                    this.store.avatar=this.options.img;
                    setTimeout(() => {
                        console.log(this.store.avatar)
                    }, 1000);
                    this.$message.success('修改成功');
                    this.visible = false;
                });
            });
        },
        // 实时预览
        realTime(data) {
            this.previews = data;
        },
        // 关闭窗口
        closeDialog() {
            this.options.img = this.store .avatar
            this.visible = false;
            window.removeEventListener('resize', this.resizeHandler);
        },
    },
};
</script>
<style scoped lang="scss">
.user-info-head {
    position: relative;
    display: inline-block;
    height: 120px;
    margin: 10px 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    .headTitle{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      font-size: 13px;
      color: #dedede;
      transition: 0.5s;
    }
}

.user-info-head:hover:after {
    content: '+';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 120px;
    border-radius: 50%;
    
}
.user-info-head:hover{
  .headTitle{
    transition: 1s;
      display: none;
    }
}
</style>
