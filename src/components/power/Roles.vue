<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" style="float: left">添加角色
          </el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table
          :data="rolesList"
          style="width: 100%"
          border>
        <!--展开列-->
        <el-table-column type="expand" list.Expanded=true>
          <template slot-scope="scope">
            <el-row :class="['vcenter','bgbottom',i1===0?'bgtop':'']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRightById(scope.row,item1.id)">{{
                    item1.authName
                  }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row :class="['vcenter',i2===0?'':'bgtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <!--<pre>{{item2.authName}}</pre>-->
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children"
                            :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->

        <el-table-column
            type="index"
        >
        </el-table-column>
        <el-table-column
            label="角色名称"
            prop="roleName">
        </el-table-column>
        <el-table-column
            label="角色描述"
            prop="roleDesc">
        </el-table-column>
        <el-table-column
            label="操作"
            width="300px"
        >
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="small "
                       @click="showEditDialog()">编辑
            </el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="small " @click="removeUserById(scope.row.id)"
            >删除
            </el-button>

            <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--展示分配权限对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
    >
      <!--树型控件-->
      <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          :default-checked-keys="defKeys"
          default-expand-all
          :props="treeProps"
          ref="treeRef">
      </el-tree>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {

  name: "Roles",
  data() {
    return {
      // 所有角色列表
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性 绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点ID值的数组
      defKeys: [],
      // 当前即将分配角色权限的id
      roldId: ''
    }
  },
  created() {
    // 角色列表数据
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const {data: res} = await axios.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        // 获取到的权限数据保存到 data中
        this.rolesList = res.data
        this.$message.success('获取角色列表成功')
      }

    },
    // 根据ID删除对应的tag
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        const {data: res} = await axios.delete(`roles/${role.id}/rights/${rightId}`)
        console.log(role.id, rightId)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        } else {
          // 防止页面刷新
          role.children = res.data
          console.log(rightId)
        }

      }

    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roldId = role.id

      // 获取所有权限的数据列表
      const {data: res} = await axios.get('rights/tree')
      // console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      } else {
        this.rightsList = res.data
        this.defKeys = res.data
      }
      // 递归获取三级节点的Id
      // console.log(role)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有的三级权限的id，并保存在defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      console.log(node.children)
      // node.children.forEach(item => this.getLeafKeys(item, arr))
      // console.log(node.children.forEach(item=>this.getLeafKeys(item,arr)))

    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const {data: res} = await axios.post(`roles/${this.roldId}/rights`, {rids: idStr})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.setRightDialogVisible = false

    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bgtop {
  border-top: 1px solid #eee;

}

.bgbottom {
  border-bottom: 1px solid #eee;

}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
