<template>
  <div id="CaseSet">
    <el-card class="box-card">
      <div class="cost-header">
        <div class="cost-select">
          <el-select filterable style="width: 100%;" v-model="siteValue" placeholder="请选择场地">
            <el-option
              v-for="item in siteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="cost-button">
          <el-button @click="getCaseList()" style="width: 100%;" type="text" class="text-button">搜 索</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="no-case-box" v-if="caseList.length<=0">
        <div class="no-case">无柜子数据</div>
      </div>
      <el-tabs v-if="caseList.length>0" v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in caseList" :key="index" :label="item.nameLocker" :name="item.pkNo">
          <div class="case-box">
            <div class="case-item-box" v-for="(item,index) in itemList" :key="index">
              <div class="case-item">
                <div class="case-item-main">{{item.nameBox}}</div>
                <div class="case-item-type">{{item.TypeName}}</div>
                <div class="case-item-button">
                  <el-button @click="setCaseType(item)" style="width: 100%;" type="primary" size="mini" class="text-button">设 置</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="cost-footer-button">
        <div class="cost-footer-left">
          <el-button @click="dialogVisible1 = true" style="width: 100%;" type="text" class="text-button">添 加</el-button>
        </div>
        <div class="cost-footer-right">
          <el-button @click="dialogVisible3 = true" style="width: 100%;" type="text" class="text-button">设 置</el-button>
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
        title="添加新柜子"
        :visible.sync="dialogVisible1"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="caseName" label="柜子名称">
            <el-input v-model="ruleForm.caseName" placeholder="请输入柜门名称"></el-input>
          </el-form-item>
          <el-form-item prop="caseValue" label="柜子设备ID">
            <el-input v-model="ruleForm.caseValue" placeholder="请输入柜子设备ID" style="width: 100%"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button class="button-margin" type="primary" @click="addCase('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="柜子设置"
        :visible.sync="dialogVisible3"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="casePkName" label="柜子名称">
            <el-input v-model="ruleForm.casePkName" placeholder="请输入柜门名称"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button class="button-margin" type="primary" @click="setCaseInfo('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="柜门设置"
        :visible.sync="dialogVisible2"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="name" label="柜门名称">
            <el-input v-model="ruleForm.name" placeholder="请输入柜门名称"></el-input>
          </el-form-item>
          <el-form-item prop="value" label="柜门类型">
            <el-select v-model="ruleForm.value" placeholder="请选择柜门类型" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button class="button-margin" type="primary" @click="postSetCase">确 定</el-button>
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
      activeName: '',
      caseList:[],
      itemList:[],
      dialogVisible1:false,
      dialogVisible2:false,
      dialogVisible3:false,
      ruleForm: {
        name:"",
        value:"",
        caseName:"",
        caseValue:"",
        casePkName:""
      },
      rules: {
        name: [{ required: true, message: '请输入柜门名称', trigger: 'blur' }],
        value: [{ required: true, message: '请选择柜门类型', trigger: 'blur' }],
        caseName: [{ required: true, message: '请输入柜子名称', trigger: 'blur' }],
        caseValue: [{ required: true, message: '请输入柜子设备ID', trigger: 'blur' }],
        casePkName: [{ required: true, message: '请输入柜子名称', trigger: 'blur' }],
      },
      options: [],
      caseNo:"", //柜门编号
      casePkNo:"" //柜子编号
    }
  },
  created(){
    this.getTypeData();
    this.getSiteList();
  },
  methods: {
    handleClick(tab) {
      this.ruleForm.casePkName = tab.label;
      this.casePkNo = tab.name;
      this.getItemList(tab.name);
    },
    getTypeData(){
      let port = 'subCabinetType/getSubCabinetType';
      let postData = this.axios.postData(port);
      postData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          let arr = [];
          for(let i=0;i<data.length;i++){
            arr.push({value:data[i].pkNo,label:data[i].typeName});
          };
          this.options = arr;
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
    getCaseList(data,no,name){
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
          this.caseList = [];
          let data = res.data.data;
          this.caseList = data;
          if(!!no && !!name){
            this.activeName = no;
            this.casePkNo = no;
            this.ruleForm.casePkName = name;
            this.getItemList(no);
          }else{
            this.activeName = data[0].pkNo;
            this.casePkNo = data[0].pkNo;
            this.ruleForm.casePkName = data[0].nameLocker;
            this.getItemList(data[0].pkNo);
          };
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getItemList(data){
      let port = 'cabinetManage/getSubCabinetList';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        spaceCharacterNo:this.siteValue,
        cabinetNo:data
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            for(let j=0;j<this.options.length;j++){
              if(data[i].fkSubCabinetTypeNo == this.options[j].value){
                data[i].TypeName = this.options[j].label
              };
            };
          };
          this.itemList = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    addCase(formName){
      this.$refs[formName].validate(valid => {
        if(valid){
          let port = 'cabinetProcessing/addTheCabinet';
          let obj = {
            opid:sessionStorage.getItem("OpenId"),
            fkSpaceCharacterNo:this.siteValue,
            deviceId:this.ruleForm.caseValue,
            nameLocker:this.ruleForm.caseName
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.$message.success('添加柜子成功');
              this.dialogVisible1 = false;
            }else if(res.data.status == 588){
              this.checkLogin();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        }else{
          return false;
        }
      });
    },
    setCaseType(data){
      this.ruleForm.name = data.nameBox;
      this.ruleForm.value = data.fkSubCabinetTypeNo;
      this.caseNo = data.pkNo;
      this.dialogVisible2 = true;
    },
    postSetCase(){
      let port = 'cabinetManage/updateSubCabinet';
      let obj = {
        opid:sessionStorage.getItem("OpenId"),
        pkNo:this.caseNo,
        nameBox:this.ruleForm.name,
        fkSubCabinetTypeNo:this.ruleForm.value
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.$message.success('柜门设置成功');
          this.getItemList(this.activeName);
          this.dialogVisible2 = false;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    setCaseInfo(formName){
      this.$refs[formName].validate(valid => {
        if(valid){
          let port = 'cabinetManage/updateCabinet';
          let obj = {
            opid:sessionStorage.getItem("OpenId"),
            nameLocker:this.ruleForm.casePkName,
            cabinetNo:this.casePkNo
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.$message.success('柜子设置成功');
              this.getCaseList(this.siteValue,this.casePkNo,this.ruleForm.casePkName);
              this.dialogVisible3 = false;
            }else if(res.data.status == 588){
              this.checkLogin();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        }else{
          return false;
        }
      });
    }
  },
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
#CaseSet{
  
}
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
.cost-footer-button{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #EEEEEE;
}
.cost-footer-left{
  width: 50%;
}
.cost-footer-right{
  border-left: 1px solid #EEEEEE;
  width: 50%;
}
.case-box{
  height: calc(100vh - 210px);
  overflow-y: scroll;
  padding: 0px 5px 15px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: center;
}
.case-item-box{
  margin: 5px 5px 0px 0px;
  width: calc(100%/4 - 6px);
  border: 1px solid #EEEEEE;
  border-radius: 5px;
  position: relative;
}
.case-item-box:nth-of-type(1),
.case-item-box:nth-of-type(2),
.case-item-box:nth-of-type(3),
.case-item-box:nth-of-type(4){
  margin-top: 0px;
}
.case-item-box:nth-of-type(4n){
  margin-right: 0px;
}
.case-item-button{
  width: 100%;
}
.case-item-main{
  font-size: 0.9em;
  width: 100%;
  font-weight: bold;
}
.case-item-type{
  font-size: 0.4em;
  margin-bottom: 3px;
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
.no-case-box{
  height: calc(100vh - 136px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-case{
  color: #47484dbe;
  font-size: 14px;
  padding: 10px 0px;
}
</style>