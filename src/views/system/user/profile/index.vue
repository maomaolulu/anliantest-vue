<template>
    <div class="myPage">
        <!-- <div class="pageLeft">
        
      </div> -->
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>个人信息</span>
                        </div>
                    </template>
                    <div>
                        <div class="text-center">
                            <userAvatar :user="user" />
                        </div>
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="user" class="svg" />用户名称</div>
                                <div class="pull-right">{{ user.userName }}</div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="phone" class="svg" />手机号码</div>
                                <div class="pull-right">{{ user.phonenumber }}</div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="email" class="svg" />用户邮箱</div>
                                <div class="pull-right">{{ user.email }}</div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="tree" class="svg" />所属部门</div>
                                <div class="pull-right" v-if="user.dept">
                                    {{ user.dept.deptName }}
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="people" class="svg" />隶属岗位</div>
                                <div class="pull-right" v-if="user.dept">
                                    {{ postGroup }}
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="peoples" class="svg" />所属角色</div>
                                <div class="pull-right">{{ roleGroup }}</div>
                            </li>
                            <li class="list-group-item">
                                <div class="flex_s_c"><svg-icon name="date" class="svg" />创建日期</div>
                                <div class="pull-right">{{ user.createTime }}</div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                  <template #header>
                    <div class="card-header">
                        <span>基本资料</span>
                    </div>
                  </template>
                    
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="基本资料" name="userinfo">
                            <userInfo :user="user" />
                        </el-tab-pane>
                        <el-tab-pane label="修改密码" name="resetPwd">
                            <resetPwd />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from '@/api/system/user';

export default {
    name: 'Profile',
    components: {userAvatar,userInfo,resetPwd},
    data() {
        return {
            user: {},
            roleGroup: {},
            postGroup: {},
            activeTab: 'userinfo',
        };
    },
    created() {
        this.getUser();
    },
    methods: {
        getUser() {
            getUserProfile().then((response) => {
                this.user = response.data;
                this.roleGroup = response.roleGroup;
                this.postGroup = response.postGroup;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep(.el-card__header) {
    padding: 12px 15px !important;
}
::v-deep(.el-card__body) {
    padding: 0 15px !important;
}
.list-group {
    margin: 0 !important;
    .list-group-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .svg{
          margin-right: 4px;
        }
    }
}
</style>
