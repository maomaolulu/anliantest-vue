<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-input
                    v-model="queryParams.equipCode"
                    class="selfSerchInput120 mm10"
                    placeholder="设备编号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.goodsName"
                    class="selfSerchInput120 mm10"
                    placeholder="设备名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select
                    v-model="queryParams.equipType"
                    placeholder="设备类型"
                    class="selfSerchInput120 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in cateLis" :key="k" :label="item.categoryName" :value="item.id">
                    </el-option>
                </el-select>

                <el-select
                    v-model="queryParams.companyId"
                    placeholder="公司名称"
                    class="selfSerchInput180 mm10"
                    clearable
                    :disabled="queryParams.chargeDeptId != ''"
                >
                    <el-option v-for="(item, k) in companyLis" :key="k" :label="item.deptName" :value="item.deptId">
                    </el-option>
                </el-select>
                <el-tree-select
                    v-model="queryParams.chargeDeptId"
                    :disabled="queryParams.companyId != ''"
                    :expand-on-click-node="false"
                    clearable
                    :check-on-click-node="true"
                    check-strictly
                    class="selfSerchInput180 mm10"
                    placeholder="责任部门"
                    :data="deptTreeAll"
                    node-key="deptId"
                    :props="{
                        label: 'deptName',
                    }"
                    :render-after-expand="false"
                />

                <el-select v-model="queryParams.printLabel" placeholder="标签" class="selfSerchInput120 mm10" clearable>
                    <el-option v-for="(item, k) in printLabels" :key="k" :label="item.txt" :value="Number(k)">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="设备编号" prop="equipCode" />
                <el-table-column label="设备名称" prop="goodsName" />
                <el-table-column label="规格型号" prop="model" />
                <el-table-column label="设备类型" prop="equipType">
                    <template #default="scope">
                        {{
                            cateLis[scope.row.equipType]
                                ? cateLis[scope.row.equipType].categoryName
                                : scope.row.equipType
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="公司名称" prop="companyId">
                    <template #default="scope">
                        {{
                            companyLis[scope.row.companyId]
                                ? companyLis[scope.row.companyId].deptName
                                : scope.row.companyId
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="责任部门" prop="chargeDeptId">
                    <template #default="scope">
                        {{
                            deptMapLis[scope.row.chargeDeptId]
                                ? deptMapLis[scope.row.chargeDeptId].deptName
                                : scope.row.chargeDeptId
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="责任人" prop="chargeName"></el-table-column>
                <el-table-column label="标签" prop="printLabel">
                    <template #default="scope">
                        <el-tag :type="printLabels[scope.row.printLabel].tag">{{
                            printLabels[scope.row.printLabel].txt
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="维护时间" prop="updateTime" />
                <el-table-column label="维护人" prop="updateBy" />
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            class="fontSize12"
                            :underline="false"
                            @click="editItem(scope.row, 'edit')"
                            >编辑</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-link
                            type="primary"
                            class="fontSize12"
                            :underline="false"
                            @click="editItem(scope.row, 'info')"
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
                :current-page="queryParams.pageIndex"
                :page-sizes="[50, 100, 200]"
                :page-size="queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryParams.total"
            >
            </el-pagination>
        </div>
        <el-dialog :title="is == 'edit' ? '编辑设备' : '设备详情'" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-if="form != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编号" prop="equipCode">
                            <el-input v-model="form.equipCode" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类别" prop="equipType">
                            <el-select
                                v-model="form.equipType"
                                placeholder="设备类型"
                                :disabled="is == 'info'"
                                class="maxWidth"
                                clearable
                            >
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
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规格型号" prop="model">
                            <el-input v-model="form.model" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="goodsName">
                            <el-input v-model="form.goodsName" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="采购单价" prop="singlePrice">
                            <el-input
                                v-model="form.singlePrice"
                                type="number"
                                :disabled="is == 'info'"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="form.unit" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="采购日期" prop="purchaseDate">
                            <el-date-picker
                                v-model="form.purchaseDate"
                                type="date"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                                :disabled="is == 'info'"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到货日期" prop="arrivedTime">
                            <el-date-picker
                                v-model="form.arrivedTime"
                                type="date"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                                :disabled="is == 'info'"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商" prop="supplier">
                            <el-input v-model="form.supplier" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产厂家" prop="productCompany">
                            <el-input v-model="form.productCompany" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出厂编号" prop="factoryCode">
                            <el-input v-model="form.factoryCode" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前估值" prop="value">
                            <el-input
                                v-model="form.value"
                                :disabled="is == 'info'"
                                type="number"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="责任部门" prop="chargeDeptId">
                            <el-tree-select
                                v-model="form.chargeDeptId"
                                :expand-on-click-node="false"
                                :check-on-click-node="true"
                                check-strictly
                                class="maxWidth mm10"
                                placeholder="责任部门"
                                :data="deptTreeAll"
                                :disabled="is == 'info'"
                                node-key="deptId"
                                :props="{
                                    label: 'deptName',
                                }"
                                :render-after-expand="false"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="责任人" prop="chargeId">
                            <el-select
                                v-model="form.chargeId"
                                placeholder="请选择"
                                filterable
                                class="maxWidth mm10"
                                :disabled="is == 'info'"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in userLis"
                                    :key="k"
                                    :label="item.nickName"
                                    :value="Number(item.userId)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="保管人" prop="keeperId">
                            <el-select
                                v-model="form.keeperId"
                                placeholder="请选择"
                                filterable
                                class="maxWidth mm10"
                                :disabled="is == 'info'"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in userLis"
                                    :key="k"
                                    :label="item.nickName"
                                    :value="Number(item.userId)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用部门" prop="useDeptId">
                            <el-tree-select
                                v-model="form.useDeptId"
                                :expand-on-click-node="false"
                                :check-on-click-node="true"
                                check-strictly
                                class="maxWidth mm10"
                                placeholder="使用部门"
                                :data="deptTreeAll"
                                :disabled="is == 'info'"
                                node-key="deptId"
                                :props="{
                                    label: 'deptName',
                                }"
                                :render-after-expand="false"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="检定/校准" prop="calibration">
                            <el-radio-group v-model="form.calibration" :disabled="is == 'info'">
                                <el-radio label="检定">检定</el-radio>
                                <el-radio label="校准">校准</el-radio>
                                <el-radio label="不检定不校准">不检定不校准</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证书有效期" prop="usefulTime">
                            <el-date-picker
                                v-model="form.usefulTime"
                                type="date"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                                :disabled="is == 'info'"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="仪器精度" prop="precision">
                            <template #label>
                                <span>
                                    <el-tooltip content="若读数是两位小数则填2" placement="top">
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    仪器精度
                                </span>
                            </template>
                            <el-input
                                v-model="form.precision"
                                :disabled="is == 'info'"
                                type="number"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="允许误差" prop="allowanceError">
                            <el-input v-model="form.allowanceError" :disabled="is == 'info'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="测量范围" prop="testRange">
                            <el-input v-model="form.testRange" :disabled="is == 'info'" placeholder="文字描述" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测量范围(系统)" prop="testRangeMin">
                            <div class="flex_sb_c">
                                <el-input
                                    v-model="form.testRangeMin"
                                    type="number"
                                    :disabled="is == 'info'"
                                    placeholder="请输入"
                                />
                                　-　
                                <el-input
                                    v-model="form.testRangeMax"
                                    type="number"
                                    :disabled="is == 'info'"
                                    placeholder="请输入"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="设备照片" prop="testRange">
                        <image-upload
                            v-if="isShow"
                            :upData="{ bucketName: 'al-equipment-file' }"
                            :isHide="is == 'info'?true:false"
                            :isShowTip="is == 'info'?false:true"
                            @input="getImgFile"
                            :value="form.sysAttachmentList"
                        />
                    </el-form-item>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm" v-if="is == 'edit'">确 定</el-button>
                    <el-button @click="isShow = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { getCompany, getDeptlis } from '@/api/system/dept';
import { objlistUser } from '@/api/system/user';
import { equiplistPage, equipInfo, equipCategory, equipUpdate } from '@/api/deviceCenter';
import ImageUpload from '@/components/ImageUpload';

export default {
    data() {
        return {
            queryParams: {
                equipType: '', //	设备类型
                equipCode: '', //	设备编号
                goodsName: '', //	设备名称
                companyId: '', //所属公司
                chargeDeptId: '', //责任部门
                printLabel: '', //打印标签：0未打印、1已打印
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            deptMapLis: {},
            companyLis: '', //公司下拉
            lis: [], //列表数据
            deptLis: [], //部门列表
            deptTreeAll: [],
            userLis: {}, //用户数据
            userMap: {}, //部门用户对应
            cateLis: {}, //类型
            showDeptlis: [],
            loading: true,
            is: '',
            isShow: false,
            form: null,
            rules: {
                equipCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                equipType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
                model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
                goodsName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                singlePrice: [{ required: true, message: '请输入采购单价', trigger: 'blur' }],
                unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
                purchaseDate: [{ required: true, message: '请选择采购时间', trigger: 'change' }],
                arrivedTime: [{ required: true, message: '请选择到货时间', trigger: 'change' }],
                chargeDeptId: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
                chargeId: [{ required: true, message: '请选择责任人', trigger: 'change' }],
                keeperId: [{ required: true, message: '请选择保管人', trigger: 'change' }],
                calibration: [{ required: true, message: '请选择检定/校准', trigger: 'change' }],
                usefulTime: [{ required: true, message: '请选择证书有效期', trigger: 'change' }],
            },
        };
    },
    components: { ImageUpload },
    mounted() {
        this.getCateType();
        this.getCompanylis();
        this.deptlis();

        this.getUsers();
        this.getLis();
    },
    methods: {
        // 获取仪器类型下拉列表
        getCateType() {
            equipCategory({ categoryName: '现场采样仪器' }).then((res) => {
                this.cateLis = this.arrToMap(res, 'id');
            });
        },
        //获取公司下拉
        getCompanylis() {
            getCompany().then((res) => {
                this.companyLis = this.arrToMap(res.data, 'deptId');
            });
        },
        //获取部门下拉
        deptlis() {
            getDeptlis({ deptId: this.queryParams.companyId }).then((res) => {
                this.deptMapLis = this.arrToMap(res, 'deptId');
                this.deptLis = res;
                this.deptTreeAll = this.handleTree(res, 'deptId', 'parentId');
            });
        },
        //获取用户
        getUsers() {
            objlistUser().then((res) => {
                res.data.list.forEach((item) => {
                    this.userLis[item.userId] = item;
                });
                this.userMap = res.data.map;
            });
        },
        //获取数据
        getLis() {
            this.loading = true;
            equiplistPage(this.queryParams).then((res) => {
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
                equipType: '', //	设备类型
                equipCode: '', //	设备编号
                goodsName: '', //	设备名称
                companyId: '', //所属公司
                chargeDeptId: '', //责任部门
                printLabel: '', //打印标签：0未打印、1已打印
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis();
        },
        //搜索
        serch() {
            this.queryParams.pageIndex = 1;
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
        //点击编辑
        editItem(row, type) {
            this.is = type;
            equipInfo({ id: row.id }).then((res) => {
                this.form = res.data;
                this.isShow = true;
            });
        },
        //获取图片数据
        getImgFile(data) {
            this.form.sysAttachmentList = data;
        },
        //提交编辑
        submitForm() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    var res = await equipUpdate(this.form);
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isShow = false;
                    this.getLis();
                }
            });
        },
    },
};
</script>