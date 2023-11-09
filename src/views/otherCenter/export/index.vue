<template>
    <div class="myPage">
        <div class="myCenter45">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="操作人" prop="createBy" width="100"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" width="160" />
                <el-table-column label="操作内容" prop="content" />
                <el-table-column label="文件名称" prop="fileName" />
                <el-table-column label="状态" prop="status" width="90">
                    <template #default="scope">
                        <el-tag :type="exportStatus[scope.row.status].tag">{{
                            exportStatus[scope.row.status].txt
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="结果说明" prop="resultDescription" />
                <el-table-column label="失败原因" prop="failureReason" />
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-popconfirm :title="'确认删除此导出数据吗？'" @confirm="del(scope.row)">
                            <template #reference>
                                <el-link type="primary" class="fontSize12" :underline="false">删除</el-link>
                            </template>
                        </el-popconfirm>
                        <div class="el-divider el-divider-vertical" v-if="scope.row.status == 1"></div>
                        <el-link
                            type="primary"
                            class="fontSize12"
                            v-if="scope.row.status == 1"
                            :underline="false"
                            @click="edit(scope.row)"
                            >下载</el-link
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="myPageBot flex_s_c">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryParams.pageNum"
                :page-sizes="[50, 100, 200]"
                :page-size="queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryParams.total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mangePage, mangePageDel } from '@/api/otherCenter';
export default {
    nam:'exportBox',
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            lis: [],
        };
    },
    mounted() {
        this.get_lis();
    },
    methods: {
        get_lis() {
            this.loading = true;
            mangePage(this.queryParams).then((res) => {
                this.loading = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams.total = res.total;
                this.lis = res.rows;
            });
        },
        //搜索
        serch() {
            this.queryParams.pageNum = 1;
            this.get_lis();
        },
        //改变条数
        handleSizeChange(val) {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = val;
            this.get_lis();
        },
        //改变页数
        handleCurrentChange(val) {
            this.queryParams.pageNum = val;
            this.get_lis();
        },
        //删除
        del(row) {
            mangePageDel([row]).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.$message.success('删除成功');
                this.get_lis();
            });
        },
    },
};
</script>