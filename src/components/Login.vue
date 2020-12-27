<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录区域 -->
      <!-- 通过ref声明表单的引用，通过引用获取表单对象 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="from_box"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名的合法性
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码的输入合法性
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm () {
      console.log(this)
      console.log(this.$refs.loginFormRef)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 返回的是一个Promise对象 需要通过await关键字，最近的函数添加async 来获取数据
        // const result = await this.$http.post('login', this.loginForm)
        // 通过这种方式，直接获取返回结果有用的数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1、 将登录成功之后token,保存到客户端的 sessionStorage中
        //  1.1 项目中除了登录知道的其他api接口，必须在登录之后才能访问
        // 1.2 token只应在当前网站打开期间有效，所以将token保存在sessionStrage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2、 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  // 通过绝对定位，实现垂直居中
  position: absolute;
  top: 50%;
  left: 50%;
  // translate 实现元素的位移
  transform: translate(-50%, -50%);

  .avater_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    // 设置阴影  水平阴影设置 垂直阴影位置  设置模糊距离(越大越远 越模糊) 阴影颜色
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.from_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 设置盒子模型为border-box   padding 不会撑大盒子
  box-sizing: border-box;
}
.btns {
  // flex弹性布局
  display: flex;
  //  justify-content属性规定了主轴上的对齐方式;
  justify-content: flex-end;
}
</style>
