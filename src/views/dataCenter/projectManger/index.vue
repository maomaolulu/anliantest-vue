<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-select
                    class="selfSerchInput marginRight10"
                    v-model="queryParams.companyId"
                    placeholder="所属公司"
                    clearable
                >
                    <el-option v-for="(item, i) in companyLis" :key="i" :label="item.deptName" :value="item.deptId" />
                </el-select>
                <el-input
                    v-model="queryParams.code"
                    class="selfSerchInput140"
                    placeholder="类型编号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.name"
                    class="selfSerchInput140"
                    placeholder="类型名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select
                    class="selfSerchInput140 marginRight10"
                    v-model="queryParams.status"
                    placeholder="状态"
                    clearable
                >
                    <el-option v-for="(dict, k) in projectMangeStatus" :key="k" :label="dict" :value="k" />
                </el-select>
                <el-button type="primary" icon="Search" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="addItem">新增项目类型</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="所属公司" prop="companyName" align="center"/>
                <el-table-column label="类型编号" prop="code" align="center"/>
                <el-table-column label="类型名称" prop="name" align="center"/>
                <el-table-column label="状态" prop="status" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'warning'" effect="dark">{{
                            projectMangeStatus[scope.row.status]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否产出报告" prop="isOutputReport" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.isOutputReport == 0 ? 'warning' : 'success'">{{
                            isNot[scope.row.isOutputReport]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否线上生产" prop="isOnlineProduction" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.isOnlineProduction == 0 ? 'warning' : 'success'">{{
                            isNot[scope.row.isOnlineProduction]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否需公示" prop="isPublicity" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.isPublicity == 0 ? 'warning' : 'success'">{{
                            isNot[scope.row.isPublicity]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否需采样" prop="isSampling" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.isSampling == 0 ? 'warning' : 'success'">{{
                            isNot[scope.row.isSampling]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否需检测" prop="isDetection" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.isDetection == 0 ? 'warning' : 'success'">{{
                            isNot[scope.row.isDetection]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="检测类型" prop="detectionType" align="center"> 
                    <template #default="scope">
                        <span v-if="scope.row.detectionType == 0">-</span>
                        <span v-else>{{ projectDetectionType[scope.row.detectionType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="135" align="center">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="text"
                            class="noMar padding2-5"
                            icon="Edit"
                            @click="editItem(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm title="确认删除此项目类型？" @confirm="delItem(scope.row)">
                            <template #reference>
                                <el-button size="small" type="text" icon="Delete" class="elBtnDanger noMar padding2-5"
                                    >删除</el-button
                                >
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
        <el-dialog :title="is == 'add' ? '新增项目类型' : '编辑项目类型'" v-model="isShow" width="50%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="form != null">
                <el-form-item label="所属公司" prop="companyId">
                    <el-select
                        class="maxWidth"
                        v-model="form.companyId"
                        placeholder="请选择"
                        clearable
                        :disabled="is == 'edit'"
                    >
                        <el-option
                            v-for="(item, i) in companyLis"
                            :key="i"
                            :label="item.deptName"
                            :value="item.deptId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="类型编号" prop="code">
                    <el-input v-model="form.code" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="(dict, k) in projectMangeStatus" :key="k" :label="Number(k)">{{
                            dict
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否产出报告" prop="isOutputReport">
                    <el-radio-group v-model="form.isOutputReport">
                        <el-radio v-for="(dict, k) in isNot" :key="k" :label="Number(k)">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否线上生产" prop="isOnlineProduction">
                    <el-radio-group v-model="form.isOnlineProduction">
                        <el-radio v-for="(dict, k) in isNot" :key="k" :label="Number(k)">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否需公示" prop="isPublicity">
                    <el-radio-group v-model="form.isPublicity">
                        <el-radio v-for="(dict, k) in isNot" :key="k" :label="Number(k)">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否需采样" prop="isSampling">
                    <el-radio-group v-model="form.isSampling">
                        <el-radio v-for="(dict, k) in isNot" :key="k" :label="Number(k)">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否需检测" prop="isDetection">
                    <el-radio-group v-model="form.isDetection" @change="changeIsDetection">
                        <el-radio v-for="(dict, k) in isNot" :key="k" :label="Number(k)">{{ dict }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="检测类型" prop="detectionType" v-if="form.isDetection">
                    <el-radio-group v-model="form.detectionType">
                        <el-radio v-for="(dict, k) in projectDetectionType" :key="k" :label="Number(k)">{{
                            dict
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="isShow = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { getCompany } from '@/api/system/dept';
import { getProjectMangeLis, projectTypeSave, projectTypeUpdate, projectTypeDel } from '@/api/system/dataCenter';
export default {
    data() {
        var detectionType = (rule, value, callback) => {
            if (this.form.isDetection == 0) {
                return callback();
            } else {
                if (this.form.detectionType == 0) {
                    callback(new Error('请选择检测类型'));
                } else {
                    return callback();
                }
            }
        };
        return {
            companyLis: [], //公司列表
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
            form: null, //弹框数据
            is: 'add',
            isShow: false,
            rules: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
                name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入类型编号', trigger: 'blur' }],
                detectionType: [{ validator: detectionType, trigger: 'change' }],
            },
        };
    },
    mounted() {
        this.getCompanyLis();
        this.getLis();
    },
    methods: {
        //获取公司下拉
        getCompanyLis() {
            getCompany().then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.companyLis = res.data;
            });
        },
        //获取列表
        getLis() {
            this.loading = true;
            getProjectMangeLis(this.queryParams).then((res) => {
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
        //点击新增项目类型
        addItem() {
            this.is = 'add';
            this.form = {
                companyId: '',
                companyName: '',
                code: '',
                name: '',
                status: 0,
                isOutputReport: 0,
                isOnlineProduction: 0,
                isPublicity: 0,
                isSampling: 0,
                isDetection: 0,
                detectionType: 0,
            };
            this.isShow = true;
        },
        //点击编辑
        editItem(row) {
            this.is = 'edit';
            this.form = JSON.parse(JSON.stringify(row));
            this.isShow = true;
        },
        //是否检测变化时
        changeIsDetection() {
            this.form.detectionType = 0;
        },
        //提交数据
        submitForm() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 'add') {
                        var res = await projectTypeSave(this.form);
                    } else {
                        var res = await projectTypeUpdate(this.form);
                    }
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isShow = false;
                    this.getLis();
                }
            });
        },
        //删除一条
        delItem(row) {
            projectTypeDel({ id: row.id }).then((res) => {
                this.$message.success('删除成功');
                this.getLis();
            });
        },
    },
};
</script>