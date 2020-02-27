<template>
  <div>
    <el-dialog title="编辑用户" :visible.sync="showDialog">
      <el-form
        ref="dataForm"
        v-loading="loading"
        element-loading-text="正在执行"
        element-loading-background="rgba(255,255,255,0.7)"
        :model="formData"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName"/>
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
            style="width: 90px"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ "取消" }}</el-button>
        <el-button type="primary" @click="doUpdate">{{ "确定" }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { alertSuccess } from '../../../../utils/common-util'
import { requestUpdate } from '@/api/app/sys/admins'
const statusOptions = [
  { key: 1, displayName: '正常' },
  { key: 2, displayName: '未激活' },
  { key: 3, displayName: '暂停使用' }
]
export default {
  name: 'AdminsEdit',
  data () {
    return {
      formData: {},
      statusOptions,
      loading: false,
      showDialog: false,
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ min: 6, max: 20, required: true, message: '长度在 6 到 20 个字符', trigger: 'blur' }]
      }
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
    },
    doUpdate () {
      console.log(this.formData)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          requestUpdate(this.formData).then(response => {
            alertSuccess(this, response)
            this.$parent.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
