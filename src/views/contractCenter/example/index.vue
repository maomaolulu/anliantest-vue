<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="serchInfo" ref="queryForm2" :inline="true">
                <el-select v-model="serchInfo.companyId" placeholder="所属公司" class="selfSerchInput mm5" clearable>
                    <el-option v-for="(item, k) in store.allCompanys" :key="k" :label="item.deptName" :value="k">
                    </el-option>
                </el-select>
                <el-select
                    v-model="serchInfo.contractTypeId"
                    placeholder="合同类型"
                    class="selfSerchInput120 mm5"
                    clearable
                >
                    <el-option v-for="(item, k) in contractTypes" :key="k" :label="item.name" :value="k"> </el-option>
                </el-select>
                <el-input v-model="serchInfo.name" class="selfSerchInput mm5" clearable placeholder="合同范本名称" />
                <el-select v-model="serchInfo.status" placeholder="状态" class="selfSerchInput120 mm5" clearable>
                    <el-option v-for="(item, k) in contractSampleStatus" :key="k" :label="item.txt" :value="k">
                    </el-option>
                </el-select>
                <el-button type="primary" class="mm5" icon="Search" @click="serch">搜索</el-button>
                <el-button class="mm5" icon="Refresh" @click="reset">重置</el-button>
                <el-button type="primary" plain :icon="Plus" class="mm5" @click="newTemplate">新增范本</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="所属公司" prop="companyName" />
                <el-table-column label="合同类型" prop="contractTypeName" />
                <el-table-column label="合同范本名称" prop="name" />
                <el-table-column label="状态" prop="status">
                    <template #default="scope">
                        <el-tag :type="contractSampleStatus[scope.row.status].tag">{{
                            contractSampleStatus[scope.row.status].txt
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
                    <template #default="scope">
                        <el-link type="primary" class="fontSize12" :underline="false" @click="preview(scope.row)"
                            >预览</el-link
                        >
                        <div class="el-divider el-divider-vertical" v-if="scope.row.status == 1"></div>
                        <el-link
                            type="primary"
                            v-if="scope.row.status == 1"
                            class="fontSize12 elBtnWarning"
                            :underline="false"
                            @click="setdeactivate(scope.row)"
                            >停用</el-link
                        >
                        <div class="el-divider el-divider-vertical" v-if="scope.row.status == 0"></div>
                        <el-link
                            type="primary"
                            v-if="scope.row.status == 0"
                            class="fontSize12"
                            :underline="false"
                            @click="setStartUsing(scope.row)"
                            >启用</el-link
                        >
                        <div class="el-divider el-divider-vertical"></div>
                        <el-link
                            type="primary"
                            class="fontSize12 elBtnDanger"
                            :underline="false"
                            @click="del(scope.row)"
                            >删除</el-link
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="myPageBot flex_s_c">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="serchInfo.pageNum"
                :page-sizes="[50, 100, 200]"
                :page-size="serchInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="serchInfo.total"
            >
            </el-pagination>
        </div>
        <el-dialog title="新增范本" v-model="isShow" width="80%" append-to-body>
            <el-row>
                <el-steps :active="isStep" simple>
                    <el-step title="基础信息" :icon="Edit" />
                    <el-step title="组合条款" :icon="Operation" />
                    <el-step title="预览提交" :icon="Monitor" />
                </el-steps>
            </el-row>
            <div class="centerBox" v-if="isStep == 1">
                <el-form
                    ref="foundation"
                    :model="foundation"
                    :rules="foundationRuls"
                    label-width="85px"
                    class="foundation"
                    style="width: 100%"
                    v-if="foundation != null"
                >
                    <el-form-item label=" 所属公司" prop="companyId">
                        <el-select v-model="foundation.companyId" placeholder="请选择" class="maxWidth" clearable>
                            <el-option
                                v-for="(item, k) in store.allCompanys"
                                :key="k"
                                :label="item.deptName"
                                :value="k"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" 合同类型" prop="contractTypeId">
                        <el-select v-model="foundation.contractTypeId" placeholder="请选择" class="maxWidth" clearable>
                            <el-option v-for="(item, k) in contractTypes" :key="k" :label="item.name" :value="k">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" 范本名称" prop="name">
                        <el-input v-model="foundation.name" clearable placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label=" 状态" prop="status">
                        <el-radio-group v-model="foundation.status">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="0">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="showTop" v-if="isStep > 1">
                <div class="topItem">所属公司：{{ foundation.companyName }}</div>
                <div class="topItem">合同类型：{{ contractTypes[foundation.contractTypeId].name }}</div>
                <div class="topItem">范本名称：{{ foundation.name }}</div>
            </div>
            <div class="stepBox2" v-if="isStep == 2">
                <div class="tabs">
                    <div
                        :class="tabIdx == index ? 'activeTab tab' : 'tab'"
                        v-for="(item, index) in tabs"
                        :key="index"
                        @click="changeSetTab(index)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <div class="tableBox">
                    <div class="tableBoxTop flex_s_c"><span class="titleTxt">已选条款</span></div>
                    <div class="tableSelect" style="margin-bottom: 25px">
                        <el-table
                            :data="selectTabs"
                            height="100%"
                            border
                            size="small"
                            header-row-class-name="headerRowClassName"
                        >
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="条款内容" prop="content" />
                            <el-table-column label="关联字段" prop="associatedFields" />
                            <el-table-column label="排序" width="210">
                                <template #default="scope">
                                    <el-button
                                        type="primary"
                                        :icon="Upload"
                                        size="small"
                                        title="置顶"
                                        @click="setSort(scope.$index, 'top')"
                                        v-if="scope.$index > 0"
                                    />
                                    <el-button
                                        type="primary"
                                        :icon="Top"
                                        size="small"
                                        title="上移"
                                        @click="setSort(scope.$index, 'up')"
                                        v-if="scope.$index > 0"
                                    />
                                    <el-button
                                        type="primary"
                                        :icon="Bottom"
                                        size="small"
                                        title="下移"
                                        @click="setSort(scope.$index, 'bot')"
                                        v-if="scope.$index < selectTabs.length - 1"
                                    />
                                    <el-button
                                        type="primary"
                                        :icon="Download"
                                        size="small"
                                        title="置底"
                                        @click="setSort(scope.$index, 'bottom')"
                                        v-if="scope.$index < selectTabs.length - 1"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="是否必填" prop="must" width="120">
                                <template #default="scope">
                                    <el-switch
                                        v-model="scope.row.must"
                                        inline-prompt
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="60">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12 elBtnDanger"
                                        :underline="false"
                                        @click="delSelect(scope.$index)"
                                        >删除</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="tableBoxTop flex_s_c">
                        <span class="titleTxt mm10">添加条款</span>
                        <el-input
                            placeholder="内容关键词"
                            v-model="tabInfo.content"
                            clearable
                            style="width: 260px"
                            class="mm10 mm5"
                        >
                            <template #append>
                                <el-button :icon="Search" @click="serchKeyword" />
                            </template>
                        </el-input>
                        <el-button
                            type="primary"
                            class="mm5 fontSize13"
                            :disabled="!checkTabs.length"
                            @click="addSelectMov"
                            >添加</el-button
                        >
                        <el-button type="success" :icon="Plus" class="mm5 fontSize13" @click="clickNewTerm"
                            >新增条款</el-button
                        >
                    </div>
                    <div class="allTable">
                        <el-table
                            :data="allTabslis"
                            height="100%"
                            border
                            :row-key="getRowKey"
                            v-loading="tabInfo.loading"
                            size="small"
                            ref="selectTabs"
                            header-row-class-name="headerRowClassName"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="60" align="center" reserve-selection />
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="条款内容" prop="content" />
                            <el-table-column label="关联字段" prop="associatedFields" />

                            <!-- <el-table-column label="操作" width="60">
                                <template #default="scope">
                                    <el-link type="primary" class="fontSize12 elBtnDanger" :underline="false"
                                        >删除</el-link
                                    >
                                </template>
                            </el-table-column> -->
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChangeTab"
                                @current-change="handleCurrentChangeTab"
                                :current-page="tabInfo.pageNum"
                                :page-sizes="[5, 10, 20, 30, 40, 50]"
                                :page-size="tabInfo.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="tabInfo.total"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
            <div class="stepBox3" v-if="isStep == 3">
                <el-table
                    :data="selectTabs"
                    height="100%"
                    border
                    size="small"
                    style="margin-top: 15px"
                    header-row-class-name="headerRowClassName"
                >
                    <el-table-column type="index" width="60" label="序号" align="center" />
                    <el-table-column label="条款类型" prop="termName"></el-table-column>
                    <el-table-column label="条款内容" prop="content" />
                    <el-table-column label="关联字段" prop="associatedFields" />
                    <el-table-column label="是否必填" prop="must" width="120">
                        <template #default="scope">
                            <el-switch
                                disabled
                                v-model="scope.row.must"
                                inline-prompt
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShow = false">关 闭</el-button>
                    <el-button type="warning" @click="back()" v-if="isStep > 1">上一步</el-button>
                    <el-button type="primary" :loading="isSumbit ? true : false" @click="saveOrNext()">{{
                        isStep == 3 ? '提交' : '下一步'
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="预览范本" v-model="isPreview" width="80%" append-to-body>
            <el-table
                :data="previews"
                height="100%"
                border
                size="small"
                style="margin-top: 15px"
                header-row-class-name="headerRowClassName"
            >
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column label="条款类型" prop="name" />
                <el-table-column label="条款内容" prop="content" />
                <el-table-column label="关联字段" prop="associatedFields" />
                <el-table-column label="是否必填" prop="must" width="120">
                    <template #default="scope">
                        <el-switch
                            disabled
                            v-model="scope.row.must"
                            inline-prompt
                            active-text="是"
                            inactive-text="否"
                            :active-value="1"
                            :inactive-value="0"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isPreview = false">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="新增条款" v-model="isTermContent" width="50%" append-to-body>
            <el-form
                ref="termFormContent"
                :model="termFormContent"
                :rules="termContentRules"
                label-width="85px"
                v-if="termFormContent != null"
            >
                <div class="illustrate">
                    设计说明 <span @click="isExpandClick">{{ isExpand ? '收起' : '展开' }}</span>
                </div>
                <div class="illustrateContent" :style="{ 'max-height': isExpand ? '400px' : 0 }">
                    <div class="showClass">
                        <div class="row">
                            合同条款中下划线部分（即允许编辑的内容），按照输入形式分为2类：仅文本、含字段。
                        </div>
                        <div class="row">
                            【仅文本】指用_____ 标出允许变更内容，代表合同录入时，允许直接编辑文本内容；
                        </div>
                        <div class="row">
                            【含字段】指用[[　　]]（双括号需为英文字符）标出字段描述，代表合同录入时，需单独输入的内容；
                        </div>
                        <div class="row" style="margin-top: 7px">示例如下:</div>
                        <div class="row">合同文本展示为：</div>
                        <div class="rowBg">
                            本合同甲方委托乙方对 <span class="underline">衢州市能源有限公司</span> 提供
                            <span class="underline">环保咨询</span> 技术服务工作 , 支付相应的技术服务报酬
                            。双方经过平等协商，在真实、充分地表达各自意愿的基础上，根据《中华人民共和国民法典》的规定，达成本合作协议，并由双方共同恪守。
                        </div>
                        <div class="row" style="margin: 7px 0">
                            其中“<span class="underline">衢州市能源有限公司</span
                            >”为受检单位名称，该信息需用于后续业务流转，“<span class="underline">环保咨询”</span>
                            为技术服务说明，仅作为文本保存 即可；则该条款设计内容如下：
                        </div>
                        <div class="rowBg">
                            本合同甲方委托乙方对 [[受检单位名称]] 提供______技术服务工作 , 支付相应的技术服务报酬
                            。双方经过平等协商，在真实、充分地表达各自意愿的基础上，根据《中华人民共和国民法典》的规定，达成本合作协议，并由双方共同恪守。
                        </div>
                    </div>
                </div>
                <el-row style="margin-top: 15px">
                    <el-col :span="12">
                        <el-form-item label="所属公司" prop="companyId">
                            <el-input v-model="termFormContent.companyName" disabled placeholder="自动获取" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="条款类型" prop="termTypeId">
                            <el-input v-model="termFormContent.termType" disabled placeholder="请选择" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="条款内容" prop="content">
                    <el-input
                        type="textarea"
                        :rows="5"
                        v-model="termFormContent.content"
                        @input="inputChangeLis"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="内容类型" prop="contentType">
                    <el-radio-group v-model="termFormContent.contentType" disabled>
                        <el-radio :label="1">含字段</el-radio>
                        <el-radio :label="0">仅文本</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="字段说明" prop="fieldList" v-if="termFormContent.contentType == 1">
                    <el-table :data="termFormContent.fieldList" height="100%" border size="small">
                        <el-table-column label="描述" prop="fieldDescribe"></el-table-column>
                        <el-table-column label="关联字段">
                            <template #default="scope">
                                <el-select
                                    v-model="scope.row.englishName"
                                    placeholder="类型"
                                    class="maxWidth"
                                    clearable
                                >
                                    <el-option label="暂无" value="noNull"> </el-option>
                                    <el-option
                                        v-for="(item, k) in allassociatedFields"
                                        :key="k"
                                        :label="item.name"
                                        :value="item.englishName"
                                    >
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isTermContent = false">关 闭</el-button>
                    <el-button type="primary" @click="submitContractTerm()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {
    Search,
    Plus,
    EditPen,
    Delete,
    Edit,
    Operation,
    Monitor,
    Top,
    Bottom,
    Download,
    Upload,
} from '@element-plus/icons-vue';
import { dataStore } from '@/store/modules/app';
import {
    dropDownContractType,
    contract_sample_lis,
    selectByCompanyId,
    listByTermTypeId,
    contract_sample_save,
    previewList,
    deactivate,
    contract_sample_remove,
    startUsing,
    contractTerm_insert,
    contractField_list,
} from '@/api/contract';
export default {
    setup() {
        const store = dataStore();
        return { store, Search, Plus, EditPen, Delete, Operation, Monitor, Edit, Top, Bottom, Download, Upload };
    },
    data() {
        var fieldList = (rule, value, callback) => {
            this.termFormContent.termStatus = 1;
            var is = 1;
            if (value.length) {
                value.forEach((item) => {
                    console.log(item);
                    if (!item.englishName) {
                        is = 0;
                    }
                });
                if (!is) {
                    return callback(new Error('请检测关联字段是否全部选择？'));
                } else {
                    this.termFormContent.fieldList.forEach((item) => {
                        if (item.englishName == 'noNull') {
                            item['name'] = '暂无';
                            item['id'] = null;
                            this.termFormContent.termStatus = 2;
                        } else {
                            this.allassociatedFields.forEach((em) => {
                                if (em.englishName == item.englishName) {
                                    item['name'] = em.name;
                                    item['id'] = em.id;
                                }
                            });
                        }
                    });
                    callback();
                }
            }
        };
        return {
            serchInfo: {
                companyId: '',
                companyName: '',
                name: '',
                contractTypeId: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            contractTypes: {}, //合同类型
            loading: false,
            lis: [],
            isShow: false,
            isStep: 1,
            foundation: null,
            foundationRuls: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
                contractTypeId: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入范本名称', trigger: 'blur' }],
            },
            tabInfo: {
                companyId: '',
                termTypeId: '',
                content: '',
                pageNum: 1,
                pageSize: 5,
                total: 0,
                loading: false,
            },
            isSumbit: false,
            tabs: [],
            tabIdx: 0,
            selectTabs: [], //已选条款
            allTabslis: [],
            checkTabs: [], //勾选的数据条款
            previews: [], //预览数据
            isPreview: false,
            termFormContent: null,
            isTermContent: false,
            isExpand: true, //是否展开
            tabItem: '',
            termContentRules: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
                termTypeId: [{ required: true, message: '请选择条款类型', trigger: 'change' }],
                content: [{ required: true, message: '请输入条款内容', trigger: 'blur' }],
                contentType: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
                fieldList: [{ required: true, validator: fieldList, trigger: 'change' }],
            },
            allassociatedFields: [], //关联字段下拉
        };
    },
    mounted() {
        this.getDropDownContractType();
        this.getLis();
        this.getAssociatedFields();
    },
    methods: {
        //获取关联字段下拉
        getAssociatedFields() {
            contractField_list().then((res) => {
                this.allassociatedFields = res.data;
            });
        },
        //合同类型下拉
        getDropDownContractType() {
            dropDownContractType().then((res) => {
                this.contractTypes = this.arrToMap(res.data, 'id');
            });
        },
        //列表
        getLis() {
            this.loading = true;
            contract_sample_lis(this.serchInfo).then((res) => {
                this.loading = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.serchInfo.total = res.total;
                this.lis = res.rows;
            });
        },
        //搜索
        serch() {
            this.serchInfo.pageNum = 1;
            this.getLis();
        },
        //重置
        reset() {
            this.serchInfo = {
                companyId: '',
                companyName: '',
                name: '',
                contractTypeId: '',
                status: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLis();
        },
        //改变条数
        handleSizeChange(val) {
            this.serchInfo.pageNum = 1;
            this.serchInfo.pageSize = val;
            this.getLis();
        },
        //改变页数
        handleCurrentChange(val) {
            this.serchInfo.pageNum = val;
            this.getLis();
        },
        //新增范本
        newTemplate() {
            this.foundation = {
                companyId: '',
                companyName: '',
                contractTypeId: '',
                name: '',
                status: 1,
            };
            this.tabInfo = {
                companyId: '',
                termTypeId: '',
                content: '',
                pageNum: 1,
                pageSize: 5,
                total: 0,
                loading: false,
            };
            this.selectTabs = [];
            this.allTabslis = [];
            this.checkTabs = [];
            this.isSumbit = false;
            this.isStep = 1;
            this.isShow = true;
        },
        //上一步
        back() {
            this.isStep -= 1;
        },
        //下一步或提交
        saveOrNext() {
            console.log(this.isStep);
            if (this.isStep == 1) {
                this.foundation['companyName'] = this.store.allCompanys[this.foundation.companyId].deptName;
                this.$refs['foundation'].validate(async (valid) => {
                    if (valid) {
                        this.isSumbit = true;
                        selectByCompanyId({ companyId: this.foundation.companyId }).then((res) => {
                            if (res.code != 200) {
                                return this.$message.error(res.msg);
                            }
                            if (!res.rows.length) {
                                return this.$message.error('该公司下无条款，请先添加！');
                            }
                            this.tabInfo = {
                                companyId: '',
                                termTypeId: '',
                                content: '',
                                pageNum: 1,
                                pageSize: 5,
                                total: 0,
                                loading: false,
                            };
                            this.selectTabs = [];
                            this.allTabslis = [];
                            this.checkTabs = [];
                            this.isSumbit = false;
                            this.tabs = res.rows;
                            this.tabItem = res.rows[0];
                            this.getListByTermTypeId(res.rows[0].id);
                            this.isStep += 1;
                        });
                    }
                });
            } else if (this.isStep == 2) {
                if (!this.selectTabs.length) {
                    return this.$message.error('请先添加条款！');
                }
                this.isStep += 1;
            } else if (this.isStep == 3) {
                this.selectTabs.forEach((item) => {
                    item['contractTermId'] = item.id;
                });
                var query = {
                    contractSampleTerms: this.selectTabs,
                };
                for (let k in this.foundation) {
                    query[k] = this.foundation[k];
                }
                console.log(query);
                contract_sample_save(query).then((res) => {
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('新增成功！');
                    this.getLis();
                    this.isShow = false;
                });
            }
            console.log(this.isStep);
        },
        //获取条款下的列表
        getListByTermTypeId(termTypeId) {
            this.tabInfo['companyId'] = this.foundation.companyId;
            this.tabInfo['termTypeId'] = termTypeId;
            this.tabInfo['loading'] = true;
            listByTermTypeId(this.tabInfo).then((res) => {
                this.tabInfo.loading = false;
                this.tabInfo.total = res.total;
                this.allTabslis = res.rows;
            });
        },
        //搜索条款
        serchKeyword() {
            this.tabInfo.pageNum = 1;
            this.getListByTermTypeId(this.tabInfo.termTypeId);
        },
        //改变条数
        handleSizeChangeTab(val) {
            this.tabInfo.pageNum = 1;
            this.tabInfo.pageSize = val;
            this.getListByTermTypeId(this.tabInfo.termTypeId);
        },
        //改变页数
        handleCurrentChangeTab(val) {
            this.tabInfo.pageNum = val;
            this.getListByTermTypeId(this.tabInfo.termTypeId);
        },
        //切换tab类型
        changeSetTab(idx) {
            this.tabIdx = idx;
            var item = this.tabs[idx];
            this.tabItem = this.tabs[idx];
            this.tabInfo.pageNum = 1;
            this.tabInfo.content = '';
            this.getListByTermTypeId(item.id);
        },
        //选择数据表格
        handleSelectionChange(val) {
            this.checkTabs = val;
        },
        // 保存选中的数据编号
        getRowKey(row) {
            return row.id;
        },
        //添加条款
        addSelectMov() {
            this.checkTabs.forEach((element) => {
                element['termName'] = this.tabs[this.tabIdx].name;
                element['must'] = 1;
                this.selectTabs.push(element);
            });
            this.selectTabs = this.arrSome(this.selectTabs, 'id');
            this.checkTabs = [];
            this.$refs.selectTabs.clearSelection();
        },
        //删除已选条款
        delSelect(idx) {
            this.selectTabs.splice(idx, 1);
        },
        //移动已选范本顺序
        setSort(index, is) {
            var item = this.selectTabs.splice(index, 1)[0];
            if (is == 'top') {
                this.selectTabs.unshift(item);
            }
            if (is == 'up') {
                this.selectTabs.splice(index - 1, 0, item);
            }
            if (is == 'bot') {
                this.selectTabs.splice(index + 1, 0, item);
            }
            if (is == 'bottom') {
                this.selectTabs.push(item);
            }
        },
        //点击预览范本
        preview(row) {
            previewList({ id: row.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.previews = res.rows;
                this.isPreview = true;
            });
        },
        //点击停用
        setdeactivate(row) {
            this.$confirm('确认停用该范本吗？', '提示', {
                confirmButtonText: '停用',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    deactivate({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('已停用');
                        this.getLis();
                    });
                })
                .catch(() => {});
        },
        //启用
        setStartUsing(row) {
            this.$confirm('确认启用该范本吗？', '提示', {
                confirmButtonText: '启用',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    startUsing({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('已启用');
                        this.getLis();
                    });
                })
                .catch(() => {});
        },
        //点击删除
        del(row) {
            this.$confirm('确认删除该范本吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    contract_sample_remove({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('已删除');
                        this.getLis();
                    });
                })
                .catch(() => {});
        },
        //新增条款内容
        clickNewTerm() {
            console.log(this.foundation);
            console.log(this.tabs[this.tabIdx]);
            var item = this.tabs[this.tabIdx];
            this.termFormContent = {
                companyId: this.foundation.companyId,
                companyName: this.foundation.companyName,
                termTypeId: item.id,
                termType: item.name,
                content: '',
                contentType: 0,
                termStatus: 1,
                fieldList: [],
            };
            this.isTermContent = true;
        },
        //展开收起
        isExpandClick() {
            this.isExpand = !this.isExpand;
        },
        //条款内容输入自动创建列表
        inputChangeLis(e) {
            // var str=e.replace(/\[\[/g,'</div>[[')
            // var str2=str.replace(/\]\]/g,']]<div>')
            this.termFormContent.fieldList = [];
            this.termFormContent.contentType = 0;
            // 使用正则表达式匹配小括号内的内容
            let regex = /\[\[(.+?)\]\]/g;
            let matches = e.match(regex);
            // console.log(matches);
            // 提取小括号内的内容
            const contents = matches.map((match) => match.replace(/\[|\]/g, ''));
            // console.log(contents);

            if (contents && contents.length) {
                // if (contents.length == this.termFormContent.lis.length) {
                //     contents.forEach((item, i) => {
                //         this.termFormContent.lis[i]['describe'] = item;
                //     });
                // } else if (contents.length > this.termFormContent.lis.length) {
                // } else {
                //     contents.forEach((item) => {
                //         this.termFormContent.lis.push({
                //             describe: item,
                //             value: '',
                //         });
                //     });
                // }
                // // if()

                contents.forEach((item) => {
                    this.termFormContent.fieldList.push({
                        fieldDescribe: item,
                        name: '',
                        englishName: '',
                    });
                });
                this.termFormContent.contentType = 1;
                // this.termFormContent.lis.push({
                //     describe: item,
                //     value: '',
                // });
            }
        },
        //条款新增编辑
        submitContractTerm() {
            this.$refs['termFormContent'].validate(async (valid) => {
                if (valid) {
                    var res = await contractTerm_insert(this.termFormContent);
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.isTermContent = false;
                    this.$message.success('保存成功！');
                    this.getListByTermTypeId(this.tabItem.id);
                }
            });
        },
    },
};
</script>
<style scoped lang="scss">
::v-deep(.el-steps) {
    width: 100%;
}
.centerBox {
    width: 40%;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 30px;
}
.foundation {
    .el-form-item {
        margin-bottom: 35px !important;
    }
}
.showTop {
    width: calc(100% - 40px);
    margin-top: 20px;
    margin-left: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .topItem {
        width: 33.3%;
    }
}
.stepBox2 {
    width: 100%;
    margin-top: 20px;
    .tabs {
        width: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tab {
            padding: 5px 15px;
            cursor: pointer;
            border: 1px solid #ddd;
            border-radius: 7px 7px 0 0;
            &:hover {
                background: #eaf4ff;
            }
        }
        .activeTab {
            border: 1px solid #409eff;
            color: #409eff;
            background: #eaf4ff;
        }
    }
    .tableBox {
        width: 100%;
        border: 1px solid #ddd;
        padding: 10px 15px;
        box-sizing: border-box;
        .tableBoxTop {
            width: 100%;
            .titleTxt {
                font-weight: 600;
            }
        }
        .tableSelect {
            width: 100%;
            max-height: 500px;
        }
        .allTable {
            width: 100%;
            margin-top: 6px;
            .pagination {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 5px;
            }
        }
    }
}
.illustrate {
    width: 100%;
    height: 30px;
    span {
        color: #409eff;
        cursor: pointer;
        margin-left: 15px;
    }
}
.illustrateContent {
    width: 100%;
    font-size: 13px;
    overflow: hidden;
    transition: 0.5s;
    .showClass {
        width: 100%;
        border: 1px solid #ddd;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 5px;
    }
    .row {
        width: 100%;
    }
    .rowBg {
        width: 100%;
        background: #ddd;
        padding: 8px;
        box-sizing: border-box;
        text-indent: 2em;
    }
    .underline {
        text-decoration: underline;
    }
}
</style>