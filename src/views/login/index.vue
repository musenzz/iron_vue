<template>
  <div class="login-container" >
    <el-form ref="loginForm" class="login-form" :model="loginForm">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="Username"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="Password"
        />
      </el-form-item>
      <el-button  type="primary" @click="handleLogin">Login</el-button>
    </el-form>

    <div>
      下面是vuex：this.$store.state.count 获得的数据:
      <h2>{{  this.$store.state.count  }}</h2>
      下面是vuex：this.$store.getters.getStateCount获得的数据:
      <h2>{{ this.$store.getters.getStateCount }}</h2>

      <button @click="addS">+</button>
      <button @click="reduceS">-</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log('ddddddd')
          // this.loading = true
          this.$store.dispatch('login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              // this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addS () {
      // this.$store.commit("addition");
      this.$store.dispatch('addition')
    },
    reduceS () {
      // this.$store.commit('reduction');
      this.$store.dispatch('reduction')
    }
  }
}
</script>

<style lang="scss">
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
  }
</style>
