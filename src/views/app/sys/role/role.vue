<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.key"
        placeholder="请输入内容"
        clearable
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ "搜索" }}
      </el-button>
      <el-button
        v-if="permissionList.add"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ "添加" }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      stripe
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序值"
        prop="sequence"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="360"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="permissionList.view"
            size="mini"
            type="success"
            @click="handleDetail(row.id)"
          >
            {{ "查看" }}
          </el-button>
          <el-button
            v-if="permissionList.update"
            type="primary"
            size="mini"
            @click="handleUpdate(row.id)"
          >
            {{ "编辑" }}
          </el-button>
          <el-button
            v-if="permissionList.del"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            {{ "删除" }}
          </el-button>
          <el-button
            v-if="permissionList.setrolemenu"
            type="primary"
            size="small"
            @click="handleSetRole(row)"
          >
            {{ "编辑权限" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <role-add ref="addDialog"/>
    <role-edit ref="editDialog"/>
    <role-set-permission ref="setPermissionDialog"/>

  </div>
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
  name: 'Role',
  components: {RoleSetPermission, RoleEdit, RoleAdd, Pagination, SelectTree },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '可用',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
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
      this.$refs.setPermissionDialog.openDialog()
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
