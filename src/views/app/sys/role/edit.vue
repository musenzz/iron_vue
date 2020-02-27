<template>
  <el-dialog title="添加角色" :visible.sync="showDialog">
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
      <el-form-item label="排序值" prop="sequence">
        <el-input v-model.number="formData.sequence" type="number" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="formData.memo" />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog">
        {{ "取消" }}
      </el-button>
      <el-button
        type="primary"
        @click="doUpdate"
      >
        {{ "确定" }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { alertSuccess } from '../../../../utils/common-util'
  import { requestAll as requestAllMenu, requestMenuButton } from '@/api/app/sys/menu'
  import { requestList, requestDetail, requestUpdate, requestCreate, requestDelete, requestSetRole, requestRoleMenuIDList, requestAll } from '@/api/app/sys/role'
  import SelectTree from '@/components/TreeSelect'
  export default {
    name: 'RoleEdit',
    components: { SelectTree },
    data () {
      return {
        formData: {},
        loading: false,
        showDialog: false,
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          sequence: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
        },
        valueIdSelectTree: 0,
        valueIdSelectTree2: 0,
        propsSelectTree: {
          value: 'id',
          label: 'name',
          children: 'children',
          placeholder: '父级'
        },
        propsSelectlist: [],
        propsSelectlist2: [
          { id: 0, parent_id: -1, name: '顶级' }
        ],
        treeProps: {
          children: 'children',
          label: 'name'
        },
        treeData: []
      }
    },
    computed: {
      optionDataSelectTree () {
        const cloneData = JSON.parse(JSON.stringify(this.propsSelectlist))
        return cloneData.filter(father => {
          const branchArr = cloneData.filter(child => father.id === child.parent_id)
          branchArr.length > 0 ? father.children = branchArr : ''
          return father.parent_id === this.propsSelectlist[0].parent_id
        })
      }
    },
    created () {
      this.getParentTrddData()
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
      doUpdate () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.temp.parent_id = this.valueIdSelectTree2
            const tempData = Object.assign({}, this.temp)
            requestUpdate(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getParentTrddData()
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      getParentTrddData () {
        requestAll().then(response => {
          if (response.data) {
            this.propsSelectlist = response.data
          } else {
            this.propsSelectlist = this.propsSelectlist2
          }
        })
      },
      getSelectTreeValue(value, type) {
        if (type === 1) {
          this.valueIdSelectTree = value
          this.handleFilter()
        } else {
          this.valueIdSelectTree2 = value
        }
      },
    }
  }
</script>

<style scoped>

</style>
