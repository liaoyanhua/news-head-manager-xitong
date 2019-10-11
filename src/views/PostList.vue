<template>
  <div class="post-list">
    <el-form :inline="true" :model="keyword" class="demo-form-inline search">
      <el-form-item label="关键词">
        <el-input v-model="keyword" @input="handleSearch" placeholder="搜索关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" width="60%">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章标题" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>文章标题: {{ scope.row.title }}</p>
            <p>文章状态: {{ scope.row.open===1?'打开':'关闭' }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="文章状态" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.open===1?'打开':'关闭'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="新闻类型" width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.type===1?'文章':'视频'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <img
              class="avatar"
              :src="scope.row.user.head_img?$axios.defaults.baseURL+scope.row.user.head_img:'@/assets/img/pink.jpg'"
              alt
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.user.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="帐号" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.user.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.user.gender===1?'男':'女'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            :type="scope.row.open===1?'danger':'success'"
            @click="handleDelete(scope.$index, scope.row)"
          >{{scope.row.open===1?'关闭':'打开'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin:20px auto;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "", //定义搜索关键字
      totalPage: 0,
      pageIndex: 1,
      pageSize: 5,
      tableData: [
        {
          user: {}
        }
      ]
    };
  },
  mounted() {
    // this.handleSizeChange(val);
    if (!this.keyword) {
      this.getlist();
      this.$axios({
        url: `/post?pageIndex=1&pageSize=9999999`
      }).then(res => {
        this.totalPage = res.data.data.length;
      });
    } else {
      this.getSearchList();
      this.$axios({
        url: `/post_search?keyword=${this.keyword}&pageIndex=${this.pageIndex}&pageSize=99999999`
      }).then(res => {
        this.totalPage = res.data.data.length;
      });
    }
  },
  methods: {
    //获取数据列表
    getlist() {
      this.$axios({
        url: `/post?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      }).then(res => {
        const { data } = res.data;
        this.tableData = data;
      });
    },
    getSearchList() {
      this.$axios({
        url: `/post_search?keyword=${this.keyword}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      }).then(res => {
        const { data } = res.data;
        this.tableData = data;
      });
    },
    //点编辑按钮时触发
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push(`/post-edit/${row.id}`);
    },
    //点关闭按钮时触发
    handleDelete(index, row) {
      let id = row.id;
      let open = !row.open;
      this.$axios({
        url: `/post_update/${id}`,
        method: "POST",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user") || `{}`).token
        },
        data: { open: Number(open) }
      }).then(res => {
        console.log(res);
        this.$message.success(res.data.message);
        this.getlist();
      });
    },
    //选择每页多少条时触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      if (!this.keyword) {
        this.getlist();
      } else {
        this.getSearchList();
      }
    },
    //选择当前多少页时触发
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageIndex = val;
      if (!this.keyword) {
        this.getlist();
      } else {
        this.getSearchList();
      }
    },
    //搜索文章
    onSubmit() {
      console.log(this.keyword);
      this.getSearchList();
      this.$axios({
        url: `/post_search?keyword=${this.keyword}&pageIndex=${this.pageIndex}&pageSize=99999999`
      }).then(res => {
        this.totalPage = res.data.data.length;
      });
    },
    //失去焦点时触发
    handleSearch() {
      this.getSearchList();
      this.$axios({
        url: `/post_search?keyword=${this.keyword}&pageIndex=${this.pageIndex}&pageSize=99999999`
      }).then(res => {
        this.totalPage = res.data.data.length;
      });
    }
  }
};
</script>

<style scoped lang="less">
.post-list {
  margin-top: -25px;
}
.avatar {
  display: block;
  width: 50%;
  border-radius: 50%;
}
.search {
  float: right;
}
</style>