<template>
    <div :class="classObj" class="app-wrapper" :style="{ '--current-color': store.theme }">
        <!-- <div v-if="store.device === 'mobile' && store.sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
        <sidebar class="sidebar-container" />
        <div class="main-container">
            <!-- <div :class="{'fixed-header':fixedHeader}"> -->
            <div class="flexTopSelf">
                <navbar />
                <!-- <tags-view v-if="needTagsView" /> -->
            </div>
            <app-main />
        </div>

        <div class="iconHide flex_c_c">
            <el-icon><ArrowLeftBold /></el-icon>
            <div class="show">
                <div class="lisHide">
                    <div class="showDown flex_c_c" @click="exportShow">
                        <el-icon size="24"><Paperclip /></el-icon>
                    </div>
                    <!-- <div class="showDown flex_c_c" @click="showDownBox">
                        <el-icon size="24"><Download /></el-icon>
                    </div> -->
                </div>
            </div>
        </div>
        <!-- 导出状态 -->
        <transition name="h1">
        <div class="exportBox flex_c_c" v-if="isShow">
            <div class="box">
                <div class="boxTitle flex_sb_c">
                    <div>导出状态</div>
                    <el-icon class="icon" size="22" @click="closeShow"><CloseBold /></el-icon>
                </div>
                <div class="boxContent">
                    <export-box></export-box>
                </div>
                
            </div>
        </div>
    </transition>
        <!-- 下载状态 -->
        <div class="downClass" :style="{'right':right}">
            <div class="top flex_sb_c">
                下载进度
                <el-icon class="cion" size="20" @click="closeDown"><Close /></el-icon>
            </div>
            <div class="downBox oys">
                <div class="boxItem" v-for="(item, i) in 10">
                    <div class="itemVal flex_sb_c">
                        <div class="itemName">dsadsadsdfewfewfewfewfewfewfewf.pdf</div>
                        <el-icon class="iconDown"><Download /></el-icon>
                    </div>
                    <div class="rowline">
                        <el-progress :percentage="50" :stroke-width="5" striped-flow striped />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { dataStore } from '@/store/modules/app';
// import { AppMain, Navbar, Sidebar, TagsView } from './components';
import { Sidebar, Navbar, AppMain } from './components';
import exportBox from '@/views/otherCenter/export/index.vue'
// import RightPanel from '@/components/RightPanel';
export default {
    setup() {
        // initialize the store
        const store = dataStore();
        return { store };
    },
    name: 'Layout',
    components: {
        Sidebar,
        Navbar,
        AppMain,
        exportBox
    },
    computed: {
        classObj() {
            return {
                hideSidebar: !this.store.sidebar.opened,
                openSidebar: this.store.sidebar.opened,
                withoutAnimation: this.store.sidebar.withoutAnimation,
                mobile: this.store.device === 'mobile',
            };
        },
        variables() {
            return variables;
        },
    },
    data() {
        return {
            right:'-400px',
            isShow:false,
        };
    },
    methods: {
        handleClickOutside() {
            console.log('2222222222222222222222222222');
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
        },
        showDownBox(){
            this.right=0
        },
        closeDown(){
            this.right='-400px'
        },
        exportShow(){
            this.isShow=true
        },
        closeShow(){
            this.isShow=false
        }
    },
};
</script>
<style scoped lang="scss">
.iconHide {
    position: fixed;
    right: 0;
    bottom: 30px;
    height: 50px;
    width: 15px;
    float: left;
    z-index: 6666;
    background: #fff;
    box-shadow: 0 0 9px 3px #ddd;
    border-radius: 5px 0 0 5px;

    .show {
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: pointer;
        &:hover {
            .lisHide {
                right: 0;
            }
        }
        .lisHide {
            position: fixed;
            right: -100px;
            bottom: 30px;
            width: 50px;
            float: left;
            z-index: 7777;
            background: #fff;
            transition: 0.3s;
            box-shadow: 0 0 9px 3px #ddd;
            border-radius: 5px;
            overflow: hidden;
            .showDown {
                width: 50px;
                height: 50px;
                float: left;
                cursor: pointer;
                transition: 0.3s;
                &:hover {
                    background: #409eff;
                }
            }
        }
    }
}

.downClass {
    position: fixed;
    right: -400px;
    bottom: 30px;
    width: 260px;
    height: 300px;
    z-index: 8888;
    background: #fff;
    box-shadow: 0 0 9px 3px #ddd;
    transition: 0.3s;
    .top {
        width: 100%;
        float: left;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
        padding: 0 10px;
        box-sizing: border-box;
        height: 35px;
        background: #c8b3b3;
        .cion {
            cursor: pointer;
        }
    }
    .downBox {
        width: 100%;
        height: calc(100% - 35px);
        float: left;
        &::-webkit-scrollbar {
            display: none;
        }
        .boxItem + .boxItem {
            margin-top: 15px;
        }
        .boxItem {
            width: 100%;
            float: left;
            padding: 0 10px;
            box-sizing: border-box;

            .itemVal {
                width: 100%;
                float: left;
                .itemName {
                    width: calc(100% - 30px);
                    float: left;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .iconDown {
                    cursor: pointer;
                }
            }
            .rowline {
                width: 100%;
                float: left;
            }
        }
    }
}
.exportBox{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    .box{
        width: 80%;
        height: 80%;
        background: #fff;
        border-radius: 7px;
        overflow: hidden;
        .boxTitle{
            width: 100%;
            height: 40px;
            float: left;
            padding: 0 15px;
            box-sizing: border-box;
            font-weight: 600;
            font-size: 18px;
            .icon{
                cursor: pointer;
            }
        }
        .boxContent{
            width: 100%;
            height: calc(100% - 40px);
            float: left;
        }
        // background: #fff;
    }
}

/* 1.过渡动画 */
@keyframes axisX {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 2. 过渡类名 */
/* 开始 */
.h1-enter-active {
  animation: axisX 0.5s;
}
/* 结束 */
.h1-leave-active {
  animation: axisX 0.2s reverse;
}

</style>