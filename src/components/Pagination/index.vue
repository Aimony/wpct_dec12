<template>
  <div>
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      style="text-align:center"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 15, 20]"
    />
    <!-- <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSize"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align:center">
    </el-pagination> -->
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1,
      required: true
    },
    pageSize: {
      type: Number,
      default: 5,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
