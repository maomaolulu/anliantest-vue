<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-input
                    v-model="queryParams.testStandardsName"
                    class="selfSerchInput140 mm10"
                    placeholder="名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.testStandards"
                    class="selfSerchInput140 mm10"
                    placeholder="文号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select
                    v-model="queryParams.legalEffect"
                    placeholder="法律效力"
                    class="selfSerchInput180 mm10"
                    clearable
                >
                    <el-option v-for="item in legalEffectOptions" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
                <el-select class="selfSerchInput140 mm10" v-model="queryParams.status" placeholder="状态" clearable>
                    <el-option v-for="(dict, k) in lawStatus" :key="k" :label="dict.txt" :value="k" />
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="addItem">新增</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="名称" prop="testStandardsName" />

                <el-table-column label="文号" prop="testStandards" width="120" />
                <el-table-column label="颁发部门" prop="issuingDepartment" />
                <el-table-column label="法律效力" prop="legalEffect" width="140" />
                <el-table-column label="状态" prop="status" width="100">
                    <template #default="scope">
                        <span :style="{ color: lawStatus[scope.row.status].color }">{{
                            lawStatus[scope.row.status].txt
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实施日期" prop="implementationDate" width="150" />
                <el-table-column label="废止日期" prop="abolitionDate" width="150" />
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-link type="primary" class="fontSize12" :underline="false" @click="editItem(scope.row)"
                            >编辑</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-popconfirm title="确认删除此法规？" @confirm="delItem(scope.row)">
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
        <el-dialog :title="is == 'add' ? '新增法律法规' : '编辑法律法规'" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="form != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="testStandardsName">
                            <el-input
                                v-model="form.testStandardsName"
                                placeholder="请输入法规名称，注意避免敲打多个连续空格"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文号" prop="testStandards">
                            <el-input v-model="form.testStandards" placeholder="请输入文号" :disabled="is == 'edit'" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="颁发部门" prop="issuingDepartment">
                            <el-input v-model="form.issuingDepartment" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法律效力" prop="legalEffect">
                            <el-select v-model="form.legalEffect" placeholder="法律效力" class="maxWidth" clearable>
                                <el-option v-for="item in legalEffectOptions" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label="Number(k)" v-for="(item, k) in lawStatus" :key="k">{{
                                    item.txt
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实施日期" prop="implementationDate">
                            <el-date-picker
                                v-model="form.implementationDate"
                                value-format="YYYY-MM-DD"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="废止日期" prop="abolitionDate">
                            <el-date-picker
                                v-model="form.abolitionDate"
                                value-format="YYYY-MM-DD"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行业类别or地方" prop="industryOrArea">
                            <el-input v-model="form.industryOrArea" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="代替/修订关系" prop="relationship">
                            <el-input v-model="form.relationship" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述" prop="describeInfo">
                            <el-input v-model="form.describeInfo" type="textarea" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="isShow = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { getLawLis, lawAdd, lawUpdate, lawDel } from '@/api/naturalCenter';
export default {
    
    data() {
        var abolitionDate=(rule, value, callback)=>{
            console.log(value)
            if(this.form.status==0){
                if(!value){
                    callback(new Error('请选择废止日期'));
                }else{
                    callback()
                }
            }else{
                callback()
            }
        }
        return {
            queryParams: {
                testStandardsName: '',
                testStandards: '',
                legalEffectls: [],
                legalEffect: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                standCategory: 1,
            },
            loading: true,
            lis: [],
            form: null,
            is: 'add',
            isShow: false,
            rules: {
                testStandardsName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                testStandards: [{ required: true, message: '文号不能为空', trigger: 'blur' }],
                legalEffect: [{ required: true, message: '请选择法律效力', trigger: 'change' }],
                status: [{ required: true, message: '请选择状态', trigger: 'change' }],
                implementationDate: [{ required: true, message: '请选择实施日期', trigger: 'change' }],
                abolitionDate:[{ validator: abolitionDate, trigger: 'blur'}]
            },
        };
    },
    mounted() {
        this.getLis();
    },
    methods: {
        //获取列表
        getLis() {
            this.loading = true;
            getLawLis(this.queryParams).then((res) => {
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
                testStandardsName: '',
                testStandards: '',
                legalEffect: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                standCategory: 1,
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
        addItem() {
            this.is = 'add';
            this.form = {
                testStandardsName: '',
                testStandards: '',
                issuingDepartment: '',
                legalEffect: '',
                status: 1,
                implementationDate: '',
                abolitionDate: '',
                industryOrArea: '',
                relationship: '',
                describeInfo: '',
                standCategory: 1,
            };
            console.log(this.form )
            this.isShow = true;
        },
        //点击编辑
        editItem(row) {
            console.log(row);
            this.is = 'edit';
            this.form = JSON.parse(JSON.stringify(row));
            this.form['standCategory'] = 1;
            this.isShow = true;
        },
        //提交数据
        submitForm() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 'add') {
                        var res = await lawAdd(this.form);
                    } else {
                        var res = await lawUpdate(this.form);
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
            lawDel({ id: row.id }).then((res) => {
                this.$message.success('删除成功');
                this.getLis();
            });
        },
    },
};
</script>