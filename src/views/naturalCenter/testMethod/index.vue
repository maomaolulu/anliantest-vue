<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-input
                    v-model="queryParams.substanceName"
                    class="selfSerchInput180 mm10"
                    placeholder="危害名称"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-select
                    v-model="queryParams.testCategory"
                    placeholder="检测对象/类别"
                    class="selfSerchInput180 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in testCates" :key="k" :label="item" :value="Number(k)"> </el-option>
                </el-select>
                <el-input
                    v-model="queryParams.testStandards"
                    class="selfSerchInput180 mm10"
                    placeholder="标准号"
                    clearable
                    @keyup.enter.native="serch"
                />
                <el-input
                    v-model="queryParams.testStandardsName"
                    class="selfSerchInput180 mm10"
                    placeholder="标准名称"
                    clearable
                    @keyup.enter.native="serch"
                />

                <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                <el-button icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="newAddTest">新增</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="危害因素" prop="substanceName" />
                <el-table-column label="检测对象/类别" prop="testCategory">
                    <template #default="scope">
                        <span>{{ testCates[scope.row.testCategory] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标准号" prop="testStandards" />
                <el-table-column label="标准名" prop="testStandardsName" />
                <el-table-column label="状态" prop="status" width="70">
                    <template #default="scope">
                        <span :style="{ color: lawStatus[scope.row.status].color }">{{
                            lawStatus[scope.row.status].txt
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="方法号" prop="testNumber" />
                <el-table-column label="方法名" prop="testName" />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-link type="primary" class="fontSize12" :underline="false" @click="editItem(scope.row)"
                            >编辑</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-popconfirm
                            :title="'确认删除危害因素(' + scope.row.substanceName + ')吗？'"
                            @confirm="showDispatch(scope.row)"
                        >
                            <template #reference>
                                <el-link type="primary" class="fontSize12" :underline="false">删除</el-link>
                            </template>
                        </el-popconfirm>

                        <div class="el-divider el-divider-vertical"></div>
                        <el-link type="primary" class="fontSize12" :underline="false" @click="showLimit(scope.row)"
                            >资质</el-link
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
        <el-dialog title="新增" v-model="isDispatch" width="70%" :close-on-click-modal="false">
            <el-form
                :model="dispatchInfo"
                :rules="rules"
                v-if="dispatchInfo != null"
                ref="roleForm"
                label-width="130px"
                class="demo-ruleForm"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="危害因素" prop="substanceName">
                            <el-select
                                class="maxWidth"
                                v-model="dispatchInfo.substanceName"
                                placeholder="苯（选择，可搜索，不可创建）"
                                filterable
                                clearable
                                remote
                                :remote-method="remoteMethod"
                                :loading="loadingSub"
                            >
                                <el-option
                                    v-for="(item, index) in substanceInfoList"
                                    :key="index"
                                    :label="item.substanceName"
                                    :value="item.substanceName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检测对象/类别" prop="testCategory">
                            <el-select
                                class="maxWidth"
                                v-model="dispatchInfo.testCategory"
                                placeholder="工作场所空气（下拉）"
                                @change="changeAndSerch"
                                filterable
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in testCates"
                                    :key="index"
                                    :label="item"
                                    :value="Number(index)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="检测标准号" prop="testStandards">
                            <el-select
                                class="maxWidth"
                                :disabled="!dispatchInfo.testCategory"
                                v-model="dispatchInfo.testStandards"
                                placeholder="工作场所空气（下拉）"
                                filterable
                                clearable
                                @change="
                                    (e) => {
                                        defaultChange(e, 'testStandards', 'testStandardsName');
                                    }
                                "
                                remote
                                :remote-method="
                                    (e) => {
                                        remoteMethodStand(e, 'testStandards');
                                    }
                                "
                                :loading="loading"
                            >
                                <el-option
                                    v-for="(item, index) in standardLis"
                                    :key="index"
                                    :label="item.testStandards"
                                    :value="item.testStandards"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检测标准名" prop="testStandardsName">
                            <el-select
                                class="maxWidth"
                                :disabled="!dispatchInfo.testCategory"
                                v-model="dispatchInfo.testStandardsName"
                                placeholder="工作场所空气（下拉）"
                                filterable
                                clearable
                                @change="
                                    (e) => {
                                        defaultChange(e, 'testStandardsName', 'testStandards');
                                    }
                                "
                                remote
                                :remote-method="
                                    (e) => {
                                        remoteMethodStand(e, 'testStandardsName');
                                    }
                                "
                                :loading="loading"
                            >
                                <el-option
                                    v-for="(item, index) in standardLis"
                                    :key="index"
                                    :label="item.testStandardsName"
                                    :value="item.testStandardsName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-card class="box-card" v-for="(item, index) in dispatchInfo.list" :key="index">
                    <template #header>
                        <div class="clearfix">
                            <span>方法 - {{ index + 1 }}</span>
                            <i
                                style="float: right"
                                v-if="dispatchInfo.list.length > 1"
                                @click="delMethon(index)"
                                class="el-icon-delete cardDel"
                                title="删除"
                            ></i>
                        </div>
                    </template>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="方法号"
                                :prop="'list.' + index + '.testNumber'"
                                :rules="{
                                    required: true,
                                    message: '方法号不能为空',
                                    trigger: 'blur',
                                }"
                            >
                                <el-input clearable v-model="item.testNumber" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="方法名"
                                :prop="'list.' + index + '.testName'"
                                :rules="{
                                    required: true,
                                    message: '方法名不能为空',
                                    trigger: 'blur',
                                }"
                            >
                                <el-input clearable v-model="item.testName" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <table class="layui-table">
                            <th width="120">采样方式</th>
                            <th>采样流量(L/min)</th>
                            <th>采样时长(min)</th>
                            <th>采样时长说明</th>
                            <th>采样设备</th>
                            <th>收集器</th>
                            <tr>
                                <td>
                                    <el-checkbox v-model="item.isAreaSample">定点</el-checkbox>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.fixedSampleTraffic"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.fixedSampleDuration"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input clearable v-model="item.fixedSampleNote" placeholder="请输入"></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.fixedSampleEquipment"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input clearable v-model="item.fixedCollector" placeholder="请输入"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-checkbox v-model="item.isPersonalSample">个体</el-checkbox>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.personalSampleTraffic"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.personalSampleDuration"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.personalSampleNote"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.personalSampleEquipment"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.personalCollector"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                            </tr>
                        </table>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="保存方式"
                                :prop="'list.' + index + '.saveMethod'"
                                :rules="{
                                    required: true,
                                    message: '保存方式不能为空',
                                    trigger: 'blur',
                                }"
                            >
                                <el-input clearable v-model="item.saveMethod" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="保存期限"
                                :prop="'list.' + index + '.saveTerm'"
                                :rules="{
                                    required: true,
                                    message: '保存期限不能为空',
                                    trigger: 'blur',
                                }"
                            >
                                <el-input clearable v-model="item.saveTerm" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="吸收液" prop="absorbentSolution">
                                <el-input clearable v-model="item.absorbentSolution" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="检测设备"
                                :prop="'list.' + index + '.detectionEquipment'"
                                :rules="{
                                    required: true,
                                    message: '检测设备不能为空',
                                    trigger: 'blur',
                                }"
                            >
                                <el-input clearable v-model="item.detectionEquipment" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <table class="layui-table">
                            <th width="120">检出限</th>
                            <th>最低检出浓度</th>
                            <th width="150">标准采样体积</th>
                            <th>检出限说明</th>
                            <th>计算</th>
                            <th width="100">保留位数</th>
                            <tr>
                                <td>
                                    <el-input clearable v-model="item.detectionLimit" placeholder="请输入"></el-input>
                                </td>
                                <td>
                                    <el-input clearable v-model="item.limitOfDetection" placeholder="请输入"></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.standardSamplingVolume"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.explanationOfDetectionLimit"
                                        placeholder="请输入"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input
                                        clearable
                                        v-model="item.calculation"
                                        placeholder="请输入"
                                        type="textarea"
                                        :rows="1"
                                    ></el-input>
                                </td>
                                <td>
                                    <el-input clearable v-model="item.decimalPlaces" placeholder="请输入"></el-input>
                                </td>
                            </tr>
                        </table>
                    </el-row>
                </el-card>
                <div class="flex_e_c">
                    <el-button type="primary" @click="pushList">新增方法</el-button>
                </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isDispatch = false">取 消</el-button>
                    <el-button type="primary" @click="sumbitDispatch">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="编辑" v-model="isEdit" width="70%" :close-on-click-modal="false">
            <el-form
                :model="dispatchInfo"
                :rules="rules"
                v-if="dispatchInfo != null"
                ref="roleForm"
                label-width="160px"
                class="demo-ruleForm"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="危害因素" prop="substanceName">
                            <el-select
                                disabled
                                class="maxWidth"
                                v-model="dispatchInfo.substanceName"
                                placeholder="苯（选择，可搜索，不可创建）"
                                filterable
                                clearable
                                remote
                                :remote-method="remoteMethod"
                                :loading="loadingSub"
                            >
                                <el-option
                                    v-for="(item, index) in substanceInfoList"
                                    :key="index"
                                    :label="item.substanceName"
                                    :value="item.substanceName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检测对象/类别" prop="testCategory">
                            <el-select
                                disabled
                                class="maxWidth"
                                v-model="dispatchInfo.testCategory"
                                placeholder="工作场所空气（下拉）"
                                @change="changeAndSerch"
                                filterable
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in testCates"
                                    :key="index"
                                    :label="item"
                                    :value="Number(index)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="检测标准号" prop="testStandards">
                            <el-select
                                class="maxWidth"
                                disabled
                                v-model="dispatchInfo.testStandards"
                                placeholder="工作场所空气（下拉）"
                                filterable
                                clearable
                                @change="
                                    (e) => {
                                        defaultChange(e, 'testStandards', 'testStandardsName');
                                    }
                                "
                                remote
                                :remote-method="
                                    (e) => {
                                        remoteMethodStand(e, 'testStandards');
                                    }
                                "
                                :loading="loading"
                            >
                                <el-option
                                    v-for="(item, index) in standardLis"
                                    :key="index"
                                    :label="item.testStandards"
                                    :value="item.testStandards"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检测标准名" prop="testStandardsName">
                            <el-select
                                class="maxWidth"
                                disabled
                                v-model="dispatchInfo.testStandardsName"
                                placeholder="工作场所空气（下拉）"
                                filterable
                                clearable
                                @change="
                                    (e) => {
                                        defaultChange(e, 'testStandardsName', 'testStandards');
                                    }
                                "
                                remote
                                :remote-method="
                                    (e) => {
                                        remoteMethodStand(e, 'testStandardsName');
                                    }
                                "
                                :loading="loading"
                            >
                                <el-option
                                    v-for="(item, index) in standardLis"
                                    :key="index"
                                    :label="item.testStandardsName"
                                    :value="item.testStandardsName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="方法号"
                            prop="testNumber"
                            :rules="[{ required: true, message: '方法号不能为空' }]"
                        >
                            <el-input
                                clearable
                                v-model="dispatchInfo.testNumber"
                                disabled
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="方法名"
                            prop="testName"
                            :rules="[{ required: true, message: '方法名不能为空' }]"
                        >
                            <el-input
                                clearable
                                v-model="dispatchInfo.testName"
                                disabled
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <table class="layui-table">
                        <th width="120">采样方式</th>
                        <th>采样流量(L/min)</th>
                        <th>采样时长(min)</th>
                        <th>采样时长说明</th>
                        <th>采样设备</th>
                        <th>收集器</th>
                        <tr>
                            <td>
                                <el-checkbox v-model="dispatchInfo.isAreaSample">定点</el-checkbox>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.fixedSampleTraffic"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.fixedSampleDuration"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.fixedSampleNote"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.fixedSampleEquipment"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.fixedCollector"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="dispatchInfo.isPersonalSample">个体</el-checkbox>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.personalSampleTraffic"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.personalSampleDuration"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.personalSampleNote"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.personalSampleEquipment"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.personalCollector"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                        </tr>
                    </table>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="保存方式"
                            prop="saveMethod"
                            :rules="[{ required: true, message: '保存方式不能为空' }]"
                        >
                            <el-input clearable v-model="dispatchInfo.saveMethod" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="保存期限"
                            prop="saveTerm"
                            :rules="[{ required: true, message: '保存期限不能为空' }]"
                        >
                            <el-input clearable v-model="dispatchInfo.saveTerm" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="吸收液" prop="absorbentSolution">
                            <el-input
                                clearable
                                v-model="dispatchInfo.absorbentSolution"
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="检测设备"
                            prop="detectionEquipment"
                            :rules="[{ required: true, message: '检测设备不能为空' }]"
                        >
                            <el-input
                                clearable
                                v-model="dispatchInfo.detectionEquipment"
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <table class="layui-table">
                        <th width="120">检出限</th>
                        <th>最低检出浓度</th>
                        <th width="150">标准采样体积</th>
                        <th>检出限说明</th>
                        <th>计算</th>
                        <th width="100">保留位数</th>
                        <tr>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.detectionLimit"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.limitOfDetection"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.standardSamplingVolume"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.explanationOfDetectionLimit"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.calculation"
                                    placeholder="请输入"
                                    type="textarea"
                                    :rows="1"
                                ></el-input>
                            </td>
                            <td>
                                <el-input
                                    clearable
                                    v-model="dispatchInfo.decimalPlaces"
                                    placeholder="请输入"
                                ></el-input>
                            </td>
                        </tr>
                    </table>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isEdit = false">取 消</el-button>
                    <el-button type="primary" @click="sumbitDispatchEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {
    getTestMenthodLis,
    dropdownList,
    substanceInfoDropdownList,
    substancetestmethodSave,
    substancetestmethodUpdate,
    substancetestmethodDel,
} from '@/api/naturalCenter';
export default {
    data() {
        return {
            queryParams: {
                substanceName: '',
                testCategory: '',
                testStandards: '',
                testStandardsName: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            loading: true,
            lis: [],
            isDispatch: false,
            dispatchInfo: null,
            substanceInfoList: [], //危害因素下拉
            loadingSub: false,
            standardLis: [], //标准下拉
            rules: {
                substanceName: [{ required: true, message: '请选择危害因素', trigger: 'change' }],
                testCategory: [{ required: true, message: '请选择检测对象/类别', trigger: 'change' }],
                testStandards: [{ required: true, message: '请选择检测标准号', trigger: 'change' }],
                testStandardsName: [{ required: true, message: '请选择检测标准名', trigger: 'change' }],
            },
            isEdit: false,
        };
    },
    mounted() {
        this.getLis();
        this.getsubstanceInfoDropdownList();
    },
    methods: {
        //获取下拉危害因素
        getsubstanceInfoDropdownList(name = '') {
            substanceInfoDropdownList({ substanceName: name }).then((res) => {
                this.substanceInfoList = res;
                this.loadingSub = false;
            });
        },
        //远程搜索
        remoteMethod(query) {
            this.loadingSub = true;
            this.substanceInfoList = [];
            if (query !== '') {
                this.getsubstanceInfoDropdownList(query);
            } else {
                this.getsubstanceInfoDropdownList();
            }
        },
        //获取列表
        getLis() {
            this.loading = true;
            getTestMenthodLis(this.queryParams).then((res) => {
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
                substanceName: '',
                testCategory: '',
                testStandards: '',
                testStandardsName: '',
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
            this.dispatchInfo = {
                substanceName: '',
                testCategory: '',
                testStandards: '',
                testStandardsName: '',
                list: [
                    {
                        testNumber: '',
                        testName: '',
                        isAreaSample: 0,
                        isPersonalSample: 0,
                        fixedSampleTraffic: '',
                        fixedSampleDuration: '',
                        fixedSampleNote: '',
                        fixedSampleEquipment: '',
                        fixedCollector: '',
                        personalSampleTraffic: '',
                        personalSampleDuration: '',
                        personalSampleNote: '',
                        personalSampleEquipment: '',
                        personalCollector: '',
                        saveMethod: '',
                        saveTerm: '',
                        absorbentSolution: '',
                        detectionLimit: '',
                        limitOfDetection: '',
                        standardSamplingVolume: '',
                        explanationOfDetectionLimit: '',
                        calculation: '',
                        decimalPlaces: '',
                        detectionEquipment: '',
                    },
                ],
            };
            this.isDispatch = true;
        },
        //获取标准
        changeAndSerch(e) {
            this.standardLis = [];
            this.dispatchInfo.testStandards = '';
            this.dispatchInfo.testStandardsName = '';
            dropdownList({ testCategory: e }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.standardLis = res.data;
            });
        },
        //改变标准号或标准名
        defaultChange(e, is, set) {
            if (e == '') {
                this.dispatchInfo.testStandards = '';
                this.dispatchInfo.testStandardsName = '';
            } else {
                this.standardLis.forEach((item) => {
                    if (item[is] == e) {
                        console.log(item);
                        this.dispatchInfo[set] = item[set];
                    }
                });
            }
        },
        // 远程搜索标准
        remoteMethodStand(e, type) {
            this.loading = true;
            this.standardLis = [];
            var query = {
                testCategory: this.dispatchInfo.testCategory,
            };
            query[type] = e;
            dropdownList(query).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.loading = false;
                this.standardLis = res.data;
            });
        },
        //追加方法
        pushList() {
            this.dispatchInfo.list.push({
                testNumber: '',
                testName: '',
                isAreaSample: 0,
                isPersonalSample: 0,
                fixedSampleTraffic: '',
                fixedSampleDuration: '',
                fixedSampleNote: '',
                fixedSampleEquipment: '',
                fixedCollector: '',
                personalSampleTraffic: '',
                personalSampleDuration: '',
                personalSampleNote: '',
                personalSampleEquipment: '',
                personalCollector: '',
                saveMethod: '',
                saveTerm: '',
                absorbentSolution: '',
                detectionLimit: '',
                limitOfDetection: '',
                standardSamplingVolume: '',
                explanationOfDetectionLimit: '',
                calculation: '',
                decimalPlaces: '',
                detectionEquipment: '',
            });
        },
        //删除方法
        delMethon(idx) {
            this.dispatchInfo.list.splice(idx, 1);
        },
        //提交新增
        sumbitDispatch() {
            this.$refs['roleForm'].validate(async (valid) => {
                if (valid) {
                    console.log(11111111111111);
                    var substanceInfoId = '';
                    this.substanceInfoList.forEach((item) => {
                        if (item['substanceName'] == this.dispatchInfo.substanceName) {
                            substanceInfoId = item.id;
                        }
                    });
                    var substanceTestLawId = '';
                    this.standardLis.forEach((item) => {
                        if (item['testStandards'] == this.dispatchInfo.testStandards) {
                            substanceTestLawId = item.id;
                        }
                    });
                    this.dispatchInfo.list.forEach((item, i) => {
                        if (item.isAreaSample) {
                            if (!item['fixedSampleTraffic']) {
                                return this.$message.error('方法' + (i + 1) + '的定点采样流量为空');
                            }
                            if (!item['fixedSampleDuration']) {
                                return this.$message.error('方法' + (i + 1) + '的定点采样时长为空');
                            }
                            if (!item['fixedSampleEquipment']) {
                                return this.$message.error('方法' + (i + 1) + '的定点采样设备为空');
                            }
                            if (!item['fixedCollector']) {
                                return this.$message.error('方法' + (i + 1) + '的定点采样收集器为空');
                            }
                        }
                        if (item.isPersonalSample) {
                            if (!item['personalSampleTraffic']) {
                                return this.$message.error('方法' + (i + 1) + '的个体采样流量为空');
                            }
                            if (!item['personalSampleDuration']) {
                                return this.$message.error('方法' + (i + 1) + '的个体采样时长为空');
                            }
                            if (!item['personalSampleEquipment']) {
                                return this.$message.error('方法' + (i + 1) + '的个体采样设备为空');
                            }
                            if (!item['personalCollector']) {
                                return this.$message.error('方法' + (i + 1) + '的个体采样收集器为空');
                            }
                        }
                        item.isAreaSample = item.isAreaSample == true ? 1 : 0;
                        item.isPersonalSample = item.isPersonalSample == true ? 1 : 0;
                        item['substanceName'] = this.dispatchInfo.substanceName;
                        item['testCategory'] = this.dispatchInfo.testCategory;
                        item['testStandards'] = this.dispatchInfo.testStandards;
                        item['testStandardsName'] = this.dispatchInfo.testStandardsName;
                        item['substanceTestLawId'] = substanceTestLawId;
                        item['substanceInfoId'] = substanceInfoId;
                    });
                    substancetestmethodSave(this.dispatchInfo.list).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.getLis();
                        this.$message.success(res.msg);
                        this.isDispatch = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //点击编辑
        editItem(row) {
            console.log(row);
            this.dispatchInfo = row;
            this.dispatchInfo.isAreaSample = this.dispatchInfo.isAreaSample ? true : false;
            this.dispatchInfo.isPersonalSample = this.dispatchInfo.isPersonalSample ? true : false;
            this.isEdit = true;
        },
        //编辑提交
        sumbitDispatchEdit() {
            this.$refs['roleForm'].validate(async (valid) => {
                if (valid) {
                    if (this.dispatchInfo.isAreaSample) {
                        if (!this.dispatchInfo['fixedSampleTraffic']) {
                            return this.$message.error('定点采样流量为空');
                        }
                        if (!this.dispatchInfo['fixedSampleDuration']) {
                            return this.$message.error('定点采样时长为空');
                        }
                        if (!this.dispatchInfo['fixedSampleEquipment']) {
                            return this.$message.error('定点采样设备为空');
                        }
                        if (!this.dispatchInfo['fixedCollector']) {
                            return this.$message.error('定点采样收集器为空');
                        }
                    }
                    if (this.dispatchInfo.isPersonalSample) {
                        if (!this.dispatchInfo['personalSampleTraffic']) {
                            return this.$message.error('个体采样流量为空');
                        }
                        if (!this.dispatchInfo['personalSampleDuration']) {
                            return this.$message.error('个体采样时长为空');
                        }
                        if (!this.dispatchInfo['personalSampleEquipment']) {
                            return this.$message.error('个体采样设备为空');
                        }
                        if (!this.dispatchInfo['personalCollector']) {
                            return this.$message.error('个体采样收集器为空');
                        }
                    }
                    this.dispatchInfo.isAreaSample = this.dispatchInfo.isAreaSample == true ? 1 : 0;
                    this.dispatchInfo.isPersonalSample = this.dispatchInfo.isPersonalSample == true ? 1 : 0;
                    substancetestmethodUpdate(this.dispatchInfo).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.getLis();
                        this.$message.success(res.msg);
                        this.isDispatch = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //删除
        showDispatch(row) {
            substancetestmethodDel({ id: row.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.getLis();
                this.$message.success('删除成功');
            });
        },
        //资质点击
        showLimit(row){
            this.$message.success('功能待开发');
        }
    },
};
</script>
<style lang="scss" scoped>
.selfInput + .selfInput {
    margin-left: 10px;
}

.selftTag + .selftTag {
    margin-left: 5px;
}
.layui-table td,
.layui-table th {
    position: relative;
    padding: 9px 15px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
}
.layui-table td,
.layui-table th,
.layui-table-col-set,
.layui-table-fixed-r,
.layui-table-grid-down,
.layui-table-header,
.layui-table-page,
.layui-table-tips-main,
.layui-table-tool,
.layui-table-total,
.layui-table-view,
.layui-table[lay-skin='line'],
.layui-table[lay-skin='row'] {
    border-width: 1px;
    border: 1px solid #e5e5e5;
    &:hover {
        background-color: #e1e7f0 !important;
    }
}
table {
    border-collapse: collapse;
    margin-bottom: 20px;
}
.cardDel {
    color: #f56c6c;
    cursor: pointer;
    font-size: 20px;
}
.box-card {
    margin-bottom: 15px;
}
</style>