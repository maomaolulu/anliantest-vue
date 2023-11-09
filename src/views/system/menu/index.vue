<template>
    <div class="myPage">
        <div class="myPageTop45">
            <el-form :model="queryParams" ref="queryForm" size="default">
                <el-input
                    class="selfSerchInput marginRight10"
                    v-model="queryParams.menuName"
                    placeholder="请输入菜单名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable class="marginRight10">
                    <el-option v-for="(dict, k) in menuStatus" :key="k" :label="dict" :value="k" />
                </el-select>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:menu:add']"
                    >新增</el-button
                >
                <el-button type="info" plain icon="Switch" @click="toggleExpandAll">展开/折叠</el-button>
            </el-form>
        </div>
        <div class="myCenter45">
            <el-table
                v-if="refreshTable"
                v-loading="loading"
                :data="menuList"
                row-key="menuId"
                height="100%"
                :default-expand-all="isExpandAll"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                size="small"
            >
                <el-table-column
                    prop="menuName"
                    label="菜单名称"
                    :show-overflow-tooltip="true"
                    width="160"
                ></el-table-column>
                <el-table-column prop="icon" label="图标" align="center" width="100">
                    <template #default="scope">
                        <svg-icon :name="scope.row.icon" />
                    </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
                <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <template #default="scope">
                        <el-tag :type="scope.row.status==0?'success':'danger'">{{ menuStatus[scope.row.status] }}</el-tag>
                        
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
                <el-table-column label="操作" align="center" width="240">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="primary"
                            icon="Edit"
                            class="noMar"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:menu:edit']"
                            text
                            >修改</el-button
                        >
                        <el-button
                            size="small"
                            type="primary"
                            icon="Plus"
                            class="noMar"
                            @click="handleAdd(scope.row)"
                            v-hasPermi="['system:menu:add']"
                            text
                            >新增</el-button
                        >
                        <el-button
                            size="small"
                            type="primary"
                            class="noMar"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:menu:remove']"
                            text
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" v-model="open" width="680px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-tree-select
                                v-model="form.parentId"
                                :data="menuOptions"
                                class="maxWidth"
                                node-key="menuId"
                                :props="{ label: 'menuName', children: 'children' }"
                                check-strictly
                                :render-after-expand="false"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="form.menuType">
                                <el-radio label="M">目录</el-radio>
                                <el-radio label="C">菜单</el-radio>
                                <el-radio label="F">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="form.menuType != 'F'">
                        <el-form-item label="菜单图标" prop="icon">
                            <el-popover
                                placement="bottom-start"
                                width="460"
                                trigger="click"
                                @show="$refs['iconSelect'].reset()"
                            >
                                <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />
                                <template #reference>
                                    <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                                        <template #prefix v-if="form.icon">
                                            <svg-icon v-if="form.icon" :name="form.icon" style="width: 25px" />
                                        </template>
                                        <template #prefix v-else>
                                            <i class="el-icon-search el-input__icon" />
                                        </template>
                                    </el-input>
                                </template>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="isFrame">
                            <template #label>
                                <span>
                                    <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    是否外链
                                </span>
                            </template>
                            <el-radio-group v-model="form.isFrame">
                                <el-radio label="0">是</el-radio>
                                <el-radio label="1">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="path">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    路由地址
                                </span>
                            </template>
                            <el-input v-model="form.path" placeholder="请输入路由地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="component">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    组件路径
                                </span>
                            </template>

                            <el-input v-model="form.component" placeholder="请输入组件路径" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'M'">
                        <el-form-item prop="perms">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    权限字符
                                </span>
                            </template>
                            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="query">
                            <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    路由参数
                                </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType == 'C'">
                        <el-form-item prop="isCache">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    是否缓存
                                </span>
                            </template>
                            <el-radio-group v-model="form.isCache">
                                <el-radio label="0">缓存</el-radio>
                                <el-radio label="1">不缓存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="visible">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    显示状态
                                </span>
                            </template>
                            <el-radio-group v-model="form.visible">
                                <el-radio v-for="(dict, key) in menuIsHides" :key="key" :label="key">{{
                                    dict
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.menuType != 'F'">
                        <el-form-item prop="status">
                            <template #label>
                                <span>
                                    <el-tooltip
                                        content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                                        placement="top"
                                    >
                                        <el-icon><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                    菜单状态
                                </span>
                            </template>
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="(dict, key) in menuStatus" :key="key" :label="key">{{
                                    dict
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script >
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu';
import IconSelect from '@/components/IconSelect';
export default {
    setup() {
        return {};
    },
    name: 'Menu',
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: {  IconSelect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 菜单表格树数据
            menuList: [],
            // 菜单树选项
            menuOptions: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部折叠
            isExpandAll: false,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                menuName: undefined,
                visible: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
                orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
                path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
            },
        };
    },
    created() {
        
        this.getList();
    },
    methods: {
        // 选择图标
        selected(name) {
            this.form.icon = name;
        },
        /** 查询菜单列表 */
        getList() {
            this.loading = true;
            listMenu(this.queryParams).then((response) => {
                this.menuList = this.handleTree(response.data, 'menuId');
                console.log(this.menuList, 'this.menuList this.menuList this.menuList ');
                this.loading = false;
            });
        },
        /** 转换菜单数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.menuId,
                label: node.menuName,
                children: node.children,
            };
        },
        /** 查询菜单下拉树结构 */
        getTreeselect() {
            listMenu().then((response) => {
                this.menuOptions = [];
                const menu = { menuId: 0, menuName: '主类目', children: [] };
                menu.children = this.handleTree(response.data, 'menuId');
                this.menuOptions.push(menu);
                console.log(this.menuOptions);
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                menuId: undefined,
                parentId: 0,
                menuName: undefined,
                icon: undefined,
                menuType: 'M',
                orderNum: undefined,
                isFrame: '1',
                isCache: '0',
                visible: '0',
                status: '0',
            };
            this.resetForm('form');
        },
        resetForm(refName) {
            if (this.$refs[refName]) {
                this.$refs[refName].resetFields();
            }
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams= {
                menuName: undefined,
                visible: undefined,
            }
            // this.resetForm(this,'queryForm');
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            this.getTreeselect();
            if (row != null && row.menuId) {
                this.form.parentId = row.menuId;
            } else {
                this.form.parentId = 0;
            }
            this.open = true;
            this.title = '添加菜单';
            console.log(this.open);
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getMenu(row.menuId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = '修改菜单';
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.menuId != undefined) {
                        updateMenu(this.form).then((response) => {
                            this.$message.success('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addMenu(this.form).then((response) => {
                            this.$message.success('新增成功');
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项？')
                .then(function () {
                    return delMenu(row.menuId);
                })
                .then(() => {
                    this.getList();
                    this.$message.success('删除成功');
                })
                .catch(() => {});
        },
    },
};
</script>
