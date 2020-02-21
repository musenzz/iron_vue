<template>
  <div class="menu-wrapper">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
      >
        <el-submenu v-for="(router,index) in routes" :index="index" :key="index" style="text-align: left" >
          <template slot="title">
            {{router.meta.title}}
          </template>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import variables from '@/styles/variables.scss'

  export default {
    name: 'Sidebar',
    computed: {
      ...mapGetters([
        'routes'
      ]),
      variables () {
        return variables
      }
    }
  }
</script>

<style scoped>

</style>
