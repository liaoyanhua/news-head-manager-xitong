<template>
  <el-container class="container">
    <el-aside width="200px">
        <el-row class="icons">
                <i class="iconfont iconnew"></i>
        </el-row>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#263445"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>文章管理</span>
          </template>
          <el-menu-item index="1-1">发布文章</el-menu-item>
          <el-menu-item index="1-2">编辑文章</el-menu-item>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header >
          <el-row class="user" type="flex" justify="end" align="middle">
 <img :src="$axios.defaults.baseURL+user.user.head_img" alt="">
         <span>{{user.user.nickname}}</span>
          <span>{{user.user.username}}</span>
          <span>  <el-button type="danger" @click="logOut" round>退出</el-button></span>
          </el-row>
        
      </el-header>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data(){
        return{
            user:{

            }
        }
    },
    mounted(){
        this.user=JSON.parse(localStorage.getItem('user'));
        console.log(this.user);
    },
    methods:{
        logOut(){
            localStorage.removeItem('user');
            this.$router.replace('/login');
        }
    }
};
</script>

<style scoped lang="less">
.container {
  position: absolute;
  top: 0;
  bottom: 0;
}
.el-header,
.el-footer {
  width: 100%;
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
padding-bottom:20px;
.user{
 text-align: right;
  vertical-align: middle;
}
  img{
      height:48px;
      width:48px;
      border-radius: 50%;
      margin-bottom:20px;
  }
  span{
      margin-left:20px;
      &:nth-last-of-type(1){
          padding-bottom:20px;
      }
  }
}

.el-aside {
  background-color: #263445;
  color: #333;
  .el-menu {
    border-right: none;
    background: #263445;
  }
}

.el-main {
  width: 100%;
  background-color: #e9eef3;
  color: #333;
  line-height: 160px;
}

.el-container {
  width: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.icons{
    height:60px;
.iconnew{
    box-sizing: border-box;
    display: block;
    margin:0 auto;
    color:#fff;
    font-size:60px;
    text-align: center;
}
}

</style>