<template>
  <el-row type="flex" justify="center" align="middle" class="login-container">
  
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
       <el-row class="title">
      <h2>系统登录</h2>
      <img src="@/assets/img/pink.jpg" alt="">
    </el-row>
      <el-form-item label="帐户" prop="username">
        <el-input v-model="form.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
        <el-form-item>
    <el-button type="primary" @click="submitForm('form')">登录</el-button>
    <el-button @click="resetForm('form')">重置</el-button>
  </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
   methods: {
      submitForm(formName) {
        this.$refs.form.validate((valid) => {
          if (valid) {
           this.$axios({
             url:'/login',
             method:'POST',
             data:this.form
           }).then(res=>{
             console.log(res);
             let {data,message}=res.data;
             if(res.data.statusCode===401){
               this.$message.error(message);
               return;
             }else{
               this.$message.success(message);
               localStorage.setItem('user',JSON.stringify(data));
               setTimeout(()=>{
                 this.$router.push('/');
               },2000)
             }
           })
          } else {
            this.$message.error('请输入正确的用户名和密码')
            return;
          }
        });
      },
      resetForm(formName) {
        this.$refs.form.resetFields();
      }
    }
};
</script>

<style scoped lang="less">
.login-container {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #2d3a4b;
  .title{
    margin-left:21%;
    h2{
      color:#fff;
      margin:20px auto;
      text-align: center;
    }
    img{
      display: block;
      width:48px;
      height:48px;
      border-radius: 50%;
      margin:10px auto;
    }
  }
  .demo-ruleForm {
    width: 32%;
  }
}
</style>