<template>
<el-row  class="welcome" type="flex" justify="center" align="middle">
  <div>
      <img :src="user.user.head_img?$axios.defaults.baseURL+user.user.head_img:'/img/pink.4c1174ca.jpg'" alt="">
        <h1>Welcome to back !!!!!</h1>
  </div>
  </el-row>
</template>

<script>
export default {
    data(){
        return{
             user:{ user: {} }
        }
    },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },
}
</script>

<style scoped lang="less">
    .welcome{
        img{
            display: block;
            height:150px;
            width:150px;
            border-radius: 50%;
            margin:100px auto;
        }
        h1{
            text-align:center;
            font-size:80px;
        }
    }
</style>