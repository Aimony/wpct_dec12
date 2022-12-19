<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
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

    // 接收读取表格成功的数据
    async handleSuccess({ results, header }) {
      console.log(results, header)
      this.tableData = results;
      this.tableHeader = header;

      const fieldMapping = {
        "小区名称": "villageName",
        "小区楼号": "buildNo",
        "小区房号": "roomNo",
        "姓名": "name",
        "手机号码": "number",
        "身份证": "pid",
        "户口所在地": "resident",
        "保障类型": "guaranteeType",
        "车辆型号": "car",
        "与房屋关系": "relation",
        "符合条件人数": "conditionNumber",
        "其中低保人数": "personNumber",
        "面积核准单价": "areaFee",
        "核准面积": "limitArea",
        "超出面积": "overArea",
        "超出面积单价": "overareaFee",
        "物业单价": "property",
        "物业费": "propertyFee ",
        "押金": "deposit",
        "公摊水费": "waterFee",
        "公摊电费": "electricity",
        "气费": "gasFee",
        "停车费": "carFee",
        "车位号1": "parking1",
        "车位号2": "parking2",
        "其他费用": "otherFee",
        "收回不符合条件疫情减免金额": "afee",
        "收回不符合条件租金": "bfee",
        "应收应退租金": "cfee",
        "应收应退物业费": "dfee",
        "优惠": "discount",
        "备注": "remarks",

        "支付开始时间": "payBeginTime",
        "支付结束时间": "payEndTime",
        "操作人员记录": "updateUser",
        "订单号": "orderNo",
      };

      const newArr = results.map((obj) => {
        const newObj = {};
        const keyArr = Object.keys(obj);
        keyArr.forEach((zhKey) => {
          const enkey = fieldMapping[zhKey];
          newObj[enkey] = obj[zhKey];
        });
        return newObj;
      });

      console.log(newArr);

      // // BUG 重复导入bug
      // const res = await batchImportEmploymentsAPI(newArr)
      //   .then(() => {
      //     setTimeout(() => {
      //       this.$router.back();
      //     }, 2000);
      //     this.$message.success("导入成功！");
      //   })
      //   .catch(() => {
      //     this.$message.error("导入失败！");
      //     return;
      //   });
      // if (res.success) return this.$message.success("导入成功！");
      // console.log(res);

      // console.log(res);
    },
  },
};
</script>
