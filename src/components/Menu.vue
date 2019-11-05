<template>
  <div id="Menu">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#393D49"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          style="height: 100vh;">
          <el-menu-item index="1" @click="go('/main/index')">
            <i class="el-icon-info"></i>
            <span slot="title">存柜信息</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单信息</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="go('/main/order')">
                <i class="el-icon-s-order"></i>
                <span slot="title">订单记录</span>
              </el-menu-item>
              <el-menu-item index="2-2" @click="go('/main/open')">
                <i class="el-icon-s-order"></i>
                <span>开柜申请</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>存包柜设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="go('main/caseset')">
                <i class="el-icon-setting"></i>
                <span slot="title">智能柜设置</span>
              </el-menu-item>
              <el-menu-item index="3-2" @click="go('main/casecost')">
                <i class="el-icon-bank-card"></i>
                <span>柜门价格设置</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>记录查询</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="go('main/moncount')">
                <i class="el-icon-loading"></i>
                <span>月度统计</span>
              </el-menu-item>
              <el-menu-item index="4-2" @click="go('main/charge')">
                <i class="el-icon-loading"></i>
                <span>充值核销记录</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return{
      
    }
  },
  methods:{
    go(url) {
      this.$router.push({path: url});
    },
    out(){
      let OpenId = sessionStorage.getItem("OpenId");
      let getUser = axios.getUser(OpenId);
      getUser.then((res) => {
        if(res.data.msg != 'OK'){
          this.$message.error(res.data.msg);
          this.$router.push({path: '/login'});
          sessionStorage.removeItem("OpenId");
          sessionStorage.removeItem("id");
        }
      })
    }
  }
}
</script>

<style scoped>
#Menu{
  text-align: left;
}
</style>