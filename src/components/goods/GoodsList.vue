<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="2">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
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

    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="addGoodsVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodList: [],
      addGoodsVisible: false,
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodList = res.data.goods
      this.total = res.data.total
      console.log(this.goodList)
    },
    // 跳转添加商品列表页面
    goAddPage() {
      //   this.addGoodsVisible = true
      this.$router.push('/goods/add')
    },
    handleSizeChange(pagesize) {
      console.log(pagesize)
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
    },
    handleCurrentChange(pagenum) {
      console.log(pagenum)
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    queryGoodsList() {
      this.getGoodsList()
    },
    clearInput() {
      this.queryInfo.query = ''
      this.queryInfo.pagesize = 1
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    async deleteGood(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除操作')
      }
      // 数据库删除操作
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 350px;
}
</style>
