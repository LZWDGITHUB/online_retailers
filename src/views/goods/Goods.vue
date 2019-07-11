<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="javascript:;">商品管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="el-tob-bottom">
      <el-col :span="24">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <el-input
          placeholder="请输入搜索内容"
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

          @click="addGoods"
        >添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="goodsList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态" width="100">
        <template slot-scope="scope">{{ scope.row.goods_state | capitalize }}</template>
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="120">
        <template slot-scope="scope">{{ scope.row.add_time | fmtTime('/') }}</template>
      </el-table-column>
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
            @click="showDeleteDialog(scope.row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-check"
            size="small"
            plain
            title="分配角色"
            @click="showGrantDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getGoodsList } from "@/api";
export default {
  data() {
    return {
      addDialogFormVisible: false,
      loading: false,
      goodsList: [],
      query: "",
      total: 0,
      pagenum: 1,
      pagesize: 5
    };
  },
  created() {
    this.initList();
  },
  methods: {
    //初始化表格数据
    initList() {
      this.loading = true;
      getGoodsList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.goodsList = res.data.goods;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.initList();
    },
    //跳转到新增商品页
    addGoods() {
      this.$router.push({name: 'Toadd'})
    }
  },
  filters: {
    capitalize: function(value) {
      if (value === 0) {
        let data = `未通过(${value})`;
        return data;
      } else if (value === 1) {
        let data = `审核中(${value})`;
        return data;
      } else {
        let data = `已审核(${value})`;
        return data;
      }
    },
    fmtTime: function(value, separator) {
      let time = new Date(value * 1000);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + separator + m + separator + d;
    }
  }
};
</script>
<style lang="scss" scoped>
.goods {
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

