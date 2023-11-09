<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="query" size="default" @submit.prevent="search_get_lis">
                <el-input
                    v-model="query.customerOrder"
                    placeholder="客户隶属"
                    class="selfSerchInput120 mm10"
                    clearable
                />
                <el-input
                    v-model="query.enterpriseName"
                    placeholder="企业名称"
                    class="selfSerchInput120 mm10"
                    clearable
                />
                <el-cascader
                    :props="props"
                    v-model="query.province"
                    placeholder="省/市/区"
                    class="selfSerchInput120 mm10"
                    clearable
                ></el-cascader>
                <!-- <el-input v-model="query.purchaseCode" placeholder="最近合作" class="input_self" clearable /> -->
                <el-select
                    v-model="query.businessStatus"
                    placeholder="业务状态"
                    class="selfSerchInput120 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in businessStatusType" :key="k" :label="item" :value="k"> </el-option>
                </el-select>
                <el-select
                    v-model="query.customerStatus"
                    placeholder="客户状态"
                    class="selfSerchInput120 mm10"
                    clearable
                >
                    <el-option v-for="(item, k) in customerStatusType" :key="k" :label="item" :value="k"> </el-option>
                </el-select>
                <el-button type="primary" class="mm10" icon="Search" @click="search_get_lis">搜索</el-button>
                <el-button icon="Refresh" @click="refresh_get_lis">重置</el-button>
                <el-button type="success" icon="Plus" @click="addInfo" v-if="hasPermissions('custom:list:add')"
                    >新增客户</el-button
                >
                <el-button
                    type="primary"
                    @click="distributeBatch"
                    :disabled="!select_lis.length"
                    v-if="hasPermissions('custom:list:allocation')"
                    >批量分配</el-button
                >
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table
                :data="data_lis"
                style="width: 100%"
                height="100%"
                border
                @selection-change="selectionChange"
                size="small"
            >
                <el-table-column type="selection" width="55" align="center" header-align="center"></el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                    align="center"
                    header-align="center"
                ></el-table-column>
                <el-table-column
                    prop="customerOrder"
                    label="客户隶属"
                    align="center"
                    header-align="center"
                ></el-table-column>
                <el-table-column
                    prop="enterpriseName"
                    label="企业名称"
                    align="center"
                    header-align="center"
                ></el-table-column>
                <el-table-column label="省/市/区" align="center" header-align="center">
                    <template #default="scope">
                        <span>{{ scope.row.province }}</span>
                        <span v-if="scope.row.province && scope.row.city">/</span>
                        <span>{{ scope.row.city }}</span>
                        <span v-if="scope.row.city && scope.row.district">/</span>
                        <span>{{ scope.row.district }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最近合作" align="center" header-align="center"></el-table-column>
                <el-table-column prop="businessStatus" label="业务状态" align="center" header-align="center">
                    <template #default="scope">
                        {{ businessStatusType[scope.row.businessStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="customerStatus" label="客户状态" align="center" header-align="center">
                    <template #default="scope">
                        {{ customerStatusType[scope.row.customerStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="index" label="操作" align="center" header-align="center">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            link
                            v-if="
                                (scope.row.businessStatus === 0 || scope.row.businessStatus === 5) &&
                                hasPermissions('custom:list:allocation')
                            "
                            @click="distributeInfo(scope.row)"
                            >分配</el-button
                        >
                        <el-button
                            type="primary"
                            link
                            @click="editInfo(scope.row)"
                            v-if="hasPermissions('custom:list:update')"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            link
                            @click="delInfo(scope.row)"
                            v-if="hasPermissions('custom:list:delete')"
                            >删除</el-button
                        >
                        <el-dropdown
                            trigger="click"
                            style="margin-left: 10px"
                            @command="
                                (e) => {
                                    return dropdownClick(e, scope.row);
                                }
                            "
                        >
                            <el-button type="primary" link>更多</el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="showCustomInfo">企业信息</el-dropdown-item>
                                    <!-- <el-dropdown-item command="addCustom">历史跟进</el-dropdown-item>
                  <el-dropdown-item command="addCustom">历史合作</el-dropdown-item> -->
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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

        <el-dialog
            :title="showDialogPage ? '批量分配' : '分配'"
            v-model="distributeVisible"
            width="50%"
            :close-on-click-modal="false"
        >
            <div v-if="distributeVisible">
                <el-form ref="distributeForm" :model="distributeForm" label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item
                                label="业务员"
                                prop="userId"
                                :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                            >
                                <el-select
                                    v-model="distributeForm.userId"
                                    placeholder="业务员"
                                    style="width: 100%"
                                    filterable
                                >
                                    <el-option
                                        v-for="(item, k) in userObj"
                                        :key="k"
                                        :label="item.nickName"
                                        :value="Number(k)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                    :data="
                        info_lis.slice(
                            info_query.pageSize * (info_query.pageNum - 1),
                            info_query.pageSize * info_query.pageNum,
                        )
                    "
                    style="width: 100%"
                    max-height="420px"
                    border
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="55"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="enterpriseName"
                        label="企业名称"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column label="省/市/区" align="center" header-align="center">
                        <template #default="scope">
                            <span>{{ scope.row.province }}</span>
                            <span v-if="scope.row.province && scope.row.city">/</span>
                            <span>{{ scope.row.city }}</span>
                            <span v-if="scope.row.city && scope.row.district">/</span>
                            <span>{{ scope.row.district }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务状态" align="center" header-align="center">
                        <template #default="scope">
                            {{ businessStatusType[scope.row.businessStatus] }}
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="showDialogPage">
                    <el-pagination
                        @size-change="infoSizeChange"
                        @current-change="infoCurrentChange"
                        :current-page="info_query.pageNum"
                        :page-sizes="[10]"
                        :page-size="info_query.pageSize"
                        :total="info_query.totalCount"
                        layout="total, prev, pager, next, jumper"
                    ></el-pagination>
                </template>
            </div>
            <template #footer>
                <el-button @click="distributeVisible = false">取 消</el-button>
                <el-button type="primary" @click="distributeSubmit">确 定</el-button>
            </template>
        </el-dialog>
        <editCustom ref="editCustom" @refreshLis="get_lis"></editCustom>
        <customInfo ref="customInfo"></customInfo>
    </div>
</template>
<script>
import {
    getCustomLis,
    getCustomDetail,
    deleteCustomer,
    checkIfRelate,
    customAllocation,
    getAddressLis,
} from '@/api/businessCenter/custom.ts';
import { listUser } from '@/api/deviceCenter/warehousing.ts';
import editCustom from './editCustom.vue';
import customInfo from './customInfo.vue';
import { dataStore } from '@/store/modules/app.ts';
export default {
    name: '',
    props: {},
    components: {
        editCustom,
        customInfo,
    },
    data() {
        return {
            query: {
                pageNum: 1,
                pageSize: 50,
                totalCount: 0,
            },
            data_lis: [],
            select_lis: [],
            userInfo: {},
            businessStatusType: {
                0: '待分配',
                1: '待跟进',
                2: '跟进中',
                3: '待合作',
                4: '合作中',
                5: '跟进结束',
            },
            customerStatusType: {
                1: '正常',
                0: '停用',
            },
            contactClassLis: {
                1: '商务',
                2: '财务',
                3: '业务',
                4: 'EHS',
            },
            customerStatusTypeLis: [
                { value: 1, label: '正常' },
                { value: 0, label: '停用' },
            ],
            showDialogPage: false,
            distributeVisible: false,
            distributeForm: {},
            city_lis: {},
            cityLoading: false,
            info_lis: [],
            info_query: {
                pageNum: 1,
                pageSize: 10,
                totalCount: 0,
            },
            userObj: {},
            props: {
                lazy: true,
                value: 'regionName',
                label: 'regionName',
                lazyLoad(node, resolve) {
                    const { level } = node;
                    if (level == 0) {
                        getAddressLis()
                            .then((res) => {
                                if (res.code != 200) {
                                    this.$message.error(res.msg);
                                    resolve([]);
                                    return;
                                }
                                resolve(res.data);
                            })
                            .catch((err) => {
                                console.log(err);
                                resolve([]);
                            });
                    } else if (level <= 2) {
                        let params = {
                            regionParentId: node.data.id,
                        };
                        getAddressLis(params)
                            .then((res) => {
                                if (res.code != 200) {
                                    this.$message.error(res.msg);
                                    resolve([]);
                                    return;
                                }
                                if (level == 2) {
                                    for (let i = 0; i < res.data.length; i++) {
                                        res.data[i].leaf = 'leaf';
                                    }
                                }
                                resolve(res.data);
                            })
                            .catch((err) => {
                                console.log(err);
                                resolve([]);
                            });
                    } else {
                        resolve([]);
                    }
                },
            },
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.userInfo = dataStore().userInfo;
        this.get_lis();
        this.getUserLis();
    },
    beforeDestroy() {},
    methods: {
        infoSizeChange(val) {
            this.info_query.pageSize = val;
            this.info_query.pageNum = 1;
        },
        infoCurrentChange(val) {
            this.info_query.pageNum = val;
        },
        distributeSubmit() {
            this.$refs.distributeForm.validate((valid, err) => {
                if (valid) {
                    customAllocation(this.distributeForm).then((res) => {
                        if (res.code != 200) {
                            return this.$message.error(res.msg);
                        }
                        this.$message.success('分配成功');
                        this.get_lis();
                        this.distributeVisible = false;
                    });
                } else {
                    console.log(err);
                }
            });
        },
        getUserLis(cb) {
            listUser().then((res) => {
                if (res.code != 200) {
                    this.$message.error(res.msg);
                    cb && cb(false);
                    return;
                }
                let userObj = {};
                for (let i = 0; i < res.data.list.length; i++) {
                    userObj[res.data.list[i].userId] = res.data.list[i];
                }
                this.userObj = userObj;
                cb && cb(true);
            });
        },
        distributeBatch() {
            let info_lis = [];
            let info_type = '';
            for (let i = 0; i < this.select_lis.length; i++) {
                if ((info_type || info_type === 0) && this.select_lis[i].businessStatus != info_type) {
                    return this.$message.error('状态不符，请重新勾选！');
                }
                info_type = this.select_lis[i].businessStatus;
                if (this.select_lis[i].businessStatus === 0 || this.select_lis[i].businessStatus == 5) {
                    this.select_lis[i].companyId = this.select_lis[i].id;
                    info_lis.push(this.select_lis[i]);
                }
            }
            // let info_lis = []
            // for (let i = 0; i < this.select_lis.length; i++) {
            //   if (this.select_lis[i].businessStatus === 0 || this.select_lis[i].businessStatus == 5) {
            //     info_lis.push(this.select_lis[i])
            //   }
            // }
            if (!info_lis.length) {
                return this.$message.error('请先勾选！');
            }
            this.info_query.totalCount = info_lis.length;
            this.info_lis = info_lis;
            this.distributeForm = {
                userId: '',
                tasksList: info_lis,
            };
            this.showDialogPage = true;
            this.distributeVisible = true;
        },
        distributeInfo(row) {
            let info_lis = [];
            info_lis.push(row);
            this.info_query.totalCount = info_lis.length;
            this.info_lis = info_lis;
            this.distributeForm = {
                userId: '',
                tasksList: [row],
            };
            this.showDialogPage = false;
            this.distributeVisible = true;
        },
        delInfo(row) {
            let params = {
                customerId: row.customerId,
            };
            checkIfRelate(params).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                if (res.msg == '可以删除') {
                    this.$confirm('确认删除此条客户？', '提示').then((res) => {
                        deleteCustomer(params).then((res) => {
                            if (res.code != 200) {
                                return this.$message.error(res.msg);
                            }
                            this.$message.success('删除成功');
                            this.get_lis();
                        });
                    });
                } else {
                    this.$alert('该客户信息不可删除！', '提示');
                }
            });
        },
        editInfo(row) {
            this.$refs.editCustom.init(2, row.customerId);
        },
        addInfo() {
            this.$refs.editCustom.init(1, this.userInfo.userId);
        },
        dropdownClick(val, row) {
            if (val == 'showCustomInfo') {
                this.$refs.customInfo.init(row.customerId);
            }
        },
        selectionChange(val) {
            this.select_lis = val;
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
        get_lis(cb) {
            let params = JSON.parse(JSON.stringify(this.query));
            if (params.province) {
                params.area = params.province[2];
                params.city = params.province[1];
                params.province = params.province[0];
            }
            getCustomLis(params).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.data_lis = res.rows;
                this.query.totalCount = res.total;
                cb && cb();
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.project {
    width: 100%;
    height: 100%;
    padding: 20px 20px 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .top_self {
        position: relative;
        width: 100%;
        margin-bottom: 4px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        :deep(.input_self) {
            width: 160px;
            margin-right: 10px;
            margin-bottom: 6px;
        }
        .right_btn {
            position: absolute;
            right: 0;
        }
    }
    .subBtn {
        margin-bottom: 6px;
    }
    .main_table {
        flex: 1;
        margin-bottom: 6px;
        overflow: hidden;
    }
    .el-dropdown {
        padding: 2px;
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