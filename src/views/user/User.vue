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
        <el-button type="success" plain class="search-button">添加用户</el-button>
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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <!-- slot-scope="scope" -->
        <template>
          <el-button type="primary" icon="el-icon-edit" size="small" plain></el-button>
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
        :page-sizes="[1, 2, 3, 4]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/api";
export default {
  data() {
    return {
      userList: [],
      query: '',
      total: 0,
      pagesize: 1,
      pagenum: 1
    };
  },
  created() {
    this.initList();
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
        params: { query: this.query, pagenum: this.pagenum, pagesize: this.pagesize }
      }).then(res => {
        this.userList = res.data.users;
        this.total = res.data.total
      });
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