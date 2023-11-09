import {dataStore} from '@/store/modules/app';
export default {
    setup() {
        // initialize the store
        const store = dataStore();
        return { store };
    },
    computed: {
      device() {
        return this.store.device
      }
    },
    mounted() {
      // In order to fix the click on menu on the ios device will trigger the mouseleave bug
      this.fixBugIniOS()
    },
    methods: {
      fixBugIniOS() {
        const $subMenu = this.$refs.subMenu
        if ($subMenu) {
          const handleMouseleave = $subMenu.handleMouseleave
          $subMenu.handleMouseleave = (e) => {
            if (this.device === 'mobile') {
              return
            }
            handleMouseleave(e)
          }
        }
      }
    }
  }
  