<template>
  <div>Home组件
    <el-button @click="tuichu" type="primary" plai>退出</el-button>
  </div>
</template>

<script>

export default {
  name: "Home",
  methods: {
    // 退出到登录界面
    tuichu() {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    }
  }


}
</script>

<style scoped>

</style>
