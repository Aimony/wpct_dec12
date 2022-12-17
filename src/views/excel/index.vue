<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
// TODO Excel 批量导入 接口
// import { batchImportEmploymentsAPI } from "@/api";

export default {
  name: "UploadExcel",
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
    };
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    async handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;

      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };

      const newArr = results.map((obj) => {
        const newObj = {};
        const keyArr = Object.keys(obj);
        keyArr.forEach((zhkey) => {
          const enkey = userRelations[zhkey];
          newObj[enkey] = obj[zhkey];
        });
        return newObj;
      });

      console.log(newArr);

      // BUG 重复导入bug
      const res = await batchImportEmploymentsAPI(newArr)
        .then(() => {
          setTimeout(() => {
            this.$router.back();
          }, 2000);
          this.$message.success("导入成功！");
        })
        .catch(() => {
          this.$message.error("导入失败！");
          return
        });
      // if (res.success) return this.$message.success("导入成功！");
      // console.log(res);

      // console.log(res);
    },
  },
};
</script>
