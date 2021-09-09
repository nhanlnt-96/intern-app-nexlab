<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="logout" color="primary" text-color="white" />
      <span class="q-ml-sm">Bạn có chắc rằng bạn muốn đăng xuất không ?</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Không" color="primary" v-close-popup />
      <q-btn flat label="Có" color="primary" v-close-popup @click="onLogoutBtnClick" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { removeToken } from "../../boot/cookies";
import { Cookies } from "quasar";

export default {
  name: "LogOutConfirm",
  methods: {
    onLogoutBtnClick() {
      removeToken();
      const access_token: string = Cookies.get("access_token");
      const refresh_token: string = Cookies.get("refresh_token");

      if (!access_token || !refresh_token) {
        this.$router.push({ path: "/log-in" });
      }
    }
  }
};
</script>

<style scoped>

</style>
