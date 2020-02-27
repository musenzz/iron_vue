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

    <el-table
      v-loading="listLoading"
      stripe
      :data="list"
      border
      highlight-current-row
    >
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope" prop>
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="360"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleDetail(scope.row)"
          >
            {{ "查看" }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            {{ "编辑" }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            {{ "删除" }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleSetRole(scope.row)"
          >
            {{ "分配角色" }}
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

    <admins-add  ref="addDialog"/>
    <admins-detail  ref="detailDialog"/>
    <admins-edit  ref="editDialog"/>
    <admins-set-role  ref="setRoleDialog"/>
  </div>
</template>

<script>
import { requestList, requestDelete } from '@/api/app/sys/admins'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import AdminsAdd from './add'
import AdminsDetail from './details'
import AdminsEdit from './edit'
import AdminsSetRole from './set_role'

export default {
  name: 'Admins',
  components: { AdminsSetRole, AdminsEdit, AdminsDetail, AdminsAdd, Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '正常',
        2: '未激活',
        3: '暂停使用'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        status: undefined,
        sort: '-id'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      requestList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
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
    handleSetRole (row) {
      this.$refs.setRoleDialog.openDialog(row)
    },
    handleDelete (row) {
      const ids = []
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
