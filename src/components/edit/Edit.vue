<template>
  <div>
    <h3 class="editorH3">推荐使用电脑来编辑资料</h3>
    <el-upload
      class="avatar-uploader"
      action="#"
      :http-request="upImg"
      :headers="header"
      :show-file-list="false"
      :before-upload="beforeUpload"
      
    ></el-upload>

    <quill-editor
      class="editor"
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  // [{ header: 1 }, { header: 2 }], // 1、2 级标题
  // [{ script: "sub" }, { script: "super" }], // 上标/下标
  // [{'direction': 'rtl'}],                         // 文本方向
  //[{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["link", "image", "video"], // 链接、图片、视频
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  ["clean"] // 清除文本格式
];

import { quillEditor } from "vue-quill-editor";
import { format } from "util";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "quillEdit",
  props: {
    /*编辑器的内容*/
    oHtml: {
      type: String
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000 //kb
    }
  },

  components: {
    quillEditor
  },

  data() {
    return {
      content: this.oHtml,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "强烈建议您使用电脑进行编辑",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              // link: function(value) {
              //   if (value) {
              //     var href = prompt('请输入url');
              //     this.quill.format("link", href);
              //   } else {
              //     this.quill.format("link", false);
              //   }
              // },
            }
          }
        }
      },
      serverUrl: this.$GLO.host + "comm/batchUpload", // 这里写你要上传的图片服务器地址
      header: {
        'Content-Type': 'application/json;charset=UTF-8'
      } // 有的图片服务器要求请求头需要有token
    };
  },
  
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("input", this.content);
    },
    // 富文本图片上传前
    beforeUpload(file) {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    upImg(file){
      let File = file.file;
      let addImg = this.axios.addImg(File);
      addImg.then((res) => {
        // 如果上传成功
        if(res.data.msg == 'OK'){
          let quill = this.$refs.myQuillEditor.quill;
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.url为服务器返回的图片地址
          quill.insertEmbed(length, "image", res.data.data);
          // 调整光标到最后
          quill.setSelection(length + 1);
          // loading动画消失
          this.quillUpdateImg = false;
        }else{
          this.quillUpdateImg = false;
          this.$message.error("图片插入失败");
        }
      });
    }
  }
};
</script> 

<style>
img{
  max-width: 100%;
}
.editorH3{
  text-align: center;
}
.ql-toolbar{
  position: fixed;
  top:0;
  left: 0;
  z-index: 1002;
  background-color: aliceblue;
}
.ql-container{
  margin-bottom: 35px;
  background-color: white;
}
.editor {
  line-height: normal !important;
  height: 100%;
  text-align: left;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker {
  border: 1px solid #aaa;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>