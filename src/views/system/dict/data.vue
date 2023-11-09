<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                <el-select
                    v-model="queryParams.dictType"
                    placeholder="字典名称"
                    clearable
                    class="selfSerchInput140 mm10"
                >
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.dictId"
                        :label="item.dictName"
                        :value="item.dictType"
                    />
                </el-select>
                <el-input
                    class="selfSerchInput140 mm10"
                    v-model="queryParams.dictLabel"
                    placeholder="请输入字典标签"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-select v-model="queryParams.status" placeholder="数据状态" clearable class="selfSerchInput120 mm10">
                    <el-option v-for="(dict, k) in dictStatus" :key="k" :label="dict" :value="k" />
                </el-select>
                <el-button type="primary" class="mm10" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form>
        </div>
        <div class="myPageTop45">
            <el-button type="primary" plain icon="Plus" size="mini" @click="handleAdd" v-hasPermi="['system:dict:add']"
                >新增</el-button
            >
            <el-button
                type="success"
                plain
                icon="Edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['system:dict:edit']"
                >修改</el-button
            >
            <el-button
                type="danger"
                plain
                icon="Delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:dict:remove']"
                >删除</el-button
            >
            <el-button
                type="warning"
                plain
                icon="Download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['system:dict:export']"
                >导出</el-button
            >
            <el-button type="warning" plain icon="Close" size="mini" @click="handleClose">关闭</el-button>
        </div>
        <div class="myCenter135">
            <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="字典编码" align="center" prop="dictCode" />
                <el-table-column label="字典标签" align="center" prop="dictLabel">
                    <template #default="scope">
                        <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{
                            scope.row.dictLabel
                        }}</span>
                        <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{
                            scope.row.dictLabel
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="字典键值" align="center" prop="dictValue" />
                <el-table-column label="字典排序" align="center" prop="dictSort" />
                <el-table-column label="状态" align="center" prop="status">
                    <template #default="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                            dictStatus[scope.row.status]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="text"
                            icon="Edit"
                            class="noMar"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:dict:edit']"
                            >修改</el-button
                        >
                        <el-button
                            size="small"
                            class="noMar"
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:dict:remove']"
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

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="字典类型">
                    <el-input v-model="form.dictType" :disabled="true" />
                </el-form-item>
                <el-form-item label="数据标签" prop="dictLabel">
                    <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
                </el-form-item>
                <el-form-item label="数据键值" prop="dictValue">
                    <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
                </el-form-item>
                <el-form-item label="样式属性" prop="cssClass">
                    <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
                </el-form-item>
                <el-form-item label="显示排序" prop="dictSort">
                    <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item label="回显样式" prop="listClass">
                    <el-select v-model="form.listClass">
                        <el-option
                            v-for="item in listClassOptions"
                            :key="item.value"
                            :label="item.label + '(' + item.value + ')'"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="(dict, key) in dictStatus" :key="key" :label="key">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
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
import { listData, getData, delData, addData, updateData } from '@/api/system/dict/data';
import { optionselect as getDictOptionselect, getType } from '@/api/system/dict/type';

export default {
    name: 'Data',
    dicts: ['sys_normal_disable'],
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
            // 字典表格数据
            dataList: [],
            // 默认字典类型
            defaultDictType: '',
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 数据标签回显样式
            listClassOptions: [
                {
                    value: 'default',
                    label: '默认',
                },
                {
                    value: 'primary',
                    label: '主要',
                },
                {
                    value: 'success',
                    label: '成功',
                },
                {
                    value: 'info',
                    label: '信息',
                },
                {
                    value: 'warning',
                    label: '警告',
                },
                {
                    value: 'danger',
                    label: '危险',
                },
            ],
            // 类型数据字典
            typeOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                dictName: undefined,
                dictType: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                dictLabel: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
                dictValue: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
                dictSort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
            },
        };
    },
    created() {
        const dictId = this.$route.params && this.$route.params.dictId;
        this.getType(dictId);
        this.getTypeList();
    },
    methods: {
        /** 查询字典类型详细 */
        getType(dictId) {
            getType(dictId).then((response) => {
                this.queryParams.dictType = response.data.dictType;
                this.defaultDictType = response.data.dictType;
                this.getList();
            });
        },
        /** 查询字典类型列表 */
        getTypeList() {
            getDictOptionselect().then((response) => {
                this.typeOptions = response.data;
            });
        },
        //改变条数
        handleSizeChangeLis(val) {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = val;
            this.getList();
        },
        //改变页数
        handleCurrentChangeLis(val) {
            this.queryParams.pageNum = val;
            this.getList();
        },
        /** 查询字典数据列表 */
        getList() {
            this.loading = true;
            listData(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                dictCode: undefined,
                dictLabel: undefined,
                dictValue: undefined,
                cssClass: undefined,
                listClass: 'default',
                dictSort: 0,
                status: '0',
                remark: undefined,
            };
            this.resetForm(this,'form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 返回按钮操作 */
        handleClose() {
            // const obj = { path: '/system/dict' };
            // this.$tab.closeOpenPage(obj);
            this.$router.back()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm(this,'queryForm');
            this.queryParams.dictType = this.defaultDictType;
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加字典数据';
            this.form.dictType = this.queryParams.dictType;
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.dictCode);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const dictCode = row.dictCode || this.ids;
            getData(dictCode).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = '修改字典数据';
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.dictCode != undefined) {
                        updateData(this.form).then((response) => {
                            // this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
                            this.$message.success('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addData(this.form).then((response) => {
                            // this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
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
            const dictCodes = row.dictCode || this.ids;
            this.$confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项？')
                .then(function () {
                    return delData(dictCodes);
                })
                .then(() => {
                    this.getList();
                    this.$message.success('删除成功');
                    // this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'system/dict/data/export',
                {
                    ...this.queryParams,
                },
                `data_${new Date().getTime()}.xlsx`,
            );
        },
    },
};
</script>