<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-input
                    v-model="queryParams.substanceNameOrOtherName"
                    class="selfSerchInput180 mm10"
                    placeholder="危害名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.casCode"
                    class="selfSerchInput180 mm10"
                    placeholder="CAS号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select
                    v-model="queryParams.substanceType"
                    placeholder="类别"
                    class="selfSerchInput180 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in hazardousTypes" :key="k" :label="item" :value="Number(k)">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="addItem">新增</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="危害名称" prop="substanceName" />
                <el-table-column label="其他名称" prop="substanceOtherName" />
                <el-table-column label="英文名" prop="substanceEnglishName" />
                <el-table-column label="CAS号" prop="casCode" />
                <el-table-column label="类别" prop="substanceType">
                    <template #default="scope">
                        <span>{{ hazardousTypes[scope.row.substanceType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="updateTime" width="150" />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-link type="primary" class="fontSize12" :underline="false" @click="editItem(scope.row)"
                            >编辑</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-popconfirm
                            :title="'确认删除危害因素(' + scope.row.substanceName + ')吗？'"
                            @confirm="delItem(scope.row)"
                        >
                            <template #reference>
                                <el-link type="primary" class="fontSize12" :underline="false">删除</el-link>
                            </template>
                        </el-popconfirm>

                        <div class="el-divider el-divider-vertical"></div>
                        <el-link type="primary" class="fontSize12" :underline="false" @click="showLimit(scope.row)"
                            >限值</el-link
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
        <el-dialog :title="is == 'add' ? '新增危害因素' : '编辑危害因素'" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-if="form != null">
                <div class="boxTitle">危害因素基本信息</div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="危害因素类别" prop="substanceType">
                            <el-select
                                v-model="form.substanceType"
                                placeholder="请选择"
                                v-if="is == 'edit'"
                                disabled
                                class="maxWidth"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in hazardousTypes"
                                    :key="k"
                                    :label="item"
                                    :value="Number(k)"
                                >
                                </el-option>
                            </el-select>
                            <el-select
                                v-model="form.substanceType"
                                placeholder="请选择"
                                v-if="is == 'add'"
                                class="maxWidth"
                                clearable
                            >
                                <el-option label="毒物(包括co/co2)" :value="Number(1)"> </el-option>
                                <el-option label="粉尘" :value="Number(2)"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="危害因素名称" prop="substanceName">
                            <el-input v-model="form.substanceName" :disabled="is == 'edit'" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="其他中文名" prop="substanceOtherName">
                            <el-input v-model="form.substanceOtherName" placeholder="若存在多种叫法请用“；”分隔" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名" prop="substanceEnglishName">
                            <el-input v-model="form.substanceEnglishName" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.substanceType < 3">
                    <el-col :span="12">
                        <el-form-item label="CAS号" prop="casCode">
                            <el-input v-model="form.casCode" placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否折减" prop="isReduction">
                            <el-switch
                                v-model="form.isReduction"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="boxTitle" v-if="form.substanceType < 3">理化性质</div>
                <el-row v-if="form.substanceType < 3">
                    <el-col :span="12">
                        <el-form-item label="熔点(℃)" prop="meltingPoint">
                            <el-input v-model="form.meltingPoint" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="沸点(℃)" prop="boilingPoint">
                            <el-input v-model="form.boilingPoint" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="boxTitle">毒理学</div>
                <el-row v-if="form.substanceType < 3">
                    <el-form-item label="毒性质料" prop="toxicityData">
                        <el-input v-model="form.toxicityData" type="textarea" placeholder="请输入" clearable />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="form.substanceType < 3">
                        <el-form-item label="侵入途径" prop="routesOfInvasion">
                            <el-input v-model="form.routesOfInvasion" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="可能导致的职业病" prop="occupationalDisease">
                            <el-input v-model="form.occupationalDisease" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="对人健康的影响" prop="healthImpact">
                        <el-input v-model="form.healthImpact" type="textarea" placeholder="请输入" clearable />
                    </el-form-item>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="isShow = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 限值 -->
        <el-dialog title="限值" v-model="islimiting" width="80%" append-to-body :before-close="onClose">
            <div class="flex_sb_c" style="margin-bottom: 15px">
                <span class="fontW_15">{{ hazardousTypes[limtData.substanceType] }}</span>
                <el-button
                    type="primary"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                    @click="addLimte"
                    >新增</el-button
                >
            </div>
            <el-table :data="limts" max-height="400" border :row-class-name="tableRowClassName">
                <el-table-column type="index" width="50" label="序号" align="center" />
                <el-table-column label="条件" prop="conditionNote">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.conditionNote"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="MAC"
                    prop="mac"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.mac"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="PC-TWA"
                    prop="pcTwa"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.pcTwa"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="PC-STEL"
                    prop="pcStel"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.pcStel"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="临界不良反应"
                    prop="adverseReactions"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.adverseReactions"></el-input>
                    </template>
                </el-table-column>
                <!-- 噪声 -->
                <el-table-column label="噪声:接触时间" prop="noiseTimeFrequency" v-if="limtData.substanceType == 3">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.noiseTimeFrequency"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="接触限值[dB(A)]" prop="noisePeakValue" v-if="limtData.substanceType == 3">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.noisePeakValue"></el-input>
                    </template>
                </el-table-column>
                <!-- 高温 -->
                <el-table-column label="接触时间率(%)" prop="contactTimeRate" v-if="limtData.substanceType == 4">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.contactTimeRate"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="体力劳动强度Ⅰ限值(℃)"
                    prop="laborIntensityOne"
                    v-if="limtData.substanceType == 4"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.laborIntensityOne"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="体力劳动强度Ⅱ限值(℃)"
                    prop="laborIntensityTwo"
                    v-if="limtData.substanceType == 4"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.laborIntensityTwo"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="体力劳动强度Ⅲ限值(℃)"
                    prop="laborIntensityThree"
                    v-if="limtData.substanceType == 4"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.laborIntensityThree"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="体力劳动强度Ⅳ限值(℃)"
                    prop="laborIntensityFour"
                    v-if="limtData.substanceType == 4"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.laborIntensityFour"></el-input>
                    </template>
                </el-table-column>
                <!-- 紫外辐射                 -->
                <el-table-column label="辐照度" prop="irradiance" v-if="limtData.substanceType == 5">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.irradiance"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="照射量" prop="exposure" v-if="limtData.substanceType == 5">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.exposure"></el-input>
                    </template>
                </el-table-column>
                <!-- 微波辐射 -->
                <el-table-column label="日剂量" prop="dailyDose" v-if="limtData.substanceType == 10">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.dailyDose"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="8h平均功率密度" prop="averagePowerDensity" v-if="limtData.substanceType == 10">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.averagePowerDensity"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="非8h平均功率密度"
                    prop="nonAveragePowerDensity"
                    v-if="limtData.substanceType == 10"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.nonAveragePowerDensity"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="短时间功率接触密度"
                    prop="shortPowerDensity"
                    v-if="limtData.substanceType == 10"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.shortPowerDensity"></el-input>
                    </template>
                </el-table-column>
                <!-- 6.手传振动 -->
                <el-table-column
                    label="等能量频率计权振动加速度"
                    prop="acceleration"
                    v-if="limtData.substanceType == 6"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.acceleration"></el-input>
                    </template>
                </el-table-column>
                <!-- 7.工频电场 -->
                <el-table-column
                    label="频率（Hz）"
                    prop="frequency"
                    v-if="limtData.substanceType == 7 || limtData.substanceType == 8"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.frequency"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="电场强度"
                    prop="electricFieldIntensity"
                    v-if="limtData.substanceType == 7 || limtData.substanceType == 8 || limtData.substanceType == 9"
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.electricFieldIntensity"></el-input>
                    </template>
                </el-table-column>
                <!-- 8.高频电磁场 -->
                <el-table-column label="磁场强度" prop="magneticFieldIntensity" v-if="limtData.substanceType == 8">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.magneticFieldIntensity"></el-input>
                    </template>
                </el-table-column>
                <!-- 9.超高频辐射 -->
                <el-table-column label="功率密度(mW/cm²)" prop="powerDensity" v-if="limtData.substanceType == 9">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.powerDensity"></el-input>
                    </template>
                </el-table-column>
                <!-- 11.激光辐射 -->
                <el-table-column label="波长(nm)" prop="laserWavelength" width="90" v-if="limtData.substanceType == 11">
                    <template #default="scope">
                        <el-image
                            fit="cover"
                            v-if="scope.row.laserWavelength"
                            class="imgWidth"
                            :src="selfEnv() + scope.row.laserWavelength"
                            @click="handlePictureCardPreview(selfEnv() + scope.row.laserWavelength)"
                        >
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    label="照射时间(s)"
                    prop="laserExposureTime"
                    width="90"
                    v-if="limtData.substanceType == 11"
                >
                    <template #default="scope">
                        <el-image
                            fit="cover"
                            v-if="scope.row.laserExposureTime"
                            class="imgWidth"
                            :src="selfEnv()+ scope.row.laserExposureTime"
                            @click="handlePictureCardPreview(selfEnv() + scope.row.laserExposureTime)"
                        >
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="照射部位" prop="laserExposureSite" v-if="limtData.substanceType == 11">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.laserExposureSite"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="激光照射量(J/cm²)"
                    prop="laserExposure"
                    width="90"
                    v-if="limtData.substanceType == 11"
                >
                    <template #default="scope">
                        <el-image
                            fit="cover"
                            v-if="scope.row.laserExposure"
                            class="imgWidth"
                            :src="selfEnv() + scope.row.laserExposure"
                            @click="handlePictureCardPreview(selfEnv() + scope.row.laserExposure)"
                        >
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    label="激光辐照度(W/cm²)"
                    prop="laserIrradiance"
                    width="90"
                    v-if="limtData.substanceType == 11"
                >
                    <template #default="scope">
                        <el-image
                            fit="cover"
                            v-if="scope.row.laserIrradiance"
                            class="imgWidth"
                            :src="selfEnv()+ scope.row.laserIrradiance"
                            @click="handlePictureCardPreview(selfEnv() + scope.row.laserIrradiance)"
                        >
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column
                    label="接触时间(h)"
                    prop="contactTime"
                    v-if="
                        limtData.substanceType == 6 ||
                        limtData.substanceType == 7 ||
                        limtData.substanceType == 8 ||
                        limtData.substanceType == 9 ||
                        limtData.substanceType == 11
                    "
                >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.contactTime"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark">
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.remark"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    width="120"
                    label="操作"
                    align="center"
                    v-if="limtData.substanceType == 1 || limtData.substanceType == 2"
                >
                    <template #default="scope">
                        <el-link
                            type="primary"
                            class="fontSize12"
                            :underline="false"
                            @click="delLimit(scope.row, scope.$index)"
                            >删除</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-link
                            type="primary"
                            class="fontSize12"
                            :underline="false"
                            @click="saveLimit(scope.row, scope.$index)"
                            >{{scope.row.id?'编辑保存':'新增保存'}}</el-link
                        >
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="islimiting = false">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
        <el-image-viewer
            class="imageViewr"
            v-if="dialogVisibleView"
            :url-list="[dialogImageUrl]"
            @close="closeViewer"
        />
    </div>
</template>
<script>
import {
    getSubstanceInfo,
    substanceAdd,
    substanceUpdate,
    substanceDel,
    getSubstancelimit,
    substancelimitDel,
    substancelimitAdd,
    substancelimitUpdate,
} from '@/api/naturalCenter';

import { ElImageViewer} from 'element-plus'
export default {
    data() {
        return {
            queryParams: {
                substanceNameOrOtherName: '',
                casCode: '',
                substanceType: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            lis: [],
            form: null,
            is: 'add',
            isShow: false,
            rules: {
                substanceType: [{ required: true, message: '请选择危害因素类别', trigger: 'change' }],
                substanceName: [{ required: true, message: '请输入危害因素名称', trigger: 'blur' }],
                substanceEnglishName: [{ required: true, message: '请输入危害因素英文名称', trigger: 'blur' }],
                isReduction: [{ required: true, message: '请选择是否折减', trigger: 'change' }],
            },
            islimiting: false,
            limts: [],
            limtData: '',
            dialogImageUrl: '', //预览的图片
            dialogVisibleView: false,
        };
    },
    components: {
        ElImageViewer
    },
    mounted() {
        this.getLis();
    },
    methods: {
        //鲜艳提示未保存
        tableRowClassName({row, rowIndex}) {
        if (!row.id ) {
          return 'warning-row';
        }  {
          return 
        }
       
      },
        //获取列表
        getLis() {
            this.loading = true;
            getSubstanceInfo(this.queryParams).then((res) => {
                this.loading = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams.total = res.data.totalCount;
                this.lis = res.data.list;
            });
        },
        //重置
        reset() {
            this.queryParams = {
                substanceNameOrOtherName: '',
                casCode: '',
                substanceType: '',
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
        //点击新增
        addItem() {
            this.is = 'add';
            this.form = {
                substanceType: '',
                substanceName: '',
                substanceOtherName: '',
                substanceEnglishName: '',
                casCode: '',
                isReduction: 1,
                meltingPoint: '',
                boilingPoint: '',
                toxicityData: '',
                routesOfInvasion: '',
                occupationalDisease: '',
                healthImpact: '',
            };
            this.isShow = true;
        },
        //点击编辑
        editItem(row) {
            console.log(111)
            this.is = 'edit';
            this.form = row;
            this.isShow = true;
        },
        //删除
        delItem(row) {
            substanceDel({ id: row.id }).then((res) => {
                this.$message.success('删除成功');
                this.getLis();
            });
        },
        //提交数据
        submitForm() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 'add') {
                        var res = await substanceAdd(this.form);
                    } else {
                        var res = await substanceUpdate(this.form);
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
        //查看限值
        showLimit(row) {
            this.limtData = row;
            this.islimiting = true;
            getSubstancelimit({ substanceInfoId: row.id }).then((res) => {
                this.limts = res.data;
                this.islimiting = true;
            });
        },
        //新增一条限值
        addLimte() {
            this.limts.push({
                substanceInfoId:this.limtData.id,
                conditionNoteNoteNote: '', //                     条件
                mac: '', //                          	 MAC
                pcTwa: '', //                        		PC-TWA
                pcStel: '', //                          	PC-STEL
                adverseReactions: '', //    				临界不良反应
                noiseTimeFrequency: '', //    			噪声：接触时间   脉冲噪声：工作日接触脉冲次数（n,次）
                noisePeakValue: '', //		噪声：接触限值[dB(A)]   脉冲噪声：声压级峰值[dB(A)]
                contactTimeRate: '', //                          接触时间率(%)
                laborIntensityOne: '', //       体力劳动强度Ⅰ限值(℃)
                laborIntensityTwo: '', //      体力劳动强度Ⅱ限值(℃)
                laborIntensityThree: '', //     体力劳动强度Ⅲ限值(℃)
                laborIntensityFour: '', //       体力劳动强度Ⅳ限值(℃)
                irradiance: '', //    辐照度（紫外辐射时单位 μW/cm²）
                exposure: '', //           照射量（紫外辐射时单位mJ/cm²）
                dailyDose: '', //       			日剂量(μW·h/cm²)
                averagePowerDensity: '', //  		8h平均功率密度(μW/cm²)
                nonAveragePowerDensity: '', //  	非8h平均功率密度(μW/cm²)
                shortPowerDensity: '', //   	短时间功率接触密度(mW/cm²)
                contactTime: '', //         			   接触时间(h)
                acceleration: '', //	等能量频率计权振动加速度(m/s²)
                frequency: '', //                       频率（Hz）
                electricFieldIntensity: '', //    电场强度（工频电场时单位为 kV/m，超高频辐射与高频电磁场时单位为V/m）
                magneticFieldIntensity: '', //  		磁场强度(A/m)
                powerDensity: '', //                	功率密度(mW/cm²)
                laserWavelength: '', //           波长(nm)
                laserExposureTime: '', //	照射时间(s)
                laserExposureSite: '', //		照射部位
                laserExposure: '', //		激光照射量(J/cm²)
                laserIrradiance: '', //		激光辐照度(W/cm²)
                remark: '', //                		备注
            });
        },
        //删除一条限值
        delLimit(row, idx) {
            if (row.id) {
                this.$confirm(`确认删除序号（${idx + 1}）限值？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        substancelimitDel({ id: row.id }).then((res) => {
                            this.$message.success('删除成功');
                            this.limts.splice(idx, 1);
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            } else {
                this.limts.splice(idx, 1);
            }
        },
        //保存限值
        async saveLimit(row, idx) {
            if (row.id) {
                var res = await substancelimitUpdate(row);
            } else {
                var res = await substancelimitAdd(row);
            }
            if (res.code != 200) {
                return this.$message.error(res.msg);
            }
            this.$message.success('保存成功');
            this.limts.splice(idx, 1, res.data);
        },
        onClose(done){
            console.log(this.limts)
            var is=this.limts.every(element => {
                return element.id
            });
            if(is){
                done()
            }else{
                this.$message.error('还有数据未保存(黄色标识)');
            }
            
        },
        // 预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file;
            this.dialogVisibleView = true;
        },
        // 关闭查看器
        closeViewer() {
            console.log(3333333333333)
            this.dialogVisibleView = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.boxTitle {
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
    padding-left: 15px;
    margin-bottom: 15px;
}
.imgWidth {
    max-width: 95%;
    max-height: 50px;
}
.el-image-viewer__wrapper {
    z-index: 3000 !important;
}
::v-deep(.warning-row){
    background: oldlace !important;
}
</style>