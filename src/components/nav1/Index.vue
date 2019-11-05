<template>
  <div id="Index">
    <el-card class="box-card">
      <div class="search-box">
        <div class="search-item">
          <el-select @change="changeSite" v-model="siteValue" filterable placeholder="请选择">
            <el-option label="全部场地" value=""></el-option>
            <el-option
              v-for="item in siteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select @change="getData" v-model="caseValue" filterable placeholder="请选择">
            <el-option label="全部柜子" value=""></el-option>
            <el-option
              v-for="item in caseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 162px)">
        <el-table-column
          prop="nameBox"
          label="名称"
          min-width="80"
          align="center"
          fit="true">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型"
          min-width="85"
          align="center"
          fit="true">
        </el-table-column>
        <el-table-column
          prop="caseType"
          label="状态"
          min-width="70"
          align="center"
          fit="true">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="75"
          align="center"
          fit="true">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.notUse" class="mini-button" size="mini" type="text" @click="openCase(scope.row)">开柜</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="count-text">空余柜门数量：<span>{{count}}</span>个</div>
      <div style="display: flex;align-items: center;">
        <div style="width: 49%;border-right: 1px solid #EEEEEE">
          <el-button style="width: 100%" type="text" class="text-button">查 询</el-button>
        </div>
        <div style="width: 50%;">
          <el-button style="width: 100%" type="text" class="text-button">刷 新</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      siteValue:"",
      siteOptions:[],
      caseValue:"",
      caseOptions:[],
      tableData: [],
      count:0
    }
  },
  created(){
    this.getSiteList();
    this.getCaseList();
    this.getData();
  },
  methods:{
    changeSite(){
      this.getCaseList();
      this.getData();
    },
    getSiteList(){
      let port = 'spaceCharacter/getSpaceCharacterList';
      let obj = {
        opid:sessionStorage.getItem("OpenId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].pkNo,label:data[i].spaceCharacterName});
          };
          this.siteOptions = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCaseList(){
      let port = 'cabinetManage/getCabinetList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        spaceCharacterNo:this.siteValue
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].pkNo,label:data[i].nameLocker});
          };
          this.caseOptions = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getData(){
      let port = 'cabinetManage/getSubCabinetList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        cabinetNo:this.caseValue,
        spaceCharacterNo:this.siteValue
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          this.count = 0;
          for(let i=0;i<data.length;i++){
            if(data[i].notUse){
              data[i].caseType = '已使用';
            }else{
              data[i].caseType = '未使用';
              this.count += 1;
            }
          };
          this.tableData = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    openCase(){
      
    }
  }
}
</script>

<style scoped>
#Index{

}
.search-box{
  display: flex;
  align-items: center;
  padding: 5px 7px;
  justify-content: space-between;
}
.search-item{
  width: 49%
}
.count-text{
  font-size: 14px;
  color: #47484dbe;
  border-bottom: 1px solid #EEEEEE;
  padding: 3px 0px;
}
.count-text span{
  color: red;
}
</style>