<template>
  <div>
    <!-- v-premission="'deposit:list'" -->
    <el-table :data="list">
      <el-table-column
        align="center"
        label="openid"
        width="300"
        prop="openid"
      />
      <el-table-column align="center" label="小区楼号房号" width="300">
        <template slot-scope="scope">
          <span
            v-text="
              `${scope.row.villageName}${scope.row.buildNo}号楼${scope.row.roomNo}号`
            "
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="houseType"
        label="房屋类型"
        width="150"
      />
      <el-table-column
        align="center"
        prop="relation"
        label="与房屋关系"
        width="150"
      />
      <el-table-column align="center" label="押金" width="220">
        <template slot-scope="scope">
          {{ scope.row.deposit / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-position"
            @click="deleteDeposit(scope.row)"
            v-premission="'deposit:update'"
            >扣押金</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page"
      :page-size="pageSize"
      @change="changePage"
    />

    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="closeDialog"
    >
      <el-form :model="form" label-width="100px" ref="deleteForm">
        <el-form-item
          label="扣除押金"
          prop="money"
          :rules="[
            { required: true, message: '请输入扣除金额', trigger: 'change' },
          ]"
        >
          <el-input v-model="form.money" type="number"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">处 理</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, removeDeposit } from '@/api/deposit'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        money: 0,
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getList({
        pageNum: this.page,
      })
      this.list = res.data.data.list
      this.total = res.data.data.total
      // console.log(this.list)
    },
    changePage() {
      this.getList()
    },
    deleteDeposit(row) {
      this.form = row
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.$message({
        type: 'info',
        message: '取消成功!',
      })

      this.$refs['deleteForm'].resetFields()
    },
    async submitForm() {
      this.$refs['deleteForm'].validate(async (valid) => {
        console.log(this.form.money)
        if (valid) {
          await removeDeposit({ money: this.form.money }, this.form)
          this.dialogVisible = false
          this.getList()
          this.$message({
            type: 'success',
            message: '扣除成功!',
          })
          this.form.money = ''
          this.$refs['deleteForm'].resetFields()
        }
      })
    },
  },
}
</script>

<style lang="scss" sccped></style>
