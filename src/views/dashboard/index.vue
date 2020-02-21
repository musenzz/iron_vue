<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'
export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data () {
    return {
      currentRole: 'adminDashboard'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
