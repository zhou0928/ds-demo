<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域-->
      <div class="logo-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登陆区域-->
      <el-form label-width="0px" class="form1" :model="loginForm"
               :rules="rules"
               ref="loginFormRef"
      >
        <!--  用户名-->
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名"
                    prefix-icon="el-icon-user"
                    v-model="loginForm.username"
          >

          </el-input>
        </el-form-item>
        <!--  密码-->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码"
                    prefix-icon="el-icon-unlock"
                    v-model="loginForm.password"
                    type="password"
                    show-password>

          </el-input>
        </el-form-item>
        <!--  按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Login",

  data() {
    return {
      // 登录表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      rules: {
        // 验证用户名是否合法
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
      }

    }
  },
  methods: {
    // 登录表单验证
    submitForm(forName) {
      // console.log(this)
      this.$refs[forName].validate(valid => {
        if (!valid) return;
        // const {data: res} = await this.$http.post("login", this.loginForm)
        // if (res.meta.status !== 200) {
        //   return this.$message.error('登陆失败')
        // }
        // this.$message.success('登陆成功')

        // 先配置axios
        /* axios({
           method: 'post',
           url: 'login',
           data: this.loginForm
         })*/

        // 直接执行post请求
        axios.post('login', this.loginForm)
            // console.log(this)
            .then(response => {
              if (response.data.meta.status !== 200) {
                return this.$message.error('登陆失败');
              }
              this.$message.success('登录成功')
              // console.log(response)
              // 1.将登陆成功之后的token，保存在客户端的sessionStorage中
              //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
              //  1.2 token只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
              window.sessionStorage.setItem('token', response.data.data.token)
              // 2.通过编程式导航跳转到后台主页，路由地址是 /home
              this.$router.push('/home')

            })


      })
    },
    // 重置登录表单
    resetForm(forName) {
      console.log(this)
      this.$refs[forName].resetFields();
    }
  }

}

</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);


}

.logo-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.logo-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.form1 {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

}

.btns {
  display: flex;
  justify-content: center;
}
</style>
