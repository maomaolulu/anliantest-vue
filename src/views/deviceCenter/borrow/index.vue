<template>
    <div class="paddBoxPage">
        <el-tabs v-model="activeName" class="self_el_tabs">
            <el-tab-pane label="外部设备" name="first">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-input
                                clearable
                                v-model="queryParams.companyName"
                                class="selfSerchInput mm10"
                                placeholder="隶属公司"
                            />
                            <el-input
                                clearable
                                v-model="queryParams.equipCode"
                                class="selfSerchInput mm10"
                                placeholder="设备编号"
                            />
                            <el-input
                                clearable
                                v-model="queryParams.goodsName"
                                class="selfSerchInput mm10"
                                placeholder="设备名称"
                            />
                            <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                            <el-button type="info" icon="RefreshRight" class="mm10" @click="reset">重置</el-button>
                            <el-button type="primary" icon="Monitor" class="mm10" plain @click="registration"
                                >设备登记</el-button
                            >
                        </el-form>
                    </div>
                    <div class="myCenter90">
                        <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="规格型号" prop="model" />
                            <el-table-column label="设备隶属" prop="companyName"></el-table-column>
                            <el-table-column label="维护人" prop="createName"></el-table-column>
                            <el-table-column label="维护时间" prop="createTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="delEquip(scope.row)"
                                        >删除</el-link
                                    >
                                    <div class="el-divider el-divider-vertical"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="editEquip(scope.row)"
                                        >编辑</el-link
                                    >
                                    <div class="el-divider el-divider-vertical"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="borrow(scope.row)"
                                        >借入</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="myPageBot flex_s_c">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryParams.pageIndex"
                            :page-sizes="[50, 100, 200]"
                            :page-size="queryParams.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="queryParams.total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="内部借入记录" name="two">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParams2" ref="queryForm2" :inline="true">
                            <el-select
                                v-model="queryParams2.companyId"
                                placeholder="借用公司"
                                class="selfSerchInput mm10"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in store.allCompanys"
                                    :key="k"
                                    :label="item.deptName"
                                    :value="k"
                                >
                                </el-option>
                            </el-select>
                            <el-input
                                v-model="queryParams2.equipCode"
                                class="selfSerchInput mm10"
                                clearable
                                placeholder="设备编号"
                            />
                            <el-input
                                v-model="queryParams2.goodsName"
                                class="selfSerchInput mm10"
                                clearable
                                placeholder="设备名称"
                            />
                            <el-select
                                v-model="queryParams2.status"
                                placeholder="状态"
                                class="selfSerchInput mm10"
                                clearable
                                
                            >
                                <el-option v-for="(item, k) in equipStatuslend" :key="k" :label="item" :value="k">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="Search" class="mm10" @click="serch2">搜索</el-button>
                            <el-button type="info" icon="RefreshRight" class="mm10" @click="reset2">重置</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter90">
                        <el-table :data="lis2" height="100%" border v-loading="loading2" size="small">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="状态" prop="status">
                                <template #default="scope">
                                    <span>{{ equipStatuslend[scope.row.status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="借用开始时间" prop="startTime" />
                            <el-table-column label="借用结束时间" prop="endTime" />
                            <el-table-column label="设备隶属" prop="companyName"></el-table-column>
                            <el-table-column label="操作人" prop="createName"></el-table-column>
                            <el-table-column label="操作时间" prop="createTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
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
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="queryParams2.pageIndex"
                            :page-sizes="[50, 100, 200]"
                            :page-size="queryParams2.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="queryParams2.total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="外部借入记录" name="three">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParams3" ref="queryForm3" :inline="true">
                            <el-select
                                v-model="queryParams3.companyId"
                                placeholder="借用公司"
                                class="selfSerchInput mm10"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in store.allCompanys"
                                    :key="k"
                                    :label="item.deptName"
                                    :value="k"
                                >
                                </el-option>
                            </el-select>
                            <el-input
                                v-model="queryParams3.equipCode"
                                class="selfSerchInput mm10"
                                clearable
                                placeholder="设备编号"
                            />
                            <el-input
                                v-model="queryParams3.goodsName"
                                class="selfSerchInput mm10"
                                clearable
                                placeholder="设备名称"
                            />
                            <el-select
                                v-model="queryParams3.status"
                                placeholder="状态"
                                class="selfSerchInput mm10"
                                clearable
                            >
                                <el-option v-for="(item, k) in equipStatuslend" :key="k" :label="item" :value="k">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="Search" class="mm10" @click="serch3">搜索</el-button>
                            <el-button type="info" icon="RefreshRight" class="mm10" @click="reset3">重置</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter90">
                        <el-table :data="lis3" height="100%" border v-loading="loading3" size="small">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="状态" prop="status">
                                <template #default="scope">
                                    <span>{{ equipStatuslend[scope.row.status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="借用开始时间" prop="startTime" />
                            <el-table-column label="借用结束时间" prop="endTime" />
                            <el-table-column label="设备隶属" prop="companyName"></el-table-column>
                            <el-table-column label="操作人" prop="createName"></el-table-column>
                            <el-table-column label="操作时间" prop="createTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="$message.success('待开发')"
                                        >详情</el-link
                                    >
                                    <div class="el-divider el-divider-vertical" v-if="scope.row.status == 0"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        v-if="scope.row.status == 0"
                                        :underline="false"
                                        @click="revoke(scope.row)"
                                        >撤销</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="myPageBot flex_s_c">
                        <el-pagination
                            @size-change="handleSizeChange3"
                            @current-change="handleCurrentChange3"
                            :current-page="queryParams3.pageIndex"
                            :page-sizes="[50, 100, 200]"
                            :page-size="queryParams3.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="queryParams3.total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title="is == 'add' ? '设备登记' : '设备编辑'" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-if="form != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备隶属" prop="companyName">
                            <el-input v-model="form.companyName" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编号" prop="equipCode">
                            <el-input v-model="form.equipCode" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备类别" prop="equipType">
                            <el-select v-model="form.equipType" placeholder="设备类型" class="maxWidth" clearable>
                                <el-option
                                    v-for="(item, k) in cateLis"
                                    :key="k"
                                    :label="item.categoryName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格型号" prop="model">
                            <el-input v-model="form.model" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="goodsName">
                            <el-input v-model="form.goodsName" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商" prop="supplier">
                            <el-input v-model="form.supplier" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生产厂家" prop="productCompany">
                            <el-input v-model="form.productCompany" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出厂编号" prop="factoryCode">
                            <el-input v-model="form.factoryCode" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="使用部门" prop="useDeptId">
                            <el-tree-select
                                v-model="form.useDeptId"
                                :expand-on-click-node="false"
                                clearable
                                :check-on-click-node="true"
                                check-strictly
                                class="maxWidth"
                                placeholder="使用部门"
                                :data="deptTreeAll"
                                node-key="deptId"
                                :props="{
                                    label: 'deptName',
                                }"
                                :render-after-expand="false"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仪器精度" prop="precision">
                            <template #label>
                                <span>
                                    <el-tooltip content="若读数是2位小数则填2" placement="top">
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    仪器精度
                                </span>
                            </template>
                            <el-input v-model="form.precision" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="允许误差" prop="allowanceError">
                            <el-input v-model="form.allowanceError" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测量范围" prop="testRange">
                            <el-input v-model="form.testRange" placeholder="文字描述" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="测量范围(系统)" prop="testRange">
                            <div class="flex_sb_c">
                                <el-input v-model="form.testRangeMin" type="number" placeholder="请输入" />
                                　-　
                                <el-input v-model="form.testRangeMax" type="number" placeholder="请输入" />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上次检定时间" prop="verificationTime">
                            <el-date-picker
                                v-model="form.verificationTime"
                                type="date"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证书有效期" prop="usefulTime">
                            <el-date-picker
                                v-model="form.usefulTime"
                                type="date"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="修正因子" prop="correctionFactorMin">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="紫外类设备填2个值,第一空为中波的修正系数,第二空为短波的修正系数。"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    修正因子
                                </span>
                            </template>
                            <div class="flex_sb_c">
                                <el-input v-model="form.correctionFactorMin" placeholder="请输入" />
                                　
                                <el-input v-model="form.correctionFactorMax" placeholder="请输入" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShow = false">关 闭</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="设备借入" v-model="isBorrow" width="60%" append-to-body>
            <el-form ref="formBorrow" :model="formBorrow" :rules="rules" label-width="130px" v-if="formBorrow != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编号">
                            <el-input v-model="formBorrow.equipCode" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input v-model="formBorrow.goodsName" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规格型号">
                            <el-input v-model="formBorrow.model" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备隶属">
                            <el-input v-model="formBorrow.companyName" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="借用时间" prop="timeValue">
                            <el-date-picker
                                v-model="formBorrow.timeValue"
                                type="datetimerange"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm"
                                :disabled-date="disabledDate"
                                :default-time="defaultTime"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用公司" prop="companyId">
                            <el-select
                                v-model="formBorrow.companyId"
                                placeholder="使用公司"
                                disabled
                                class="maxWidth"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in store.dictMap['sys_ehs_company']"
                                    :key="k"
                                    :label="item.dictLabel"
                                    :value="Number(k)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remake">
                            <el-input v-model="formBorrow.remake" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isBorrow = false">关 闭</el-button>
                    <el-button type="primary" @click="submitBorrow()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {
    equipCategory,
    equipExternal,
    equipsave,
    equipDel,
    equipExternalUpdate,
    equip_borrowing_record_save,
    equip_borrowing_record_lis,
    equip_borrowing_record_externalListPage,
    revokeEquip,
} from '@/api/deviceCenter';
import { dataStore } from '@/store/modules/app';

export default {
    setup() {
        const store = dataStore();
        return { store };
    },
    data() {
        return {
            activeName: 'first',
            queryParams: {
                companyName: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            queryParams2: {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            queryParams3: {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            cateLis: '',
            loading: true,
            loading2: true,
            loading3: true,
            lis: [],
            lis2: [],
            lis3: [],
            isShow: false,
            form: null,
            rules: {
                companyName: [{ required: true, message: '请输入隶属公司', trigger: 'blur' }],
                equipType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
                equipCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                goodsName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
                timeValue: [{ required: true, message: '请选择借用时间', trigger: 'change' }],
            },
            deptTreeAll: [],
            is: 'add',
            isBorrow: false,
            formBorrow: null,
            defaultTime: '',
        };
    },
    mounted() {
        this.deptTreeAll = this.handleTree(this.store.oldAllDepts, 'deptId', 'parentId');
        this.getType();
        this.getLis();
        this.getLis2();
        this.getLis3();
    },
    methods: {
        disabledDate(date) {
            return date.getTime() < Date.now() - 8.64e7;
        },
        //获取类型
        getType() {
            equipCategory({ categoryName: '现场采样仪器' }).then((res) => {
                this.cateLis = this.arrToMap(res, 'id');
            });
        },
        getLis() {
            this.loading = true;
            equipExternal(this.queryParams).then((res) => {
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
            this.queryParams.pageIndex = 1;
            this.getLis();
        },
        //重置
        reset() {
            this.queryParams = {
                companyName: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis();
        },
        //改变条数
        handleSizeChange(val) {
            this.queryParams.pageIndex = 1;
            this.queryParams.pageSize = val;
            this.getLis();
        },
        //改变页数
        handleCurrentChange(val) {
            this.queryParams.pageIndex = val;
            this.getLis();
        },
        //设备登记
        registration() {
            this.is = 'add';
            this.form = {
                companyName: '', //	所属公司id
                equipType: '', //	设备类型
                equipCode: '', //	设备编号
                goodsName: '', //	设备名称
                model: '', //	规格型号
                supplier: '', //	供应商
                productCompany: '', //	生产厂家
                factoryCode: '', //出厂编号
                useDeptId: '', //使用部门id
                precision: '', //	精度
                allowanceError: '', //允许误差
                testRange: '', //测量范围
                testRangeMin: '', //	测量范围;系统）-min
                testRangeMax: '', //	测量范围;系统）-max
                usefulTime: '', //	s证书有效期
                correctionFactorMin: '', //	修正因子min
                correctionFactorMax: '', //	修正因子max
                verificationTime: '', //上次检定时间
            };
            this.isShow = true;
        },
        //编辑
        editEquip(row) {
            this.is = 'edit';
            this.form = row;
            this.isShow = true;
        },
        //提交编辑
        submitForm() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 'add') {
                        var res = await equipsave(this.form);
                    } else {
                        var res = await equipExternalUpdate(this.form);
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
        //删除设备
        delEquip(row) {
            this.$confirm(`确定删除设备(${row.equipCode})？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    equipDel({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('删除成功');
                        this.getLis();
                    });
                })
                .catch(() => {});
        },
        //借入
        borrow(row) {
            this.defaultTime = new Date().getTime();
            this.formBorrow = {
                equipId: row.id,
                timeValue: '',
                companyId: Number(this.store.userInfo.companyKey),
                equipCode: row.equipCode,
                goodsName: row.goodsName,
                model: row.model,
                companyName: row.companyName,
            };
            this.isBorrow = true;
        },
        //借入提交
        submitBorrow() {
            this.$refs['formBorrow'].validate(async (valid) => {
                if (valid) {
                    this.formBorrow['type'] = 1;
                    this.formBorrow['startTime'] = this.formBorrow.timeValue[0];
                    this.formBorrow['endTime'] = this.formBorrow.timeValue[1];
                    this.formBorrow['actual_end_time'] = this.formBorrow.timeValue[1];
                    var res = await equip_borrowing_record_save(this.formBorrow);
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('借入成功');
                    this.isBorrow = false;
                    this.getLis();
                    this.getLis2();
                    this.getLis3();
                }
            });
        },
        //内部记录
        getLis2() {
            this.loading2 = true;
            equip_borrowing_record_lis(this.queryParams2).then((res) => {
                this.loading2 = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams2.total = res.total;
                this.lis2 = res.rows;
            });
        },
        //搜索
        serch2() {
            this.queryParams2.pageIndex = 1;
            this.getLis2();
        },
        //重置
        reset2() {
            this.queryParams2 = {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis2();
        },
        //改变条数
        handleSizeChange2(val) {
            this.queryParams2.pageIndex = 1;
            this.queryParams2.pageSize = val;
            this.getLis2();
        },
        //改变页数
        handleCurrentChange2(val) {
            this.queryParams2.pageIndex = val;
            this.getLis2();
        },
        //外部记录
        getLis3() {
            this.loading3 = true;
            equip_borrowing_record_externalListPage(this.queryParams3).then((res) => {
                this.loading3 = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams3.total = res.total;
                this.lis3 = res.rows;
            });
        },
        //搜索
        serch3() {
            this.queryParams3.pageIndex = 1;
            this.getLis3();
        },
        //重置
        reset3() {
            this.queryParams3 = {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis3();
        },
        //改变条数
        handleSizeChange3(val) {
            this.queryParams3.pageIndex = 1;
            this.queryParams3.pageSize = val;
            this.getLis3();
        },
        //改变页数
        handleCurrentChange3(val) {
            this.queryParams3.pageIndex = val;
            this.getLis3();
        },
        revoke(row) {
            this.$confirm(`确定删除设备(${row.equipCode})？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    revokeEquip({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('撤销成功');
                        this.getLis3();
                    });
                })
                .catch(() => {});
        },
    },
};
</script>
