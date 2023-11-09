<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-select
                    v-model="queryParams.businessUnitId"
                    placeholder="所属事业部"
                    filterable
                    class="selfSerchInput180 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in business" :key="k" :label="item" :value="Number(k)"> </el-option>
                </el-select>
                <el-input
                    v-model="queryParams.code"
                    class="selfSerchInput180 mm10"
                    placeholder="类别编号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.name"
                    class="selfSerchInput180 mm10"
                    placeholder="类别名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select v-model="queryParams.status" placeholder="状态" class="selfSerchInput180 mm10" clearable>
                    <el-option v-for="(item, k) in contractCateStatus" :key="k" :label="item.txt" :value="Number(k)">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="newAddTest">新增一级类别</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="所属事业部" prop="businessUnitId">
                    <template #default="scope">
                        <span>{{ business[scope.row.businessUnitId] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="一级类别编号" prop="code" />
                <el-table-column label="一级类别名称" prop="name" />
                <el-table-column label="状态" prop="status" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                            contractCateStatus[scope.row.status].txt
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template #default="scope">
                        <el-link type="primary" class="fontSize12" :underline="false" @click="edit(scope.row)"
                            >编辑</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-popconfirm
                            :title="'确认删除类别编号为(' + scope.row.code + ')的数据吗？'"
                            @confirm="del(scope.row)"
                        >
                            <template #reference>
                                <el-link type="primary" class="fontSize12" :underline="false">删除</el-link>
                            </template>
                        </el-popconfirm>
                        <div class="el-divider el-divider-vertical"></div>
                        <el-link type="primary" class="fontSize12" :underline="false" @click="twoClick(scope.row)"
                            >二级类别</el-link
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
        <el-dialog
            :title="is == 'add' ? '新增一级类别' : '编辑一级类别'"
            v-model="isDispatch"
            width="40%"
            :close-on-click-modal="false"
        >
            <el-form
                :model="form"
                :rules="rules"
                v-if="form != null"
                ref="form"
                label-width="110px"
                class="demo-ruleForm"
            >
                <el-form-item label="所属事业部" prop="businessUnitId">
                    <el-select
                        v-model="form.businessUnitId"
                        placeholder="所属事业部"
                        filterable
                        class="maxWidth"
                        clearable
                    >
                        <el-option v-for="(item, k) in business" :key="k" :label="item" :value="Number(k)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级类别编号" prop="code">
                    <el-input clearable v-model="form.code" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="一级类别名称" prop="name">
                    <el-input clearable v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="Number(k)" v-for="(item, k) in contractCateStatus" :key="k">{{
                            item.txt
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isDispatch = false">取 消</el-button>
                    <el-button type="primary" @click="sumbitDispatch">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {
    contractTypeLis,
    contractTypeSave,
    contractTypeUpdate,
    contractTypeDel,
    businessUnitList,
} from '@/api/system/dataCenter';
export default {
    data() {
        return {
            business: {},
            queryParams: {
                businessUnitId: '',
                code: '',
                pid: 0,
                name: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            lis: [{ value: 1, status: 1 }],
            is: 'add',
            isDispatch: false,
            form: null,
            rules: {
                businessUnitId: [{ required: true, message: '请选择所属事业部', trigger: 'blur' }],
                code: [{ required: true, message: '请输入类别编号', trigger: 'blur' }],
                name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
            },
        };
    },
    mounted() {
        this.getBusiness();
        this.getLis();
    },
    methods: {
        //获取事业部
        getBusiness() {
            businessUnitList().then((res) => {
                res.data.forEach((item) => {
                    this.business[item.deptId] = item.deptName;
                });
            });
        },
        //获取列表
        getLis() {
            this.loading = true;
            contractTypeLis(this.queryParams).then((res) => {
                this.loading = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams.total = res.total;
                this.lis = res.rows;
            });
        },
        //重置
        reset() {
            this.queryParams = {
                businessUnitId: '',
                code: '',
                pid: 0,
                name: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis();
        },
        //搜索
        serch() {
            this.queryParams.pageNum = 1;
            this.getLis();
        },
        //改变条数
        handleSizeChange(val) {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = val;
            this.getLis();
        },
        //改变页数
        handleCurrentChange(val) {
            this.queryParams.pageNum = val;
            this.getLis();
        },
        //点击新增
        newAddTest() {
            this.is = 'add';
            this.form = {
                pid: 0,
                businessUnitId: '',
                code: '',
                name: '',
                status: 0,
            };
            this.isDispatch = true;
        },
        //点击编辑
        edit(row) {
            console.log(row);
            this.is = 'edit';
            this.form = row;
            this.isDispatch = true;
        },
        //删除
        del(row) {
            contractTypeDel({ id: row.id, pid: 0 }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.$message.success('删除成功');
                this.getLis();
            });
        },
        //提交
        sumbitDispatch() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 'add') {
                        var res = await contractTypeSave(this.form);
                    } else {
                        var res = await contractTypeUpdate(this.form);
                    }
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isDispatch = false;
                    this.getLis();
                }
            });
        },
        //点击二级类别
        twoClick(row) {
            this.$router.push({
                path: '/dataCenter/contractTwo',
                query: {
                    pid: row.id,
                    businessUnitId: row.businessUnitId,
                },
            });
        },
    },
};
</script>