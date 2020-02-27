<template>
  <div>
    <el-dialog
      :visible.sync="showDialog"
      title="角色分配"
    >
      <el-form
        v-loading="loading"
        element-loading-text="正在执行"
        element-loading-background="rgba(255,255,255,0.7)"
        label-width="80px"
        label-position="left"
      >
        <el-form-item>
          <el-tree
            ref="tree"
            :check-strictly="false"
            :data="treeData"
            :props="treeProps"
            show-checkbox
            default-expand-all
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div v-if="loading!==true" style="text-align:right;">
        <el-button type="danger" @click="closeDialog">{{ "取消" }}</el-button>
        <el-button type="primary" @click="setRole()">{{ "确定" }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { alertSuccess } from '../../../../utils/common-util'
import { requestSetRole, requestAdminsRoleIdList } from '@/api/app/sys/admins'
import { requestAll } from '@/api/app/sys/role'
export default {
  name: 'AdminsSetRole',
  data () {
    return {
      treeData: [],
      loading: false,
      showDialog: false,
      treeProps: {
        children: 'children',
        label: 'name'
      },
      userId: 0
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    openDialog (rowData) {
      this.showDialog = true
      this.userId = rowData.id
      requestAdminsRoleIdList(rowData.id).then(response => {
        if (response.data !== null) {
          this.$refs.tree.setCheckedKeys(response.data)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
        this.loading = false
      })
    },
    closeDialog () {
      this.showDialog = false
    },
    getTreeData () {
      requestAll().then(response => {
        if (response.data) {
          this.treeData = this.optionDataSelectTree(response.data)
        }
      })
    },
    optionDataSelectTree (data) {
      const cloneData = JSON.parse(JSON.stringify(data))
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(child => father.id === child.parent_id)
        branchArr.length > 0 ? father.children = branchArr : ''
        return father.parent_id === data[0].parent_id
      })
    },
    setRole () {
      this.loading = true
      const menuIds = this.$refs.tree.getCheckedKeys()
      requestSetRole(this.userId, menuIds).then((response) => {
        alertSuccess(this, response)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
