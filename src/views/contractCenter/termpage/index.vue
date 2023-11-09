<template>
    <div class="boxCenter">
        <div class="left">
            <div class="serch flex_s_s">
                <el-input v-model="input" placeholder="条款类型" clearable :suffix-icon="Search" />
                <el-button type="success" :icon="Plus" style="margin-left: 5px; font-size: 13px" @click="newAddType"
                    >新增类型</el-button
                >
            </div>
            <div class="treeBox">
                <el-tree
                    :data="data"
                    :props="defaultProps"
                    node-key="key"
                    ref="tree"
                    @node-click="handleNodeClick"
                    highlight-current
                    :current-node-key="currentNodeKey"
                    :filter-node-method="filterNode"
                    accordion
                >
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <span>{{ node.label }}</span>
                            <span v-if="node.level == 2">
                                <el-icon style="color: #409eff" title="编辑" @click.stop="editTree(data)"
                                    ><EditPen
                                /></el-icon>
                                <el-icon
                                    style="color: #f56c6c; margin-left: 8px"
                                    title="删除"
                                    @click.stop="delTree(data)"
                                    ><Delete
                                /></el-icon>
                            </span>
                        </span>
                    </template>
                </el-tree>
            </div>
        </div>
        <div class="right" v-if="currentData != null">
            <div class="myPageTop45">
                <el-form :model="serchInfo" ref="queryForm2" :inline="true">
                    <el-select
                        v-model="serchInfo.contentType"
                        placeholder="类型"
                        class="selfSerchInput100 mm5"
                        clearable
                    >
                        <el-option v-for="(item, k) in contentTypeSelect" :key="k" :label="item.txt" :value="k">
                        </el-option>
                    </el-select>
                    <el-input
                        v-model="serchInfo.content"
                        class="selfSerchInput mm5"
                        clearable
                        placeholder="内容关键词"
                    />
                    <el-select
                        v-model="serchInfo.associatedFields"
                        placeholder="关联字段"
                        class="selfSerchInput100 mm5"
                        clearable
                    >
                        <el-option
                            v-for="(item, k) in allassociatedFields"
                            :key="k"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                    </el-select>
                    <el-select
                        v-model="serchInfo.termStatus"
                        placeholder="状态"
                        class="selfSerchInput100 mm5"
                        clearable
                    >
                        <el-option v-for="(item, k) in termStatusSelect" :key="k" :label="item.txt" :value="k">
                        </el-option>
                    </el-select>
                    <el-input
                        v-model="serchInfo.updateBy"
                        class="selfSerchInput100 mm5"
                        clearable
                        placeholder="最后操作人"
                    />
                    <el-button type="primary" icon="Search" class="mm5" @click="serch">搜索</el-button>
                    <el-button  class="mm5" icon="Refresh" @click="reset">重置</el-button>
                    <el-button type="primary" plain icon="Plus" class="mm5" @click="clickNewTerm">新增条款</el-button>
                    <!-- <el-button type="primary" class="mm5" @click="filedView">关联字段库</el-button> -->
                </el-form>
            </div>
            <div class="myCenter90">
                <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                    <el-table-column type="index" width="60" label="序号" align="center" />
                    <el-table-column label="类型" prop="equipCode" width="90">
                        <template #default="scope">
                            <span>{{ contentTypeSelect[scope.row.contentType].txt }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="条款内容" prop="content" />
                    <el-table-column label="关联字段" prop="associatedFields"> </el-table-column>
                    <el-table-column label="状态" prop="termStatus" width="90">
                        <template #default="scope">
                            <el-tag :type="termStatusSelect[scope.row.termStatus].tag">{{
                                termStatusSelect[scope.row.termStatus].txt
                            }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后操作人" prop="updateBy" width="100" />
                    <el-table-column label="最后操作时间" prop="updateTime" width="150"></el-table-column>
                    <el-table-column label="操作" width="120" align="left">
                        <template #default="scope">
                            <el-link
                                type="primary"
                                class="fontSize12"
                                :underline="false"
                                v-if="scope.row.termStatus == 2"
                                v-hasPermi="['term:list:update']"
                                @click="editItem(scope.row)"
                                >编辑</el-link
                            >
                            <div class="el-divider el-divider-vertical" v-hasPermi="['term:list:update']" v-if="scope.row.termStatus == 2"></div>
                            <el-link
                                type="primary"
                                v-if="scope.row.termStatus == 1"
                                class="fontSize12 elBtnWarning"
                                :underline="false"
                                @click="updateStatus(scope.row, 0)"
                                >停用</el-link
                            >
                            <div class="el-divider el-divider-vertical" v-if="scope.row.termStatus == 1"></div>
                            <el-link
                                type="primary"
                                class="fontSize12"
                                :underline="false"
                                v-if="scope.row.termStatus == 0"
                                @click="updateStatus(scope.row, 1)"
                                >启用</el-link
                            >
                            <div class="el-divider el-divider-vertical" v-if="scope.row.termStatus == 0"></div>
                            <el-link
                                type="primary"
                                class="fontSize12 elBtnDanger"
                                :underline="false"
                                @click="delItem(scope.row)"
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
        </div>
        <div class="right centerView" v-else>
            <span>请选择条款类型！</span>
        </div>
        <!-- 条款类型 -->
        <el-dialog :title="is == 1 ? '新增条款类型' : '编辑条款类型'" v-model="isTerm" width="40%" append-to-body>
            <el-form ref="termForm" :model="termForm" :rules="termRules" label-width="130px" v-if="termForm != null">
                <el-form-item label="所属公司" prop="companyId">
                    <el-select v-model="termForm.companyId" placeholder="所属公司" class="maxWidth" clearable>
                        <el-option
                            v-for="(item, k) in store.allCompanys"
                            :key="k"
                            :label="item.deptName"
                            :value="Number(k)"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="termForm.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="显示顺序" prop="orderNum">
                    <el-input-number v-model="termForm.orderNum" :min="1" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isTerm = false">关 闭</el-button>
                    <el-button type="primary" @click="submitTerm()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 条款内容 -->
        <el-dialog :title="isAdd?'新增条款':'编辑条款'" v-model="isTermContent" width="50%" append-to-body>
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
                        :disabled="!isAdd"
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
import { Search, Plus, EditPen, Delete } from '@element-plus/icons-vue';
import { dataStore } from '@/store/modules/app';
import {
    contractTermTypelis,
    contractTermType_insert,
    contractTermType_update,
    contractTermType_check,
    contractTermType_remove,
    contractTerm_list,
    contractField_list,
    contractTerm_insert,
    contractTerm_update,
    contractTerm_info,
    contractTerm_check,
    contractTerm_remove,
    contractTerm_updateStatus,
} from '@/api/contract';
export default {
    setup() {
        const store = dataStore();
        return { store, Search, Plus, EditPen, Delete };
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
            input: '',
            data: [], //树形数据
            defaultProps: {},
            currentNodeKey: '',
            currentData: null, //当前选择的数据
            loading: true,
            lis: [],
            serchInfo: {
                contentType: '',
                content: '',
                associatedFields: '',
                termStatus: '',
                updateBy: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
            },
            allassociatedFields: [], //关联字段下拉
            lis: [],
            is: 1, //控制条款新增、||编辑
            isTerm: false,
            termForm: null, //条款数据
            termRules: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
                name: [{ required: true, message: '请输入条款名称', trigger: 'blur' }],
                orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
            },
            isTermContent: false,
            termFormContent: null, //条款内容数据
            isExpand: true, //是否展开
            termContentRules: {
                companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
                termTypeId: [{ required: true, message: '请选择条款类型', trigger: 'change' }],
                content: [{ required: true, message: '请输入条款内容', trigger: 'blur' }],
                contentType: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
                fieldList: [{ required: true, validator: fieldList, trigger: 'change' }],
            },
            isAdd: true, //是否新增 编辑
        };
    },
    watch: {
        input(val) {
            this.$refs.tree.filter(val);
        },
    },
    components: {
        // Search
    },
    mounted() {
        this.getTree();
        this.getAssociatedFields();
    },
    methods: {
        //获取关联字段下拉
        getAssociatedFields() {
            contractField_list().then((res) => {
                this.allassociatedFields = res.data;
            });
        },
        //获取公司条款类型
        getTree() {
            contractTermTypelis().then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                var map = res.data;
                var lis = [];
                for (let k in map) {
                    var arr = map[k];
                    arr.forEach((item) => {
                        item['key'] = k + '-' + item.id;
                        item['label'] = item.name;
                    });
                    lis.push({
                        label: this.store.allCompanys[k].deptName,
                        key: this.store.allCompanys[k].deptId,
                        children: arr,
                    });
                }
                this.data = lis;
                this.$nextTick(() => {
                    if (this.currentNodeKey) {
                        this.$refs.tree.setCurrentKey(this.currentNodeKey);
                    }
                });
            });
        },
        //点击节点
        handleNodeClick(data, node, c, d) {
            if (node.level == 1) {
                node.isCurrent = false;
                this.$refs.tree.setCurrentKey(this.currentNodeKey);
            } else {
                this.currentNodeKey = data.key;
                this.currentData = data;
                this.serchInfo = {
                    contentType: '',
                    content: '',
                    associatedFields: '',
                    termStatus: '',
                    updateBy: '',
                    pageNum: 1,
                    pageSize: 50,
                    total: 0,
                    termTypeId: data.id,
                };
                this.getLis();
            }
        },
        //搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //列表
        getLis() {
            this.loading = true;
            contractTerm_list(this.serchInfo).then((res) => {
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
                contentType: '',
                content: '',
                associatedFields: '',
                termStatus: '',
                updateBy: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                termTypeId: this.currentData.id,
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
        //点击新增条款类型
        newAddType() {
            this.termForm = {
                companyId: '',
                name: '',
                orderNum: 1,
            };
            this.isTerm = true;
            this.is = 1;
        },
        //点击编辑条款
        editTree(data) {
            console.log(data);
            this.termForm = {
                companyId: data.companyId,
                name: data.name,
                orderNum: data.orderNum,
                id: data.id,
            };
            this.isTerm = true;
            this.is = 2;
        },
        //提交条款类型
        submitTerm() {
            this.$refs['termForm'].validate(async (valid) => {
                if (valid) {
                    if (this.is == 1) {
                        var res = await contractTermType_insert(this.termForm);
                    } else {
                        var res = await contractTermType_update(this.termForm);
                    }
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.isTerm = false;
                    this.$message.success(this.is == 1 ? '保存成功！' : '编辑成功！');
                    this.getTree();
                }
            });
        },
        //删除条款类型
        delTree(data) {
            contractTermType_check({ id: data.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.$confirm('确认删除该条款吗？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        console.log(data);
                        console.log(this.currentNodeKey);

                        contractTermType_remove({ id: data.id }).then((res) => {
                            if (res.code != 200) {
                                return this.$message.error(res.msg);
                            }
                            if (this.currentNodeKey) {
                                if (data.key == this.currentNodeKey) {
                                    this.currentNodeKey = '';
                                    this.currentData = null;
                                    this.$refs.tree.setCurrentKey(null);
                                }
                            }
                            this.$message.success('已删除');
                            this.getTree();
                        });
                    })
                    .catch(() => {});
            });
        },
        //新增条款内容
        clickNewTerm() {
            console.log(this.currentData);
            this.termFormContent = {
                companyId: this.currentData.companyId,
                companyName: this.store.allCompanys[this.currentData.companyId].deptName,
                termTypeId: this.currentData.id,
                termType: this.currentData.name,
                content: '',
                contentType: 0,
                termStatus: 1,
                fieldList: [],
            };
            this.isAdd = true;
            this.isTermContent = true;
        },
        //点击编辑
        editItem(row) {
            contractTerm_info({ id: row.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.termFormContent = res.data;
                this.termFormContent.fieldList.forEach((item) => {
                    if (!item.id) {
                        item['englishName'] = 'noNull';
                    }
                });
                this.isAdd = false;
                this.isTermContent = true;
            });
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
                    if (this.isAdd) {
                        var res = await contractTerm_insert(this.termFormContent);
                    } else {
                        var res = await contractTerm_update(this.termFormContent);
                    }
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.isTermContent = false;
                    this.$message.success(this.is == 1 ? '保存成功！' : '编辑成功！');
                    this.getLis();
                }
            });
        },
        //删除条款
        delItem(row) {
            contractTerm_check({ id: row.id }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.$confirm('确认删除该条款？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        contractTerm_remove({ id: row.id }).then((res) => {
                            if (res.code != 200) {
                                return this.$message.error(res.msg);
                            }
                            this.$message.success('已删除');
                            this.getLis();
                        });
                    })
                    .catch(() => {});
            });
        },
        //停用启用
        updateStatus(row, status) {
            var txt = status == 1 ? '确认启用该条款？' : '确认停用该条款？';
            this.$confirm(txt, '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    contractTerm_updateStatus({ id: row.id, termStatus: status }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('修改成功！');
                        this.getLis();
                    });
                })
                .catch(() => {});
        },
        //跳转字段库
        filedView() {
            this.$router.push({
                path: '/contractCenter/fields',
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.left {
    width: 25%;
    height: 100%;
    background: #fff;
    float: left;
    border-radius: 5px;
    padding: 10px 15px 10px 15px;
    box-sizing: border-box;
    .serch {
        width: 100%;
        height: 45px;
        float: left;
    }
    .treeBox {
        width: 100%;
        height: calc(100% - 45px);
        float: left;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
.right {
    width: calc(75% - 15px);
    float: right;
    height: 100%;
    background: #fff;
    border-radius: 5px;
    padding: 10px 15px 0px 15px;
    box-sizing: border-box;
}
.centerView {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        font-style: oblique;
        font-family: fantasy;
        font-weight: 600;
        color: #999;
        font-size: 24px;
    }
}
::v-deep(.el-tree-node__content) {
    height: 35px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
::v-deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background: #b7d9ff;
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