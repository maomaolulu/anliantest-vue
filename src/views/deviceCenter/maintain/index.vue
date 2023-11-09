<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="query" size="default" @submit.prevent="search_get_lis">
                <el-input v-model="query.equipCode" placeholder="设备编号" class="selfSerchInput mm10" clearable />
                <el-input v-model="query.goodsName" placeholder="设备名称" class="selfSerchInput mm10" clearable />
                <el-select v-model="query.repairStatus" placeholder="设备状态" class="selfSerchInput mm10" clearable>
                    <el-option v-for="(item, k) in repairStatusType" :key="k" :label="item" :value="k"> </el-option>
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="search_get_lis">搜索</el-button>
                <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
                <el-button type="primary" icon="Plus" @click="addInfo" plain class="right_btn">新增</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <div class="main_table" ref="main_table">
                <el-table :data="data_lis" style="width: 100%" :height="tableHeight" border size="small">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="55"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="equipCode"
                        label="仪器编号"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="goodsName"
                        label="仪器名称"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="model"
                        label="规格型号"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column prop="repairStatus" label="状态" align="center" header-align="center">
                        <template #default="scope">
                            <span>{{ repairStatusType[scope.row.repairStatus] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyId" label="隶属公司" align="center" header-align="center">
                        <template #default="scope">
                            <template v-if="deptObj[scope.row.companyId]">
                                {{ deptObj[scope.row.companyId].deptName }}
                            </template>
                            <template v-else>
                                {{ scope.row.companyId }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chargeDeptId" label="责任部门" align="center" header-align="center">
                        <template #default="scope">
                            {{
                                deptObj[scope.row.chargeDeptId]
                                    ? deptObj[scope.row.chargeDeptId].deptName
                                    : scope.row.chargeDeptId
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="breakdownTime"
                        label="故障时间"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="completeTime"
                        label="维修完成时间"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column label="操作" align="center" header-align="center">
                        <template #default="scope">
                            <template v-if="scope.row.repairStatus === 0">
                                <el-button type="danger" link @click="delInfo(scope.row)">删除</el-button>
                                <el-button type="primary" link @click="editRecordInfo(scope.row)">编辑</el-button>
                                <el-button type="primary" link @click="completeRecord(scope.row)">完成维修</el-button>
                            </template>
                            <template v-if="scope.row.repairStatus === 1">
                                <el-button type="primary" link @click="info(scope.row)">维修详情</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="myPageBot flex_s_c">
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="query.pageNum"
                :page-sizes="[50, 100, 200, 500]"
                :page-size="query.pageSize"
                :total="query.totalCount"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>

        <el-dialog
            :title="
                editType == 0
                    ? '维修记录详情'
                    : editType == 1
                    ? '编辑维修记录'
                    : editType == 1
                    ? '新增维修记录'
                    : '完成维修'
            "
            width="50%"
            v-model="editInfoVisible"
            @close="get_lis"
            :close-on-click-modal="false"
        >
            <div v-if="editInfoVisible">
                <el-form ref="editInfo" :model="editInfo" label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <template v-if="editType == 1">
                                <el-form-item
                                    label="设备编号"
                                    prop="afterEquipId"
                                    :rules="[{ required: true, message: '请选择设备编号', trigger: 'change' }]"
                                >
                                    <el-select
                                        v-model="editInfo.afterEquipId"
                                        placeholder="设备编号"
                                        @change="selectEquip"
                                        :disabled="[0, 3].includes(editType)"
                                        filterable
                                    >
                                        <el-option
                                            v-for="(item, index) in equip_lis"
                                            :key="index"
                                            :label="item.equipCode"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item
                                    label="设备编号"
                                    prop="equipId"
                                    :rules="[{ required: true, message: '请选择设备编号', trigger: 'change' }]"
                                >
                                    <el-select
                                        v-model="editInfo.equipId"
                                        placeholder="设备编号"
                                        @change="selectEquip"
                                        :disabled="[0, 3].includes(editType)"
                                        filterable
                                    >
                                        <el-option
                                            v-for="(item, index) in equip_lis"
                                            :key="index"
                                            :label="item.equipCode"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备名称" prop="goodsName">
                                <el-input v-model="editInfo.goodsName" placeholder="设备名称" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="规格型号" prop="model">
                                <el-input v-model="editInfo.model" placeholder="规格型号" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="责任部门" prop="chargeDeptId">
                                <el-select v-model="editInfo.chargeDeptId" placeholder="责任部门" disabled>
                                    <el-option
                                        v-for="(item, k) in deptObj"
                                        :key="k"
                                        :label="item.deptName"
                                        :value="Number(k)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item
                                label="故障时间"
                                prop="breakdownTime"
                                :rules="[{ required: true, message: '请选择设备故障时间', trigger: 'change' }]"
                            >
                                <el-date-picker
                                    v-model="editInfo.breakdownTime"
                                    type="datetime"
                                    placeholder="故障时间"
                                    format="YYYY-MM-DD HH:mm"
                                    value-format="YYYY-MM-DD HH:mm"
                                    :disabled="[0, 3].includes(editType)"
                                />
                            </el-form-item>
                        </el-col>
                        <template v-if="editType == 3 || editType === 0">
                            <el-col :span="12">
                                <el-form-item
                                    label="维修完成时间"
                                    prop="completeTime"
                                    :rules="[{ required: true, message: '请选择维修完成时间', trigger: 'change' }]"
                                >
                                    <el-date-picker
                                        v-model="editInfo.completeTime"
                                        type="datetime"
                                        placeholder="维修完成时间"
                                        format="YYYY-MM-DD HH:mm"
                                        value-format="YYYY-MM-DD HH:mm"
                                        :disabled="editType != 3"
                                    />
                                </el-form-item>
                            </el-col>
                        </template>
                    </el-row>
                    <template v-if="editType == 3 || editType === 0">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="故障原因" prop="remark">
                                    <el-input
                                        v-model="editInfo.remark"
                                        placeholder="故障原因"
                                        :disabled="editType != 3"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维修费用" prop="repairCost">
                                    <el-input
                                        v-model="editInfo.repairCost"
                                        placeholder="维修费用"
                                        :disabled="editType != 3"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </el-form>
            </div>
            <template #footer v-if="[1, 2, 3].includes(editType)">
                <el-button @click="editInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="editInfoSubmit" :loading="submitLoading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { listDept, getCompany } from '@/api/system/dept.ts';
import {
    getRepairUse,
    getRepairList,
    addRepairList,
    delRepairList,
    editRepairList,
    completeRepair,
} from '@/api/deviceCenter/maintain.ts';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            query: {
                pageNum: 1,
                pageSize: 50,
                totalCount: 0,
            },
            data_lis: [],
            repairStatusType: {
                0: '待维修',
                1: '已维修',
            },
            deptObj: {},
            equip_lis: [],
            equip_obj: {},
            editInfoVisible: false,
            editInfo: {},
            editType: 0, // 0:详情,1:编辑,2:新增,3:完成维修
            tableHeight: 0,
            submitLoading: false,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.get_lis();
        this.getDeptLis();
        this.getEquipLis();
        this.$nextTick(() => {
            this.tableHeight = this.$refs.main_table.offsetHeight;
        });
        // this.getCompanyLis()
    },
    beforeDestroy() {},
    methods: {
        // 详情
        info(row) {
            this.editType = 0;
            this.editInfo = JSON.parse(JSON.stringify(row));
            if (!this.equip_obj[row.equipId]) {
                let equipInfo = {
                    id: row.equipId,
                    goodsName: row.goodsName,
                    equipCode: row.equipCode,
                    model: row.model,
                    chargeDeptId: row.chargeDeptId,
                };
                this.equip_lis.push(equipInfo);
                this.equip_obj[equipInfo.id] = equipInfo;
            }
            this.editInfoVisible = true;
        },
        // 完成维修
        completeRecord(row) {
            this.editType = 3;
            this.editInfo = JSON.parse(JSON.stringify(row));
            if (!this.equip_obj[row.equipId]) {
                let equipInfo = {
                    id: row.equipId,
                    goodsName: row.goodsName,
                    equipCode: row.equipCode,
                    model: row.model,
                    chargeDeptId: row.chargeDeptId,
                };
                this.equip_lis.push(equipInfo);
                this.equip_obj[equipInfo.id] = equipInfo;
            }
            this.editInfoVisible = true;
        },
        // 编辑
        editRecordInfo(row) {
            this.editType = 1;
            let editInfo = JSON.parse(JSON.stringify(row));
            editInfo.afterEquipId = editInfo.equipId;
            if (!this.equip_obj[row.equipId]) {
                let equipInfo = {
                    id: row.equipId,
                    goodsName: row.goodsName,
                    equipCode: row.equipCode,
                    model: row.model,
                    chargeDeptId: row.chargeDeptId,
                };
                this.equip_lis.push(equipInfo);
                this.equip_obj[equipInfo.id] = equipInfo;
            }
            this.editInfo = editInfo;
            this.editInfoVisible = true;
        },
        // 删除
        delInfo(row) {
            this.$confirm('确认删除此条数据？', '提示').then(() => {
                delRepairList(row).then((res) => {
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('删除成功');
                    this.get_lis();
                    this.getEquipLis();
                });
            });
        },
        // 提交
        editInfoSubmit() {
            this.submitLoading = true;
            if (this.editType == 1) {
                // 编辑
                this.$refs.editInfo.validate((valid, err) => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.editInfo));
                        editRepairList(params)
                            .then((res) => {
                                this.submitLoading = false;
                                if (res.code != 200) {
                                    return this.$message.error(res.msg);
                                }
                                this.$message.success('编辑成功');
                                this.editInfoVisible = false;
                                this.getEquipLis();
                            })
                            .catch((err) => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    } else {
                        this.submitLoading = false;
                        console.log(err);
                    }
                });
            } else if (this.editType == 2) {
                // 新增
                this.$refs.editInfo.validate((valid, err) => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.editInfo));
                        addRepairList(params)
                            .then((res) => {
                                this.submitLoading = false;
                                if (res.code != 200) {
                                    return this.$message.error(res.msg);
                                }
                                this.$message.success('新增成功');
                                this.editInfoVisible = false;
                                this.getEquipLis();
                            })
                            .catch((err) => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    } else {
                        this.submitLoading = false;
                        console.log(err);
                    }
                });
            } else if (this.editType == 3) {
                // 完成维修
                this.$refs.editInfo.validate((valid, err) => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.editInfo));
                        completeRepair(params)
                            .then((res) => {
                                this.submitLoading = false;
                                if (res.code != 200) {
                                    return this.$message.error(res.msg);
                                }
                                this.$message.success('操作成功');
                                this.editInfoVisible = false;
                                this.getEquipLis();
                            })
                            .catch((err) => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    } else {
                        this.submitLoading = false;
                        console.log(err);
                    }
                });
            }
        },
        // 弹窗选择仪器设备
        selectEquip(e) {
            if (this.equip_obj[this.editInfo.equipId]) {
                this.editInfo.goodsName = this.equip_obj[this.editInfo.equipId].goodsName || '';
                this.editInfo.equipCode = this.equip_obj[this.editInfo.equipId].equipCode || '';
                this.editInfo.model = this.equip_obj[this.editInfo.equipId].model || '';
                this.editInfo.chargeDeptId = this.equip_obj[this.editInfo.equipId].chargeDeptId || '';
            } else {
                this.editInfo.equipId = '';
                this.editInfo.goodsName = '';
                this.editInfo.model = '';
                this.editInfo.chargeDeptId = '';
            }
        },
        // 新增弹窗
        addInfo() {
            this.editType = 2;
            this.editInfo = {
                equipId: '', // 设备id
                goodsName: '', // 设备名称
                model: '', // 设备型号
                chargeDeptId: '', // 责任部门
                breakdownTime: '', // 故障时间
            };
            this.editInfoVisible = true;
        },
        // 设备列表
        getEquipLis() {
            getRepairUse().then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.equip_lis = res.data;
                let equip_obj = {};
                for (let i = 0; i < res.data.length; i++) {
                    equip_obj[res.data[i].id] = res.data[i];
                }
                this.equip_obj = equip_obj;
            });
        },
        // 获取公司列表
        getCompanyLis() {
            getCompany().then((res) => {
                if (res.code != 200) {
                    return;
                }
                let companyObj = {};
                for (let i = 0; i < res.data.length; i++) {
                    companyObj[res.data[i].deptId] = res.data[i];
                }
                this.companyObj = companyObj;
            });
        },
        // 获取部门列表
        getDeptLis(cb) {
            listDept().then((res) => {
                if (res.code != 200) {
                    return;
                }
                let deptObj = {};
                for (let i = 0; i < res.data.length; i++) {
                    deptObj[res.data[i].deptId] = res.data[i];
                }
                this.deptObj = deptObj;
            });
        },
        // 搜索列表
        search_get_lis() {
            this.query.pageNum = 1;
            this.get_lis();
        },
        refresh_get_lis() {
            this.query = {
                pageNum: 1,
                pageSize: 50,
                totalCount: 0,
            };
            this.get_lis();
        },
        sizeChangeHandle(val) {
            this.query.pageSize = val;
            this.query.pageNum = 1;
            this.get_lis();
        },
        currentChangeHandle(val) {
            this.query.pageNum = val;
            this.get_lis();
        },
        // 获取列表
        get_lis() {
            let params = JSON.parse(JSON.stringify(this.query));
            getRepairList(params).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.data_lis = res.rows;
                this.query.totalCount = res.total;
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.maintain {
    width: 100%;
    height: 100%;
    padding: 20px 20px 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .top_self {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .input_self {
            width: 160px;
            margin-right: 10px;
        }
        .right_btn {
            position: absolute;
            right: 0;
        }
    }
    .main_table {
        flex: 1;
        margin-bottom: 6px;
    }
    :deep(.el-form-item__content) {
        .el-input,
        .el-select,
        .el-cascader {
            width: 100%;
        }
    }
}
</style>