<template>
  <div>
    <!--导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-table
          style="width: 100%"
          border
          stripe
          :data="rightsList">
        <el-table-column
            type="index"
            label="#"
        >
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
        >
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
        >
        </el-table-column>
        <el-table-column
            prop="level"
            label="权限等级"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,2,5,10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Rights",
  data() {
    return {
      // 权限列表
      rightsList: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10

      },
      total: 0
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      let {data: res} = await axios.get('rights/list', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      } else {
        this.rightsList = res.data.id
        console.log(res.data)
        this.$message.success('获取权限列表成功')
        this.rightsList = res.data
        console.log(this.rightsList)
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newValue) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = newValue
      this.getRightsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newValue) {
      console.log(`当前页: ${newValue}`);
      this.queryInfo.pagenum = newValue
      this.getRightsList()

    },
  }
}


</script>

<style scoped>

</style>
