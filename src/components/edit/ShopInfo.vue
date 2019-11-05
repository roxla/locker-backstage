<template>
  <div>
    <el-header style="height: 42px;" class="header" v-show="edit">
      <el-row>
        <el-col :span="2">
          <img src="../../../static/img/back.png" class="img" alt="img" @click="go('/shopmain/user')">
        </el-col>
        <el-col :span="20">编辑店铺简介</el-col>
        <el-col :span="2">
          <img src="../../../static/img/home.png" class="img" alt="img" @click="go('/shopmain/shopindex')">
        </el-col>
      </el-row>
    </el-header>
    <el-main style="height: calc(100vh - 78px); padding: 0px;" v-show="edit">
      <el-card class="box-card">
        <div v-html="article.content" ref="intro" class="info ql-editor" style="padding: 0px;"></div>
      </el-card>
    </el-main>
    <el-main style="padding: 0px; height: calc(100vh - 36px);" v-show="!edit">
      <quill-edit
        v-model="article.content"
        :oHtml="article.content"
        @input="UpContent"
        style="margin-top: 28px;"/>
    </el-main>
    <el-footer style="height: 30px; padding: 0px;">
      <el-button style="width: 100%; padding: 7px 0px;" v-show="edit" type="primary" @click="startEdit">编辑信息</el-button>
      <el-button style="width: 100%; padding: 7px 0px; margin: 0px;" v-show="!edit" type="success" @click="overEdit">完成编辑</el-button>
    </el-footer>
  </div>
</template>

<script>
import * as axios from "@/assets/axiosServer.js";
import quillEdit from "./Edit.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  data() {
    return {
      article: {
        content: ''
      },
      edit:true
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.article.content = this.$route.query.introduction;
      },
      immediate: true
    }
  },
  components: {
    quillEdit,
  },
  created(){
    this.out();
  },
  methods: {
    out(){
      let port = 'merchant/merchantData'
      let obj = {
        opid:sessionStorage.getItem("ShopId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          console.log('ok');
        }else if(res.data.status == 911){

        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    go(url){
      this.$router.push({path: url});
    },
    // 开始编辑
    startEdit(){
      this.edit = false;
      this.article.content = this.$refs.intro.innerHTML;
    },
    // 结束编辑
    overEdit(){
      let port = 'merchant/changeMerchant'
      let obj = {
        opid:sessionStorage.getItem("ShopId"),
        merchantIntroduce:this.article.content
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.$message.success('编辑成功');
          this.edit = true;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    // 同步输入
    UpContent(ev) {
      this.article.content = ev;
    },
  }
}
</script>

<style scoped>
.header {
  padding: 10px 15px;
  background-color: #393D49;
  color: white;
}
.img{
  width: 22px;
  height: 22px;
}
.box-card{
  width: 96%;
  margin: 5px auto;
}
</style>
