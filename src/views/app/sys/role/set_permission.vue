<template>
  <el-dialog
    :visible.sync="showDialog"
    title="设置权限"
  >
    <div v-if="loading === true ? false : true" style="text-align:right;">
      <el-button @click="setTreeExpandState($event)">{{ "展开" }}</el-button>
    </div>
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
          :default-expanded-keys="treeExpandedKeys"
          show-checkbox
          node-key="id"
          class="permission-tree"
        />
      </el-form-item>
    </el-form>
    <div v-if="loading === true ? false : true" style="text-align:right;">
      <el-button type="danger" @click="dialogFormVisibleSetRole = false">
        {{ "取消" }}
      </el-button>
      <el-button type="primary" @click="setRole()">
        {{ "确定" }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { requestAll as requestAllMenu, requestMenuButton } from '@/api/app/sys/menu'
import { requestList, requestDetail, requestUpdate, requestCreate, requestDelete, requestSetRole, requestRoleMenuIDList, requestAll } from '@/api/app/sys/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import SelectTree from '@/components/TreeSelect'
import { checkAuthAdd, checkAuthDel, checkAuthView, checkAuthUpdate, checkAuthSetrolemenu } from '@/utils/permission'
import RoleAdd from './add'
import RoleEdit from './edit'
import RoleSetPermission from './set_permission'
export default {
  name: 'RoleSetPermission',
  data () {
    return {
      showDialog : false,
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
      operationList: [],
      permissionList: {
        add: false,
        del: false,
        view: false,
        update: false,
        setrolemenu: false
      },
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      loading: true,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        status: undefined,
        sort: '-id'
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' },
        { label: 'sequence Ascending', key: '+sequence' },
        { label: 'sequence Descending', key: '-sequence' }
      ],
      temp: {
        id: 0,
        memo: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        detail: '详情'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        sequence: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
      },
      multipleSelection: [],
      dialogFormVisibleSetRole: false,
      dialogFormVisibleSetRoleTitle: '编辑角色权限',
      treeProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      treeExpandedKeys: []
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
    this.getMenuButton()
    this.getList()
    this.getParentTrddData()
    this.getTreeData()
  },
  methods: {
    openDialog () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    checkPermission () {
      this.permissionList.add = checkAuthAdd(this.operationList)
      this.permissionList.del = checkAuthDel(this.operationList)
      this.permissionList.view = checkAuthView(this.operationList)
      this.permissionList.update = checkAuthUpdate(this.operationList)
      this.permissionList.setrolemenu = checkAuthSetrolemenu(this.operationList)
    },
    getMenuButton () {
      requestMenuButton('Role').then(response => {
        this.operationList = response.data
      }).then(() => {
        this.checkPermission()
      })
    },
    getList () {
      this.listLoading = true
      requestList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.parent_id = this.valueIdSelectTree
      this.listQuery.page = 1
      this.getList()
    },
    sortChange (data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop
      } else {
        this.listQuery.sort = undefined
      }
      this.handleFilter()
    },
    handleCreate () {
      this.$refs.addDialog.openDialog()
    },
    handleUpdate (rowData) {
      this.$refs.editDialog.openDialog(rowData)
    },
    handleDelete (row) {
      var ids = []
      ids.push(row.id)
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestDelete(ids).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.total = this.total - 1
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.getParentTrddData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSetRole (row) {
      this.loading = true
      this.temp = row
      this.dialogFormVisibleSetRole = true
      this.dialogFormVisibleSetRoleTitle = row.name + '-角色权限设置'
      requestRoleMenuIDList(this.temp.id).then(response => {
        this.$refs.tree.setCheckedKeys(response.data)
        this.loading = false
      })
    },
    getTreeData () {
      requestAllMenu().then(response => {
        if (response.data) {
          for (const row of response.data) {
            if (row.menu_type === 1) {
              this.treeExpandedKeys.push(row.id)
            }
          }
          this.treeData = this.optionDataSelectTree2(response.data)
        }
      })
    },
    optionDataSelectTree2 (data) {
      const cloneData = JSON.parse(JSON.stringify(data))
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.id === child.parent_id)
        branchArr.length > 0 ? father.children = branchArr : ''
        return father.parent_id === data[0].parent_id
      })
    },
    setRole () {
      this.loading = true
      const menuids = this.$refs.tree.getCheckedKeys()
      requestSetRole(this.temp.id, menuids).then(() => {
        this.dialogFormVisibleSetRole = false
        this.$notify({
          title: '成功',
          message: '设置成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.loading = false
      })
    },
    setTreeExpandState (e) {
      if (e.target.innerText === '展开') {
        e.target.innerText = '恢复'
        this.setTreeOpen()
      } else {
        e.target.innerText = '展开'
        this.setTreeClose()
      }
    },
    setTreeClose () {
      this.defaultExpand = false
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.isOpen = false
        for (var ii = 0; ii < this.treeExpandedKeys.length; ii++) {
          if (this.$refs.tree.store._getAllNodes()[i].key === this.treeExpandedKeys[ii]) {
            this.isOpen = true
            break
          }
        }
        if (this.isOpen === true) {
          this.$refs.tree.store._getAllNodes()[i].expanded = true
        } else {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.defaultExpand
        }
      }
    },
    setTreeOpen () {
      this.defaultExpand = true
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = this.defaultExpand
      }
    },
    getSelectTreeValue (value, type) {
      if (type === 1) {
        this.valueIdSelectTree = value
        this.handleFilter()
      } else {
        this.valueIdSelectTree2 = value
      }
    },
    getParentTrddData () {
      requestAll().then(response => {
        if (response.data) {
          this.propsSelectlist = response.data
        } else {
          this.propsSelectlist = this.propsSelectlist2
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
