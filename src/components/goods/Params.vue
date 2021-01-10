<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert :title="title" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 选择区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateCascaderProps"
            v-model="selectedKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabParamsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addBtnParams"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe="">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addBtnParams"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe="">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeTag(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisiable"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '注意：只允许为第三级分类设置相关参数',
      cateList: [],
      cateCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKeys: [],
      // 被激活的tab页签名称
      activeName: 'many',
      //   动态参数列表
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      addDialogVisiable: false,
      // 添加参数的属性
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      //   inputVisible: false,
      //   标签输入值
      //   inputValue: '',
    }
  },
  created() {
    this.getCateList()
  },
  // 添加计算属性
  computed: {
    // 如果选中三级属性就是false, 如果不是三级属性就是true
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取分类id
    catId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态标题计算属性
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  methods: {
    //   获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$messge.error('获取商品失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleChange() {
      this.getParamsData()
    },
    // tab页签监听的事件
    tabParamsClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数列表的数据
    async getParamsData() {
      //   证明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        // 清空参数列表
        this.manyTableData = []
        this.onlyTableData = []
        return true
      }
      console.log(this.selectedKeys)
      //   根据分类id 和当前面板 获取参数列表
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$messge.error('获取参数列表失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //  为每一行设置文本框
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addBtnParams() {
      this.addDialogVisiable = true
    },
    // 监听会话框的关闭事件
    addDialogClose() {
      console.log(this)
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (validate) => {
        if (validate) {
          const { data: res } = await this.$http.post(
            `categories/${this.catId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          if (res.meta.status !== 201) {
            return this.$messge.error('保存失败')
          }
          this.$message.success('保存成功')
          this.addDialogVisiable = false
          this.getParamsData()
        }
      })
    },
    // 监听编辑的对话框事件
    showEditDialog() {},
    // 点击按钮显示文本输入框
    showInput(item) {
      item.inputVisible = true
      //  让文本框自动获得焦点
      //    $nextTick 方法的作用,在页面元素重新渲染之后才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点 或按下了enter键都会触发该事件
    handleInputConfirm(item) {
      if (item.inputValue.trim().length === 0) {
        item.inputVisible = false
        item.inputValue = ''
        return
      }
      //   如果没有return， 则表明输入的有东西，需要做后续处理
      item.attr_vals.push(item.inputValue)
      item.inputValue = ''
      item.inputVisible = false
      this.saveAttrValues(item)
    },
    // 处理 保存attr_vuls
    async saveAttrValues(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('保存参数失败')
      }
      this.$message.success('保存参数成功')
    },
    // 删除标签事件
    closeTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrValues(row)
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  display: inline-block;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
