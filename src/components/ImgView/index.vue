<template>
    <div>
        <el-image-viewer
            class="imageViewr"
            v-if="dialogVisibleView"
            :url-list="[dialogImageUrl]"
            @close="closeViewer"
        />
    </div>
</template>
<script>
import { ElImageViewer } from 'element-plus';
export default {
    data() {
        return {
            dialogVisibleView: false,
            dialogImageUrl: '',
        };
    },
    components: {
        ElImageViewer,
    },
    methods: {
        show(option){
            this.dialogVisibleView=true;
            this.dialogImageUrl=option.url
        },
        // 关闭查看器
        closeViewer() {
            this.dialogVisibleView = false;
        },
    },
};
</script>
