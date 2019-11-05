<template>
  <div class="hello">
    <el-button @click="export2Excel()">test</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testData: [
        {
          name: "aaa",
          age: 18,
          address: "aaaa"
        },
        {
          name: "bbb",
          age: 17,
          address: "bbbb"
        },
        {
          name: "ccc",
          age: 16,
          address: "cccc"
        },
        {
          name: "ddd",
          age: 15,
          address: "dddd"
        },
        {
          name: "eee",
          age: 14,
          address: "eeee"
        }
      ],
      name:'testExcel'
    };
  },
  methods: {
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../excel/Export2Excel");
        const tHeader = ["名字", "年龄", "地址"]; // 上面设置Excel的表格第一行的标题
        const filterVal = ["name", "age", "address"]; // 上面的index、phone_Num、school_Name是tableData里对象的属性
        const list = this.testData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const fileName = this.name;
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style scoped>
</style>
