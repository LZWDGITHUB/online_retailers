<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <el-input
          placeholder="请输入内容"
          class="search-input"
          v-model="query"
          @keydown.native.enter="initList"
        >
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button
          type="success"
          plain
          class="search-button"
          @click="addDialogFormVisible = true"
        >添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain></el-button>
          <el-button type="warning" icon="el-icon-check" size="small" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 3, 4, 5]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 新增用户 -->
    <el-dialog title="新增用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, changeUserState, addUser, getUserById, editUser } from "@/api";
export default {
  data() {
    return {
      userList: [],
      query: "",
      total: 0,
      pagenum: 1,
      pagesize: 5,
      addDialogFormVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editDialogFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: 0
      },
      // 添加用户的表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        mobile: [{ required: true, message: "电话不能为空" }]
      }
    }
  },
  created() {
    this.initList()
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.initList()
    },
    //初始化表格数据
    initList() {
      getUserList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    //改变用户状态
    changeUserState(row) {
      changeUserState({ uid: row.id, type: row.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: "success",
            message: "修改用户状态成功"
          })
        } else {
          this.$message({
            type: "error",
            message: res.meta.msg
          })
        }
      })
    },
    //添加用户
    addUserSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          //执行添加用户方法
          addUser(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                type: "success",
                message: "创建用户成功"
              })
            }
            this.addDialogFormVisible = false
            this.initList()
          })
        }
      })
    },
    //显示编辑用户对话框
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      getUserById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
          this.editForm.id = res.data.id
        }
      })
    },
    //编辑用户提交
    editUserSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          //执行编辑用户方法
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "编辑用户成功"
              })
            }
            this.editDialogFormVisible = false;
            this.initList();
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  .el-breadcrumb {
    margin-bottom: 0px;
  }
  .el-tob-bottom {
    margin: 2px 0px;
  }
  .search-input {
    width: 300px;
  }
  .search-button {
    margin: 0px 5px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>