<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
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

export default {
  name: 'Menu',
  components: { MenuEdit, MenuDetail, MenuAdd, dragTreeTable },
  directives: { waves },
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
      listLoading: true

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
          return '<span>' + item.url + '</span>'
        }
      },
      {
        type: '',
        title: '类型',
        field: 'menuType',
        width: 200,
        align: 'center',
        formatter: item => {
          if (item.menu_type === 1) {
            return '<span v-if="{{item.menu_type==1}}" style="color: #3399CC">模块</span> '
          }
          if (item.menu_type === 2) {
            return '<span v-if="item.menu_type==2" style="color: #67B8DE">菜单</span>'
          }
          if (item.menu_type === 3) {
            return '<span v-if="item.menu_type==3" style="color: #91C9E8">操作</span>'
          }
        }
      },
      {
        type: '',
        title: '代码',
        field: 'code',
        width: 200,
        align: 'center',
        formatter: item => {
          return '<span>' + item.code + '</span>'
        }
      },
      {
        type: '',
        title: '图标',
        field: 'icon',
        width: 200,
        align: 'center',
        formatter: item => {
          return '<span>' + item.icon + '</span>'
        }
      },
      {
        type: '',
        title: '操作类型',
        field: 'operateType',
        width: 200,
        align: 'center',
        open: true,
        formatter: item => {
          return '<span>' + item.operate_type + '</span>'
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
              return '<i style="color: #09ff76">查看 </i>'
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
      requestList().then(response => {
        this.treeData.lists = response.data
        this.listLoading = false
      })
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
