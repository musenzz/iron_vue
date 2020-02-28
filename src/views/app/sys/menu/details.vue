<template>
  <el-dialog title="菜单信息" :visible.sync="showDialog">
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
      <el-form-item label="菜单类型" prop="menu_type">
        <el-select
          v-model.number="formData.menu_type"
          type="number"
          placeholder="菜单类型"
          disabled
        >
          <el-option
            v-for="item in menuTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型" prop="operate_type">
        <el-select v-model.number="formData.operate_type" placeholder="操作类型" disabled>
          <el-option
            v-for="item in menuOperateTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父级" prop="parent_id">
        <tree-select v-model="treeNodeId" :multiple="false"  disabled
                     :options="treeSelectOptions"
                     :load-options="loadOptions"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" :disabled="true"/>
      </el-form-item>
      <el-form-item label="菜单url" prop="url">
        <el-input v-model="formData.uri" :disabled="true"/>
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="formData.code" :disabled="true"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon" :disabled="true"/>
      </el-form-item>
      <el-form-item label="排序值" prop="sequence">
        <el-input v-model.number="formData.sequence" type="number" :disabled="true"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model.number="formData.status" type="number">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">未启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="formData.memo" :disabled="true"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" @click="closeDialog">{{ "关闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { requestAll } from '@/api/app/sys/menu'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const menuTypeOptions = [
  { key: 1, display_name: '模块' },
  { key: 2, display_name: '菜单' },
  { key: 3, display_name: '操作' }
]

const menuOperateTypeOptions = [
  { key: 'none', display_name: '非操作类型' },
  { key: 'add', display_name: '新增' },
  { key: 'del', display_name: '删除' },
  { key: 'view', display_name: '查看' },
  { key: 'update', display_name: '编辑' },
  { key: 'list', display_name: '分页api' },
  { key: 'setrolemenu', display_name: '分配角色菜单权限' },
  { key: 'setadminrole', display_name: '分配管理员角色' }
]
export default {
  name: 'MenuDetail',
  components: { TreeSelect },
  data () {
    return {
      showDialog: false,
      formData: {},
      loading: false,
      menuTypeOptions,
      menuOperateTypeOptions,
      treeNodeId: null,
      treeSelectOptions: []
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    openDialog (rowData) {
      this.resetFormData()
      this.formData = rowData
      this.showDialog = true
      if (rowData.parent_id !== 0) {
        this.treeNodeId = rowData.parent_id
      }
    },
    closeDialog () {
      this.showDialog = false
    },
    resetFormData () {
      this.loading = false
      this.formData = {}
    },
    getAll () {
      requestAll().then(response => {
        if (response.data) {
          this.treeSelectOptions = response.data
        }
      })
    },
    loadOptions ({ action, parentNode, callback }) {

    }
  }
}
</script>

<style scoped>

</style>
