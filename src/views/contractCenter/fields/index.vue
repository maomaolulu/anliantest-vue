<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="serchInfo" ref="queryForm2" :inline="true">
                <el-select v-model="serchInfo.value" placeholder="所属公司" class="selfSerchInput mm5" clearable>
                    <el-option v-for="(item, k) in options" :key="k" :label="item.deptName" :value="k"> </el-option>
                </el-select>
                <el-select v-model="serchInfo.value" placeholder="条款类型" class="selfSerchInput120 mm5" clearable>
                    <el-option v-for="(item, k) in options" :key="k" :label="item.deptName" :value="k"> </el-option>
                </el-select>
                <el-input v-model="serchInfo.value" class="selfSerchInput mm5" clearable placeholder="内容关键词" />
                <el-input v-model="serchInfo.value" class="selfSerchInput mm5" clearable placeholder="描述" />
                <el-select v-model="serchInfo.value" placeholder="关联字段" class="selfSerchInput120 mm5" clearable>
                    <el-option v-for="(item, k) in options" :key="k" :label="item.deptName" :value="k"> </el-option>
                </el-select>
                <el-select v-model="serchInfo.value" placeholder="状态" class="selfSerchInput120 mm5" clearable>
                    <el-option v-for="(item, k) in options" :key="k" :label="item.deptName" :value="k"> </el-option>
                </el-select>

                <el-button type="primary" class="mm5" @click="serch2">搜索</el-button>
                <el-button type="info" class="mm5" @click="reset2">重置</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                    <el-table-column type="index" width="60" label="序号" align="center" />
                    <el-table-column label="所属公司" prop="equipCode" width="100" />
                    <el-table-column label="条款类型" prop="equipCode" width="100" />
                    <el-table-column label="条款内容" prop="goodsName" />
                    <el-table-column label="描述" prop="goodsName" />
                    <el-table-column label="关联字段" prop="status">
                        <template #default="scope">
                            <span>{{ equipStatuslend[scope.row.status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后操作人" prop="endTime" width="100" />
                    <el-table-column label="最后操作时间" prop="companyName" width="150"></el-table-column>
                    <el-table-column label="状态" prop="status" width="100">
                        <template #default="scope">
                            <span>{{ equipStatuslend[scope.row.status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                        <template #default="scope">
                            <el-link
                                type="primary"
                                class="fontSize12"
                                :underline="false"
                                @click="$message.success('待开发')"
                                >详情</el-link
                            >
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        <div class="myPageBot flex_s_c">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="serchInfo.pageIndex"
                :page-sizes="[50, 100, 200]"
                :page-size="serchInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="serchInfo.total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            serchInfo: {pageIndex: 1, pageSize: 50, total: 0},
            loading: false,
            lis: [],
        };
    },
    methods: {
        //列表
        getLis() {},
        //搜索
        serch() {
            this.serchInfo.pageIndex = 1;
            this.getLis();
        },
        //重置
        reset() {
            this.serchInfo = {
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis();
        },
        //改变条数
        handleSizeChange(val) {
            this.serchInfo.pageIndex = 1;
            this.serchInfo.pageSize = val;
            this.getLis();
        },
        //改变页数
        handleCurrentChange(val) {
            this.serchInfo.pageIndex = val;
            this.getLis();
        },
    },
};
</script>