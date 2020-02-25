<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >
        {{ "添加" }}
      </el-button>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        stripe
        :data="list"
        border
        highlight-current-row
      ></el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admins',
  data () {
    return {
      listLoading: true,
      list: []
    }
  }
}
</script>
