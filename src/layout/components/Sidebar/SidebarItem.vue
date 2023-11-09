<template>
    <div v-if="!item.hidden">
        <template
            v-if="
                hasOneShowingChild(item.children, item) &&
                (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
                !item.alwaysShow
            "
        >
            <app-link
                v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
                class="selftLink"
            >
                <el-menu-item
       
                    :index="resolvePath(onlyOneChild.path)"
                    :class="!store.sidebar.opened?'MenuItem':'' "
                >
                    <!-- <SvgIcon :name="item.meta.icon" :color="activeMenu == item.path ? store.theme : '#fff'" />
                    <span>{{ item.meta.title }}</span> -->
                    <template v-if="store.sidebar.opened">
   
                        <SvgIcon :name="item.meta.icon" :color="activeMenu == item.path ? store.theme : '#fff'" />
                        <span v-if="item.meta" :title="item.meta.title">{{ item.meta.title }}</span>
                    </template>
                    <template v-else>
                        <template v-if="onlyOneChild.meta.title == '首页'">
                            <div class="min min2">
                                <SvgIcon
                                    :name="item.meta.icon"
                                    :color="activeMenu == item.path ? store.theme : '#fff'"
                                />
                            </div>
                        </template>
                        <template v-else>
                            <SvgIcon :name="item.meta.icon" :color="activeMenu == item.path ? store.theme : '#fff'" />
                            <span v-if="item.meta" :title="item.meta.title">{{ item.meta.title }}</span>
                        </template>
                    </template>
                </el-menu-item>
            </app-link>
        </template>
        <el-sub-menu v-else ref="subMenu" :class="!store.sidebar.opened?'MenuItem':''" :index="resolvePath(item.path)" teleported>
            <template #title>
                <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
         -->
                <template v-if="store.sidebar.opened">
                    <SvgIcon :name="item.meta.icon" :color="activeMenu == item.path ? store.theme : '#fff'" />
                    <span v-if="item.meta" :title="item.meta.title">{{ item.meta.title }}</span>
                </template>
                <template v-else>
                    <div class="min">
                        <SvgIcon :name="item.meta.icon" :color="activeMenu == item.path ? store.theme : '#fff'" />
                    </div>
                </template>
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>
  
<script>
import path from 'path-browserify'
import { isExternal } from '@/utils/validate';
//   import Item from './Item'
import AppLink from './Link';
import FixiOSBug from './FixiOSBug';
import {dataStore} from '@/store/modules/app';
export default {
    setup() {
        // initialize the store
        const store = dataStore();
        return { store };
    },
    name: 'SidebarItem',
    components: { AppLink },
    computed: {
        activeMenu() {
            var route = this.$route;
            var { meta } = route;
            var routerPath=route.path;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            if (routerPath == '/dataCenter/contractTwo') {
                routerPath = '/dataCenter/contractType';
            }
            return routerPath;
        },
    },
    // mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true,
        },
        isNest: {
            type: Boolean,
            default: false,
        },
        basePath: {
            type: String,
            default: '',
        },
    },
    data() {
        this.onlyOneChild = null;
        return {};
    },
    mounted() {},
    methods: {
        hasOneShowingChild(children = [], parent) {
            if (!children) {
                children = [];
            }
            const showingChildren = children.filter((item) => {
                if (item.hidden) {
                    return false;
                } else {
                    // Temp set(will be used if only has one showing child)

                    this.onlyOneChild = item;
                    return true;
                }
            });

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true;
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
                return true;
            }

            return false;
        },
        resolvePath(routePath, routeQuery) {

            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(this.basePath)) {
                return this.basePath;
            }
            if (routeQuery) {
                let query = JSON.parse(routeQuery);
                return { path: path.resolve(this.basePath, routePath), query: query };
            }
            return path.resolve(this.basePath, routePath);
        },
    },
};
</script>
<style lang="scss" scoped>
.min {
    position: absolute;
    left: 0px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
}
.min2 {
    left: 3px !important;
}
::v-deep(.MenuItem) {
    .el-sub-menu__icon-arrow {
        right: 0 !important;
    }
}
</style>
  