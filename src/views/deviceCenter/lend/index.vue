<template>
    <div class="paddBoxPage">
        <el-tabs v-model="activeName" class="self_el_tabs">
            <el-tab-pane label="设备借出" name="first">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-select
                                v-model="queryParams.equipType"
                                placeholder="设备类型"
                                class="selfSerchInput140 mm10"
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
                            <el-date-picker
                                v-model="value"
                                class="selfSerchInput320 mm10"
                                type="datetimerange"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :default-time="defaultTime"
                            />

                            <el-button type="primary" icon="Search" class="mm10" @click="serch">搜索</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter90" v-if="isSerch">
                        <el-table :data="lis" height="100%" border v-loading="loading" size="small">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="规格型号" prop="model" />
                            <el-table-column label="责任部门" prop="chargeDeptId">
                                <template #default="scope">
                                    {{
                                        store.allDepts[scope.row.chargeDeptId]
                                            ? store.allDepts[scope.row.chargeDeptId].deptName
                                            : scope.row.chargeDeptId
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="更新时间" prop="createTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="equipInfo(scope.row)"
                                        >详情</el-link
                                    >
                                    <div class="el-divider el-divider-vertical"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="borrow(scope.row)"
                                        >借出</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="myPageBot flex_s_c" v-if="isSerch">
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
                    <div class="myCenter45 pageBorder" v-if="!isSerch">
                        <img src="@/assets/imgs/serchQuery.png" alt="">
                        请输入查询条件进行搜索
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="借出记录" name="two">
                <div class="paddTabMyPage">
                    <div class="myPageTop45">
                        <el-form :model="queryParamsrecord" ref="queryFormrecord" :inline="true">
                            <el-select
                                v-model="queryParamsrecord.companyId"
                                class="selfSerchInput180 mm10"
                                placeholder="借用公司"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in store.allCompanys"
                                    :key="k"
                                    :label="item.deptName"
                                    :value="Number(k)"
                                >
                                </el-option>
                            </el-select>

                            <el-input
                                v-model="queryParamsrecord.equipCode"
                                class="selfSerchInput140 mm10"
                                placeholder="设备编号"
                            />
                            <el-input
                                v-model="queryParamsrecord.goodsName"
                                class="selfSerchInput140 mm10"
                                placeholder="设备名称"
                            />
                            <el-select
                                v-model="queryParamsrecord.status"
                                class="selfSerchInput140 mm10"
                                placeholder="状态"
                                clearable
                            >
                                <el-option
                                    v-for="(item, k) in equipStatuslend"
                                    :key="k"
                                    :label="item"
                                    :value="Number(k)"
                                >
                                </el-option>
                            </el-select>

                            <el-button type="primary" icon="Search" class="mm10" @click="serchrecord">搜索</el-button>
                            <el-button icon="Refresh" @click="reset">重置</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter90">
                        <el-table :data="lisrecord" height="100%" border v-loading="loadingrecord" size="small">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="设备编号" prop="equipCode" />
                            <el-table-column label="设备名称" prop="goodsName" />
                            <el-table-column label="状态" prop="status">
                                <template #default="scope">
                                    {{ equipStatuslend[scope.row.status] }}
                                </template>
                            </el-table-column>
                            <el-table-column label="借用开始时间" prop="startTime" />
                            <el-table-column label="借用结束时间" prop="endTime" />
                            <el-table-column label="借用公司" prop="companyId">
                                <template #default="scope">
                                    {{
                                        store.allDepts[scope.row.companyId]
                                            ? store.allDepts[scope.row.companyId].deptName
                                            : scope.row.companyId
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" prop="createBy"></el-table-column>
                            <el-table-column label="操作时间" prop="createTime"></el-table-column>
                            <el-table-column label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="equipInfo(scope.row)"
                                        >详情</el-link
                                    >
                                    <div class="el-divider el-divider-vertical" v-if="scope.row.status == 0"></div>
                                    <el-link
                                        type="primary"
                                        class="fontSize12"
                                        :underline="false"
                                        @click="revoke(scope.row)"
                                        v-if="scope.row.status == 0"
                                        >撤销</el-link
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="myPageBot flex_s_c">
                        <el-pagination
                            @size-change="handleSizeChangerecord"
                            @current-change="handleCurrentChangerecord"
                            :current-page="queryParamsrecord.pageIndex"
                            :page-sizes="[50, 100, 200]"
                            :page-size="queryParamsrecord.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="queryParamsrecord.total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="借出" v-model="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-if="form != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编号" prop="equipCode">
                            <el-input v-model="form.equipCode" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="goodsName">
                            <el-input v-model="form.goodsName" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备型号" prop="model">
                            <el-input v-model="form.model" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司名称" prop="productCompany">
                            <el-input v-model="form.productCompany" disabled placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="借用时间" prop="time">
                            <el-date-picker
                                v-model="form.time"
                                class="selfSerchInput320 mm10"
                                type="datetimerange"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :default-time="defaultTime"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="借用公司" prop="companyId">
                            <el-select v-model="form.companyId" placeholder="请选择" class="maxWidth" clearable>
                                <el-option
                                    v-for="(item, k) in store.allCompanys"
                                    :key="k"
                                    :label="item.deptName"
                                    :value="Number(k)"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" :rows="1" type="textarea" placeholder="请输入" />
                    </el-form-item>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShow = false">关 闭</el-button>
                    <el-button type="primary" @click="sumbit()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { lendListPage, equipCategory, lendSave, lendrecordlis, revokeEquipBorrowingRecord } from '@/api/deviceCenter';
import { dataStore } from '@/store/modules/app';

export default {
    setup() {
        const store = dataStore();
        return { store };
    },
    data() {
        //验证借出时间
        var validateTime = (rule, value, callback) => {
            if (value == null) {
                callback(new Error('请选择借出时间'));
            } else {
                if (!value.length) {
                    callback(new Error('请选择借出时间'));
                } else {
                    const selectStar = new Date(value[0]).getTime();
                    const selectEnd = new Date(value[1]).getTime();
                    const serchStar = new Date(this.value[0]).getTime();
                    const serchEnd = new Date(this.value[1]).getTime();
                    if (selectStar >= serchStar && selectEnd <= serchEnd) {
                        callback();
                    } else {
                        callback(new Error(`请选择${this.value[0]}至${this.value[1]}时间段内`));
                    }
                }
            }
        };
        return {
            activeName: 'first',
            value: null,
            queryParams: {
                equipType: '',
                startTime: '',
                endTime: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            queryParamsrecord: {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            },
            defaultTime: [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 12, 0, 0)],
            loading: true,
            loadingrecord: true,
            cateLis: '',
            lis: [],
            lisrecord: [],
            form: null,
            rules: {
                time: [{ required: true, validator: validateTime, trigger: 'blur' }],
                companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
            },
            isShow: false,
            isSerch:false,
        };
    },
    computed: {},
    mounted() {
        this.getType();
        this.getLis();
        this.getLisrecord();
    },
    methods: {
        //获取类型
        getType() {
            equipCategory({ categoryName: '现场采样仪器' }).then((res) => {
                this.cateLis = this.arrToMap(res, 'id');
            });
        },
        //获取数据
        getLis() {
            if (this.value && this.value.length) {
                this.queryParams['startTime'] = this.value[0];
                this.queryParams['endTime'] = this.value[1];
            } else {
                this.queryParams['startTime'] = '';
                this.queryParams['endTime'] = '';
            }
            this.loading = true;
            lendListPage(this.queryParams).then((res) => {
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
            if(this.queryParams.equipType||this.value){
                this.isSerch=true
            }
            if(!this.queryParams.equipType&&!this.value){
                this.isSerch=false
            }
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
        //点击借出
        borrow(row) {
            this.form = row;
            this.form['time'] = [];
            this.isShow = true;
        },
        //提交
        sumbit() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.form['startTime'] = this.form.time[0];
                    this.form['endTime'] = this.form.time[1];
                    var res = await lendSave(this.form);
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.isShow = false;
                    this.getLis();
                }
            });
        },
        //获取数据
        getLisrecord() {
            this.loadingrecord = true;
            lendrecordlis(this.queryParamsrecord).then((res) => {
                this.loadingrecord = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParamsrecord.total = res.total;
                this.lisrecord = res.rows;
            });
        },
        //搜索
        serchrecord() {
            this.queryParamsrecord.pageIndex = 1;
            this.getLisrecord();
        },
        //重置
        reset() {
            this.queryParamsrecord = {
                companyId: '',
                equipCode: '',
                goodsName: '',
                status: '',
                pageIndex: 1,
                pageSize: 50,
                total: 0,
            };
            this.getLisrecord();
        },
        //改变条数
        handleSizeChangerecord(val) {
            this.queryParamsrecord.pageIndex = 1;
            this.queryParamsrecord.pageSize = val;
            this.getLisrecord();
        },
        //改变页数
        handleCurrentChangerecord(val) {
            this.queryParamsrecord.pageIndex = val;
            this.getLisrecord();
        },
        //撤销
        revoke(row) {
            this.$confirm('确定撤销此设备？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    revokeEquipBorrowingRecord({ id: row.id }).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('撤销成功');
                        this.getLisrecord();
                    });
                })
                .catch(() => {});
        },
        //详情
        equipInfo(row) {
            this.$router.push({
                path: '/deviceCenter/equipInfo',
                query: {
                    id: row.id,
                },
            });
        },
    },
};
</script>
<style scoped lang="scss">
.pageBorder{
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #777;
    img{
        width: 200px;
        margin-bottom:15px
    }
}
</style>
