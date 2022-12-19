<template>
  <div>
    <div class="header" style="margin: 10px">
      <!-- 顶栏区域 -->
      <el-row :gutter="30" style="margin-bottom:20px">
        <el-col :span="3">
          <el-select v-model="form1.villageName" placeholder="请选择小区">
            <el-option v-for="item in list" :key="item.pid" :label="item.villageName" :value="item.pid">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="form1.buildNo" placeholder="请选择楼号">
            <el-option v-for="item in list" :key="item.pid" :label="item.buildNo" :value="item.pid">
            </el-option>
          </el-select>
        </el-col>

        <!-- TODO 缴交状态 payStatus 字段 -->
        <!-- TODO 后台返回 payStateOption，这里先写死 -->
        <el-col :span="4">
          <el-select v-model="payStatus" placeholder="请选择缴交状态">
            <el-option v-for="item in payStateOption" :key="item.id" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <el-input v-model="list.name" placeholder="请输入姓名"></el-input>
        </el-col>

        <el-col :span="5">
          <div class="block">
            <el-date-picker v-model="choiceDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="menu">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 新增信息、Excel操作 -->
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button type="primary" size="small" @click="showAdd" v-premission="'build:add'" style="margin-right:30px">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" size="small" @click="uploadExcel">导入excel</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" size="small" @click="showExport">导出excel</el-button>
        </el-col>
      </el-row>

      <!-- <el-button type="success" size="small" @click="downloadExcel">导出excel</el-button> -->
    </div>
    <!-- v-premission="'build:list'" -->

    <!-- 默认展示表格 -->
    <el-table :data="list" fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="scope.$index + 1" />
        </template>
      </el-table-column>

      <el-table-column align="center" prop="residence" label="小区楼房房号" width="250">
        <template slot-scope="scope">
          {{
              `${scope.row.villageName}${scope.row.buildNo}号楼${scope.row.roomNo}号`
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="name" label="姓名" width="140" /> -->
      <el-table-column align="center" prop="guaranteeType" label="保障类型" width="220" />
      <el-table-column align="center" label="缴交状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payStatus == '未缴' ? 'danger' : 'success'">
            {{ scope.row.payStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="已缴纳日期" width="160" />
      <el-table-column align="center" prop="consumption.monthCost" label="合计待缴" width="220" />
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-tickets" @click="showDetail(scope.row)" v-premission="'build:list'">查看</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="showChange(scope.row)" v-premission="'build:update'">修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="deleteRow(scope.row)" v-premission="'build:remove'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看详情 -->
    <el-dialog title="详情" :visible.sync="tableVisable" width="55%" height="550px" top="5vh" :before-close="closeDialog">
      <el-form :model="form" label-width="100px">
        <el-col :span="12">
          <el-form-item label="小区">
            {{ form.villageName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼号">
            {{ form.buildNo }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房号">
            {{ form.roomNo }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名">
            {{ form.name }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号">
            {{ form.pid }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话">
            {{ form.number }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="户口所在地">
            {{ form.resident }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="保障类型">
            {{ form.guaranteeType }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆类型">
            {{ form.car }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="与房屋关系">
            {{ form.relation }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="符合条件人数">
            {{ form.conditionNumber }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其中低保人数">
            {{ form.personNumber }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="面积核准单价">
            {{ form.consumption && form.consumption.areaFee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="面积">
            {{ form.consumption && form.consumption.area }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="核准面积">
            {{ form.consumption && form.consumption.limitArea }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="超出面积">
            {{ form.consumption && form.consumption.overArea }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="超出面积单价">
            {{ form.consumption && form.consumption.overareaFee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业单价">
            {{ form.consumption && form.consumption.property }}
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="物业费">
            {{ form.consumption && form.consumption.propertyFee }}
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="押金">
            {{ form.consumption && form.consumption.deposit }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="水费">
            {{ form.consumption && form.consumption.waterFee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电费">
            {{ form.consumption && form.consumption.electricity }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="气费">
            {{ form.consumption && form.consumption.gasFee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="停车费">
            {{ form.consumption && form.consumption.carFee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="收回不符合条件疫情减免金额" label-width="auto" style="margin-left: 60px">
            {{ form.consumption && form.consumption.afee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="收回不符合条件租金" label-width="auto" style="margin-left: 60px">
            {{ form.consumption && form.consumption.bfee }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退租金" label-width="auto" style="margin-left: 60px">
            {{ form.consumption && form.consumption.cfee }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退物业费" label-width="auto" style="margin-left: 60px">
            {{ form.consumption && form.consumption.dfee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="优惠">
            {{ form.consumption && form.consumption.discount }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="合计待缴">
            {{ form.consumption && form.consumption.monthCost }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="备注">
            {{ form.remarks }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="支付开始时间">
            {{ form.payBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付结束时间">
            {{ form.payEndTime }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="后台人员修改时间" label-width="auto">
            {{ form.payEndTime }}
          </el-form-item>
        </el-col>
        <div />
        <el-col :span="12">
          <el-form-item label="操作人员记录">
            {{ form.updateUser }}
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="公共电梯费">
            {{ form.consumption&&form.consumption.liftFee }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共水费">
            {{ form.consumption&&form.consumption.gwaterFee }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共电费">
            {{ form.consumption&&form.consumption.electricityFee }}
          </el-form-item>
        </el-col> -->
      </el-form>
    </el-dialog>

    <!-- 新增 - 对话框 -->
    <el-dialog :title="title" :visible.sync="addVisable" width="70%" height="600px" top="5vh" :before-close="closeAdd">
      <el-form ref="form" :model="form1" :label-width="labelWidth" :rules="rules">
        <el-col :span="12">
          <el-form-item label="小区" prop="villageName">
            <el-input v-model="form1.villageName" placeholder="请输入小区名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼号" prop="buildNo">
            <el-input v-model="form1.buildNo" placeholder="请输入楼号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房号" prop="roomNo">
            <el-input v-model="form1.roomNo" placeholder="请输入房号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form1.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="number">
            <el-input v-model="form1.number" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="身份证号" prop="pid">
            <el-input v-model="form1.pid" placeholder="请输入身份证" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="户口所在地" prop="resident">
            <el-input v-model="form1.resident" placeholder="请输入户口所在地" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房屋类型" prop="guaranteeType">
            <el-select v-model="form1.guaranteeType" placeholder="请选择房屋类型">
              <!-- <el-option label="公共租赁住房" value="公共租赁住房" /> -->
              <!-- <el-option label="廉租住房" value="廉租住房" /> -->
              <el-option label="商品房" value="商品房" />
              <el-option label="安置房" value="安置房" />
              <!-- <el-option label="店面" value="店面" /> -->
              <!-- <el-option label="不符合条件" value="不符合条件" /> -->
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆类型" prop="car">
            <el-select v-model="form1.car" placeholder="请选择车辆类型">
              <el-option v-for="item in carOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="与房屋关系" prop="relation">
            <el-select v-model="form1.relation" placeholder="请选择与房屋关系">
              <el-option v-for="item in houseOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="符合条件人数" prop="conditionNumber">
            <el-input v-model="form1.conditionNumber" placeholder="符合条件人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其中低保人数" prop="personNumber">
            <el-input v-model="form1.personNumber" placeholder="请输入低保人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col v-if="form.consumption" :span="12">
          <el-form-item label="租金" prop="consumption.areaFee">
            <el-input v-model="form1.consumption.areaFee" placeholder="请输入租金" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="面积" prop="consumption.area">
            <el-input v-model="form1.consumption.area" placeholder="请输入面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="核准面积" prop="consumption.limitArea">
            <el-input v-model="form1.consumption.limitArea" placeholder="请输入核准面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="超出面积" prop="consumption.overArea">
            <el-input v-model="form1.consumption.overArea" placeholder="请输入超出面积" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="超出面积单价" prop="consumption.overareaFee">
            <el-input v-model="form1.consumption.overareaFee" placeholder="请输入超出面积单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业单价" prop="consumption.property">
            <el-input v-model.number="form1.consumption.property" placeholder="请输入物业单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业费" prop="consumption.propertyFee">
            <el-input v-model="form1.consumption.propertyFee" type="number" placeholder="请输入物业费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="押金" prop="consumption.deposit">
            <el-input v-model="form1.consumption.deposit" type="number" placeholder="请输入押金" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="公摊水费" prop="consumption.waterFee">
            <el-input v-model.number="form1.consumption.waterFee" type="number" placeholder="请输入水费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="公摊电费" prop="consumption.electricity">
            <el-input v-model="form1.consumption.electricity" type="number" placeholder="请输入电费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="气费" prop="consumption.gasFee">
            <el-input v-model="form1.consumption.gasFee" type="number" placeholder="请输入气费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="停车费" prop="consumption.carFee">
            <el-input v-model="form1.consumption.carFee" type="number" placeholder="请输入停车费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其他费用" prop="otherFee">
            <el-input v-model="form1.consumption.otherFee" type="number" placeholder="请输入其他费用" />
          </el-form-item>
        </el-col>

        <!-- TODO 车位号接口 -->
        <el-col :span="12">
          <el-form-item label="车位号1" prop="parking1">
            <el-input v-model="form1.consumption.parking1" type="number" placeholder="请输入车位号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车位号2" prop="parking2">
            <el-input v-model="form1.consumption.parking2" type="number" placeholder="请输入车位号" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item type="number" label="收回不符合条件疫情减免金额" label-width="auto" style="margin-left: 60px" prop="consumption.afee">
            <el-input v-model="form1.consumption.afee" type="number" placeholder="请输入收回不符合条件疫情减免金额" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="收回不符合条件租金" label-width="auto" style="margin-left: 60px" prop="consumption.bfee">
            <el-input v-model="form1.consumption.bfee" type="number" placeholder="请输入收回不符合条件租金" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="应收应退租金" label-width="auto" style="margin-left: 60px" prop="consumption.cfee">
            <el-input v-model="form1.consumption.cfee" type="number" placeholder="请输入应收应退租金" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item type="number" label="应收应退物业费" label-width="auto" style="margin-left: 60px" prop="consumption.dfee">
            <el-input v-model="form1.consumption.dfee" type="number" placeholder="请输入应收应退物业费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="优惠" prop="consumption.discount">
            <el-input v-model="form1.consumption.discount" type="number" placeholder="请输入优惠" />
          </el-form-item>
        </el-col>

        <div style="display: inline-block; margin-bottom: 20px; width: 50%">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form1.remarks" placeholder="请输入备注" />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="submit">{{ btn }}</el-button>
      </div>
    </el-dialog>

    <!-- Excel按需导出 - 对话框 -->
    <el-dialog title="导出选项" :visible.sync="exportVisable" width="70%" height="600px" top="5vh">
      <el-checkbox-group v-model="checkField">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
      </el-checkbox-group>

      <div slot="footer">
        <el-button size="small" @click="cancelExport">取 消</el-button>
        <download-excel class="export-excel-wrapper" :data="list" :fields="excelFields" name="房屋信息表.xls">
          <el-button type="success" size="small" @click="showExport">导出excel</el-button>
        </download-excel>
      </div>
    </el-dialog>

    <Pagination :total="total" :page.sync="page" :page-size="pageSize" @change="changePage" />

    <!-- 底栏月份切换 -->
    <div style="padding: 20px" class="pagePosition">
      <el-row>
        <el-button size="medium" type="primary" style="width: 100px" @click="backMouth">上一月</el-button>
        当前{{ month }}月
        <el-button size="medium" type="primary" style="width: 100px" @click="nextMouth">下一月</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getList, deleteRow, updateRow, addRow } from "@/api/buildinfo";
import Pagination from "@/components/Pagination/index.vue";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      month: 1,
      list: [],
      tableVisable: false,
      form: {
        consumption: {},
      },
      labelWidth: "120px",
      form1: {
        buildNo: "",// 楼号
        car: "",
        conditionNumber: "",
        guaranteeType: "",
        name: "",
        number: "",
        personNumber: "",
        pid: "",
        remarks: "",
        resident: "",
        roomNo: "",// 房号
        villageName: "",// 小区
        relation: "",
        payStatus: "", // TODO 新增字段
        choiceDate: "", // 选择的日期
        consumption: {
          afee: 0, //收回不符合条件疫情减免金额
          area: "",
          areaFee: 0, // 面积核准单价（租金）
          bfee: 0, //收回不符合条件租金
          carFee: 0, // 停车费
          cfee: 0, //应收应退租金
          deposit: 0, //押金
          dfee: 0, //应收应退物业费
          discount: "",
          electricity: 0, //公摊电费
          gasFee: 0, //气费
          limitArea: "",
          monthCost: "",
          overArea: "",
          overareaFee: 0, // 超出面积单价
          property: 0, //物业单价
          propertyFee: 0, //物业费
          waterFee: 0, //公摊水费
          parking1: "", // 停车位 1   // TODO 后台添加字段 
          parking2: "", // 停车位 2   // TODO 后台添加字段
          otherFee: 0, // 其他费用    // TODO 后台添加字段
        },
      },
      addVisable: false,
      exportVisable: false, // 导出
      checkField:[],    // 选择导出的字段
      total: 0,
      page: 1,
      pageSize: 5,
      title: "",
      btn: "",
      // 缴交状态
      payStateOption: [
        {
          id:0,
          value: "已缴交",
          label: "已缴交",
        },
        {
          id:1,
          value: "未缴交",
          label: "未缴交",
        },
      ],
      carOption: [
        {
          value: "汽车",
          label: "汽车",
        },
        {
          value: "摩托车",
          label: "摩托车",
        },
      ],
      // 与房屋关系
      houseOption: [
        {
          value: "户主",
          label: "户主",
        },
        {
          value: "租户",
          label: "租户",
        },
      ],
      rules: {
        villageName: [
          { required: true, message: "请输入小区名", trigger: "blur" },
        ],
        buildNo: [{ required: true, message: "请输入楼号", trigger: "blur" }],
        roomNo: [{ required: true, message: "请输入房号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        number: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
        ],
        //#region
        // pid: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
        // resident: [
        //   { required: true, message: "请输入户口所在地", trigger: "blur" },
        // ],
        // guaranteeType: [
        //   { required: true, message: "请输入保障类型", trigger: "blur" },
        // ],
        // car: [{ required: true, message: "请输入车辆型号", trigger: "blur" }],
        // conditionNumber: [
        //   { required: true, message: "请输入符合条件人数", trigger: "blur" },
        // ],
        // personNumber: [
        //   { required: true, message: "请输入其中低保人数", trigger: "blur" },
        // ],
        // relation: [
        //   { required: true, message: "请输入其中低保人数", trigger: "blur" },
        // ],
        // "consumption.areaFee": [
        //   { required: true, message: "请输入面积核准单价", trigger: "blur" },
        // ],
        // "consumption.area": [
        //   { required: true, message: "请输入面积", trigger: "blur" },
        // ],
        // "consumption.limitArea": [
        //   { required: true, message: "请输入核准面积", trigger: "blur" },
        // ],
        // "consumption.overArea": [
        //   { required: true, message: "请输入超出面积", trigger: "blur" },
        // ],
        // "consumption.overareaFee": [
        //   { required: true, message: "请输入超出面积单价", trigger: "blur" },
        // ],
        // "consumption.property": [
        //   { required: true, message: "请输入物业单价", trigger: "blur" },
        // ],
        // "consumption.propertyFee": [
        //   { required: true, message: "请输入物业费", trigger: "blur" },
        // ],
        // "consumption.deposit": [
        //   { required: true, message: "请输入押金", trigger: "blur" },
        // ],
        // "consumption.waterFee": [
        //   { required: true, message: "请输入水费", trigger: "blur" },
        // ],
        // "consumption.electricity": [
        //   { required: true, message: "请输入电费", trigger: "blur" },
        // ],
        // "consumption.gasFee": [
        //   { required: true, message: "请输入气费", trigger: "blur" },
        // ],
        // "consumption.carFee": [
        //   { required: true, message: "请输入停车费", trigger: "blur" },
        // ],
        // "consumption.afee": [
        //   {
        //     required: true,
        //     message: "请输入收回不符合条件疫情减免金额",
        //     trigger: "blur",
        //   },
        // ],
        // "consumption.bfee": [
        //   {
        //     required: true,
        //     message: "请输入收回不符合条件租金",
        //     trigger: "blur",
        //   },
        // ],
        // "consumption.cfee": [
        //   { required: true, message: "请输入应收应退租金", trigger: "blur" },
        // ],
        // "consumption.dfee": [
        //   { required: true, message: "请输入应收应退物业费", trigger: "blur" },
        // ],
        // "consumption.discount": [
        //   { required: true, message: "请输入优惠", trigger: "blur" },
        // ],
        //#endregion
      },

      // Excel导出配置
      excelFields: {
        小区名称: "villageName",
        小区楼号: "buildNo",
        小区房号: "roomNo",
        姓名: "name",
        手机号码: "number",
        身份证: "pid",
        户口所在地: "resident",
        保障类型: "guaranteeType",
        车辆型号: "car",
        与房屋关系: "relation",
        符合条件人数: "conditionNumber",
        其中低保人数: "personNumber",
        面积核准单价: "areaFee",
        核准面积: "limitArea",
        超出面积: "overArea",
        超出面积单价: "overareaFee",
        物业单价: "property",
        物业费: "propertyFee ",
        押金: "deposit",
        公摊水费: "waterFee",
        公摊电费: "electricity",
        气费: "gasFee",
        停车费: "carFee",
        车位号1: "parking1",
        车位号2: "parking2",
        其他费用: "otherFee",
        收回不符合条件疫情减免金额: "afee",
        收回不符合条件租金: "bfee",
        应收应退租金: "cfee",
        应收应退物业费: "dfee",
        优惠: "discount",
        备注: "remarks",

        支付开始时间: "payBeginTime",
        支付结束时间: "payEndTime",
        操作人员记录: "updateUser",
        订单号: "orderNo",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm() {
      this.$refs["form"].resetFields();
    },
    backMouth() {
      if (this.month <= 1) {
        return this.$message.error("已经最小月份" + this.month + "月了");
      } else {
        this.month--;
        this.getList();
      }
    },
    nextMouth() {
      if (this.month >= 12) {
        return this.$message.error("已经最大月份" + this.month + "月了");
      } else {
        this.month++;
        this.getList();
      }
    },

    async getList() {
      const res = await getList({
        pageNum: this.page,
        month: this.month,
      });
      console.log(res);
      this.list = res.data.data.list;
      this.total = res.data.data.total;
    },
    showDetail(row) {
      this.tableVisable = true;
      this.form = row;
      console.log(row);
    },
    closeDialog() {
      this.tableVisable = false;
    },
    closeAdd() {
      (this.form1 = {
        buildNo: "",
        car: "",
        conditionNumber: "",
        guaranteeType: "",
        name: "",
        number: "",
        personNumber: "",
        pid: "",
        remarks: "",
        resident: "",
        roomNo: "",
        villageName: "",
        relation: "",
        consumption: {
          afee: "",
          area: "",
          areaFee: "",
          bfee: "",
          carFee: "",
          cfee: "",
          deposit: "",
          dfee: "",
          discount: "",
          electricity: "",
          gasFee: "",
          limitArea: "",
          monthCost: "",
          overArea: "",
          overareaFee: "",
          property: "",
          propertyFee: "",
          waterFee: "",
          payinfoId: "",
          buildId: "",
        },
      }),
        (this.addVisable = false);
    },
    showAdd() {
      this.title = "新增";
      this.btn = "新 增";
      this.addVisable = true;
    },
    showChange(row) {
      this.title = "修改";
      this.btn = "修 改";
      this.form1.villageName = row.villageName;
      this.form1.buildNo = row.buildNo;
      this.form1.roomNo = row.roomNo;
      this.form1.name = row.name;
      this.form1.pid = row.pid;
      this.form1.number = row.number;
      this.form1.guaranteeType = row.guaranteeType;
      this.form1.car = row.car;
      this.form1.resident = row.resident;
      this.form1.conditionNumber = row.conditionNumber;
      this.form1.personNumber = row.personNumber;
      this.form1.consumption.areaFee = row.consumption.areaFee;
      this.form1.consumption.area = row.consumption.area;
      this.form1.relation = row.relation;
      this.form1.consumption.limitArea = row.consumption.limitArea;
      this.form1.consumption.overArea = row.consumption.overArea;
      this.form1.consumption.overareaFee = row.consumption.overareaFee;
      this.form1.consumption.property = row.consumption.property;
      this.form1.consumption.propertyFee = row.consumption.propertyFee;
      this.form1.consumption.deposit = row.consumption.deposit;
      this.form1.consumption.waterFee = row.consumption.waterFee;
      this.form1.consumption.electricity = row.consumption.electricity;
      this.form1.consumption.gasFee = row.consumption.gasFee;
      this.form1.consumption.carFee = row.consumption.carFee;
      this.form1.consumption.afee = row.consumption.afee;
      this.form1.consumption.bfee = row.consumption.bfee;
      this.form1.consumption.cfee = row.consumption.cfee;
      this.form1.consumption.dfee = row.consumption.dfee;
      this.form1.consumption.discount = row.consumption.discount;
      this.form1.consumption.buildId = row.consumption.buildId;
      this.form1.payinfoId = row.payinfoId;
      this.form1.remarks = row.remarks;
      this.addVisable = true;
    },
    submit() {
      // console.log(this.form)
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.form1.consumption.monthCost =
            Number(this.form1.consumption.limitArea) *
              Number(this.form1.consumption.areaFee) +
            Number(this.form1.consumption.overArea) *
              Number(this.form1.consumption.overareaFee) +
            Number(this.form1.consumption.property) *
              Number(this.form1.consumption.area) +
            // Number(this.form1.consumption.deposit) +
            Number(this.form1.consumption.afee) +
            Number(this.form1.consumption.bfee) +
            Number(this.form1.consumption.cfee) +
            Number(this.form1.consumption.dfee) +
            Number(this.form1.consumption.discount) +
            Number(this.form1.consumption.electricity) +
            Number(this.form1.consumption.carFee) +
            Number(this.form1.consumption.gasFee) +
            Number(this.form1.consumption.waterFee);
          if (this.title === "修改") {
            await updateRow(this.form1).then(
              (res) => {
                this.$message({
                  type: "success",
                  message: res.data.data,
                });
              },
              (err) => {
                this.$message({
                  type: "error",
                  message: res.data.data,
                });
              }
            );
            this.closeAdd();
          } else {
            // console.log(this.form1)
            await addRow(this.form1).then(
              (res) => {
                this.$message({
                  type: "success",
                  message: res.data.data,
                });
              },
              (err) => {
                this.$message({
                  type: "error",
                  message: res.data.data,
                });
              }
            );
            this.closeAdd();
          }
          this.getList();
          // console.log(this.form1.relation)
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$refs["form"].resetFields();
      this.addVisable = false;
    },
    async deleteRow(row) {
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteRow({
            payinfoId: row.payinfoId,
            orderNo: row.orderNo,
          }).then(
            (res) => {
              this.$message({
                type: "success",
                message: res.data.data,
              });
            },
            (err) => {
              this.$message({
                type: "error",
                message: res.data.data,
              });
            }
          );
          // console.log(results)
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 导入 Excel
    uploadExcel() {
      this.$router.push("/excel");
    },
    // 导出 Excel
    showExport() {
      this.exportVisable = true;
    },
    // 导出Excel - 对话框 - 取消
    cancelExport() {
      this.exportVisable = false;
    },

    // 重置
    reset(){
      console.log('reset')
      console.log(this.form1);
      this.form1.villageName = ""
      this.form1.buildNo = ""
      this.form1.payStatus = ""
      this.list.name = ""


    },
    // 筛选
    search(){
      console.log('search')
      this.getList()
    },

    changePage() {
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  height: 90vh;
  overflow: auto;
}

.pagePosition {
  padding: 20px;
  display: flex;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
</style>
