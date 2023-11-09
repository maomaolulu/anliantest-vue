<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                <el-input
                    v-model="queryParams.noticeTitle"
                    placeholder="公告标题"
                    class="selfSerchInput marginRight10"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入操作人员"
                    class="selfSerchInput marginRight10"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-select
                    v-model="queryParams.noticeType"
                    placeholder="公告类型"
                    clearable
                    class="selfSerchInput marginRight10"
                >
                    <el-option v-for="(dict, key) in noticeTypes" :key="key" :label="dict" :value="key" />
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:notice:add']"
                    >新增</el-button
                >
                <el-button
                    type="success"
                    plain
                    icon="Edit"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['system:notice:edit']"
                    >修改</el-button
                >
                <el-button
                    type="danger"
                    plain
                    icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['system:notice:remove']"
                    >删除</el-button
                >
            </el-form>
        </div>

        <div class="myCenter90">
            <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" prop="noticeId" width="100" />
                <el-table-column label="公告标题" align="center" prop="noticeTitle" :show-overflow-tooltip="true" />
                <el-table-column label="公告类型" align="center" prop="noticeType" width="100">
                    <template #default="scope">
                        <el-tag type="ssuccess">{{ noticeTypes[scope.row.noticeType] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="status" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                            noticeStatus[scope.row.status]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建者" align="center" prop="createBy" width="100" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="text"
                            icon="Edit"
                            class="noMar"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:notice:edit']"
                            >修改</el-button
                        >
                        <el-button
                            size="small"
                            class="noMar"
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:notice:remove']"
                            >删除</el-button
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

        <!-- 添加或修改公告对话框 -->
        <el-dialog :title="title" v-model="open" width="780px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公告标题" prop="noticeTitle">
                            <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公告类型" prop="noticeType">
                            <el-select v-model="form.noticeType" placeholder="请选择公告类型">
                                <el-option
                                    v-for="(dict, key) in noticeTypes"
                                    :key="key"
                                    :label="dict"
                                    :value="key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="(dict, key) in noticeStatus" :key="key" :label="key">{{
                                    dict
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容">
                            <editor v-model:value="form.noticeContent" ref="editor" :min-height="192" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from '@/api/system/notice';

export default {
    name: 'Notice',
    dicts: ['sys_notice_status', 'sys_notice_type'],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 公告表格数据
            noticeList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                noticeTitle: undefined,
                createBy: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                noticeTitle: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
                noticeType: [{ required: true, message: '公告类型不能为空', trigger: 'change' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询公告列表 */
        getList() {
            this.loading = true;
            listNotice(this.queryParams).then((response) => {
                this.noticeList = response.rows;
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
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                noticeId: undefined,
                noticeTitle: undefined,
                noticeType: undefined,
                noticeContent: undefined,
                status: '0',
            };
            this.resetForm(this, 'form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm(this, 'queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.noticeId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加公告';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const noticeId = row.noticeId || this.ids;
            getNotice(noticeId).then((response) => {
                this.form = response.data;
                console.log(this.form);
                this.open = true;
                this.title = '修改公告';
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                  this.form.noticeContent=this.$refs.editor.currentValue
                    if (this.form.noticeId != undefined) {
                        updateNotice(this.form).then((response) => {
                            this.$message.success('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addNotice(this.form).then((response) => {
                            this.$message.success('新增成功');
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const noticeIds = row.noticeId || this.ids;
            this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？')
                .then(function () {
                    return delNotice(noticeIds);
                })
                .then(() => {
                    this.getList();
                    this.$message.success('删除成功');
                })
                .catch(() => {});
        },
    },
};
</script>