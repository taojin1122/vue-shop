<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        style="width: 100%"
        :data="userList"
        :border="true"
        :stripe="true"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserInfo(scope.row.id)"
            ></el-button>
            <!-- 配置按钮 -->
            <el-tooltip
              effect="dark"
              content="配置角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
                @click="setRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="pagesizeList"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeUserDialog"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="editFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 配置角色对话框 -->
    <el-dialog
      title="配置角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
    >
      <div class="role">
        <p><span>当前用户：</span>{{ userInfo.username }}</p>
        <p><span>当前角色：</span>{{ userInfo.role_name }}</p>
        <p>
          <span>分配新角色：</span>
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      return callback(new Error('请输入合法邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页条数
        pagesize: 5,
      },
      value: '',
      pagesizeList: [5, 10, 15, 20],
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      userInfo: '',
      roleList: [],
      // 选中角色的id
      selectRoleId: '',
      // 添加用户的表单名称
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用于名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3到10个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在6到15个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    delete() {},
    // 添加用户函数
    addUser() {
      console.log(this)
      this.$refs.addUserFormRef.validate(async (validate) => {
        console.log(validate)
        if (validate) {
          // 发起添加用户请求
          const { data: res } = await this.$http.post('users', this.addUserForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        }
      })
    },
    // 修改用户数据
    editUser() {},
    // 监听修改用户的对话框
    async showEditDialog(id) {
      // 查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.addUserForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户提交事件
    editUserInfo() {
      this.$refs.editFormRef.validate(async (validate) => {
        console.log(validate)
        if (validate) {
          const { data: res } = await this.$http.put(
            'users/' + this.addUserForm.id,
            this.addUserForm
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('更新失败')
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新成功')
        }
      })
    },
    // 监听删除用户信息
    async deleteUserInfo(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      // 根据弹出框的结果进行请求操作
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除操作')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 弹出设置用户角色对话框
    async setRoleDialog(userInfo) {
      this.userInfo = userInfo
      // 弹出对话框之前，获取角色列表
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 保存用户的角色信息
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择角色信息')
      }
      const {
        data: res,
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('保存用户角色失败')
      }
      this.$message.success('保存用户角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听配置角色关闭对话框
    setRoleDialogClose() {
      this.userInfo = ''
      this.selectRoleId = ''
    },
    // 监听关闭修改用户信息对话框
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 关闭用户对话框
    closeUserDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 监听每页条数的变化
    handleSizeChange(newPageSize) {
      console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    //  监听 页码的变化
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
  },
}
</script>

<style lang="less" scoped>
.role span {
  display: inline-block;
  width: 100px;
  // margin-right: 15px;
  // margin-left: 10px;
}
</style>
