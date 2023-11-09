<template>
    <section class="app-main">
        <!-- <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view v-if="!$route.meta.link" :key="key" />
            </keep-alive>
        </transition> -->
        <!-- <iframe-toggle /> -->
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <!-- <keep-alive :include="cachedViews"> -->
                    <component :is="Component" />
                <!-- </keep-alive> -->
            </transition>
        </router-view>
    </section>
</template>

<script>
// import iframeToggle from "./IframeToggle/index"

export default {
    name: 'AppMain',
    components: {},
    computed: {
        cachedViews() {
            // return this.$store.state.tagsView.cachedViews
            return '';
        },
        key() {
            return this.$route.path;
        },
    },
    created(){
    }
};
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    height: calc(100% - 50px) !important;
    width: 100%;
    float: left;
    background: #eee;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 6px;
    }
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 3px;
}
</style>
