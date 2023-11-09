<template>
    <div class="myPage">
        <div class="myPageTop45">
            <div class="topLine">
                <div class="maxTopWidth">
                    <div
                        :class="active == i ? 'itemType activeItemType' : 'itemType'"
                        v-for="(item, i) in business"
                        :key="i"
                        @click="changeTab(i)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <el-button type="primary" icon="Paperclip" class="mm10" @click="oneClick"
                    >一级类别管理</el-button
                >
                <div class="line"></div>
            </div>
        </div>
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-select
                    v-model="queryParams.companyId"
                    placeholder="所属公司"
                    filterable
                    class="selfSerchInput180 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in companyArr" :key="k" :label="item.deptName" :value="Number(k)">
                    </el-option>
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
                <el-button type="primary" plain icon="Plus" @click="newAddTest">新增二级类别</el-button>
            </el-form>
        </div>
        <div class="myCenter135">
            <el-table :data="lis" height="100%" border v-loading="loading">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="所属公司" prop="deptId">
                    <template #default="scope">
                        <span>{{ companyArr[scope.row.companyId].deptName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="二级类别编号" prop="code" />
                <el-table-column label="二级类别名称" prop="name" />
                <el-table-column label="状态" prop="status" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                            contractCateStatus[scope.row.status].txt
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="100">
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
            :title="is == 'add' ? '新增二级类别' : '编辑二级类别'"
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
                <el-form-item label="所属公司" prop="companyId">
                    <el-select v-model="form.companyId" placeholder="所属公司" filterable class="maxWidth" clearable>
                        <el-option v-for="(item, k) in companyArr" :key="k" :label="item.deptName" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级类别编号" prop="code">
                    <el-input clearable v-model="form.code" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="二级类别名称" prop="name">
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
    businessLis,
} from '@/api/system/dataCenter';
import { getCompany } from '@/api/system/dept';
export default {
    data() {
        return {
            business: [],
            companyArr: {},
            active: 0,
            queryParams: {
                companyId: '',
                code: '',
                name: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            lis: [],
            is: 'add',
            isDispatch: false,
            form: null,
            rules: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
                code: [{ required: true, message: '请输入类别编号', trigger: 'blur' }],
                name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
            },
        };
    },
    mounted() {
        this.getCompanyLis();
        this.getBusine();
    },
    methods: {
        // 事业部下一级分类
        getBusine() {
            businessLis({ businessUnitId: this.$route.query.businessUnitId }).then((res) => {
                this.business = res.data;
                this.getLis();
            });
        },
        //获取公司
        getCompanyLis() {
            getCompany().then((res) => {
                res.data.forEach((item) => {
                    this.companyArr[item.deptId] = item;
                });
                console.log(this.companyArr);
            });
        },
        //切换类别
        changeTab(i) {
            this.active = i;
            this.getLis();
        },
        //获取列表
        getLis() {
            this.loading = true;
            this.queryParams['pid'] = this.business[this.active].id;
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
                companyId: '',
                code: '',
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
                pid: this.$route.query.pid,
                businessUnitId: this.$route.query.businessUnitId,
                companyId: '',
                code: '',
                name: '',
                status: 0,
            };
            this.isDispatch = true;
        },
        //点击编辑
        edit(row) {
            this.is = 'edit';
            this.form = row;
            this.isDispatch = true;
        },
        //删除
        del(row) {
            contractTypeDel({ id: row.id, pid: this.$route.query.pid }).then((res) => {
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
        //去往一级类别
        oneClick() {
            this.$router.push({
                path: '/dataCenter/contractType',
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.topLine {
    width: 100%;
    float: left;
    position: relative;
    .line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #d9d9d9;
        z-index: 1;
    }
}
.maxTopWidth {
    float: left;
    max-width: calc(100% - 35px);
    margin-right: 5px;
    box-sizing: border-box;
    position: relative;
    z-index: 22;
    .activeItemType {
        color: #409eff !important;
        font-weight: 600;
        border-bottom: 1px solid #fff !important;
        box-sizing: border-box;
        z-index: 333;
        // border-color: red;
    }
    .itemType {
        float: left;
        padding: 9px 15px;
        box-sizing: border-box;
        font-size: 13px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        color: #999;
    }
    .itemType + .itemType {
        border-left: none;
    }
}
</style>