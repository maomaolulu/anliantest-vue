/// <reference types="vite/client" />
declare module "vue-qr";
declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const vueComponent: DefineComponent<{}, {}, any>;

    export default vueComponent;
}