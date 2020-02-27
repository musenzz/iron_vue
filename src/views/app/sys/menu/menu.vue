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
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        style="width: 90px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in menuTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ "添加" }}
      </el-button>
    </div>

    <template>
      <dragTreeTable ref="treeTable" :data="treeData" :on-drag="onTreeDataChange" border />
    </template>

    <menu-add ref="addDialog"/>
    <menu-detail ref="detailDialog"/>
    <menu-edit ref="editDialog"/>
  </div>
</template>

<script>
import {
  requestList,
  requestDelete
} from '@/api/app/sys/menu'
import waves from '@/directive/waves'
import dragTreeTable from 'drag-tree-table'
import MenuAdd from './add'
import MenuDetail from './details'
import MenuEdit from './edit'

const menuTypeOptions = [
  { key: 1, display_name: '模块' },
  { key: 2, display_name: '菜单' },
  { key: 3, display_name: '操作' }
]

export default {
  name: 'Menu',
  components: { MenuEdit, MenuDetail, MenuAdd, dragTreeTable },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '启用',
        2: '不启用'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      treeData: {
        columns: [],
        lists: [],
        custom_field: {
          id: 'id',
          order: 'sort',
          lists: 'children',
          parent_id: 'parent_id'
        }
      },
      valueIdSelectTree: 0,
      valueIdSelectTree2: 0,
      propsSelectTree: {
        value: 'id',
        label: 'name',
        children: 'children',
        placeholder: '父级'
      },
      tableKey: 0,
      list: [],
      listLoading: true,
      loading: true,
      listQuery: {
        page: 1,
        limit: 20,
        parent_id: undefined,
        key: undefined,
        menu_type: undefined,
        sort: '-id'
      },
      menuTypeOptions

    }
  },
  mounted () {
    this.treeData.columns = [
      {
        type: 'selection',
        title: '菜单名称',
        field: 'name',
        width: 200,
        align: 'left',
        formatter: item => {
          return '<span>' + item.name + '</span>'
        }
      },
      {
        type: '',
        title: 'uri',
        field: 'uri',
        width: 200,
        align: 'left',
        formatter: item => {
          return '<span>' + item.uri + '</span>'
        }
      },
      {
        type: '',
        title: '类型',
        field: 'menuType',
        width: 200,
        align: 'left',
        formatter: item => {
          if (item.menuType === 1) {
            return '<span v-if="{{item.menuType==1}}" style="color: #30395C">模块</span> '
          }
          if (item.menuType === 2) {
            return '<span v-if="item.menuType==2" style="color: #4A6491">菜单</span>'
          }
          if (item.menuType === 3) {
            return '<span v-if="item.menuType==3" style="color: #85A5CC">操作</span>'
          }
        }
      },
      {
        type: '',
        title: '代码',
        field: 'code',
        width: 200,
        align: 'left',
        formatter: item => {
          return '<span>' + item.code + '</span>'
        }
      },
      {
        type: '',
        title: '图标',
        field: 'icon',
        width: 200,
        align: 'left',
        formatter: item => {
          return '<span>' + item.icon + '</span>'
        }
      },
      {
        type: '',
        title: '操作类型',
        field: 'operateType',
        width: 200,
        align: 'left',
        formatter: item => {
          return '<span>' + item.operateType + '</span>'
        }
      },
      {
        title: '操作',
        type: 'action',
        width: 350,
        align: 'center',
        actions: [
          {
            text: '查看菜单',
            onclick: this.onDetail,
            formatter: item => {
              return '<i>查看菜单 </i>'
            }
          },
          {
            text: '编辑',
            onclick: this.onEdit,
            formatter: item => {
              return '<i>编辑</i>'
            }
          },
          {
            text: '删除',
            onclick: this.onDelete,
            formatter: item => {
              return '<i style="color: red;margin: 5px">删除</i>'
            }
          }
        ]
      }
    ]
  },
  created () {
    this.getList()
  },
  methods: {
    onTreeDataChange (list, from, to, where) {
      this.treeData.lists = list
    },
    onEdit (item) {
      this.handleUpdate(item)
    },
    onDetail (item) {
      this.handleDetail(item)
    },
    onDelete (item) {
      this.handleDelete(item.id)
    },
    getList () {
      this.listLoading = true
      requestList(this.listQuery).then(response => {
        this.treeData.lists = response.data.items
        this.listLoading = false
        this.$refs.treeTable.OpenAll()
      })
    },
    handleFilter () {
      this.listQuery.parent_id = this.valueIdSelectTree
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate () {
      this.$refs.addDialog.openDialog()
    },
    handleDetail (rowData) {
      this.$refs.detailDialog.openDialog(rowData)
    },
    handleUpdate (rowData) {
      this.$refs.editDialog.openDialog(rowData)
    },
    handleDelete (id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestDelete(id).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .tree-column{
    text-align: left !important;
  }
</style>
