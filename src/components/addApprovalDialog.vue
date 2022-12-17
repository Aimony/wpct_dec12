<template>
  <div>
    <el-dialog
      title="新增"
      width="50%"
      :visible.sync="addApprovalDialogVisible"
     >



      <el-table :data="suggestionList" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
      </el-table>




      <el-form ref="form" :model="form" label-width="80px">
        <el-card class="box-card">
          <el-col :span="6">
            <el-form-item label="小区楼号" >
              <el-input v-model="input" placeholder="请输入小区楼号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小区房号" >
              <el-input v-model="input" placeholder="请输入小区房号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="与房屋的关系" >
              <el-input v-model="input" placeholder="请选择与房屋的关系"></el-input>
            </el-form-item>
          </el-col>
        </el-card>

        <el-card class="box-card">
          <el-col :span="6">
            <el-form-item label="姓名" >
              <el-input v-model="input" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" >
              <el-input v-model="input" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="与房屋的关系" >
              <el-input v-model="input" placeholder="请选择与房屋的关系"></el-input>
            </el-form-item>
          </el-col>
        </el-card>



        <el-col :span="6">
          <el-form-item label="与房屋的关系" >
            <el-input v-model="input" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-form>











      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addApprovalDialog",
  props: {
    // addApprovalDialogVisible 是否显示对话框
    addApprovalDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      suggestionList: []      // 初始化表格
    }
  },
  // todo 添加对话框bug
  methods: {
    cancel(){
      this.$emit('update:addApprovalDialogVisible', false)     // 触发父组件的 visible，并更新为false
    },
    determine(){
      this.$emit('update:addApprovalDialogVisible', false)
    },


    // addApprovalDialogVisible(){
    //   this.$emit("update:addApprovalDialogVisible", false)
    // }
  }
}
</script>

<style scoped>

</style>
