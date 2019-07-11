<template>
  <div class="TreeGirdOne">
    <el-table
      :data="myData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template slot-scope="scope">{{ scope.row.cat_deleted | capitalize }}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            title="编辑用户"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            title="删除用户"
            @click="deleteCategory(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editCategoriesForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoriesSubmit('editCategoriesForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCategoriesById, editCategories, deleteCategories } from "@/api";
export default {
  name: "tree-grid-one",
  props: {
    // 数据源
    dataSource: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      editDialogFormVisible: false,
      editForm: {
        cat_name: "",
        id: 0
      },
      // 添加用户的表单验证
      rules: {
        cat_name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  computed: {
    // 获取数据源
    myData() {
      let me = this;
      return me.dataSource;
    }
  },
  filters: {
    capitalize: function(value) {
      return value.toString();
    }
  },
  methods: {
    //显示编辑商品分类对话框
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      getCategoriesById(row.cat_id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.cat_name = res.data.cat_name;
          this.editForm.id = res.data.cat_id;
        }
      });
    },
    //编辑商品分类提交
    editCategoriesSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          //执行编辑用户方法
          editCategories(this.editForm).then(res => {
            window.console.log(res);
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: res.meta.msg
              });
            }
            this.editDialogFormVisible = false;
            this.$emit("editDeleteCate");
          });
        }
      });
    },
    //显示删除对话框
    deleteCategory(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCategories(row.cat_id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: res.meta.msg
              });
              this.$emit("editDeleteCate");
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
</style>