<template>
  <div class="menu-wrapper">
    <el-menu>
      <el-submenu v-for="(router,index) in routes" :index="index" :key="index">
        <template slot="title">
         {{router.name}}
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Sidebar',
  computed: {
    ...mapGetters([
      'routes'
    ])
  }
}
</script>

<style scoped>

</style>
