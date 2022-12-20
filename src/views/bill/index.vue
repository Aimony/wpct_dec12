<template>
  <div class="app-container">

    <div class="header">
      <!-- 顶栏区域 -->
      <el-row :gutter="20" style="margin-bottom:20px">
        <el-col :span="3">
          <el-select v-model="searchData.buildNo" placeholder="请选择楼号">
            <el-option v-for="item in list" :key="item.pid" :label="item.buildNo" :value="item.pid">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="searchData.roomNo" placeholder="请选择房号">
            <el-option v-for="item in list" :key="item.pid" :label="item.roomNo" :value="item.pid">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-input v-model="searchData.orderNo" placeholder="请输入订单号"></el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="searchData.name" placeholder="请输入缴费人姓名"></el-input>
        </el-col>

        <el-col :span="5">
          <div class="block">
            <el-date-picker v-model="searchData.choiceDate" type="date" placeholder="选择日期">
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
    </div>

    <!--    展示列表  v-premission="'bill:list'"-->
    <el-table :data="list" v-loading="listLoading" highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template v-slot:="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column align="center" prop="orderNo" label="订单号" width="270" />
      <el-table-column align="center" prop="roomNo" label="小区楼号房号" width="160" />
      <el-table-column align="center" prop="payEndTime" label="处理时间" width="160" />
      <el-table-column align="center" prop="consumption.monthCost" label="缴费金额" width="160" />
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-tickets" @click="showDetail(scope.row)" v-premission="'bill:list'">查看</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="showChange(scope.row)" v-premission="'bill:update'">修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="deleteBill(scope.row)" v-premission="'bill:remove'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" :page.sync="page" :page-size="pageSize" @change="changePage" />
    <!--    分页器-->
    <div style="padding: 20px" class="pagePosition">
      <el-row>
        <el-button size="medium" type="primary" style="width: 100px" @click="pop.add = true" v-premission="' bill:add'">
          新增</el-button>&nbsp;
        <el-button size="medium" type="primary" style="width: 100px" @click="backMouth">上一月</el-button>
        当前{{ month }}月
        <el-button size="medium" type="primary" style="width: 100px" @click="nextMouth">下一月</el-button>
        <el-button size="medium" type="primary" style="width: 100px" @click="this.getlist">刷新</el-button>
      </el-row>
    </div>
    <!--    详情对话框-->
    <el-dialog title="详情" :visible.sync="pop.show" width="70%" modal-append-to-body>
      <el-form :model="form" ref="show">
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

        <el-col :span="12">
          <el-form-item label="物业费">
            {{ form.consumption && form.consumption.propertyFee }}
          </el-form-item>
        </el-col>

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
          <el-form-item label="收回不符合条件疫情减免金额" label-width="auto">
            {{ form.consumption && form.consumption.afee }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="收回不符合条件租金" label-width="auto">
            {{ form.consumption && form.consumption.bfee }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退租金" label-width="auto">
            {{ form.consumption && form.consumption.cfee }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退物业费" label-width="auto">
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

        <el-col :span="12">
          <el-form-item label="操作人员记录">
            {{ form.updateUser }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共电梯费">
            {{ form.consumption && form.consumption.liftFee }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共水费">
            {{ form.consumption && form.consumption.gwaterFee }}
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pop.show = false">取 消</el-button>
        <el-button type="primary" @click="pop.show = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--   新增 -->
    <el-dialog title="新增" :visible.sync="pop.add" width="80%" :before-close="closeDialog">
      <el-form ref="formAdd" :model="form" :label-width="labelWidth">
        <el-col :span="12">
          <el-form-item label="小区" prop="villageName">
            <el-input v-model="form.villageName" placeholder="请输入小区名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼号" prop="buildNo">
            <el-input v-model="form.buildNo" placeholder="请输入楼号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房号" prop="roomNo">
            <el-input v-model="form.roomNo" placeholder="请输入房号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号" prop="pid">
            <el-input v-model="form.pid" placeholder="请输入身份证" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="number">
            <el-input v-model="form.number" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="户口所在地" prop="resident">
            <el-input v-model="form.resident" placeholder="请输入户口所在地" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="保障类型" prop="guaranteeType">
            <el-select v-model="form.guaranteeType" placeholder="请选择保障类型">
              <el-option label="公共租赁住房" value="公共租赁住房" />
              <el-option label="廉租住房" value="廉租住房" />
              <el-option label="商品住房" value="商品住房" />
              <el-option label="安置住房" value="安置住房" />
              <el-option label="店面" value="店面" />
              <el-option label="不符合条件" value="不符合条件" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆类型" prop="car">
            <el-select v-model="form.car" placeholder="请选择车辆类型">
              <el-option v-for="item in carOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="与房屋关系" prop="relation">
            <el-select v-model="form.relation" placeholder="请选择与房屋关系">
              <el-option v-for="item in houseOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="符合条件人数" prop="conditionNumber">
            <el-input v-model="form.conditionNumber" placeholder="符合条件人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其中低保人数" prop="personNumber">
            <el-input v-model="form.personNumber" placeholder="请输入低保人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col v-if="form.consumption" :span="12">
          <el-form-item label="面积核准单价" prop="consumption.areaFee">
            <el-input v-model="form.consumption.areaFee" placeholder="请输入面积核准单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="面积" prop="consumption.area">
            <el-input v-model="form.consumption.area" placeholder="请输入面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="核准面积" prop="consumption.limitArea">
            <el-input v-model="form.consumption.limitArea" placeholder="请输入核准面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="超出面积" prop="consumption.overArea">
            <el-input v-model="form.consumption.overArea" placeholder="请输入超出面积" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="超出面积单价" prop="consumption.overareaFee">
            <el-input v-model="form.consumption.overareaFee" placeholder="请输入超出面积单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业单价" prop="consumption.property">
            <el-input v-model="form.consumption.property" placeholder="请输入物业单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业费" prop="consumption.propertyFee">
            <el-input v-model="form.consumption.propertyFee" type="number" placeholder="请输入物业费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="押金" prop="consumption.deposit">
            <el-input v-model="form.consumption.deposit" type="number" placeholder="请输入押金" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="水费" prop="consumption.waterFee">
            <el-input v-model="form.consumption.waterFee" type="number" placeholder="请输入水费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电费" prop="consumption.electricity">
            <el-input v-model="form.consumption.electricity" type="number" placeholder="请输入电费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="气费" prop="consumption.gasFee">
            <el-input v-model="form.consumption.gasFee" type="number" placeholder="请输入气费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="停车费" prop="consumption.carFee">
            <el-input v-model="form.consumption.carFee" type="number" placeholder="请输入停车费" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item type="number" label="收回不符合条件疫情减免金额" label-width="auto" prop="consumption.afee">
            <el-input v-model="form.consumption.afee" type="number" placeholder="请输入收回不符合条件疫情减免金额" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="收回不符合条件租金" label-width="auto" prop="consumption.bfee">
            <el-input v-model="form.consumption.bfee" type="number" placeholder="请输入收回不符合条件租金" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退租金" label-width="auto" prop="consumption.cfee">
            <el-input v-model="form.consumption.cfee" type="number" placeholder="请输入应收应退租金" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item type="number" label="应收应退物业费" label-width="auto" prop="consumption.dfee">
            <el-input v-model="form.consumption.dfee" type="number" placeholder="请输入应收应退物业费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共电梯费" prop="consumption.liftFee">
            <!-- {{ form.consumption && form.consumption.liftFee }} -->
            <el-input v-model="form.consumption.liftFee" type="number" placeholder="请输入公共电梯费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共水费" prop="consumption.gwaterFee">
            <!-- {{ form.consumption && form.consumption.gwaterFee }} -->
            <el-input v-model="form.consumption.gwaterFee" type="number" placeholder="请输入公共水费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="优惠" prop="consumption.discount">
            <el-input v-model="form.consumption.discount" type="number" placeholder="请输入优惠" />
          </el-form-item>
        </el-col>

        <!-- <template>
          <div>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </div>
        </template> -->
        <div style="display: inline-block; margin-bottom: 20px; width: 50%">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注" />
          </el-form-item>
        </div>
        <!-- <el-col :span="12">
          <div>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </div>
        </el-col> -->
      </el-form>
      <span slot="footer">
        <el-button @click="pop.add = false">取 消</el-button>
        <el-button type="primary" @click="submit('formAdd')">添加</el-button>
      </span>
    </el-dialog>
    <!--    缴费明细 - ？？？-->
    <el-dialog title="修改" :visible.sync="pop.update" width="75%" :before-close="closeDialog">
      <el-form ref="formUpdate" :model="form" :label-width="labera">
        <el-col :span="12">
          <el-form-item label="小区" prop="villageName">
            <el-input v-model="form.villageName" placeholder="请输入小区名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼号" prop="buildNo">
            <el-input v-model="form.buildNo" placeholder="请输入楼号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房号" prop="roomNo">
            <el-input v-model="form.roomNo" placeholder="请输入房号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号" prop="pid">
            <el-input v-model="form.pid" placeholder="请输入身份证" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="number">
            <el-input v-model="form.number" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="户口所在地" prop="resident">
            <el-input v-model="form.resident" placeholder="请输入户口所在地" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="保障类型" prop="guaranteeType">
            <el-select v-model="form.guaranteeType" placeholder="请选择保障类型">
              <el-option label="公共租赁住房" value="公共租赁住房" />
              <el-option label="廉租住房" value="廉租住房" />
              <el-option label="商品住房" value="商品住房" />
              <el-option label="安置住房" value="安置住房" />
              <el-option label="店面" value="店面" />
              <el-option label="不符合条件" value="不符合条件" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆类型" prop="car">
            <el-select v-model="form.car" placeholder="请选择车辆类型">
              <el-option v-for="item in carOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="与房屋关系" prop="relation">
            <el-select v-model="form.relation" placeholder="请选择与房屋关系">
              <el-option v-for="item in houseOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="符合条件人数" prop="conditionNumber">
            <el-input v-model="form.conditionNumber" placeholder="符合条件人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其中低保人数" prop="personNumber">
            <el-input v-model="form.personNumber" placeholder="请输入低保人数" type="number" />
          </el-form-item>
        </el-col>

        <el-col v-if="form.consumption" :span="12">
          <el-form-item label="面积核准单价" prop="consumption.areaFee">
            <el-input v-model="form.consumption.areaFee" placeholder="请输入面积核准单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="面积" prop="consumption.area">
            <el-input v-model="form.consumption.area" placeholder="请输入面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="核准面积" prop="consumption.limitArea">
            <el-input v-model="form.consumption.limitArea" placeholder="请输入核准面积" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="超出面积" prop="consumption.overArea">
            <el-input v-model="form.consumption.overArea" placeholder="请输入超出面积" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="超出面积单价" prop="consumption.overareaFee">
            <el-input v-model="form.consumption.overareaFee" placeholder="请输入超出面积单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业单价" prop="consumption.property">
            <el-input v-model="form.consumption.property" placeholder="请输入物业单价" type="number" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物业费" prop="consumption.propertyFee">
            <el-input v-model="form.consumption.propertyFee" type="number" placeholder="请输入物业费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="押金" prop="consumption.deposit">
            <el-input v-model="form.consumption.deposit" type="number" placeholder="请输入押金" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="水费" prop="consumption.waterFee">
            <el-input v-model="form.consumption.waterFee" type="number" placeholder="请输入水费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电费" prop="consumption.electricity">
            <el-input v-model="form.consumption.electricity" type="number" placeholder="请输入电费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="气费" prop="consumption.gasFee">
            <el-input v-model="form.consumption.gasFee" type="number" placeholder="请输入气费" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="停车费" prop="consumption.carFee">
            <el-input v-model="form.consumption.carFee" type="number" placeholder="请输入停车费" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item type="number" label="收回不符合条件疫情减免金额" label-width="auto" prop="consumption.afee">
            <el-input v-model="form.consumption.afee" type="number" placeholder="请输入收回不符合条件疫情减免金额" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="收回不符合条件租金" label-width="auto" prop="consumption.bfee">
            <el-input v-model="form.consumption.bfee" type="number" placeholder="请输入收回不符合条件租金" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="应收应退租金" label-width="auto" prop="consumption.cfee">
            <el-input v-model="form.consumption.cfee" type="number" placeholder="请输入应收应退租金" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item type="number" label="应收应退物业费" label-width="auto" prop="consumption.dfee">
            <el-input v-model="form.consumption.dfee" type="number" placeholder="请输入应收应退物业费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共电梯费" prop="consumption.liftFee">
            <el-input v-model="form.consumption.liftFee" type="number" placeholder="请输入公共电梯费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共水费" prop="consumption.gwaterFee">
            <el-input v-model="form.consumption.gwaterFee" type="number" placeholder="请输入公共水费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠" prop="consumption.discount">
            <el-input v-model="form.consumption.discount" type="number" placeholder="请输入优惠" />
          </el-form-item>
        </el-col>
        <div style="display: inline-block; margin-bottom: 20px; width: 50%">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注" />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button @click="pop.update = false">取 消</el-button>
        <el-button type="primary" @click="upadteBill('formUpdate')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get } from 'js-cookie';
import {
  getBillListAPI,
  deleteBillAPI,
  addBillItem,
  updateBillItem,
} from "../../api/bill";
import Pagination from "../../components/Pagination";
export default {
  name: "index",
  components: {
    Pagination,
  },
  data() {
    return {
      labelWidth: "80px",
      pop: {
        show: false,
        add: false,
        update: false,
      },
      labera: "80px",
      month: 1,
      total: 0,
      pageSize: 10,
      page: 1,
      // currentPage3: 1,
      detailDialogVisible: false,
      list: [], //表格的数据
      listLoading: false, //数据加载等待动画
      // 搜索数据
      searchData: {
        name: "",
        orderNo: "", // 订单号
        buildNo: "",
        roomNo: "",
        handleTime: "", // 处理时间
      },
      form: {
        //表单
        buildNo: "",
        car: "",
        conditionNumber: "",
        guaranteeType: "", //
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
          gwaterFee: 0,
          liftFee: 0,
        },
      },
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
      houseOption: [
        {
          value: "户主",
          label: "户主",
        },
        {
          value: "亲属",
          label: "亲属",
        },
        {
          value: "租户",
          label: "租户",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    // 获取列表
    async getlist() {
      this.listLoading = true;
      const { data } = await getBillListAPI({
        pageNum: this.page,
        month: this.month,
      });
      console.log(data);
      this.listLoading = false;
      this.list = data.data.list;
      this.total = data.data.total;
    },
    //删除
    deleteBill(row) {
      console.log(row);
      this.$confirm("是否删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteBillAPI({
            payinfoId: row.payinfoId,
            orderNo: row.orderNo,
          }).then(
            (res) => {
              this.getlist();
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
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    //查看
    showDetail(row) {
      this.form = { ...row };
      this.pop.show = true;
    },
    //新增
    submit(e) {
      console.log(e);
      addBillItem(this.form).then(
        (res) => {
          this.getlist();
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
      this.pop.add = false;
      // console.log(this.form)
      this.$refs[e].resetFields();
    },
    //修改
    upadteBill(e) {
      updateBillItem(this.form).then(
        (res) => {
          this.getlist();
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
      this.pop.update = false;
      this.$refs[e].resetFields();
    },
    changePage() {
      this.getlist();
    },
    closeDialog() {
      this.pop.show = false;
      this.pop.add = false;
      this.pop.update = false;
    },
    //上一个月
    nextMouth() {
      if (this.month >= 12) {
        return this.$message.error("已经最大月份" + this.month + "月了");
      } else {
        this.month++;
        this.getlist();
      }
    },
    //下一个月
    backMouth() {
      if (this.month <= 1) {
        return this.$message.error("已经最小月份" + this.month + "月了");
      } else {
        this.month--;
        this.getlist();
      }
    },
    showChange(row) {
      this.form = { ...row };
      this.pop.update = true;
    },
    // TODO 重置 
    reset() {
      this.searchData.name = "",
      this.searchData.orderNo = "",
      this.searchData.buildNo = "",
      this.searchData.roomNo = "",
      this.searchData.handleTime = ""
      this.getlist()
    },
    // TODO 搜索
    search() {
      this.getlist()
    },
  },
};
</script>
<style>
.pagePosition {
  padding: 20px;
  display: flex;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
</style>