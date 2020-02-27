<template>
  <div>
    <el-dialog title="用户信息" :visible.sync="showDialog">
      <el-form
        ref="dataForm"
        v-loading="loading"
        element-loading-text="正在执行"
        element-loading-background="rgba(255,255,255,0.7)"
        :model="formData"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName"/>
          <el-input v-model="formData.id" hidden></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model.number="formData.status"
            placeholder="状态"
            type="number"
            style="width: 210px"
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="formData.memo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="closeDialog" type="primary">{{ "关闭" }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const statusOptions = [
  { key: 1, displayName: '正常' },
  { key: 2, displayName: '未激活' },
  { key: 3, displayName: '暂停使用' }
]
export default {
  name: 'AdminsDetail',
  data () {
    return {
      formData: {},
      statusOptions,
      loading: false,
      showDialog: false
    }
  },
  methods: {
    openDialog (rowData) {
      this.showDialog = true
      this.resetFormData()
      this.formData = rowData
    },
    closeDialog () {
      this.showDialog = false
    },
    resetFormData () {
      this.formData = {
        status: 1,
        memo: ''
      }
      this.loading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
