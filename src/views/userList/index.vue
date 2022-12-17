<!--
 * @Author: Your Name you@example.com
 * @Date: 2022-10-31 17:54:46
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-12-16 13:39:17
 * @FilePath: \vue-admin-template-master\src\views\userList\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div>
      <el-button type="primary" style="width: 100px; margin: 20px" @click="showDialog" v-premission="'user:add'">新增
      </el-button>
      <!-- <el-date-picker v-model="value1" type="datetime"  v-premission="'user:list'" placeholder="选择日期时间">
      </el-date-picker> -->
    </div>
    <el-table :data="userList" fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="scope.$index + 1" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称" width="140" />
      <el-table-column align="center" prop="id" label="用户ID" width="160" />
      <el-table-column align="center" prop="updateTime" label="创建日期" width="200" />
      <el-table-column align="center" prop="roleId" label="roleID" width="200" />
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="showChange(scope.row)"
            v-premission="'user:update'">修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="deleteRow(scope.row)"
            v-premission="'user:remove'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagenation">
      <el-pagination background layout="prev, pager, next" @current-change="goPage" @prev-click="backPage"
        @next-click="nextPage" :total="total" :page-size="5">
      </el-pagination>
    </div>

    <el-dialog title="新增" :visible.sync="pop.add">
      <el-form :model="userForm" ref="addForm" :rules="rules">
        <!-- <el-form-item label="用户id" :label-width="formLabelWidth" prop="id">
          <el-input v-model.number="userForm.id" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickName">
          <el-input v-model="userForm.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="userForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="roleId" :label-width="formLabelWidth">
          <el-input v-model="userForm.roleId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog1">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="pop.update">
      <el-form :model="userForm" ref="addForm" :rules="rules">
        <el-form-item label="用户id" :label-width="formLabelWidth" prop="id">
          <el-input v-model="userForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickName">
          <el-input v-model="userForm.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="userForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="roleId" :label-width="formLabelWidth">
          <el-input v-model="userForm.roleId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toASCII } from 'punycode'
import {
  getUserList,
  deleteUserList,
  updateUserList,
  addUserList,
} from '../../api/myuser'
export default {
  data() {
    return {
      rules: {
        id: [
          { required: true, message: '请输入id', trigger: 'blur' },
          { type: 'number', message: 'id必须为数字值' },
        ],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
      },
      pageNum: 1,
      total: 0,
      userList: [],
      pop: {
        add: false,
        update: false,
      },
      formLabelWidth: '80px',
      userForm: {
        nickName: '',
        password: '',
        roleId: 0,
        roleName: '',
        userName: '',
        users: [{}],
      },
    }
  },
  mounted() {
    this.getList()
  },

  methods: {
    showDialog() {
      this.pop.add = true
      this.userForm = {
        nickName: '',
        password: '',
        roleId: 0,
        roleName: '',
        userName: '',
        users: [{}],
      }
    },
    closeDialog1() {
      this.pop.add = false
      this.$refs['addForm'].resetFields()
    },
    closeDialog() {
      this.pop.update = false
      this.$refs['addForm'].resetFields()
    },
    async getList() {
      await getUserList(this.pageNum).then(
        (res) => {
          // console.log(res)
          this.total = res.data.data.total
          this.userList = res.data.data.list
        },
        (err) => {
          console.log(err)
        }
      )
    },
    submit() {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          addUserList(this.userForm).then(
            (res) => {
              console.log(res)
              if (res.data.success) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                })
                this.getList()
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error',
                })
              }
            },
            (err) => {
              this.$message({
                message: err.data.data,
                type: 'error',
              })
            }
          )
          this.userForm = {
            nickName: '',
            password: '',
            roleId: 0,
            roleName: '',
            userName: '',
            users: [{}],
          }
          this.pop.add = false
          this.getList()
        }
      })
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUserList(row.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      this.getList()
    },
    showChange(row) {
      this.pop.update = true
      this.userForm = { ...row }
    },
    updateUser() {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          this.$confirm('此操作将把数据修改, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              updateUserList(this.userForm).then((res) => {
                this.$message({
                  type: 'success',
                  message: res.data.msg,
                })
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消',
              })
            })
          this.getList()
          this.pop.update = false
        }
      })
    },
    backPage(e) {
      this.pageNum = e
      this.getList()
    },
    nextPage(e) {
      this.pageNum = e
      this.getList()
    },
    goPage(e) {
      this.pageNum = e
      this.getList()
    },
  },
}
</script>

<style lang="css" scoped>
.pagenation {
  padding: 20px;
  display: flex;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
</style>
