<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
                <el-input
                    v-model="queryParams.roleName"
                    class="selfSerchInput140"
                    placeholder="请输入角色名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-input
                    class="selfSerchInput140"
                    v-model="queryParams.roleKey"
                    placeholder="请输入权限字符"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-select
                    class="selfSerchInput140 marginRight10"
                    v-model="queryParams.status"
                    placeholder="角色状态"
                    clearable
                >
                    <el-option v-for="(dict, k) in rolesStatus" :key="k" :label="dict" :value="k" />
                </el-select>
                <el-date-picker
                    v-model="dateRange"
                    style="width: 220px"
                    class="marginRight10 feloat"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:role:add']"
                    >新增</el-button
                >
                <el-button
                    type="danger"
                    plain
                    icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['system:role:remove']"
                    >删除</el-button
                >
                <!-- <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    @click="handleExport"
                    v-hasPermi="['system:role:export']"
                    >导出</el-button
                > -->
            </el-form>
        </div>
        <div class="myCenter90">
            <el-table
                v-loading="loading"
                :data="roleList"
                @selection-change="handleSelectionChange"
                height="100%"
                border
                size="small"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="角色编号" prop="roleId" width="120" />
                <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
                <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
                <el-table-column label="显示顺序" prop="roleSort" width="100" />
                <el-table-column label="状态" align="center" width="100">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-value="0"
                            inactive-value="1"
                            @change="handleStatusChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <template v-if="scope.row.roleId !== 1">
                            <el-button
                                size="small"
                                text
                                type="primary"
                                icon="Edit"
                                class="selfBtnSmall"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['system:role:edit']"
                                >修改</el-button
                            >
                            <el-button
                                size="small"
                                text
                                type="primary"
                                icon="Delete"
                                class="selfBtnSmall"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['system:role:remove']"
                                >删除</el-button
                            >
                            <el-button size="small" text type="primary" icon="Promotion" class="selfBtnSmall" @click="setUserRole(scope.row)"
                                >分配用户</el-button
                            >
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="myPageBot flex_s_c">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
                :page-sizes="[10, 50, 100, 200]"
                :page-size="queryParams.pageSize"
                :current-page="queryParams.pageNum"
                @size-change="handleSizeChangeLis"
                @current-change="handleCurrentChangeLis"
            />
        </div>

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" v-model="open" width="60%" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="form != null">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="form.roleName" placeholder="请输入角色名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="roleKey">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    权限字符
                                </span>
                            </template>
                            <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="角色顺序" prop="roleSort">
                            <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="(dict, k) in rolesStatus" :key="k" :label="k">{{ dict }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="备注">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="菜单权限" prop="menuIds">
                        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand('menu')"
                            >展开/折叠</el-checkbox
                        >
                        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')"
                            >全选/全不选</el-checkbox
                        >
                        <el-tree
                            class="tree-border"
                            :data="menuOptions"
                            v-if="isExpandAll"
                            :check-strictly="isStrictlyMenu"
                            :default-expanded-keys="form.menuIds"
                            :default-checked-keys="form.menuIds"
                            :default-expand-all="isExpandAllMenu"
                            show-checkbox
                            ref="menu"
                            node-key="id"
                            empty-text="加载中，请稍候"
                            :props="defaultProps"
                        ></el-tree>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="权限范围" prop="dataScope">
                        <el-select v-model="form.dataScope" style="width: 100%" placeholder="权限范围" clearable>
                            <el-option v-for="(item, k) in roleDataScope" :key="k" :label="item" :value="k" />
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="数据权限">
                        <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand('dept')"
                            >展开/折叠</el-checkbox
                        >
                        <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')"
                            >全选/全不选</el-checkbox
                        >

                        <el-tree
                            class="tree-border"
                            :data="deptList"
                            v-if="isExpandAll"
                            :check-strictly="isStrictlyDept"
                            :default-expanded-keys="form.deptIds"
                            :default-checked-keys="form.deptIds"
                            :default-expand-all="isExpandAllDept"
                            show-checkbox
                            ref="dept"
                            node-key="deptId"
                            empty-text="加载中，请稍候"
                            :props="deptProps"
                        ></el-tree>
                    </el-form-item>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="分配权限" v-model="isUserRole" width="90%" append-to-body>
            <div class="dialogBox">
                <div class="boxLeft">
                    <div class="leftSerch">
                        <el-input v-model="treeKeyword" placeholder="请输入部门名称" clearable />
                    </div>
                    <div class="leftTree">
                        <el-tree
                            :data="deptList"
                            default-expand-all
                            :current-node-key="firstNodeKey"
                            highlight-current
                            :expand-on-click-node="false"
                            @node-click="deptTreeItemClick"
                            node-key="deptId"
                            ref="treeSet"
                            :filter-node-method="filterNode"
                            empty-text="加载中，请稍候"
                            :props="deptProps"
                        ></el-tree>
                    </div>
                </div>
                <div class="boxRight">
                    <div class="myPage">
                        <div class="myPageTop45">
                            <el-input
                                v-model="serchInfo.nickName"
                                class="selfSerchInput"
                                placeholder="请输入人员名称"
                                clearable
                            />
                            <el-button type="primary" style="margin-left: 10px" @click="serchRoleUser">搜索</el-button>
                            <el-button type="info" plain @click="addRoleUser" v-if="isBox == 'allocated'"
                                >添加人员</el-button
                            >
                            <el-button
                                type="warning"
                                plain
                                @click="allSetCancelRole"
                                v-if="isBox == 'allocated'"
                                :key="new Date().getTime()"
                                :disabled="!selectUsersAll.length"
                                >批量取消授权</el-button
                            >
                            <el-button type="info" plain @click="colseRoleUser" v-if="isBox == 'unallocated'"
                                >取消授权</el-button
                            >
                            <el-button
                                type="success"
                                @click="allSetRole"
                                v-if="isBox == 'unallocated'"
                                :key="new Date().getTime()"
                                :disabled="!selectUsersAll.length"
                                >批量授权</el-button
                            >
                            <el-button type="danger" plain @click="isUserRole = false">关闭</el-button>
                        </div>
                        <div class="myCenter90">
                            <el-table
                                :data="usersData"
                                style="width: 100%"
                                height="100%"
                                border
                                ref="userTable"
                                :row-key="getRowKey"
                                @selection-change="selectUser"
                            >
                                <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="nickName" label="人员名称"> </el-table-column>
                                <el-table-column prop="dept.deptName" label="所属部门"> </el-table-column>
                                <el-table-column prop="email" label="邮箱"> </el-table-column>
                                <el-table-column prop="createTime" label="创建时间"> </el-table-column>
                                <el-table-column prop="address" label="操作" width="100">
                                    <template #default="scope">
                                        <el-popconfirm
                                            title="确认授权此用户？"
                                            v-if="isBox == 'allocated'"
                                            @confirm="cancelItemUserRole(scope.row)"
                                        >
                                            <template #reference>
                                                <el-button type="text" size="small" style="color: #f56c6c">取消授权</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <el-popconfirm
                                            title="确认授权此用户？"
                                            v-if="isBox == 'unallocated'"
                                            @confirm="setItemUserRole(scope.row)"
                                        >
                                            <template #reference>
                                                <el-button type="text" size="small">授权</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="myPageBot flex_s_c">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="serchInfo.pageNum"
                                :page-sizes="[30, 50, 100, 200]"
                                :page-size="serchInfo.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="serchInfo.total"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listRole,
    getRole,
    delRole,
    addRole,
    updateRole,
    dataScope,
    changeRoleStatus,
    allocatedUserList,
    unallocatedUserList,
    authUserSelectAll,
    authUserCancelAll,
} from '@/api/system/role';
import { listDept } from '@/api/system/dept';
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu';

export default {
    name: 'Role',
    dicts: ['sys_normal_disable'],
    data() {
        var checkMenus = (rule, value, callback) => {
            console.log(this.form.menuIds);
            if (!this.form.menuIds.length) {
                return callback(new Error('请选择路由菜单！'));
            } else {
                callback();
            }
        };
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 角色表格数据
            roleList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否显示弹出层（数据权限）
            openDataScope: false,
            menuExpand: false,
            menuNodeAll: false,
            deptExpand: false,
            deptNodeAll: false,
            isExpandAllMenu: false, //菜单默认不展开
            isExpandAllDept: false, //部门默认不展开
            isExpandAll: true, //控制树状图重新渲染
            isStrictlyMenu: false, //菜单父子是否关联
            isStrictlyDept: false, //权限父子是否关联
            // 日期范围
            dateRange: [],
            // 数据范围选项
            dataScopeOptions: [
                {
                    value: '1',
                    label: '全部数据权限',
                },
                {
                    value: '2',
                    label: '自定数据权限',
                },
                {
                    value: '3',
                    label: '本部门数据权限',
                },
                {
                    value: '4',
                    label: '本部门及以下数据权限',
                },
                {
                    value: '5',
                    label: '仅本人数据权限',
                },
            ],
            menuOptions: [], // 菜单列表
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                roleName: undefined,
                roleKey: undefined,
                status: undefined,
            },
            // 表单参数
            form: null,
            defaultProps: {
                children: 'children',
                label: 'label',
            },
            deptProps: {
                children: 'children',
                label: 'deptName',
            },
            // 表单校验
            rules: {
                roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
                roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
                roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
                menuIds: [{ validator: checkMenus, trigger: 'blur' }],
                dataScope: [{ required: true, message: '请选择权限范围', trigger: 'blur' }],
            },
            deptList: [], //权限数据
            isUserRole: false,
            treeKeyword: '', //部门搜索关键词
            serchInfo: {
                nickName: '',
                pageNum: 1,
                pageSize: 30,
                total: 0,
                deptId: '',
            },
            usersData: [],
            selectUsersAll: [], //选中的人员
            firstNodeKey: '', //进入时默认的key
            itemRoleId: '', //点击的角色id
            isBox: 'allocated', //allocated 已授权状态  unallocated 未授权状态
        };
    },
    watch: {
        treeKeyword(val) {
            this.$refs.treeSet.filter(val);
        },
    },
    created() {
        this.getList();
        this.getDeptLis();
        this.getMenuLis();
    },
    methods: {
        //获取部门列表
        getDeptLis() {
            listDept().then((res) => {
                this.deptList = this.handleTree(res.data, 'deptId');
                console.log(this.deptList);
                this.firstNodeKey = this.deptList[0].deptId;
            });
        },
        //获取菜单列表
        getMenuLis() {
            menuTreeselect().then((response) => {
                this.menuOptions = response.data;
            });
        },
        /** 查询角色列表 */
        getList() {
            this.loading = true;
            listRole(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
                this.roleList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //改变条数
        handleSizeChangeLis(val) {
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = val;
            console.log(this.queryParams);
            this.getList();
        },
        //改变页数
        handleCurrentChangeLis(val) {
            this.queryParams.pageNum = val;
            this.getList();
        },
        /** 根据角色ID查询菜单树结构 */
        getRoleMenuTreeselect(roleId) {
            return roleMenuTreeselect(roleId).then((response) => {
                this.menuOptions = response.menus;
                return response;
            });
        },
        // 角色状态修改
        handleStatusChange(row) {
            let text = row.status === '0' ? '启用' : '停用';
            this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗？')
                .then(function () {
                    return changeRoleStatus(row.roleId, row.status);
                })
                .then(() => {
                    this.$message.success(text + '成功');
                })
                .catch(function () {
                    row.status = row.status === '0' ? '1' : '0';
                });
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 取消按钮（数据权限）
        cancelDataScope() {
            this.openDataScope = false;
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams= {
                pageNum: 1,
                pageSize: 10,
                roleName: undefined,
                roleKey: undefined,
                status: undefined,
            }
            this.dateRange = [];
            this.resetForm(this,'queryForm');
            this.handleQuery();
        },
        // 表格多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.roleId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.menuExpand = false;
            this.menuNodeAll = false;
            this.deptExpand = false;
            this.deptNodeAll = false;
            this.form = {
                roleId: undefined,
                roleName: undefined,
                roleKey: undefined,
                roleSort: 0,
                status: '0',
                menuIds: [],
                remark: undefined,
                dataScope: '',
                deptIds: [],
            };
            this.open = true;
            this.title = '添加角色';
            this.isExpandAllMenu = false; //菜单默认不展开
            this.isExpandAllDept = false; //部门默认不展开
            this.isExpandAll = false;
            this.$nextTick(() => {
                this.isExpandAll = true;
            });
        },
        // 树状图（展开/折叠）
        handleCheckedTreeExpand(type) {
            if (type == 'menu') {
                this.isExpandAllMenu = !this.isExpandAllMenu;
            } else if (type == 'dept') {
                this.isExpandAllDept = !this.isExpandAllDept;
            }
            this.isExpandAll = false;
            this.$nextTick(() => {
                this.isExpandAll = true;
            });
        },
        // 树状图（全选/全不选）
        handleCheckedTreeNodeAll(value, type) {
            if (type == 'menu') {
                this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
            } else if (type == 'dept') {
                this.$refs.dept.setCheckedNodes(value ? this.deptList : []);
            }
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.title = '修改角色';
            this.form = null;
            const roleId = row.roleId || this.ids;
            getRole(roleId).then((response) => {
                this.open = true;
                this.isExpandAllMenu = false; //菜单默认不展开
                this.isExpandAllDept = false; //部门默认不展开
                this.isStrictlyMenu = true;
                this.isStrictlyDept = true;
                this.form = response.data;
                console.log(this.form);
                this.$nextTick(() => {
                    this.isStrictlyMenu = false;
                    this.isStrictlyDept = false;
                });
            });
        },
        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            let checkedKeys = this.$refs.menu.getCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        // 所有部门节点数据
        getDeptAllCheckedKeys() {
            // 目前被选中的部门节点
            let checkedKeys = this.$refs.dept.getCheckedKeys();
            // 半选中的部门节点
            let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        /** 提交按钮 */
        submitForm: function () {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            this.form.deptIds = this.getDeptAllCheckedKeys();
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    if (this.form.roleId != undefined) {
                        var res = await updateRole(this.form);
                    } else {
                        var res = await addRole(this.form);
                    }
                    if (res.code != 200) {
                        return this.$message.error(res.msg);
                    }
                    this.$message.success('保存成功');
                    this.open = false;
                    this.getList();
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const roleIds = row.roleId || this.ids;
            this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
                .then(function () {
                    return delRole(roleIds);
                })
                .then(() => {
                    this.getList();
                    this.$message.success('删除成功');
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'system/role/export',
                {
                    ...this.queryParams,
                },
                `role_${new Date().getTime()}.xlsx`,
            );
        },
        //点击分配用户
        setUserRole(row) {
            this.itemRoleId = row.roleId;
            this.serchInfo = {
                nickName: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                deptId: this.firstNodeKey,
                roleId: row.roleId,
            };
            this.isBox = 'allocated';
            this.getAllocatedUserList();
            this.isUserRole = true;
        },
        //节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.deptName.indexOf(value) !== -1;
        },
        //部门点击
        deptTreeItemClick(v, b, c) {
            this.serchInfo = {
                nickName: '',
                pageNum: 1,
                pageSize: 50,
                total: 0,
                deptId: v.deptId,
                roleId: this.itemRoleId,
            };
            if (this.isBox == 'allocated') {
                this.getAllocatedUserList();
            } else {
                this.getUnallocatedUserList();
            }
        },
        getRowKey(row) {
            return row.userId;
        },
        //搜索
        serchRoleUser() {
            this.selectUsersAll = [];
            this.serchInfo.pageNum = 1;
            if (this.isBox == 'allocated') {
                this.getAllocatedUserList();
            } else {
                this.getUnallocatedUserList();
            }
        },
        //改变条数
        handleSizeChange(val) {
            this.serchInfo.pageNum = 1;
            this.serchInfo.pageSize = val;
            if (this.isBox == 'allocated') {
                this.getAllocatedUserList();
            } else {
                this.getUnallocatedUserList();
            }
        },
        //改变页数
        handleCurrentChange(val) {
            this.serchInfo.pageNum = val;
            if (this.isBox == 'allocated') {
                this.getAllocatedUserList();
            } else {
                this.getUnallocatedUserList();
            }
        },
        //获取已授权的列表
        getAllocatedUserList() {
            allocatedUserList(this.serchInfo).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.usersData = res.rows;
                this.serchInfo.total = res.total;
            });
        },
        //点击添加人员
        addRoleUser() {
            this.$refs.userTable.clearSelection();
            this.selectUsersAll = [];
            var deptId = this.$refs.treeSet.getCurrentKey();
            this.serchInfo = {
                nickName: '',
                pageNum: 1,
                pageSize: 30,
                total: 0,
                deptId: deptId,
                roleId: this.itemRoleId,
            };
            this.isBox = 'unallocated';
            this.getUnallocatedUserList();
        },
        //点击取消授权按钮
        colseRoleUser() {
            this.$refs.userTable.clearSelection();
            this.selectUsersAll = [];
            var deptId = this.$refs.treeSet.getCurrentKey();
            this.serchInfo = {
                nickName: '',
                pageNum: 1,
                pageSize: 30,
                total: 0,
                deptId: deptId,
                roleId: this.itemRoleId,
            };
            this.isBox = 'allocated';
            this.getAllocatedUserList();
        },
        //获取未授权的人员
        getUnallocatedUserList() {
            unallocatedUserList(this.serchInfo).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.usersData = res.rows;
                this.serchInfo.total = res.total;
            });
        },
        //选择人员表格
        selectUser(val) {
            console.log(val);
            this.selectUsersAll = val;
            // return
            //   val.forEach((item) => {
            //       this.selectUsersAll.push(item);
            //   });
            //   this.selectUsersAll = this.arrSome(this.selectUsersAll, 'userId');
            //   console.log(this.selectUsersAll);
        },
        //批量授权提交
        allSetRole() {
            var arr = [];
            this.selectUsersAll.forEach((item) => {
                arr.push(item.userId);
            });
            var userIds = arr.join(',');
            authUserSelectAll({ roleId: this.itemRoleId, userIds: userIds }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.getUnallocatedUserList();
                this.$message.success('授权成功');
            });
        },
        //单个授权
        setItemUserRole(row) {
            authUserSelectAll({ roleId: this.itemRoleId, userIds: row.userId }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.getUnallocatedUserList();
                this.$message.success('授权成功');
            });
        },
        //批量取消授权用户
        allSetCancelRole() {
            var arr = [];
            this.selectUsersAll.forEach((item) => {
                arr.push(item.userId);
            });
            var userIds = arr.join(',');
            authUserCancelAll({ roleId: this.itemRoleId, userIds: userIds }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.getAllocatedUserList();
                this.$message.success('取消授权成功');
            });
        },
        //单个取消授权
        cancelItemUserRole(row) {
            authUserCancelAll({ roleId: this.itemRoleId, userIds: row.userId }).then((res) => {
                if (res.code != 200) {
                    return this.$message.error(res.msg);
                }
                this.getAllocatedUserList();
                this.$message.success('取消授权成功');
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.dialogBox {
    width: 100%;
    height: 500px;
    .boxLeft {
        width: 26%;
        height: 100%;
        float: left;
        padding: 10px 15px 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 1px 4px 4px #eee;
        .leftSerch {
            width: 100%;
            float: left;
            height: 40px;
        }
        .leftTree {
            width: 100%;
            height: calc(100% - 40px);
            float: left;
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
    .boxRight {
        width: calc(74% - 15px);
        height: 100%;
        float: right;
        box-shadow: 0 1px 4px 4px #eee;
    }
}
</style>