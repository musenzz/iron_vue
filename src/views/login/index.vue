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
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
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
