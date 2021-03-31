<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header style="height: 100px">
      <div>
        <img src="../assets/logo1.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="tuichu" type="primary">退出</el-button>
    </el-header>
    <el-container style="border: 1px solid #eee">
      <!-- 侧边栏区域-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="togoleCollapse" mode="vertical">{{ togoleContent }}</div>
        <!-- 侧边栏菜单-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
        >
          <!-- 一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id"
                      style="padding-left: 0">
            <!-- 一级菜单模板区域-->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)"
            >
              <!-- 二级菜单模板区域-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>

import axios from "axios";

export default {
  name: "Home",
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-upload',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-claim',
        '145': 'el-icon-s-platform',
      },
      // 是否折叠
      isCollapse: false,
      togoleContent: '|||',
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 退出到登录界面
    tuichu() {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    async getMenuList() {
      let {data: res} = await axios.get('/menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(this.menulist)
      // .then(response => {
      //   // console.log(response)
      //   if (response.data.meta.status !== 200) return this.$message.error(response.data.meta.msg)
      //   this.menulist = response.data.data
      //   console.log(this.menulist)
      // })
    },
    // 是否折叠
    togoleCollapse() {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse) {
        this.togoleContent = '|||'
        return
      }
      this.togoleContent = '≡'

    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }


  }


}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #393532;
  color: #fff;
  text-align: center;
  line-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  padding-left: 0;

}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.el-header img {
  height: 200px;

}

.el-aside {
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #EAEDF1;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;

}

h1 {
  width: 200px;
  display: inline-block;
}

el-button {
  width: 200px;
}

.el-submenu .el-menu-item {
  padding: 0 10px;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4A5064;
  color: #fff;
  text-align: center;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
