<template>
    <div
        :class="{ 'has-logo': showLogo }"
        :style="{
            backgroundColor:
            store.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground,
        }"
    >
    
        <logo v-if="showLogo" :collapse="isCollapse" />
        <div class="navLis" :style="{ height: isCollapse ? 'calc(100% - 50px)' : 'calc(100% - 60px)' }">
            
            <el-scrollbar :class="store.sideTheme" wrap-class="scrollbar-wrapper">
                <el-menu
                    :default-active="activeMenu"
                    :collapse="isCollapse"
                    :background-color="
                       store.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground
                    "
                    :text-color="store.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                    :unique-opened="true"
                    :active-text-color="store.theme"
                    :collapse-transition="false"
                    mode="vertical"
                >
                    <sidebar-item
                        v-for="(route, index) in store.sidebarRouters"
                        :key="route.path + index"
                        :item="route"
                        :base-path="route.path"
                    />
                </el-menu>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
// import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.module.scss';
import {dataStore} from '@/store/modules/app';
export default {
    setup() {
        // initialize the store
        const store = dataStore();
        return { store };
    },
    components: { SidebarItem,Logo },
    computed: {
        // ...mapState(['settings']),
        // ...mapGetters(['sidebarRouters', 'sidebar']),
        activeMenu() {
            var route = this.$route;
            var { meta, path } = route;
            // console.log(route,path)
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                // console.log(meta.activeMenu)
                return meta.activeMenu;
            }
            
            var active=path
            if (path == '/dataCenter/contractTwo') {
                active = '/dataCenter/contractType';
            }else if(path == '/deviceCenter/equipInfo'){
                active = '/deviceCenter/files';
            }else if(path == '/contractCenter/fields'){
                active = '/contractCenter/termpage';
            }
            // /administration/user
            return active;
        },
        showLogo() {
            return this.store.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.store.sidebar.opened;
        },
        isSideTheme(){
            return this.store.sideTheme;
        }
    },
    mounted(){
        // console.log(this.$route,'this.$routethis.$routethis.$route')
    }
};
</script>
<style>
.navLis {
    width: 100%;
    float: left;
}
</style>