<template>
  <div id="CaseCost">
    <el-card class="box-card">
      <div class="cost-header">
        <div class="cost-select">
          <el-select filterable style="width: 96%;" v-model="siteValue" placeholder="请选择场地">
            <el-option
              v-for="item in siteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="cost-select">
          <el-select @change="changeCase(caseOptions)" filterable style="width: 96%;" v-model="caseValue" placeholder="请选择柜子">
            <el-option
              v-for="item in caseOptions"
              :key="item.value"
              :label="item.label.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="coupon-header">柜门设置</div>
      <el-table
        :data="caseSet"
        style="width: 100%"
        height="136px">
        <el-table-column
          prop="typeName"
          label="类型"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="rent"
          label="租金"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="settlingTime"
          label="租时/小时"
          min-width="70"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="65"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" class="mini-button" @click="setData(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cost-footer-button">
        <div style="width: 50%;">
          <el-button type="text" @click="dialogVisible1 = true" style="width: 100%;" class="text-button">免费时长:{{free_time}}/分钟</el-button>
        </div>
        <div style="width: 50%;border-left: 1px solid #EEEEEE;">
          <el-button type="text" @click="dialogVisible2 = true" style="width: 100%;" class="text-button">超时时长:{{over_time}}/小时</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="coupon-header">代金券设置</div>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 370px)">
        <el-table-column
          prop="cashCouponName"
          label="名称"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="90"
          align="center">
          <template slot-scope="scope">
            <div class="time_size">{{scope.row.createDate | fulldate}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashCouponMoney"
          label="价格"
          min-width="70"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="65"
          align="center">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              trigger="click">
              <div>
                <el-button type="text" @click="showData(scope.row)" class="mini-button" size="small">详情</el-button>
                <el-button @click="delData(scope.row)" type="text" class="mini-button" size="small">删除</el-button>
              </div>
              <el-button type="text" class="mini-button" slot="reference">操作</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="cost-footer-button">
        <div style="width: 50%;">
          <el-button @click="dialogVisible3 = true" type="text" style="width: 100%;" class="text-button">添 加</el-button>
        </div>
        <div style="width: 50%;border-left: 1px solid #EEEEEE;">
          <el-button type="text" style="width: 100%;" class="text-button">查 询</el-button>
        </div>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-dialog
        title="免费时间设置 /分钟"
        :visible.sync="dialogVisible1"
        width="90%"
        top="35vh">
        <div style="width: 94%; margin: auto;padding-top: 10px;">
          <el-slider :min="1" :max="60" v-model="free_time"></el-slider>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button @click="freeTime" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="超时时间设置"
        :visible.sync="dialogVisible2"
        width="90%"
        top="35vh">
        <div style="width: 94%; margin: auto;padding-top: 10px;">
          <el-slider :min="1" :max="12" v-model="over_time"></el-slider>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button @click="overTime" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加代金券"
        :visible.sync="dialogVisible3"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item label="请选择商铺">
            <el-select @change="getCouponList" filterable style="width: 100%;" v-model="shopValue" placeholder="请选择商铺">
              <el-option value="" label="全部店铺"></el-option>
              <el-option
                v-for="item in shopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="coupValue" label="请选择代金券">
            <el-select filterable style="width: 100%;" v-model="ruleForm.coupValue" placeholder="请选择代金券">
              <el-option
                v-for="item in coupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button class="button-margin" type="primary" @click="addCoupon('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="柜门类型设置"
        :visible.sync="dialogVisible4"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="typeName" label="柜门类型名称">
            <el-input v-model="ruleForm.typeName" placeholder="请输入柜门类型名称"></el-input>
          </el-form-item>
          <el-form-item prop="typeMoney" label="柜门类型租金/元">
            <el-input type="number" v-model="ruleForm.typeMoney" placeholder="请输入柜门类型租金"></el-input>
          </el-form-item>
          <el-form-item prop="typeTime" label="柜门类型租时/小时">
            <el-input v-model.number="ruleForm.typeTime" placeholder="请输入柜门类型租时"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button class="button-margin" type="primary" @click="setCaseData">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
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
      // 柜门设置
      caseSet:[],
      dialogVisible1:false,
      free_time: 1,
      dialogVisible2:false,
      over_time: 1,
      dialogVisible4:false,
      caseNo:"",
      // 代金券设置
      dialogVisible3:false,
      tableData:[],
      shopValue:"",
      shopOptions:[],
      coupOptions:[],
      ruleForm:{
        typeName:"",
        typeMoney:0,
        typeTime:0,
        coupValue:"",
      },
      rules:{
        typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        typeMoney: [{ required: true, message: '请输入类型租金', trigger: 'blur' }],
        typeTime: [{ required: true, message: '请输入类型租时', trigger: 'blur' }],
        coupValue: [{ required: true, message: '请选择代金券', trigger: 'blur' }],
      },
    }
  },
  created(){
    this.getSiteList();
    this.getShopList();
    this.getCaseSet();
  },
  methods: {
    changeCase(data){
      this.getCaseCoupons();
      for(let i=0;i<data.length;i++){
        if(this.caseValue == data[i].value){
          this.free_time = data[i].label.feed;
          this.over_time = data[i].label.out;
        }
      };
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
          if(data.length>0){
            this.siteValue = data[0].pkNo;
            this.getCaseList(data[0].pkNo);
          };
          this.siteOptions = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCaseList(data){
      let No = "";
      if(!!data){
        No = data;
      }else{
        No = this.siteValue;
      }
      let port = 'cabinetManage/getCabinetList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        spaceCharacterNo:No
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].pkNo,label:{name:data[i].nameLocker,feed:data[i].freeTime,out:data[i].timeoutWarning}});
          };
          if(data.length>0){
            this.caseValue = data[0].pkNo;
            this.getCaseCoupons(data[0].pkNo);
            this.free_time = data[0].freeTime;
            this.over_time = data[0].timeoutWarning;
          };
          this.caseOptions = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getShopList(){
      let port = 'merchant/getMerchantList';
      let obj = {
        opid:sessionStorage.getItem("OpenId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].pkNo,label:data[i].merchantName});
          };
          this.shopOptions = arr;
          this.getCouponList();
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCouponList(){
      this.ruleForm.coupValue = "";
      let port = 'merchantCashCoupon/getMerchantCashCoupon'
      let obj = {
        merchantNo:this.shopValue,
        opid:sessionStorage.getItem("OpenId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].cashCouponNo,label:data[i].cashCouponName});
          };
          this.coupOptions = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCaseCoupons(pkNo){
      let No = "";
      if(!!pkNo){
        No = pkNo;
      }else{
        No = this.caseValue;
      };
      let port = 'merchantCashCoupon/getMerchantCashCoupon'
      let obj = {
        relevanceCabinetNo:No,
        opid:sessionStorage.getItem("OpenId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].cashCouponMoney = parseFloat(data[i].cashCouponMoney).toFixed(2);
            data[i].createDate = this.formatDate(new Date(data[i].createDate));
          };
          this.tableData = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCaseSet(){
      let port = 'subCabinetType/getSubCabinetType'
      let postData = this.axios.postData(port);
      postData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].rent = parseFloat(data[i].rent).toFixed(2);
          };
          this.caseSet = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    addCoupon(formName){
      this.$refs[formName].validate(valid => {
        if(valid){
          if(!!this.caseValue){
            let port = 'couponForCabinet/addCouponForCabinet';
            let obj = {
              opid:sessionStorage.getItem("OpenId"),
              cabinetNo:this.caseValue,
              couponNo:this.ruleForm.coupValue
            };
            let upData = this.axios.upData(port,obj);
            upData.then(res => {
              if(res.data.status == 200){
                this.getCaseCoupons();
                this.$message.success('添加成功');
                this.dialogVisible3 = false;
              }else if(res.data.status == 588){
                this.checkLogin();
              }else{
                this.$message.error(res.data.msg);
              }
            });
          }else{
            this.$message.error('请选择柜子');
          }
        }else{
          return false;
        }
      });
    },
    freeTime(){
      let port = 'cabinetManage/updateCabinet';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        cabinetNo:this.caseValue,
        freeTime:this.free_time
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.$message.success('设置成功');
          this.dialogVisible1 = false;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    overTime(){
      let port = 'cabinetManage/updateCabinet';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        cabinetNo:this.caseValue,
        timeoutWarning:this.over_time
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.$message.success('设置成功');
          this.dialogVisible2 = false;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    delData(data){

    },
    showData(data){

    },
    setData(data){
      this.caseNo = data.pkNo;
      this.ruleForm.typeName = data.typeName;
      this.ruleForm.typeMoney = data.rent;
      this.ruleForm.typeTime = data.settlingTime
      this.dialogVisible4 = true;
    },
    setCaseData(){
      let port = 'subCabinetType/updateSubCabinetType';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        pkNo:this.caseNo,
        typeName:this.ruleForm.typeName,
        rent:this.ruleForm.typeMoney,
        settlingTime:this.ruleForm.typeTime
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.getCaseSet();
          this.$message.success('设置成功');
          this.dialogVisible4 = false;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    }
  },
}
</script>

<style scoped>
#CaseCost{
  
}
.cost-header{
  display: flex;
  align-items: center;
  padding: 5px 7px;
  justify-content: space-between;
}
.cost-select{
  width: 49%;
}
.cost-footer-button{
  display: flex;
  align-items: center;
  width: 100%;
}
.coupon-header{
  font-size: 14px;
  padding: 5px 10px;
  border-bottom: 1px solid #EEEEEE;
  text-align: left;
  color: #9A9DA2;
  font-weight: bold;
}
</style>