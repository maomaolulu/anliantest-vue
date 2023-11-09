<template>
    <div class="onePage">
        <el-table
            v-loading="loading"
            :data="lis"
            row-key="id"
            height="100%"
            border
            lazy
            :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="regionName" label="地址" :show-overflow-tooltip="true">
                <template #header>
                    <div class="flex_s_c">
                        地址
                        <el-button v-hasPermi="['showAdressBtn']" style="margin-left: 15px;" type="primary" icon="Refresh" size="small" @click="upDate">更新</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="regionCode" label="邮编"></el-table-column>
            <el-table-column prop="center" label="经纬度"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import { addressLis,synchronizationData } from '@/api/system/system';
export default {
    data() {
        return {
            lis: [],
            loading: true,
        };
    },
    mounted() {
        this.getLis();
    },
    methods: {
        getLis() {
            this.loading = true;
            addressLis().then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                res.data.forEach((element) => {
                    element['hasChildren'] = true;
                    element['children'] = [];
                });
                this.loading = false;
                this.lis = res.data;
                console.log(this.lis);
            });
        },
        load(row, treeNode, resolve) {
            addressLis({ regionParentId: row.id }).then((res) => {
                if (res.code != 200) {
                    resolve();
                    return this.$message.error(res.msg);
                }
                if (row.regionLevel < 3) {
                    res.data.forEach((element) => {
                        element['hasChildren'] = true;
                        element['children'] = [];
                    });
                }
                resolve(res.data);
            });
        },
        upDate(){
            this.loading = true;
            synchronizationData().then(res=>{
                if (res.code != 200) {
                    resolve();
                    return this.$message.error(res.msg);
                }
                this.getLis();
            })
        }
    },
};
</script>
<style lang="scss" scoped>
::v-deep(.el-table__header th) {
    background: #f1f1f1 !important;
}
</style>