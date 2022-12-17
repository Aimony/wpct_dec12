<template>
  <div>
    <!-- v-premission="'shenpi:list'" -->
    <el-table :data="stuList" style="width: 100%">
      <el-table-column align="center" prop="buildInfo[0].villageName" label="小区" width="180" />

      <el-table-column align="center" prop="examineMsg" label="意见信息" width="400" />
      <el-table-column align="center" prop="examineStatus" label="处理状态" width="100" />
      <el-table-column align="center" prop="commitTime" label="提交时间" width="220" />

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-tickets" v-premission="'shenpi:list'"
            @click="checkAll(scope.row)">
            查看</el-button>
          <el-button type="text" size="small" icon="el-icon-position" v-premission="'shenpi:update'"
            @click="settleSuggestion(scope.row)">处理
          </el-button>
          <el-button type="text" size="small" icon="el-icon-document-checked" v-premission="'shenpi:update'"
            @click="approvalSuggestion(scope.row)">审批
          </el-button>
          <el-button type="text" size="small" icon="el-icon-delete" v-premission="'shenpi:remove'"
            @click="deleteSuggestion(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination layout="total,prev, pager, next" style="text-align: center" :total="total"
      @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-size="pageSize" />

    <settleDialog :dialog-visible.sync="dialogVisible" @submitSettle="submitSettle" />

    <el-dialog title="详情" :visible.sync="tableVisable" width="55%" height="550px" :before-close="closeDialog">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="12">
          <el-form-item label="小区">{{
              buildInfo && buildInfo.villageName
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼号">{{
              buildInfo && buildInfo.buildNo
          }}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房号">{{
              buildInfo && buildInfo.roomNo
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与房屋的关系" label-width="auto">{{
              buildInfo && buildInfo.relation
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" />
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号码" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="意见信息">{{ curInfo.examineMsg }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理状态">{{
              curInfo.examineStatus
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理时间">{{
              curInfo.examineTime
          }}</el-form-item>
        </el-col>
        <el-form-item label="提交时间">{{ curInfo.commitTime }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/request'
import settleDialog from '@/views/suggestion/component/settleDialog'
import Pagination from '@/components/Pagination'
export default {
  components: {
    settleDialog,
    Pagination,
  },
  data() {
    return {
      stuList: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      List: [],
      curInfo: {},
      buildInfo: {},
      dialogVisible: false,
      tableVisable: false,
      form: {
        id: '',
        openid: '',
        resolveMsg: '',
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCurrentChange(e) {
      console.log(e)
      this.stuList = this.List.slice(
        (this.pageNum - 1) * 5,
        (this.pageNum - 1) * 5 + 5
      )
    },
    getList() {
      api({
        url: '/examine/list',
        methods: 'get',
      }).then((data) => {
        this.List = data.data.data
        this.total = data.data.data.length
        console.log(this.total)
        this.stuList = this.List.slice(
          (this.pageNum - 1) * 5,
          (this.pageNum - 1) * 5 + 5
        )
        console.log(this.List)
      })
    },
    settleSuggestion(row) {
      this.dialogVisible = true
      this.form.openid = row.openid
      this.form.id = row.id
    },
    submitSettle(msg) {
      this.form.resolveMsg = msg
      api({
        url: '/examine/solu',
        method: 'post',
        params: this.form,
      }).then((data) => {
        this.$message({
          type: 'success',
          message: '处理成功!',
        })
        this.form = {
          id: '',
          openid: '',
          resolveMsg: '',
        }
      })
    },
    deleteSuggestion(row) {
      this.$confirm('是否确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api({
            url: '/examine/remove',
            method: 'get',
            params: {
              id: row.id,
            },
          }).then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    approvalSuggestion(row) {
      api({
        url: '/examine/wxlist',
        method: 'post',
        data: {
          openid: row.openid,
        },
      }).then((data) => {
        this.$message({
          type: 'success',
          message: '审批成功!',
        })
      })
    },
    checkAll(row) {
      this.tableVisable = true
      this.curInfo = row
      this.buildInfo = row.buildInfo[0]
      // console.log(this.curInfo)
    },
    closeDialog() {
      this.tableVisable = false
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
