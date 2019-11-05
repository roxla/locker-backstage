<template>
  <div id="CHARGE">
    <el-card class="box-card">
      <div class="cost-header">
        <div class="cost-select">
          <el-select @change="getShopName" filterable style="width: 100%;" v-model="shopValue" placeholder="请选择商家">
            <el-option label="全部商家" value=""></el-option>
            <el-option
              v-for="item in shopOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="cost-button">
          <el-button @click="getData()" style="width: 100%;" type="text" class="text-button">搜 索</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="coupon-header">
        <div class="coupon-title">
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="选择月"
            style="width: 100%;"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM"
            @change="getMonthData">
          </el-date-picker>
        </div>
        <div class="coupon-button">
          <el-button @click="export2Excel()" type="text" class="mini-button">导出数据</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="calc(100vh - 178px)">
        <el-table-column
          prop="cashCouponName"
          label="券名称"
          min-width="87"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="购买时间"
          min-width="80"
          align="center">
          <template slot-scope="scope">
            <div class="time_size">{{scope.row.purchasingDate | fulldate}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashCouponMoney"
          label="金额"
          min-width="77"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isEmploy"
          label="状态"
          min-width="65"
          align="center">
        </el-table-column>
      </el-table>
      <div class="coupon-box">
        <div class="coupon-item" style="border-right: 1px solid #EEEEEE;">已核销:<span>{{isEmploy}}</span></div>
        <div class="coupon-item">未核销:<span>{{Employ}}</span></div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      shopValue:"",
      shopName:"全部商家",
      shopOptions:[],
      month:"",
      endDay:"",
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData:[],
      Employ:0,
      isEmploy:0
    }
  },
  created(){
    this.getDefTime();
    this.getShop();
  },
  methods: {
    getShopName(val){
      let obj = {};
      obj = this.shopOptions.find((item)=>{
        return item.value === val;
      });
      if(!!obj){
        this.shopName = obj.label;
      }else{
        this.shopName = "全部商家";
      }
    },
    getShop(){
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
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getDefTime(){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      this.month = year + "-" + month;
      this.getMonthData(this.month);
    },
    getMonthData(data){
      let date;
      let endDay;
      if(!!data){
        date = data;
      }else{
        date = this.month;
      };
      if(date.split('-')[1]=='04'||date.split('-')[1]=='06'||date.split('-')[1]=='09'||date.split('-')[1]=='11'){
        endDay = '30';
      }else if(date.split('-')[1] == '02'){
        let year = date.split('-')[0];
        if(year%4==0&&year%100!=0||year%400==0){
          endDay = '29';
        }else{
          endDay = '28';
        }
      }else{
        endDay = '31';
      };
      this.endDay = endDay;
      this.getData(endDay);
    },
    getData(data){
      let date;
      if(!!data){
        date = data;
      }else{
        date = this.endDay;
      };
      let port = 'merchantCashCoupon/getCashCouponRecord';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        sourceNo:this.shopValue,
        startTime:this.month + '-01',
        endTime:this.month + '-' + date + " 23:59:59"
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          this.Employ = 0;
          this.isEmploy = 0;
          for(let i=0;i<data.length;i++){
            data[i].cashCouponMoney = parseFloat(data[i].cashCouponMoney).toFixed(2);
            data[i].purchasingDate = this.formatDate(new Date(data[i].purchasingDate));
            if(data[i].isEmploy){
              data[i].isEmploy = '已核销';
              this.isEmploy += 1;
            }else{
              data[i].isEmploy = '未核销';
              this.Employ += 1;
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
    export2Excel() {
      let ua = navigator.userAgent.toLowerCase();
      function isWeixinBrowser() {
        return (/micromessenger/.test(ua)) ? true : false;
      };
      let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //ios终端
      let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isWeixinBrowser()) {
        // 微信
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
          //ios
          this.$message.error('请在电脑上打开该页面');
          event.preventDefault();
        }else if(/(Android)/i.test(navigator.userAgent)) {
          //android
          this.$message.error('请在浏览器上打开该页面');
          event.preventDefault();
        };
      }else{
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
          //ios
          this.$message.error('请在电脑上打开该页面');
          event.preventDefault();
        }else if(/(Android)/i.test(navigator.userAgent)) {
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../excel/Export2Excel");
            const tHeader = ["券编号", "券名称", "购买时间", "兑换时间", "金额", "状态"]; // 上面设置Excel的表格第一行的标题
            const filterVal = ["cashCouponRecordNo", "cashCouponName", "purchasingDate", "useDate", "cashCouponMoney", "isEmploy"]; // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.tableData; //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            const fileName = this.month + " " + this.shopName + "核销报表";
            export_json_to_excel(tHeader, data, fileName);
          });
        }else{
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../excel/Export2Excel");
            const tHeader = ["券编号", "券名称", "购买时间", "兑换时间", "金额", "状态"]; // 上面设置Excel的表格第一行的标题
            const filterVal = ["cashCouponRecordNo", "cashCouponName", "purchasingDate", "useDate", "cashCouponMoney", "isEmploy"]; // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.tableData; //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            const fileName = this.month + " " + this.shopName + "核销报表";
            export_json_to_excel(tHeader, data, fileName);
          });
        }
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
}
</script>

<style scoped>
.cost-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 7px;
}
.cost-select{
  width: 80%;
}
.cost-button{
  width: 16%;
}
.coupon-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 7px;
  border-bottom: 1px solid #EEEEEE;
}
.coupon-title{
  width: 75%;
}
.coupon-button{
  width: 20%;
}
.coupon-box{
  display: flex;
  align-items: center;
  font-size: 14px;
}
.coupon-item{
  width: 50%;
  color: #959799;
  padding: 2px 0px;
}
.coupon-item span{
  margin-left: 3px;
  color: red;
  font-weight: bold;
}
</style>