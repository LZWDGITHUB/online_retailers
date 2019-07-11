<template>
  <div class="category">
    <!-- 面包屑 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="javascript:;">商品管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-button type="success" plain class="search-button" @click="addCategory">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表单 -->
    <tree-grid-one :data-source="dataSource" @editDeleteCate="editDeleteCategory"></tree-grid-one>
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
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader v-model="selectedOptions" :options="options" :props="props" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit('addCateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGridOne from "@/components/TreeGrid/TreeGridOne";
import { getCategories, addCategories } from "@/api";
export default {
  data() {
    return {
      addDialogFormVisible: false,
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      dataSource: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      // 添加用户的表单验证
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      selectedOptions: [], //级联选择器选中后的数据
      options: [], //级联选择器的数据源
      //   props设置级联选择器展示的字段&鼠标悬停展开&可单选任意一级
      props: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover",
        checkStrictly: true
      }
    };
  },
  components: {
    TreeGridOne
  },
  created() {
    this.initList();
  },
  methods: {
    //   表单数据
    initList() {
      getCategories({
        type: "3",
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.total = res.data.total;
          this.dataSource = res.data.result;
        }
      });
    },
    // 分页事件
    handleSizeChange(val) {
      this.pagesize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.initList();
    },
    // 获取级联选择器数据
    addCategory() {
      this.addDialogFormVisible = true;
      getCategories({
        type: "2"
      }).then(res => {
        window.console.log(res);
        if (res.meta.status === 200) {
          this.options = res.data;
        }
      });
    },
    //添加商品分类
    addCateSubmit(formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          if (this.selectedOptions.length === 0) {
            this.addForm.cat_pid = 0;
            this.addForm.cat_level = 0;
          } else if (this.selectedOptions.length === 1) {
            this.addForm.cat_pid = this.selectedOptions[
              this.selectedOptions.length - 1
            ];
            this.addForm.cat_level = 1;
          } else if (this.selectedOptions.length === 2) {
            this.addForm.cat_pid = this.selectedOptions[
              this.selectedOptions.length - 1
            ];
            this.addForm.cat_level = 2;
          }
          addCategories(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.addDialogFormVisible = false;
              this.initList();
              this.$message({
                type: "success",
                message: res.meta.msg
              });
            }
          });
        }
      });
    },
    editDeleteCategory() {
      // 编辑和删除完成后执行 刷新表单
      this.initList();
    }
  }
};
</script>
<style lang="scss" scoped>
.category {
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>