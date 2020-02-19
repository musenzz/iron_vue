<template>
  <div class="user">
    <h2>User Posts</h2>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'UserPosts',
  data () {
    return {
      msg: 'UserPosts components'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
