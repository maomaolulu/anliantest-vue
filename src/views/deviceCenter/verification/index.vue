<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="query" size="default" @submit.prevent="search_get_lis">
                <el-input v-model="query.equipCode" placeholder="设备编号" class="selfSerchInput mm10" clearable />
                <el-input v-model="query.goodsName" placeholder="设备名称" class="selfSerchInput mm10" clearable />
                <el-select v-model="query.verifyState" placeholder="状态" class="selfSerchInput mm10" clearable>
                    <el-option v-for="(item, k) in checkStatusType" :key="k" :label="item" :value="k"> </el-option>
                </el-select>
                <el-button type="primary" icon="Search" class="mm10" @click="search_get_lis">搜索</el-button>
                <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table :data="data_lis" style="width: 100%" height="100%" border size="small">
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
                <el-table-column prop="model" label="规格型号" align="center" header-align="center"></el-table-column>
                <el-table-column prop="verifyState" label="状态" align="center" header-align="center">
                    <template #default="scope">
                        {{ checkStatusType[scope.row.verifyState] }}
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
                    prop="expirationDate"
                    label="证书有效期"
                    align="center"
                    header-align="center"
                ></el-table-column>
                <el-table-column
                    prop="verifyDate"
                    label="核查日期"
                    align="center"
                    header-align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center" header-align="center">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            link
                            v-if="scope.row.verifyState === 0"
                            @click="verificationInfo(scope.row)"
                            >已核查</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
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
    </div>
</template>
<script>
import { listDept } from '@/api/system/dept.ts';
import { getRepairCheck, haveRepairCheck } from '@/api/deviceCenter/verification.ts';
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
            checkStatusType: {
                0: '待核查',
                1: '核查完成',
            },
            deptObj: {},
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.get_lis();
        this.getDeptLis();
    },
    beforeDestroy() {},
    methods: {
        verificationInfo(row) {
            this.$confirm('确认检定当前仪器？', '提示').then((res) => {
                let params = {
                    equipId: row.equipId,
                };
                haveRepairCheck(params).then((res) => {
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('检定成功');
                    this.get_lis();
                });
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
            getRepairCheck(params).then((res) => {
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
.verification {
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
}
</style>