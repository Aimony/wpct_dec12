<template>
  <div>
    <div style="margin: 10px">
      <el-button
        type="primary"
        @click="addRow"
        v-premission="'pooled:add'"
        style="width: 100px; margin: 10px"
        >新增</el-button
      >
    </div>
    <div style="margin: 10px">
      <el-table
        :data="list"
        style="width: 100%;"
        v-premission="'list'"
        border
        fit
        highlight-current-row
        height="500px"
      >
        <el-table-column align="center" prop="id" label="id" width="220" />
        <el-table-column
          align="center"
          prop="villageName"
          label="小区名称"
          width="220"
        />
        <el-table-column
          align="center"
          prop="liftFee"
          label="公共电梯费"
          width="220"
        />

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              v-premission="'pooled:remove'"
              @click="deleteRow(scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-tickets"
              @click="changeRow(scope.row)"
              v-premission="'pooled:update'"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="closeDialog"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="小区名称" label-width="100px" prop="villageName">
          <el-input v-model="form.villageName" />
        </el-form-item>
        <el-form-item label="公共电梯费" label-width="100px" prop="liftFee">
          <el-input v-model.number="form.liftFee" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">{{ btn }}</el-button>
      </span>
    </el-dialog>
    <Pagination
      :page.sync="page"
      :total="total"
      :page-size="5"
      @change="goNewPage"
    />
  </div>
</template>

<script>
import { getList, removePool, updatePool, addPool } from '@/api/pool'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      list: [],
      page: 1,
      total: 0,
      dialogVisible: false,
      title: '修改',
      btn: '修 改',
      form: {
        liftFee: '',
        villageName: '',
      },
      rules: {
        villageName: [
          { required: true, message: '请输入小区名', trigger: 'blur' },
        ],
        liftFee: [
          { required: true, message: '请输入电梯费', trigger: 'blur' },
          { type: 'number', message: '电梯费必须为数字值' },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getList({ pageNum: this.page })
      this.list = res.data.data.list
      this.total = res.data.data.total
    },
    deleteRow(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await removePool({ id: row.id })
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    changeRow(row) {
      this.btn = '修 改'
      this.title = '修改'
      this.dialogVisible = true
      this.form.id = row.id
      this.form.liftFee = row.liftFee
      this.form.villageName = row.villageName
    },
    addRow() {
      this.btn = '新 增'
      this.title = '新增'
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.form = {
        liftFee: '',
        villageName: '',
      }
      this.$refs['form'].resetFields()
    },
    submitForm() {
      this.form.createTime = new Date().toISOString()
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.title === '修改') {
            await updatePool(this.form, {
              control: 'lift_fee',
            })
          } else {
            await addPool(
              {
                liftFee: this.form.liftFee,
                villageName: this.form.villageName,
              },
              {
                control: 'lift_fee',
              }
            )
          }
          this.closeDialog()
          this.getList()
        } else {
          return false
        }
      })
    },
    goNewPage() {
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped></style>
