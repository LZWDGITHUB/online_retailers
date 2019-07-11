<template>
  <div class="toadd">
    <!-- 面包屑 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="javascript:;">商品管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps
      :active="active"
      process-status="finish"
      finish-status="success"
      class="el-steps-active"
    >
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- tabs -->
    <el-tabs tab-position="left" @tab-click="handleClick" class="el-tabs">
      <el-tab-pane label="基本信息">
        <el-form ref="addOneForm" :model="oneForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="oneForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="oneForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="oneForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="oneForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="oneForm.goods_cat" placeholder="请选择分类">
              <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="oneForm.is_promote">
              <el-radio label="是" border></el-radio>
              <el-radio label="否" border></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="setHeader()"
          :on-success="handleSuccess"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="1"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script >
// import Vue from 'vue'
export default {
  data() {
    return {
      active: 0,
      oneForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        is_promote: ""
      }
    };
  },
  methods: {
    handleClick(tab) {
      this.active = parseInt(tab.index);
    },
    //点击删除图片触发
    handleRemove(file, fileList) {
      window.console.log(file, fileList);
    },
    //点击图片触发
    handlePreview(file) {
      window.console.log(file);
    },
    //图片上传请求头
    setHeader() {
      let token = localStorage.getItem("mytoken");
      return { Authorization: token };
    },
    //图片上传成功执行
    handleSuccess(response) {
        if(response.meta.status === 200) {
            this.$message({
                type: 'success',
                message: response.meta.msg
            })
        }
    }
  }
};
</script>
<style lang="scss" scoped>
.toadd {
  .el-steps-active {
    margin: 15px;
  }
  .el-tabs {
    margin-right: 20px;
  }
}
</style>
