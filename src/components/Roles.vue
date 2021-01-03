<template>
  <div>
    <!-- 角色列表面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- j角色列表区域 -->
      <el-table :data="roleList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" width="50">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5" class="vcenter">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 和三级权限 -->
              <el-col :span="19">
                <!-- 通过 嵌套 for 循环 渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限标签 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="roleName" label="角色名称">
        </el-table-column>
        <el-table-column property="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column property="name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRightDialogVisible"
      width="50%"
      @close="rightDialogClose"
    >
      <el-tree
        :data="rightTreeDate"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="defKeys"
        :default-checked-keys="defKeys"
        ref="rightTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      showSetRightDialogVisible: false,
      rightTreeDate: [],
      // 树形控件绑定对象
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      //   默认选中节点的默认值
      defKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹出框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除用户权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除!')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      //   删除之后防止展开列关闭 直接把返回的数据进行渲染复制，不需要再请求 getRoleList
      role.children = res.data
    },
    // 分配角色对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //   获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightTreeDate = res.data
      //   获取三级权限id
      this.getLeafsKeys(role, this.defKeys)
      this.showSetRightDialogVisible = true
    },
    //   通过递归的形式，设置权限默认角色下所有的三级权限id， 并保存到defKeys 数组中
    getLeafsKeys(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach((item) => {
        this.getLeafsKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    rightDialogClose() {
      this.defKeys = []
    },
    // 点击位角色添加权限
    async addRights() {
      const checkedKeys = this.$refs.rightTreeRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.rightTreeRef.getHalfCheckedKeys()
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('保存权限失败')
      }
      this.$message.success('保存权限成功')
      this.getRoleList()
      this.showSetRightDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
