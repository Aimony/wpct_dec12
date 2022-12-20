<!--
 * @Author: Your Name you@example.com
 * @Date: 2022-10-31 17:58:20
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-12-16 09:18:17
 * @FilePath: \vue-admin-template-master\src\views\role\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-row>
      <el-button
        type="primary"
        style="width: 120px; margin: 20px"
        @click="showAdd"
        v-premission="'role:add'"
        >新增
      </el-button>
    </el-row>
   <div style="margin: 10px;">
    <el-table
      :data="stuList"
      fit
      highlight-current-row
      v-premission="'role:list'"
      border
      style="height:500px"
    >
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="scope.$index + 1" />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="users[0].nickName" label="昵称" width="140" />
      <el-table-column align="center" prop="users[0].id" label="用户ID" width="160" /> -->
      <el-table-column
        align="center"
        prop="roleName"
        label="身份"
        width="250"
      />
      <el-table-column
        align="center"
        prop="roleId"
        label="roleID"
        width="200"
      />
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-tickets"
            @click="showDetail(scope.row)"
            v-premission="'role:list'"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="deleteRow(scope.row)"
            v-premission="'role:remove'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
   </div>
    <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
    <el-pagination
      layout="total,prev, pager, next"
      style="text-align: center"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSize"
    />

    <el-dialog
      title="新增"
      :visible.sync="add"
      width="60%"
      append-to-body
      :before-close="handleClose1"
    >
      <el-form :model="roleForm" :rules="rules" ref="form">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-col :span="24">
            <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <el-switch
            v-model="isAdmin"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="取消全选"
            active-text="全选"
          >
          </el-switch>
          <div class="roleList" v-show="!isAdmin">
            <el-checkbox-group
              v-model="checkedRoleList"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(items, index) in roleList"
                :label="items.id"
                :key="index + items.menuName"
                style="width: 20%"
                :checked="items.requiredPermission == 1"
                v-show="items.menuCode !== 'admin'"
                :disabled="items.requiredPermission == 1"
              >
                {{ items.menuName + items.permissionName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="pop.show"
      width="70%"
      :before-close="handleClose"
    >
      <div class="role">
        <span>拥有的路由权限:</span>
        <div v-for="(item, index) in menus" :key="index">
          <span style="width: 100px; padding: 20px">{{ item.menuName }}</span>
        </div>
      </div>
      <br />
      <br />

      <div class="role">
        <span>拥有的页面权限:</span>
        <div v-for="(item, index) in permissions" :key="index">
          <span style="width: 100px; padding: 20px">{{
            item.permissionName
          }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pop.show = false">取 消</el-button>
        <el-button type="primary" @click="pop.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserRole,
  deleteUserRole,
  addUserRole,
  getUserRoleList,
} from '../../api/role'
export default {
  data() {
    return {
      stuList: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      total: 0,
      pageNum: 1,
      pageSize: 5,
      hasAdmin: '',
      isAdmin: false,
      formLabelWidth: '120px',
      add: false,
      roleForm: {
        createTime: '',
        permsList: [],
        roleId: 0,
        roleName: '',
        updateTime: '',
      },
      Options: [],
      //选择后的列表
      checkedRoleList: [],

      roleList: [],
      // cities: cityOptions,
      checkAll: false,
      isIndeterminate: true,
      userList: [],
      pop: {
        show: false,
        add: false,
      },
      menus: [],
      permissions: [],
    }
  },
  watch: {
    roleForm: {
      deep: true,
      immediate: true,
      handler: function (val, old) {
        // console.log(val)
        this.hasAdmin = val.permsList.find((item) => {
          return item.menuCode == 'admin'
        })
      },
    },
    //
    isAdmin: function (a, b) {
      if (a) {
        this.roleForm.permsList.push(this.admin.id)
        console.log(this.admin.id)
      } else {
        this.roleForm.permsList = this.checkedRoleList
      }
    },
  },
  computed: {
    admin() {
      return this.roleList.find((item) => {
        return item.menuCode === 'admin'
      })
    },
  },
  // created() { this.getRoleList() },
  mounted() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    handleClose1() {
      this.$refs['form'].resetFields()
      this.add = false
    },
    closeDialog() {
      this.add = false
      this.$refs['form'].resetFields()
    },
    showAdd() {
      this.add = true
      this.roleForm.roleName = ''
    },
    handleCurrentChange(e) {
      console.log(this.pageNum)
      this.getList()
      this.stuList = this.userList.slice(
        (this.pageNum - 1) * 5,
        (this.pageNum - 1) * 5 + 5
      )
    },
    getList() {
      getUserRole().then((res) => {
        // console.log(res)
        this.userList = res.data.data
        this.total = this.userList.length
        this.stuList = this.userList.slice(
          (this.pageNum - 1) * 5,
          (this.pageNum - 1) * 5 + 5
        )
      })
    },
    async getRoleList() {
      await getUserRoleList().then((res) => {
        // console.log(res)
        this.roleList = res.data.data
      })
    },
    handleClose() {
      ;(this.pop.add = false), (this.pop.show = false)
    },
    showDetail(row) {
      ;(this.menus = [...row.menus]), (this.permissions = [...row.permissions])
      this.pop.show = true
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUserRole(row.roleId).then(
            (res) => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getList()
            },
            (err) => {
              // console.log(err)
              this.$message({
                type: 'error',
                message: '删除失败!',
              })
            }
          )
        })
        .catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // handleCheckAllChange(val) {
    //   this.checkedCities = val ? cityOptions : [];
    //   this.isIndeterminate = false;
    // },
    handleCheckedCitiesChange(value) {
      // console.log(value)
      this.checkedRoleList = value
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.isAdmin) {
            addUserRole(this.roleForm).then(
              (res) => {
                // console.log(res)
                this.$message({
                  type: 'success',
                  message: res.data.data,
                })
              },
              (err) => {
                this.$message({
                  type: 'success',
                  message: err,
                })
              }
            )
          } else {
            this.roleForm.permsList = this.checkedRoleList
            addUserRole(this.roleForm).then(
              (res) => {
                // console.log(res)
                this.$message({
                  type: 'success',
                  message: res.data.data,
                })
              },
              (err) => {
                this.$message({
                  type: 'success',
                  message: err,
                })
              }
            )
          }
          this.getList()
          this.add = false
        }
      })
    },
  },
}
</script>

<style>
.role {
  display: flex;
  flex-direction: row;
}

.roleList {
  display: flex;
  flex-direction: row;

  justify-content: space-between;
}
</style>
