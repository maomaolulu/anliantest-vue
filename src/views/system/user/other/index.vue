<template>
    <div class="myPage paddPage oys">
        <div class="pageTitle"># 运行环境 （推荐）</div>
        <div class="content">
            <a class="aclass" href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">
                <img class="img" src="@/assets/imgs/chorm.png" alt="" /> 前往下载
            </a>
        </div>
        <div class="content">由于系统版本迭代更新，推荐使用谷歌浏览器（更加兼容其他系统）。</div>
        <div class="pageTitle"># 移动端</div>
        <div class="content">
            <div class="qrItem">
                <div class="qrBoxImg">
                    <img src="http://60.190.21.178:98/proxyJava/file/file/last_app_qr?type=2" alt="" />
                </div>
                <div class="qeHite">云管家（Android）</div>
                <div class="qeHite qeHiteColor">（浏览器扫码）</div>
            </div>
            <div class="qrItem">
                <div class="qrBox">
                    <vue-qr
                        text="https://coa.anliantest.com"
                        size="160"
                        margin="15"
                        colorDark="#444"
                        :logoSrc="logoSrc"
                        logoBackgroundColor="red"
                    >
                    </vue-qr>
                </div>
                <div class="qeHite">云管家小程序</div>
                <div class="qeHite qeHiteColor">（微信扫码进入）</div>
            </div>
            <div class="qrItem">
                <div class="qrBox">
                    <vue-qr
                        text="https://xcx.uv8000.org"
                        size="160"
                        margin="15"
                        colorDark="#444"
                        :logoSrc="uvlogoSrc"
                        logoBackgroundColor="red"
                    >
                    </vue-qr>
                </div>
                <div class="qeHite">UV小程序</div>
                <div class="qeHite qeHiteColor">（微信扫码进入）</div>
            </div>
        </div>
        <div class="pageTitle"># 电脑端</div>
        <div class="content">
            <div class="itemBox flex_s_c" v-for="(item,index) in lis" :key="index" @click="openItem(index)">
                <img class="pcLogo" :src="item.logo" alt="" />
                <div class="row">
                    <div class="rowTitle">{{item.name}}</div>
                    <div class="rowContent">{{item.desp}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script >
const logoSrc = new URL('@/assets/imgs/coa_logo.png', import.meta.url).href;
const uvlogoSrc = new URL('@/assets/imgs/uv_logo.png', import.meta.url).href;
import VueQr from 'vue-qr/src/packages/vue-qr.vue';
export default {
    data() {
        return {
            qrCode123: 'sadsadsadsa',
            logoSrc: logoSrc,
            uvlogoSrc: uvlogoSrc,
            lis: [
                {
                    name: '云管家',
                    desp: '安联云管家后台',
                    logo: new URL('@/assets/imgs/coa_logo.png', import.meta.url).href,
                    link: 'http://60.190.21.178:98/dashboard/weclome',
                },
                {
                    name: '检测信息化平台',
                    desp: '安联检测业务后台',
                    logo: new URL('@/assets/imgs/testing.png', import.meta.url).href,
                    link: 'http://47.111.249.220:81',
                },
                {
                    name: '贴身管家',
                    desp: '优维验厂服务管理后台',
                    logo: new URL('@/assets/imgs/uv_logo.png', import.meta.url).href,
                    link:'https://xcx.uv8000.org/login'
                },
                {
                    name: '考勤智慧平台',
                    desp: '优维考勤管理后台',
                    logo: new URL('@/assets/imgs/uv_logo.png', import.meta.url).href,
                    link:'http://60.190.21.178:81/'
                },
                {
                    name: '云盘',
                    desp: '安联人自己的网盘',
                    logo: new URL('@/assets/imgs/Cloud.png', import.meta.url).href,
                    link:'http://60.190.21.178:99/'
                },
                {
                    name: '安联检评',
                    desp: '检评业务信息化系统',
                    logo: new URL('@/assets/imgs/review.png', import.meta.url).href,
                    link:'http://47.111.249.220:84/'
                },
                {
                    name: '安联评价',
                    desp: '评价业务信息化系统',
                    logo: new URL('@/assets/imgs/evaluate.png', import.meta.url).href,
                    link:'http://47.111.249.220:82/'
                },
                {
                    name: '安联环境',
                    desp: '环境公卫业务信息化系统',
                    logo: new URL('@/assets/imgs/environment.png', import.meta.url).href,
                    link:'http://47.114.182.181:60/'
                },
                {
                    name: 'LIMS',
                    desp: '实验室信息化管理系统',
                    logo: new URL('@/assets/imgs/laboratory.png', import.meta.url).href,
                    link:'http://47.111.249.220:85/'
                },
                {
                    name: '企业邮箱',
                    desp: '腾讯企业邮箱',
                    logo: new URL('@/assets/imgs/youxiang.png', import.meta.url).href,
                    link:'https://work.weixin.qq.com/mail/'
                },
 
            ],
        };
    },
    components: {
        VueQr,
    },
    methods:{
        openItem(idx){
            window.open(this.lis[idx].link)
        }
    }
};
</script>
<style scoped lang="scss">
.paddPage {
    padding: 20px 40px;
    box-sizing: border-box;
}
.pageTitle {
    width: 100%;
    float: left;
    font-weight: 600;
    font-size: 18px;
    font-family: fantasy;
    margin-bottom: 20px;
}
.content {
    font-size: 14px;
    width: 100%;
    float: left;
    padding-left: 20px;
    box-sizing: border-box;
    letter-spacing: 1px;
    .aclass {
        color: #409eff;
        &:hover {
            text-decoration: underline;
        }
    }
    .img {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 5px;
    }
}
.content + .content {
    margin-top: 5px;
}
.content + .pageTitle {
    margin-top: 20px;
}
.qrItem {
    float: left;
    width: 160px;
    .qrBox {
        width: 160px;
        height: 160px;
        box-shadow: 0 0 9px 1px #ddd;
        float: left;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    .qrBoxImg {
        width: 160px;
        height: 160px;
        box-shadow: 0 0 9px 1px #ddd;
        padding: 12px;
        box-sizing: border-box;
        float: left;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .qeHite {
        width: 100%;
        float: left;
        text-align: center;
    }
    .qeHiteColor {
        color: #409eff;
        font-size: 13px;
    }
}
.qrItem + .qrItem {
    margin-left: 40px;
}
.itemBox {
    width: 350px;
    float: left;
    padding: 25px 20px;
    box-sizing: border-box;
    box-shadow: 0 0 9px 1px #ddd;
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    margin-right: 50px;
    margin-bottom: 30px;
    &:hover {
        box-shadow: 0 0 9px 1px #409eff;
    }
    .pcLogo {
        width: 60px;
        float: left;
        margin-right: 30px;
    }
    .row {
        .rowTitle {
            width: 100%;
            font-weight: 600;
            font-size: 18px;
            color: #4e4e4e;
            float: left;
        }
        .rowContent {
            width: 100%;
            font-weight: 600;
            font-size: 18px;
            color: #afafaf;
            font-family: fantasy;
            margin-top: 10px;
            float: left;
        }
    }
}
</style>