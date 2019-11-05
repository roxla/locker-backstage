<template>
  <div id="Main">
    <el-container>
      <el-header style="height: 42px;" class="header">
        <el-row>
          <el-col :span="12" style="overflow: hidden;">
            <div class="border-left">
              <img class="img" src="../../static/img/menu.png" alt="img" @click="go('/menu')">
              <p class="text-left">{{title}}</p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="border-right">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <img class="img" src="../../static/img/login.png" alt="img">
                  <p class="text-right">{{user}}</p>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item class="drop" style="border-bottom: 1px solid #888; padding-bottom: 5px;">
                    <div @click="go('/main/user')" style="overflow: hidden;">
                      <img src="../../static/img/zhanwei.jpg" alt="img" class="ico">
                      <p class="ico-text">信息设置</p>
                    </div>
                  </el-dropdown-item> -->
                  <el-dropdown-item class="drop">
                    <div @click="dialogVisible = true" style="overflow: hidden;">
                      <img src="../../static/img/exit.png" alt="img" class="ico">
                      <p class="ico-text">退出登录</p>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="height: calc(100vh - 42px); padding: 0px; padding-top: 0px;">
        <router-view/>
      </el-main>
    </el-container>
    <!-- 退出弹窗 -->
    <el-dialog
      title="确认退出？"
      :visible.sync="dialogVisible"
      width="80%"
      top="30vh">
      <div style="padding: 5px 0px;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      visible: false,
      title:"",
      user:"管理员",
      dialogVisible: false,
    }
  },
  watch:{
    $route: {
      handler: function(val, oldVal){
        this.title = this.$route.meta.title;
      },
      immediate: true
    }
  },
  methods:{
    go(url){
      this.$router.push({path: url});
    },
    exit(){
      sessionStorage.removeItem("OpenId");
      this.dialogVisible = false;
      this.$router.push({ path: "/" });
    }
  }
}
</script>

<style scoped>
#Main{

}
.header {
  padding: 10px 15px;
  background-color: #393D49;
  color: white;
}
.border-left{
  float: left;
  height: 22px;
  overflow: hidden;
}
.text-left{
  margin: 0px;
  line-height: 23px;
  float: right;
  margin-left: 10px;
  font-size: 15px;
}
.border-right{
  float: right;
  height: 22px;
  overflow: hidden;
}
.text-right{
  margin: 0px;
  line-height: 23px;
  float: right;
  font-size: 15px;
  margin-left: 5px;
  color: white;
}
.img{
  width: 22px;
  height: 22px;
}
.drop{
  height: 24px;
  padding-left: 10px;
  padding-right: 10px;
}
.ico{
  width: 20px;
  height: 20px;
}
.ico-text{
  margin: 0px;
  float: right;
  line-height: 25px;
  margin-left: 10px;
}
</style>