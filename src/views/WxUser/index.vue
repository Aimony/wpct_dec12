<!--
 * @Author: Your Name you@example.com
 * @Date: 2022-11-05 22:07:47
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-11-09 15:18:42
 * @FilePath: \vue-admin-template-master\src\views\WxUser\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <div>
      <!-- 表格数据 -->
      <el-table :data="newArr" fit highlight-current-row height="600px" v-premission="'weixin:list'">
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" prop="villageName" label="小区" width="120"></el-table-column>
        <el-table-column align="center" prop="buildNo" label="楼号" width="120"></el-table-column>
        <el-table-column align="center" prop="roomNo" label="房号" width="100"></el-table-column>
        <el-table-column align="center" prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column align="center" prop="number" label="电话" width="160"></el-table-column>
        <el-table-column align="center" prop="nickname" label="昵称" style="width: 60px"></el-table-column>
        <el-table-column align="center" prop="openid" label="openid" width="280"></el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-size="listQuery.pageRow" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="100" />
    
  </div>
</template>

<script>
import { getWeixinlistAPI } from "../../api/weixin";

export default {
  name: "index",
  data() {
    return {
      newArr: [],
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数
        nicknames: "",
        openid: "",
        items: {
          buildNo: "string",
          car: "string",
          conditionNumber: "string",
          consumption: {
            afee: 0,
            area: 0,
            areaFee: 0,
            bfee: 0,
            buildId: "string",
            carFee: 0,
            cfee: 0,
            deposit: 0,
            dfee: 0,
            discount: 0,
            electricity: 0,
            electricityFee: 0,
            gasFee: 0,
            gwaterFee: 0,
            liftFee: 0,
            limitArea: 0,
            monthCost: 0,
            overArea: 0,
            overareaFee: 0,
            property: 0,
            propertyFee: 0,
            waterFee: 0,
          },
          guaranteeType: "string",
          name: "string",
          number: "string",
          orderNo: "string",
          payBeginTime: "2022-11-05T13:59:41.802Z",
          payEndTime: "2022-11-05T13:59:41.802Z",
          payStatus: "string",
          payinfoId: "string",
          personNumber: "string",
          pid: "string",
          relation: "string",
          remarks: "string",
          resident: "string",
          roomNo: "string",
          updateTime: "2022-11-05T13:59:41.802Z",
          updateUser: "string",
          villageName: "string",
          wechatUser: {
            buildInfoList: [
              {
                buildNo: "string",
                deposit: 0,
                houseType: "string",
                id: 0,
                openid: "string",
                orderNo: "string",
                relation: "string",
                roomNo: "string",
                villageName: "string",
              },
            ],
            id: 0,
            name: "string",
            nickname: "string",
            number: "string",
            openid: "string",
            pid: "string",
          },
        },
      },
    };
  },
  methods: {
    // 获取微信用户展示列表
    // TODO 后端返回 total  or     重写 ？
    async getList() {
      const res = await getWeixinlistAPI();
      console.log(res);
      const datalist = res.data;
      const { data1: binfo } = datalist; // 用户信息
      const { data2: uinfo } = datalist; // 用户房屋信息
      this.newArr = binfo.map((dataitem) => {
        const data = uinfo.find((i) => dataitem.openid === i.openid);
        return {
          ...dataitem,
          ...data,
        };
      });
      console.log(this.newArr);
    },
    // （每页）条数 改变时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 页数 改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="css" scoped>
.container {
  padding: 20px;
}
</style>
