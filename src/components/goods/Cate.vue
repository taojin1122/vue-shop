<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域  安装树形table组件 npm install vue-table-with-tree-grid -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="caozuo">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="catDialogVisible"
      width="50%"
      @close="cateDialogClose"
    >
      <el-form
        :model="cateForm"
        :rules="cateFormRules"
        ref="cateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            @change="handleChange"
            :props="cateCascaderProps"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      // 商品分类列表
      cateList: [],
      //   总数据条数
      total: 0,
      // 树型table列表属性定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表示当前列的模板名称
          template: 'isOk',
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          prop: '',
          type: 'template',
          template: 'caozuo',
        },
      ],
      catDialogVisible: false,
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        // 分类等级，默认添加一级分类
        cat_level: 0,
      },
      cateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器 属性值定义
      cateCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的值
      selectedKeys: [],
    }
  },
  beforeCreate() {
    console.log('beforeCreate 函数')
  },
  created() {
    console.log('created 函数')
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听每页条数的变化
    handleSizeChange(pagesize) {
      console.log(pagesize)
      this.queryInfo.pagesize = pagesize
      this.getCateList()
    },
    // 监听页码的变化
    handleCurrentChange(page) {
      console.log(page)
      this.queryInfo.pagenum = page
      this.getCateList()
    },
    // 添加分类事件
    addCate() {
      this.getParentCateList()
      this.catDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
    },
    // 监听级联选择器发生变化的事件
    handleChange() {
      console.log(this.selectedKeys)
      // 如果 selectedkeys的长度大于0 则表示有父类
      // 反之，没有父类
      if (this.selectedKeys.length > 0) {
        this.cateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.cateForm.cat_level = this.selectedKeys.length
      } else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      }
    },
    // 保存分类
    saveCate() {
      this.$refs.cateFormRef.validate(async (validate) => {
        console.log(validate)
        if (validate) {
          const { data: res } = await this.$http.post(
            'categories',
            this.cateForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error('保存分类失败')
          }
          this.$message.success('保存分类成功')
          this.getCateList()
          this.catDialogVisible = false
        }
      })
    },
    // 监听对话框的关闭事件
    cateDialogClose() {
      console.log(this)
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = []
      this.cateForm.cat_level = 0
      this.cateForm.cat_pid = 0
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
