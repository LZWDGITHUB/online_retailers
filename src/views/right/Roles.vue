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
    <el-button plain class="el-tob-bottom" @click="addDialogFormVisible = true">添加角色</el-button>
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
                  >{{thirdChildren.authName}}</el-tag>
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
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            title="编辑角色"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            title="删除角色"
            @click="showDeleteDialog(scope.row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-check"
            size="small"
            plain
            title="角色授权"
            @click="showDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权窗口 -->
    <el-dialog title="角色授权" :visible.sync="dialogTreeVisible">
      <div class="tree-container">
        <el-tree
          :data="rightList"
          show-checkbox
          ref="tree"
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedRights"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGrant">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色添加窗口 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="120px" :rules="rules" ref="addRolesForm">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesSubmit('addRolesForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色窗口 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="120px" :rules="rules" ref="editRolesForm">
        <el-form-item label="角色名称：" prop="roleName">
          <el-tag type="info">{{editForm.roleName}}</el-tag>
        </el-form-item>
        <el-form-item label="描述：" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSubmit('editRolesForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList,
  deleteRoleRight,
  getRightList,
  grantRoleRight,
  addRoles,
  getRolesById,
  editRoles,
  deleteRoles
} from "@/api";
export default {
  data() {
    return {
      roleList: [],
      dialogTreeVisible: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      selectedRights: [], //保存默认选中的权限id
      currentRole: {}, //保存点击的角色
      addDialogFormVisible: false, //添加角色窗口
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      editDialogFormVisible: false, //编辑角色窗口
      editForm: {
        roleName: "",
        roleDesc: "",
        id: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      getRoleList().then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data;
        }
      });
    },
    deleteRight(row, rightId) {
      deleteRoleRight({ roleId: row.id, rightId: rightId }).then(res => {
        if (res.meta.status === 200) {
          row.children = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.meta.msg
          });
        }
      });
    },
    showDialog(row) {
      this.dialogTreeVisible = true;
      this.currentRole = row;
      getRightList({ type: "tree" }).then(res => {
        if (res.meta.status === 200) {
          this.rightList = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.meta.msg
          });
        }
      });
      //遍历之前先让数组清空
      this.selectedRights.length = 0;
      //取出当前点击的角色的所有权限
      this.currentRole.children.forEach(first => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length !== 0) {
              second.children.forEach(third => {
                this.selectedRights.push(third.id);
              });
            }
          });
        }
      });
    },
    //提交授权
    submitGrant() {
      let rids = this.$refs.tree.getCheckedKeys().join(",");
      grantRoleRight(this.currentRole.id, { rids: rids }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.meta.msg
          });
          this.dialogTreeVisible = false;
          this.initList();
        }
      });
    },
    //添加角色
    addRolesSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          //执行添加角色方法
          addRoles(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                type: "success",
                message: res.meta.msg
              });
            } else {
              this.$message({
                type: "error",
                message: res.meta.msg
              });
            }
            this.addDialogFormVisible = false;
            this.initList();
          });
        }
      });
    },
    //显示编辑用户对话框
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      getRolesById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.roleName = res.data.roleName;
          this.editForm.roleDesc = res.data.roleDesc;
          this.editForm.id = res.data.roleId;
        }
      });
    },
    //编辑角色提交
    editRolesSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          //执行编辑角色方法
          editRoles(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "编辑角色成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.meta.msg
              });
            }
            this.editDialogFormVisible = false;
            this.initList();
          });
        }
      });
    },
    //显示删除对话框
    showDeleteDialog(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRoles(row.id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.initList();
            } else {
              this.$message({
                type: "error",
                message: res.meta.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
  .tree-container {
    height: 300px;
    overflow: auto;
  }
}
</style>
