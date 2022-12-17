<template>
  <div>
    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="closeDialog"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="意见" prop="suggestion">
          <el-input
            v-model="form.suggestion"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
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
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        suggestion: ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:dialogVisible', false)
    },
    submitForm() {
      this.$emit('submitSettle', this.form.suggestion)
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
