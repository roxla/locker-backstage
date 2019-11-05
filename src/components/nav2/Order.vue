<template>
  <div id="Order">
    <el-card class="box-card">
      <div class="search-box">
        <div class="search-item">
          <el-select @change="searchData" v-model="siteValue" filterable placeholder="请选择">
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
        height="calc(100vh - 135px)">
        <el-table-column
          prop="cabinetRecorNo"
          label="订单号"
          min-width="85"
          align="center"
          fit="true"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="存件时间"
          min-width="80"
          align="center"
          fit="true">
          <template slot-scope="scope">
            <div>{{scope.row.startTime | fulldate}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="状态"
          min-width="75"
          align="center"
          fit="true">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="65"
          align="center"
          fit="true">
          <template slot-scope="scope">
            <el-button class="mini-button" size="mini" type="text" @click="getFullData(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;align-items: center;">
        <div style="width: 49%;border-right: 1px solid #EEEEEE">
          <el-button @click="dialogVisible2 = true" style="width: 100%" type="text" class="text-button">查 询</el-button>
        </div>
        <div style="width: 50%;">
          <el-button @click="reset" style="width: 100%" type="text" class="text-button">刷 新</el-button>
        </div>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible1"
      width="90%"
      top="20vh">
      <div style="text-align: left;padding: 10px 0px;">
        <div style="padding: 0px 0px 5px;">订单号: {{no}}</div>
        <div style="padding: 0px 0px 5px;">手机号码: {{tel}}</div>
        <div style="padding: 0px 0px 5px;">状态: {{status}}</div>
        <div style="padding: 0px 0px 5px;">使用时长: {{hours}}小时</div>
        <div style="padding: 0px 0px 5px;">需要支付金额: {{cost}}元</div>
        <div style="padding: 0px 0px 5px;">是否支付: {{pay}}</div>
        <div style="padding: 0px 0px 5px;">存放时间: {{time}}</div>
        <div style="padding: 0px 0px 5px;">取件时间: {{endTime}}</div>
        <div style="padding: 0px 0px 5px;">存放地点: {{address}}</div>
        <div style="padding: 0px 0px 5px;">存放柜子: {{caseName}}</div>
        <div style="padding: 0px 0px 5px;">存放柜门: {{caseItem}}</div>
      </div>
    </el-dialog>
    <el-dialog
      title="查询"
      :visible.sync="dialogVisible2"
      width="90%"
      top="20vh">
      <dl class="item-text">
        <dd class="item-title">手机号:</dd>
        <dd class="item-body">
          <el-input type="numer" v-model="S_tel" placeholder="请输入手机号"></el-input>
        </dd>
      </dl>
      <dl class="item-text">
        <dd class="item-title">状态:</dd>
        <dd class="item-body">
          <el-select v-model="typeValue" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="item-text">
        <dd class="item-title">开始时间:</dd>
        <dd class="item-body">
          <el-date-picker
            v-model="S_stime"
            type="date"
            placeholder="请选择时间"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            :editable="false">
          </el-date-picker>
        </dd>
      </dl>
      <dl class="item-text">
        <dd class="item-title">结束时间:</dd>
        <dd class="item-body">
          <el-date-picker
            v-model="S_etime"
            type="date"
            placeholder="请选择时间"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            :editable="false"
            default-time="23:59:59">
          </el-date-picker>
        </dd>
      </dl>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button @click="search" class="button-margin" type="primary">查 询</el-button>
      </span>
    </el-dialog>
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
      tableData:[],
      // 详情
      dialogVisible1:false,
      time:"",
      hours:"",
      cost:"",
      no:"",
      endTime:"",
      address:"",
      status:"",
      pay:"",
      caseName:"",
      caseItem:"",
      tel:"",
      // 查询
      dialogVisible2:false,
      S_tel:"",
      S_stime:"",
      S_etime:"",
      options:[],
      typeValue:''
    }
  },
  created(){
    this.getSiteList();
    this.getCaseList();
    this.getTypeData();
    this.getData();
  },
  methods:{
    searchData(){
      this.getCaseList();
      this.getData();
    },
    getTypeData(){
      let port = 'cabinetRentEmploymentRecord/getRecordStateAll';
      let obj = {
        opid:sessionStorage.getItem("OpenId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].statusNo,label:data[i].statusName});
          };
          this.options = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getData(){
      let port = 'cabinetRentEmploymentRecord/getCabinetRentEmploymentRecordList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        spaceCharacterNo:this.siteValue,
        cabinetNo:this.caseValue,
        startTime:this.S_stime,
        endTime:this.S_etime,
        fkCabinetRecordStatusNo:this.typeValue,
        consumerPhone:this.S_tel
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            if(!!data[i].startTime.split('.')[1]){
              data[i].startTime = data[i].startTime.split('.')[0];
            };
          };
          this.tableData = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
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
    search(){
      this.getData();
      this.dialogVisible2 = false;
    },
    reset(){
      this.S_tel = "";
      this.S_stime = "";
      this.S_etime = "";
      this.typeValue = "";
      this.getData();
    },
    getFullData(data){
      let port = 'cabinetRentEmploymentRecord/getCabinetRentEmploymentRecordDetails'
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        cabinetRecordNo:data.cabinetRecorNo
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.hours = res.data.data.hoursOfUse;
          this.cost = parseFloat(res.data.data.amountPayable).toFixed(2);
          this.no = data.cabinetRecorNo;
          this.time = this.formatDate(new Date(res.data.data.startTime));
          this.endTime = res.data.data.endTime;
          this.address = res.data.data.spaceCharacterName;
          this.status = res.data.data.statusName;
          this.tel = res.data.data.consumerTel;
          if(!!data.pay){
            this.pay = "已支付"
          }else{
            this.pay = "未支付"
          };
          this.caseName = res.data.data.nameLocker;
          this.caseItem = res.data.data.nameBox;
          this.dialogVisible1 = true;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    }
  }
}
</script>

<style scoped>
dl{
  margin:0px;
  padding: 5px 0px;
  border-bottom: 1px solid #EEEEEE;
}
dd{
  margin: 0px;
}
#Order{

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
.item-text{
  margin-top: 5px;
  margin-bottom: 5px;
  border: 0px;
  width: 100%;
  padding: 0px;
}
.item-body{
  text-align: left;
}
.item-title{
  text-align: left;
  margin-bottom: 5px;
}
</style>