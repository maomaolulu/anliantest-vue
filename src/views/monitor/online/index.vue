<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-input
                    v-model="queryParams.ipaddr"
                    placeholder="请输入登录地址"
                    clearable
                    class="selfSerchInput marginRight10"
                    @keyup.enter.native="handleQuery"
                />
                <el-input
                    v-model="queryParams.userName"
                    placeholder="请输入用户名称"
                    clearable
                    class="selfSerchInput marginRight10"
                    @keyup.enter.native="handleQuery"
                />
                <el-button type="primary" icon="Search" class="mm10" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table
                v-loading="loading"
                height="100%"
                :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
                style="width: 100%"
            >
                <el-table-column label="序号" type="index" align="center" width="60">
                    <template #default="scope">
                        <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
                <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true" />
                <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
                <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.loginTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="text"
                            icon="Delete"
                            @click="handleForceLogout(scope.row)"
                            v-hasPermi="['monitor:online:forceLogout']"
                            >强退</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="myPageBot flex_s_c">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
                :page-sizes="[10, 50, 100, 200]"
                :page-size="queryParams.pageSize"
                :current-page="queryParams.pageNum"
                @size-change="handleSizeChangeLis"
                @current-change="handleCurrentChangeLis"
            />
        </div>
    </div>
</template>

<script>
import { list, forceLogout } from '@/api/monitor/online';

export default {
    name: 'Online',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            pageNum: 1,
            pageSize: 10,
            // 查询参数
            queryParams: {
                ipaddr: undefined,
                userName: undefined,
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询登录日志列表 */
        getList() {
            this.loading = true;
            list(this.queryParams).then((response) => {
                this.list = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //改变条数
        handleSizeChangeLis(val) {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = val;
            console.log(this.queryParams);
            this.getList();
        },
        //改变页数
        handleCurrentChangeLis(val) {
            this.queryParams.pageNum = val;
            this.getList();
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 强退按钮操作 */
        handleForceLogout(row) {
            this.$confirm('是否确认强退名称为"' + row.userName + '"的用户？')
                .then(function () {
                    return forceLogout(row.tokenId);
                })
                .then(() => {
                    this.getList();
                    this.$message.success('强退成功');
                })
                .catch(() => {});
        },
    },
};
</script>

