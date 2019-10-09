<template>
  <div class="post-add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" label="1">文章</el-radio>
        <el-radio v-model="form.type" label="2">视频</el-radio>
      </el-form-item>
      <el-form-item label="文章内容" v-if="form.type==1">
        <VueEditor :config="config" ref="vueEditor" />
      </el-form-item>
      <el-form-item label="视频内容" v-if="form.type==2">
        <el-upload
          class="upload-demo"
          drag
          :action="$axios.defaults.baseURL+'/upload'"
          :on-success="handleVideo"
          multiple
          :headers="{ Authorization:token}"
        >
          <video
            class="videos"
            controls="controls"
            autoplay="autoplay"
            :src="form.content"
            v-if="form.content"
          ></video>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将视频拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="栏目">
        <el-checkbox
        v-if="item.id!==999"
          v-model="item.checked"
          :key="index"
          v-for="(item,index) in navCates"
        >{{item.name}}</el-checkbox>
      </el-form-item>
      <el-form-item label="封面上传">
        <el-upload
          :action="$axios.defaults.baseURL+'/upload'"
          :headers="{ Authorization:token}"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleCoverUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handlePostSubmit">立即发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      token: JSON.parse(localStorage.getItem("user") || `{}`).token,
      navCates: [],
      form: {
        title: "",
        content: "",
        categories: [],
        cover: [],
        type: "1"
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: `${this.$axios.defaults.baseURL}/upload`,
          name: "file",
          headers: {
            Authorization: JSON.parse(localStorage.getItem("user") || `{}`)
              .token
          },
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess: (res, insert) => {
            //这里改成this是防止this的指向改变
            insert(this.$axios.defaults.baseURL + res.data.data.url);
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: `${this.$axios.defaults.baseURL}/upload`,
          name: "file",
          headers: {
            Authorization: JSON.parse(localStorage.getItem("user") || `{}`)
              .token
          },
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess: (res, insert) => {
            //这里改成this是防止this的指向改变
            insert(this.$axios.defaults.baseURL + res.data.data.url);
          }
        }
      }
    };
  },
  //页面一加载时获取分类栏目数据
  mounted() {
    this.$axios({
      url: "/category"
    }).then(res => {
      this.navCates = res.data.data.map((v, i) => {
        v.checked = false;
        return v;
      });
    });
  },
  //注册富文本编辑器组件
  components: {
    VueEditor
  },
  methods: {
    //点击上传视频时触发的函数
    handleVideo(res, file, filelist) {
      if (res.data.url.indexOf("http") === -1) {
        this.form.content = this.$axios.defaults.baseURL + res.data.url;
      }
    },
    //移除图片时触发的函数
    handleRemove(file, fileList) {
    this.form.cover=fileList.map((v,i)=>{
      return{id:v.response.data.id};
    }) 
    },
    //实现图片预览触发的函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //封面上传触发的函数
    handleCoverUpload(res, file, fileList) {
   //获取封面id
    this.form.cover=fileList.map((v,i)=>{
      return{id:v.response.data.id};
    }) 
    },
    //发布文章时触发的函数
    handlePostSubmit() {
     //将form中的类型转成数字
      this.form.type=Number(this.form.type);
       //获富文本框中的内容
      if (this.form.type === 1) {        
        this.form.content = this.$refs.vueEditor.editor.root.innerHTML;
      }
      //获取栏目分类id
      let cateArr=[];
     this.navCates.forEach((v,i)=>{
        if(v.checked){
          cateArr.push({id:v.id})
        }
      })
      this.form.categories=cateArr;
      //获取封面id，在上面封面上传成功时获取

      //发起发布文章请求
      this.$axios({
        method:'POST',
        url:'/post',
        data:this.form,
         headers: {
        Authorization: JSON.parse(localStorage.getItem("user") || `{}`).token
      }
      }).then(res=>{
        this.$message.success(res.data.message);
        if(res.data.message==='文章发布成功'){
          this.$router.push('/post-list');
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.post-add {
  margin-top: 20px;
  .el-form {
    width: 50%;
  }
  .videos {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>