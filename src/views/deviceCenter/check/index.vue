<template>
    <div class="paddBoxPage">
        <el-tabs v-model="activeName" class="self_el_tabs">
            <el-tab-pane label="设备检定" name="first">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-input
                                v-model="queryParams.equipCode"
                                class="selfSerchInput mm10"
                                placeholder="设备编号"
                                clearable
                                @keyup.enter.native="serch"
                            />
                            <el-input
                                v-model="queryParams.goodsName"
                                class="selfSerchInput mm10"
                                placeholder="设备名称"
                                clearable
                                @keyup.enter.native="serch"
                            />
                            <el-select
                                v-model="queryParams.verificationStatus"
                                placeholder="检定状态"
                                class="selfSerchInput120 mm10"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in equipVerificationStatus.checkSerch"
                                    :key="k"
                                    :label="item.txt"
                                    :value="k"
                                >
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
                            <el-table-column label="设备状态" prop="status">
                                <template #default="scope">
                                    {{
                                        equipStatus.checkSerch[scope.row.status]
                                            ? equipStatus.checkSerch[scope.row.status]
                                            : scope.row.status
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="检定状态" prop="verificationStatus">
                                <template #default="scope">
                                    <span
                                        class="statusClass"
                                        v-if="equipVerificationStatus.all[scope.row.verificationStatus]"
                                        :class="equipVerificationStatus.all[scope.row.verificationStatus].class"
                                    >
                                        {{ equipVerificationStatus.all[scope.row.verificationStatus].txt }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="责任部门" prop="chargeDeptId">
                                <template #default="scope">
                                    {{
                                        store.allDepts[scope.row.chargeDeptId]
                                            ? store.allDepts[scope.row.chargeDeptId].deptName
                                            : scope.row.chargeDeptId
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="证书有效期" prop="usefulTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="getInfo(scope.row)"
                                        >详情</el-link
                                    >
                                    <div class="el-divider el-divider-vertical"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        @click="showSend(scope.row, 1)"
                                        v-if="scope.row.verificationStatus == 1"
                                        :underline="false"
                                        >送检</el-link
                                    >
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        @click="showSend(scope.row, 2)"
                                        v-if="scope.row.verificationStatus == 2"
                                        :underline="false"
                                        >退检</el-link
                                    >
                                    <div
                                        class="el-divider el-divider-vertical"
                                        v-if="scope.row.verificationStatus == 2"
                                    ></div>
                                    <!--  -->
                                    <el-link
                                        type="primary"
                                        v-if="scope.row.verificationStatus == 2"
                                        class="fontSize12"
                                        @click="certificateShow(scope.row, 0)"
                                        :underline="false"
                                        >证书录入</el-link
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
            <el-tab-pane label="检定记录" name="second">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="serchInfo" ref="serchInfo" :inline="true">
                            <el-input
                                v-model="serchInfo.equipCode"
                                class="selfSerchInput mm10"
                                placeholder="设备编号"
                                clearable
                                @keyup.enter.native="serchcertificate"
                            />
                            <el-input
                                v-model="serchInfo.goodsName"
                                class="selfSerchInput mm10"
                                placeholder="设备名称"
                                clearable
                                @keyup.enter.native="serchcertificate"
                            />
                            <el-input
                                v-model="serchInfo.certificateCode"
                                class="selfSerchInput mm10"
                                placeholder="证书编号"
                                clearable
                                @keyup.enter.native="serchcertificate"
                            />
                            <el-button type="primary" icon="Search" class="mm10" @click="serchcertificate"
                                >搜索</el-button
                            >
                            <el-button icon="Refresh" @click="resetcertificate">重置</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter90">
                        <el-table
                            :data="liscertificate"
                            height="100%"
                            border
                            v-loading="loadingcertificate"
                            size="small"
                        >
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="规格型号" prop="model" />
                            <el-table-column label="证书编号" prop="certificateCode" />
                            <el-table-column label="证书有效期" prop="usefulTime"></el-table-column>
                            <el-table-column label="证书" prop="usefulTime" align="center">
                                <template #default="scope">
                                    <span
                                        v-if="
                                            scope.row.sysAttachmentList == null || !scope.row.sysAttachmentList.length
                                        "
                                        >未上传</span
                                    >
                                    <span v-else class="haveClass" @click="certificateShow(scope.row, 1, 'info')"
                                        >查看证书</span
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="certificateShow(scope.row, 1, 'info')"
                                        >详情</el-link
                                    >
                                    <div class="el-divider el-divider-vertical"></div>
                                    <!--  -->
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        @click="certificateShow(scope.row, 1, null, 'up')"
                                        :underline="false"
                                        >{{
                                            scope.row.sysAttachmentList && scope.row.sysAttachmentList.length
                                                ? '编辑'
                                                : '证书录入'
                                        }}</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="myPageBot flex_s_c">
                        <el-pagination
                            @size-change="handleSizeChangecertificate"
                            @current-change="handleCurrentChangecertificate"
                            :current-page="serchInfo.pageIndex"
                            :page-sizes="[50, 100, 200]"
                            :page-size="serchInfo.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="serchInfo.total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="设备详情" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-if="form != null">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="设备类型：">{{ form.equipType }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备编号：">{{ form.equipCode }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备名称：">{{ form.goodsName }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="规格型号：">{{ form.model }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位：">{{ form.unit }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购单价：">{{ form.singlePrice }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购时间：">{{ form.purchaseDate }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商：">{{ form.supplier }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生产厂家：">{{ form.productCompany }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="出厂编号：">{{ form.factoryCode }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="当前估值：">{{ form.value }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="责任部门：">{{ store.allDepts[form.chargeDeptId].deptName }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="责任人：">{{ store.allUsers[form.chargeId].nickName }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保管人：">{{ store.allUsers[form.keeperId].nickName }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用部门：">{{ store.allDepts[form.useDeptId].deptName }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="检定/校准：">{{ form.calibration }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证书有效期：">{{ form.usefulTime }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="精度：">{{ form.precision }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="允许误差：">{{ form.allowanceError }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="测量范围：">{{ form.testRange }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="测量范围：">{{ form.testRangeMin }}-{{ form.testRangeMax }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShow = false">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog :title="is == 1 ? '送检' : '退检'" v-model="isShowSend" width="30%" append-to-body>
            <el-form ref="formSend" :model="formSend" :rules="rules" label-width="90px" v-if="formSend != null">
                <el-form-item label="送检时间" v-if="is == 1" prop="inspectionTime">
                    <el-date-picker
                        class="maxWidth"
                        v-model="formSend.inspectionTime"
                        value-format="YYYY-MM-DD HH:mm"
                        format="YYYY-MM-DD HH:mm"
                        type="datetime"
                        :default-time="defaultTime"
                        placeholder="请选择"
                    />
                </el-form-item>
                <el-form-item label="退检时间" v-if="is == 2" prop="returnTime">
                    <el-date-picker
                        class="maxWidth"
                        v-model="formSend.returnTime"
                        value-format="YYYY-MM-DD HH:mm"
                        format="YYYY-MM-DD HH:mm"
                        type="datetime"
                        :default-time="defaultTime"
                        placeholder="请选择"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowSend = false">关 闭</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog :title="title" v-model="isShowcertificate" width="60%" append-to-body>
            <el-form
                ref="formcertificate"
                :model="formcertificate"
                :rules="rules"
                label-width="130px"
                v-if="formcertificate != null"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编号" prop="equipCode">
                            <el-input v-model="formcertificate.equipCode" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="goodsName">
                            <el-input v-model="formcertificate.goodsName" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备型号" prop="model">
                            <el-input v-model="formcertificate.model" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="完成检定时间" prop="verificationCompletionTime">
                            <el-date-picker
                                class="maxWidth"
                                :disabled="isInfo"
                                v-model="formcertificate.verificationCompletionTime"
                                value-format="YYYY-MM-DD HH:mm"
                                format="YYYY-MM-DD HH:mm"
                                type="datetime"
                                :default-time="defaultTime"
                                placeholder="请选择"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证书有效期" prop="usefulTime">
                            <el-date-picker
                                v-model="formcertificate.usefulTime"
                                type="date"
                                :disabled="isInfo"
                                class="maxWidth"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检定/校准单位" prop="verificationUnit">
                            <el-input
                                v-model="formcertificate.verificationUnit"
                                :disabled="isInfo"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证书编号" prop="certificateCode">
                            <el-input
                                v-model="formcertificate.certificateCode"
                                :disabled="isInfo"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="校准员" prop="calibrator">
                            <el-input v-model="formcertificate.calibrator" :disabled="isInfo" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="修正因子" prop="correctionFactor">
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
                            <el-input
                                v-model="formcertificate.correctionFactor"
                                :disabled="isInfo"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检定费用" prop="verificationFee">
                            <el-input
                                v-model="formcertificate.verificationFee"
                                :disabled="isInfo"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证书上传">
                            <upload-file
                                v-if="!isInfo"
                                :fileType="['pdf']"
                                fileSize="10"
                                txt="点击上传证书"
                                @input="getFile"
                                :value="formcertificate.sysAttachmentList"
                                :upData="{ bucketName: 'al-equip-certificate' }"
                            />
                            <template v-else>
                                <div
                                    class="fileClass"
                                    v-for="(item, i) in formcertificate.sysAttachmentList"
                                    :key="i"
                                    @click="handlePictureCardPreview(item)"
                                >
                                    {{ item.fileName }}
                                </div>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowcertificate = false">关 闭</el-button>
                    <el-button type="primary" @click="saveCertificate(0)" v-if="!isInfo">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {
    verificationlis,
    equipwarehouse,
    submissionverification,
    returnverification,
    certificateEntrySave,
    getverificationlis,
    verificationInfo,
    verificationupdate,
} from '@/api/deviceCenter';
import { dataStore } from '@/store/modules/app';
import UploadFile from '@/components/UploadFile';
export default {
    setup() {
        // initialize the store
        const store = dataStore();
        return { store };
    },
    components: { UploadFile },
    data() {
        return {
            activeName: 'first',
            queryParams: {
                equipCode: '',
                goodsName: '',
                verificationStatus: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            serchInfo: {
                equipCode: '',
                goodsName: '',
                certificateCode: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            loadingcertificate: true,
            lis: [],
            liscertificate: [],
            isShow: false,
            form: null,
            is: 1,
            isShowSend: false,
            formSend: null,
            rules: {
                inspectionTime: [{ required: true, message: '请选择送检时间', trigger: 'change' }],
                returnTime: [{ required: true, message: '请选择退检时间', trigger: 'change' }],
                verificationCompletionTime: [{ required: true, message: '请选择', trigger: 'change' }],
                expirationDate: [{ required: true, message: '请选择', trigger: 'change' }],
                verificationUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
                certificateCode: [{ required: true, message: '请输入', trigger: 'blur' }],
                calibrator: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
            defaultTime: '',
            isShowcertificate: false,
            formcertificate: null,
            entryType: '',
            isInfo: '',
            page: '',
            title: '证书录入',
        };
    },
    mounted() {
        this.getLis();
        this.getCerlis();
        // console.log(this.store.allUsers,'allUsersallUsersallUsers')
    },
    methods: {
        //获取数据
        getLis() {
            this.loading = true;
            verificationlis(this.queryParams).then((res) => {
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
                equipCode: '',
                goodsName: '',
                verificationStatus: '',
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
        //获取详情
        getInfo(row) {
            equipwarehouse({ id: row.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.form = res.data;
                this.isShow = true;
            });
        },
        //送检/退检
        showSend(row, type) {
            this.defaultTime = new Date().getTime();
            this.is = type;
            this.formSend = {
                equipId: row.id,
                inspectionTime: type == 1 ? '' : undefined,
                returnTime: type == 2 ? '' : undefined,
            };
            this.isShowSend = true;
        },
        //提交送检/退检
        submitForm() {
            this.$refs['formSend'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 1) {
                        var res = await submissionverification(this.formSend);
                    } else {
                        var res = await returnverification(this.formSend);
                    }

                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isShowSend = false;
                    this.getLis();
                }
            });
        },
        //证书录入
        certificateShow(row, type, is = null, page) {
            if (is == 'info') {
                this.title = '检定详情';
            } else {
                this.title = '证书录入';
            }

            this.defaultTime = new Date().getTime();
            this.entryType = type;
            this.isInfo = is;
            this.page = page;
            if (type == 0) {
                this.formcertificate = {
                    equipCode: row.equipCode,
                    goodsName: row.equipCode,
                    model: row.model,
                    equipId: row.id,
                    verificationCompletionTime: '', //完成检定时间
                    usefulTime: '', //证书有效期
                    verificationUnit: '', //	检定/校准单位
                    certificateCode: '', //	证书编号
                    calibrator: '', //	校准员
                    correctionFactor: '', //	修正因子
                    verificationFee: '', //检定费用
                };
                this.isShowcertificate = true;
            }
            if (type == 1) {
                verificationInfo({ id: row.id }).then((res) => {
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.formcertificate = res.data;
                    this.isShowcertificate = true;
                });
            }
        },
        //获取文件
        getFile(data) {
            this.formcertificate.sysAttachmentList = data;
        },
        //录入
        saveCertificate() {
            this.$refs['formcertificate'].validate(async (valid) => {
                if (valid) {
                    this.formcertificate['entryType'] = this.entryType;
                    if (this.page == 'up') {
                        var res = await verificationupdate(this.formcertificate);
                    } else {
                        var res = await certificateEntrySave(this.formcertificate);
                    }

                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isShowcertificate = false;
                    if (this.page == 'up') {
                        this.getCerlis();
                    } else {
                        this.getLis();
                        this.getCerlis();
                    }
                    this.isShowcertificate = false;
                }
            });
        },
        //获取检定记录列表
        getCerlis() {
            this.loadingcertificate = true;
            getverificationlis(this.serchInfo).then((res) => {
                this.loadingcertificate = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.serchInfo.total = res.total;
                this.liscertificate = res.rows;
            });
        },
        //重置
        resetcertificate() {
            this.serchInfo = {
                equipCode: '',
                goodsName: '',
                certificateCode: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getCerlis();
        },
        //搜索
        serchcertificate() {
            this.serchInfo.pageIndex = 1;
            this.getCerlis();
        },
        //改变条数
        handleSizeChangecertificate(val) {
            this.serchInfo.pageIndex = 1;
            this.serchInfo.pageSize = val;
            this.getCerlis();
        },
        //改变页数
        handleCurrentChangecertificate(val) {
            this.serchInfo.pageIndex = val;
            this.getCerlis();
        },
        // 预览
        handlePictureCardPreview(file) {
            console.log(window.location.origin + import.meta.env.VITE_APIIMG_URL + file.preUrl, file);
            if (file.fileName.split('.')[1] == 'pdf') {
               
                window.open(window.location.origin + import.meta.env.VITE_APIIMG_URL + file.preUrl, '_blank ');
            }
        },
    },
};
</script>
<style scoped lang="scss">
.fileClass {
    width: 100%;
    float: left;
    font-size: 14px;
    cursor: pointer;
}
.haveClass {
    cursor: pointer;
    color: #409eff;
}
</style>
