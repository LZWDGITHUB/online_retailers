<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="javascript:;">权限管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 添加角色按钮 -->
    <el-button plain class="el-tob-bottom">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id">
            <el-col :span="3">
              <el-tag
                closable
                @close="deleteRight(scope.row, firstChildren.id)"
              >{{firstChildren.authName}}</el-tag>
              <i class="el-icon-arrow-right" v-if="firstChildren.children.length !== 0"></i>
            </el-col>
            <el-col :span="21">
              <el-row v-for="secondChildren in firstChildren.children" :key="secondChildren.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(scope.row, secondChildren.id)"
                  >{{secondChildren.authName}}</el-tag>
                  <i class="el-icon-arrow-right" v-if="secondChildren.children.length !== 0"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="thirdChildren in secondChildren.children"
                    :key="thirdChildren.id"
                    @close="deleteRight(scope.row, thirdChildren.id)"
                  >{{secondChildren.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
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
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            @click="showDeleteDialog(scope.row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-check"
            size="small"
            plain
            @click="showGrantDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRoleList, deleteRoleRight } from "@/api";
export default {
  data() {
    return {
      roleList: []
    };
  },
  created() {
    getRoleList().then(res => {
      if (res.meta.status === 200) {
        this.roleList = res.data;
      }
    });
  },
  methods: {
    deleteRight(row, rightId) {
      deleteRoleRight({ roleId: row.id, rightId: rightId }).then(res => {
        if (res.meta.status === 200) {
            row.children = res.data
        } else {
          this.$message({
            type: "error",
            message: res.meta.msg
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.roles {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
