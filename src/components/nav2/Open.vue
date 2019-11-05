<template>
  <div id="Open">
    <div>
      <el-card class="box-card">
        <div class="search-box">
          <el-select @change="getData()" style="width: 49%;" v-model="Value" filterable placeholder="请选择">
            <el-option label="全部场地" value=""></el-option>
            <el-option
              v-for="item in Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="getData()" style="width: 49%;" v-model="typeValue" filterable placeholder="请选择">
            <el-option label="已处理" :value="true"></el-option>
            <el-option label="未处理" :value="false"></el-option>
          </el-select>
        </div>
      </el-card>
    </div>
    <div class="main-box">
      <el-card class="box-card open-card" v-if="openList.length<=0">
        <div class="no-open">无开柜申请</div>
      </el-card>
      <el-card class="box-card open-card" v-for="(item,index) in openList" :key="index">
        <div class="order-box">
          <div class="order-body-box">
            <dl>
              <dd class="order-message"><span>手机:</span> {{item.consumerTel}}</dd>
            </dl>
            <dl>
              <dd class="order-message"><span>使用时间:</span> {{item.startTime}}</dd>
            </dl>
            <dl>
              <dd class="order-message"><span>规格:</span> {{item.count.typeName}}型柜子 </dd>
            </dl>
            <dl>
              <dd class="order-message"><span>已使用时长:</span> {{item.count.settlingTime}}小时</dd>
            </dl>
            <dl>
              <dd class="order-message"><span>存放地点:</span> {{item.cabinetAddress}}</dd>
            </dl>
            <dl>
              <dd class="order-message"><span>备注:</span> {{item.forgetRemark}}</dd>
            </dl>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      Value:"",
      typeValue:false,
      Options:[],
      openList:[],
    }
  },
  created(){
    this.getList();
    this.getData();
  },
  methods: {
    getList(){
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
          this.Options = arr;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getData(){
      let port = 'cabinetRentEmploymentRecord/getCabinetRecordForgeList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        spaceCharacterNo:this.Value,
        cabinetOut:this.typeValue
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].startTime = this.formatDate(new Date(data[i].startTime));
          };
          console.log(data);
          this.openList = data;
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
#Open{

}
dl,dd{
  margin:0px;
}
.no-open{
  color: #47484dbe;
  font-size: 14px;
  padding: 5px 0px;
}
.order-box{
  padding: 10px;
}
.order-body-box{
  border: 1px solid rgb(226, 226, 226);
  font-size: 14px;
  padding: 5px;
  text-align: left;
}
.button-footer-box{
  display: flex;
  align-items: center;
}
.button-footer-left{
  width: 70%;
}
.button-footer-right{
  width: 30%;
}
.search-box{
  padding: 5px 7px;
  display: flex;
  justify-content: space-between;
}
.main-box{
  height: calc(100vh - 107px);
  overflow-y: scroll;
}
.order-message{
  color: #757575;
}
.order-message span{
 font-weight: bold;
 color: #5A5A5A;
}
</style>