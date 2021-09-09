<template>
  <q-btn icon="login" color="primary" @click="onLoginBtnClick"
         class="before-disable login-btn"
  >
    <p style="margin-left: 10px; margin-bottom: 0">Login</p>
  </q-btn>
</template>

<script>
export default {
  name: "LoginHeaderBtn",
  methods: {
    onLoginBtnClick() {
      this.$router.push("/log-in");
    }
  }
};
</script>

<style scoped>
.login-btn {
  padding: 5px 5px;
}
</style>
