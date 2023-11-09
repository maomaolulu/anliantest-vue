<template>
    <div
        :class="[collapse ? 'sidebar-logo-container' : 'sidebar-logo-container2']"
        :style="{
            backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground,
        }"
    >
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo" />
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link-long" to="/">
                <img v-if="logoLong" :src="logoLong" class="sidebar-logo" />
            </router-link>
        </transition>
    </div>
</template>

<script>
const logoImg=new URL('@/assets/logo/logo.png', import.meta.url).href
const logoLongImg=new URL('@/assets/logo/logoLong.png', import.meta.url).href
import variables from '@/assets/styles/variables.module.scss';
import {dataStore} from '@/store/modules/app';
export default {
    setup(props) {
        // initialize the store
        const store = dataStore();
        // const props = defineProps(['collapse']);

        // console.log(props.collapse,'collapsecollapsecollapse');
        return { store };
    },

    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        variables() {
            return variables;
        },
        sideTheme() {
            return this.store.sideTheme;
        },
    },
    data() {
        return {
            title: '信息化运营平台',
            logo: logoImg,
            logoLong: logoLongImg,
        };
    },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}
.sidebar-logo-container2 {
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .sidebar-logo-link-long {
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .sidebar-logo {
            width: 80%;
            float: left;
        }
        .sidebar-title {
            width: 100%;
            text-align: center;
            float: left;
            color: #fff;
            font-size: 14px;
            line-height: 23px;
        }
    }
}
.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;
    .sidebar-logo-link {
        height: 100%;
        width: 100%;

        .sidebar-logo {
            width: 35px;
            height: 35px;
            vertical-align: middle;
        }

        .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }
}
</style>
