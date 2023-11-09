<template>
    <div class="myPage">
        <el-tabs v-model="activeName" type="card" class="self_el_tabs">
            <el-tab-pane label="项目类型" name="first">
                <div class="myPage" style="padding: 0">
                    <div class="myPageTop45 flex_s_c">
                        <div @click="reset(0)" :class="queryParams.subtype == 0 ? 'selfBtnActive' : 'selfBtn'">
                            项目下发
                        </div>
                        <div @click="reset(1)" :class="queryParams.subtype == 1 ? 'selfBtnActive' : 'selfBtn'">
                            公示审批
                        </div>
                        <div @click="reset(2)" :class="queryParams.subtype == 2 ? 'selfBtnActive' : 'selfBtn'">
                            结束确认
                        </div>
                    </div>
                    <div class="myPageTop45" style="padding-top: 3px">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-select
                                class="selfSerchInput180 mm10"
                                v-model="queryParams.companyId"
                                placeholder="所属公司"
                                clearable
                            >
                                <el-option
                                    v-for="(item, i) in companyLis"
                                    :key="i"
                                    :label="item.deptName"
                                    :value="item.deptId"
                                />
                            </el-select>
                            <el-input
                                v-model="queryParams.code"
                                class="selfSerchInput mm10"
                                placeholder="类型编号"
                                clearable
                                @keyup.enter.native="serch"
                            />
                            <el-input
                                v-model="queryParams.name"
                                class="selfSerchInput mm10"
                                placeholder="类型名称"
                                clearable
                                @keyup.enter.native="serch"
                            />
                            <el-button type="primary" class="mm10" icon="Search" @click="serch">搜索</el-button>
                            <el-button icon="Refresh" @click="reset()">重置</el-button>
                        </el-form>
                    </div>
                    <div class="myCenter135">
                        <el-table :data="lis" height="100%" border v-loading="loading">
                            <el-table-column type="index" width="60" label="序号" align="center" />
                            <el-table-column label="所属公司" prop="companyName" />
                            <el-table-column label="类型编号" prop="code" />
                            <el-table-column label="类型名称" prop="name" />
                            <el-table-column label="负责角色" prop="roleIds" />
                            <el-table-column label="负责人员" prop="roleUserNames" />
                            <el-table-column label="操作" width="100">
                                <template #default="scope">
                                    <el-button size="small" type="text" @click="editItem(scope.row)">编辑</el-button>
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
                </div>
            </el-tab-pane>
            <el-tab-pane label="合同类型" name="second">合同类型</el-tab-pane>
        </el-tabs>
        <el-dialog title="编辑" v-if="isShow" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="form != null">
                <el-form-item label="所属公司">
                    <el-input v-model="form.companyName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="类型编号">
                    <el-input v-model="form.code" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="form.name" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="负责角色" prop="roleIdsLis">
                    <el-select v-model="form.roleIdsLis" multiple placeholder="请选择" class="maxWidth" filterable  @change="changeRole">
                        <el-option v-for="(item, i) in roleLis" :key="i" :label="item.roleName" :value="String(i)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人员">
                    <el-input v-model="form.roleUserNames" placeholder="请输入" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="isShow = false">取 消</el-button>
            </div>
        </template>
        </el-dialog>
    </div>
</template>
<script>
import { getCompany } from '@/api/system/dept';
import { getProcessLis, processUpdate } from '@/api/system/dataCenter';
import { listRoleAll } from '@/api/system/role';
export default {
    data() {
        return {
            activeName: 'first',
            queryParams: {
                subtype: 0, //0：项目下发，1：公示审批，2：结束确认
                companyId: '',
                code: '',
                name: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                type: 0,
            },
            companyLis: [],
            roleLis:{},
            loading: true,
            lis: [],
            isShow: false,
            form: null,
            rules: {
                roleIdsLis: [{ required: true, message: '请选择负责角色', trigger: 'blur' }],
            },
        };
    },
    mounted() {
        this.getCompanyLis();
        this.getLis();
        this.getRole();
    },
    methods: {
        //获取角色
        getRole() {
            listRoleAll().then((res) => {
                res.data.forEach(element => {
                    this.roleLis[element.roleId]=element;
                    
                });
                console.log(this.roleLis)
            });
        },
        //获取公司下拉
        getCompanyLis() {
            getCompany().then((res) => {
                this.companyLis = res.data;
            });
        },
        //获取列表
        getLis() {
            this.loading = true;
            getProcessLis(this.queryParams).then((res) => {
                this.loading = false;
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.queryParams.total = res.total;
                this.lis = res.rows;
            });
        },
        //重置
        reset(subtypeItem = 0, type = 0) {
            this.queryParams = {
                subtype: subtypeItem, //0：项目下发，1：公示审批，2：结束确认
                companyId: '',
                code: '',
                name: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                type: type,
            };
            console.log(this.queryParams )
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
        //点击编辑
        editItem(row) {
            row['roleIdsLis']=row['roleIds']?row['roleIds'].split(','):[]
            this.form = JSON.parse(JSON.stringify(row)) ;
            this.isShow = true;
        },
        //改变角色
        changeRole(val){
            var arr=[]
            val.forEach(em=>{
                arr=arr.concat(this.roleLis[em].userList)
            })
            arr=this.arrSome(arr,'userId')
            var userNames=[];
            arr.forEach(em=>{
                userNames.push(em.nickName)
            })
            this.form['roleUserNames']=userNames.join(',')
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.form['roleIds']=this.form['roleIdsLis'].join(',')
                    processUpdate(this.form).then((res) => {
                        this.$message.success('保存成功');
                        this.isShow = false;
                        this.getLis();
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.selfBtn {
    width: 100px;
    height: 32px;
    float: left;
    border: 1px solid #409eff;
    text-align: center;
    line-height: 31px;
    font-size: 13px;
    color: #409eff;
    border-radius: 3px;
    transition: 0.3s;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
        color: #fff;
        background: #40a0ff89;
        border-color: #40a0ff89;
    }
}
.selfBtnActive {
    width: 100px;
    height: 32px;
    float: left;
    border: 1px solid #409eff;
    background: #409eff;
    text-align: center;
    line-height: 31px;
    font-size: 13px;
    color: #fff;
    border-radius: 3px;
    margin-right: 10px;
}
</style>