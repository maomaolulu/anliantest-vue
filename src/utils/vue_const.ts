export default {
    install(app: any) {
        //数组根据参数去重
        app.config.globalProperties.menuStatus = {
            0: '正常',
            1: '停用'
        }
        //菜单显示状态
        app.config.globalProperties.menuIsHides = {
            0: '显示',
            1: '隐藏'
        }
        //菜单显示状态
        app.config.globalProperties.rolesStatus = {
            0: '正常',
            1: '停用'
        }
        //角色权限
        app.config.globalProperties.roleDataScope = {
            1: '所有数据权限',
            2: '自定义数据权限',
            3: '本部门数据权限',
            4: '本部门及以下数据权限',
            5: '仅本人数据权限'
        }
        // 字典状态
        app.config.globalProperties.dictStatus = {
            0: '正常',
            1: '停用'
        }
        // 参数配置选项
        app.config.globalProperties.sysConfigStatus = {
            'Y': '是',
            'N': '否'
        }
        // 通知类型
        app.config.globalProperties.noticeTypes = {
            1: '通知',
            2: '公告'
        }
        // 通知状态
        app.config.globalProperties.noticeStatus = {
            0: '正常',
            1: '关闭'
        }
        // 项目管理类型
        app.config.globalProperties.projectMangeStatus = {
            0: '在用',
            1: '停用'
        }
        // 项目类型检测类型
        app.config.globalProperties.projectDetectionType = {
            1: '仅物理',
            2: '仅化学',
            3: '自定义'
        }
        // 项目类型展示条件
        app.config.globalProperties.isNot = {
            1: '是',
            0: '否',
        }
        // 合同类别管理状态
        app.config.globalProperties.contractCateStatus = {
            0: {
                txt: '在用',
                color: '#409EFF'
            },
            1: {
                txt: '停用',
                color: '#F56C6C'
            }
        }
        // 法律法规  ====================================================== 
        // 状态
        app.config.globalProperties.lawStatus = {
            1: {
                txt: '现行',
                color: '#67C23A'
            },
            0: {
                txt: '废止',
                color: '#F56C6C'
            },
            2: {
                txt: '发布',
                color: '#409EFF'
            }
        }
        // 法律效力
        app.config.globalProperties.legalEffectOptions = {
            '法律': '法律',
            '行政法规': '行政法规',
            '地方性法规': '地方性法规',
            '规范性文件': '规范性文件',
        }
        // 检测标准法律效力
        app.config.globalProperties.legalEffectLS = {
            '国家标准': '国家标准',
            '行业标准': '行业标准',
            '国际标准': '国际标准',
            '地方标准': '地方标准',
        }
        //检测类别
        app.config.globalProperties.testCates = {
            1: '公共场所',
            2: '公共场所集中空调通风系统',
            3: '人防工程',
            4: '水和废水',
            5: '生活饮用水',
            6: '一次性使用卫生用品',
            7: '消毒效果',
            8: '工作场所空气',
            9: '工作场所物理因素',
            10: '工作场所通风工程',
            11: '工作场所环境卫生条件',
            12: '环境空气和废气',
            13: '土壤',
            14: '固体废物',
            15: '噪声',
            16: '教室环境卫生',
            17: '学校厕所',
            18: '学生宿舍',
            19: '加油站油气回收',
            20: '室内空气',
            21: '固体废物',
            22: '水和废水（包括地下水）',
            23: '水（含大气降水）和废水',
            24: '水和废水（含大气降水）',
            25: '空气和废气',
            26: '土壤和沉积物',
            27: '振动',
            28: '洁净室（区）',
        }
        // 危害物质类型 ()
        app.config.globalProperties.hazardousTypes = {
            1: '毒物(包括co/co2)',
            2: '粉尘',
            3: '噪声',
            4: '高温',
            5: '紫外辐射',
            6: '手传振动',
            7: '工频电场',
            8: '高频电磁场',
            9: '超高频辐射',
            10: '微波辐射',
            11: '激光辐射'
        }
        // 打印标签状态
        app.config.globalProperties.printLabels = {
            0: { txt: '未打印', tag: '' }, 1: { txt: '已打印', tag: 'success' }
        }
        //设备状态
        app.config.globalProperties.equipStatus = {
            all: { 1: '在用', 4: '维修', 6: '报废', 7: '外借', 8: '停用', 10: '库存' },
            checkSerch: { 1: '在用', 4: '维修', 7: '外借', 8: '停用', 10: '库存' },

        }
        //设备检定状态
        app.config.globalProperties.equipVerificationStatus = {
            all: { 0: { txt: '无需检定', class: 'info' }, 1: { txt: '待送检', class: 'warning' }, 2: { txt: '送检中', class: 'success' } },
            checkSerch: { 1: { txt: '待送检', class: 'warning' }, 2: { txt: '送检中', class: 'success' } },

        }
        // 设备借出状态
        app.config.globalProperties.equipStatuslend = {
            0: '待借出', 1: '待归还', 2: '已归还', 3: '撤销'
        }

        //导出文件状态
        app.config.globalProperties.exportStatus = {
            0: { txt: '导出中', tag: 'info' }, 1: { txt: '成功', tag: 'success' }, 2: { txt: '失败', tag: 'danger' },
        }


        // 合同范本状态
        app.config.globalProperties.contractSampleStatus={
            0: { txt: '停用', tag: 'danger' }, 1: { txt: '正常', tag: '' }
        }

        // 条款类型 内容类型
        app.config.globalProperties.contentTypeSelect={
            0: { txt: '仅文本', tag: 'danger' }, 1: { txt: '含字段', tag: '' }
        }
        // 条款类型 状态
        app.config.globalProperties.termStatusSelect={
            0: { txt: '停用', tag: 'danger' }, 1: { txt: '正常', tag: '' },2: { txt: '待开发', tag: 'warning' }
        }


    }
}