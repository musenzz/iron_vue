<template>
  <el-dialog title="添加菜单" :visible.sync="showDialog">
    <el-form
      ref="dataForm"
      v-loading="loading"
      element-loading-text="正在执行"
      element-loading-background="rgba(255,255,255,0.7)"
      :rules="rules"
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
        <el-select v-model.number="formData.operate_type" placeholder="操作类型">
          <el-option
            v-for="item in menuOperateTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父级" prop="parent_id">
        <SelectTree
          v-model.number="formData.parent_id"
          type="number"
          :props="propsSelectTree"
          :options="optionDataSelectTree"
          :value="valueIdSelectTree2"
          :clearable="true"
          :accordion="true"
          @getValue="getSelectTreeValue($event, 2)"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="菜单url" prop="url">
        <el-input v-model="formData.url" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon" />
      </el-form-item>
      <el-form-item label="排序值" prop="sequence">
        <el-input v-model.number="formData.sequence" type="number" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model.number="formData.status" type="number">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">未启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="formData.memo" />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog">{{ "取消" }}</el-button>
      <el-button type="primary" @click="doAdd">{{ "确定" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  requestCreate,
  requestAll
} from '@/api/app/sys/menu'
import SelectTree from '@/components/TreeSelect'
import { alertSuccess } from '../../../../utils/common-util'
import dragTreeTable from 'drag-tree-table'
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
  name: 'MenuAdd',
  components: { SelectTree, dragTreeTable },
  data () {
    return {
      showDialog: false,
      formData: {},
      menuTypeOptions,
      menuOperateTypeOptions,
      propsSelectTree: {
        value: 'id',
        label: 'name',
        children: 'children',
        placeholder: '父级'
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入菜单代码', trigger: 'blur' }],
        sequence: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
      },
      propsSelectList: [],
      propsSelectlist2: [
        { id: 0, parent_id: -1, name: '顶级' }
      ],
      valueIdSelectTree: 0,
      valueIdSelectTree2: 0
    }
  },
  created () {
    this.getAll()
  },
  computed: {
    optionDataSelectTree () {
      const cloneData = JSON.parse(JSON.stringify(this.propsSelectList))
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.id === child.parent_id)
        branchArr.length > 0 ? father.children = branchArr : ''
        return father.parent_id === this.propsSelectList[0].parent_id
      })
    }
  },
  methods: {
    openDialog () {
      this.showDialog = true
      this.resetFormData()
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
    getAll () {
      requestAll().then(response => {
        if (response.data) {
          this.propsSelectList = response.data
        } else {
          this.propsSelectList = this.propsSelectlist2
        }
      })
    },
    doAdd () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.formData)
        if (valid) {
          this.loading = true
          this.formData.parent_id = this.valueIdSelectTree2
          requestCreate(this.formData).then(response => {
            this.showDialog = false
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

<style scoped>

</style>
