<template>
  <q-layout view="lHh Lpr lFf">
    <div class="container alignCenter">
      <q-card class="my-card alignCenter q-py-xl">
        <q-form
          class="q-px-lg q-pb-lg"
          style="width: 100%"
          greedy
          @submit.prevent="onLoginBtnClick"
        >
          <div class="alignCenter">
            <img class="logo" src="../assets/logo-cgogroup.jpg" />
          </div>
          <div class="text-h6 q-py-md" style="text-align: center">
            Đăng nhập
          </div>
          <q-input
            outlined
            class="q-my-xs"
            v-model="email"
            type="text"
            label="Email"
            :rules="[
              (val) => !!val || 'Vui lòng nhập Email',
              (val) =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                'Email không hợp lệ',
            ]"
          />
          <q-input
            outlined
            class="q-my-xs"
            v-model="password"
            :type="isPwdHide ? 'password' : 'text'"
            label="Mật khẩu"
            :rules="[
              (val) => !!val || 'Vui lòng nhập Mật khẩu',
              (val) =>
                /(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(val) ||
                'Mật khẩu phải có ít nhất 8 kí tự, bao gồm các chữ cái và số ',
            ]"
          >
            <template #append>
              <q-icon
                :name="isPwdHide ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdHide = !isPwdHide"
                style="font-size: 16px"
              />
            </template>
          </q-input>
          <q-btn
            class="q-py-sm"
            label="Đăng nhập"
            color="primary"
            style="width: 100%"
            type="submit"
            no-caps
            :loading="isLoading"
          />
          <div
            class="forgot-password text-subtitle2 q-py-md"
            @click="handleShowForgotPassword"
          >
            Quên mật khẩu
          </div>
        </q-form>
      </q-card>
    </div>
  </q-layout>
  <q-dialog v-model="isForgotPassword">
    <forgot-password-component @close-dialog="handleCloseDialog" />
  </q-dialog>
</template>
<script lang="ts">
import ForgotPasswordComponent from "src/components/popups/ForgotPasswordComponent.vue";
import { useAppStore } from "src/store";
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  components: { ForgotPasswordComponent },
  setup() {
    const $q = useQuasar();
    const email = ref<string>("");
    const password = ref<string>("");
    const store = useAppStore();
    const router = useRouter();
    const isLoading = ref<boolean>(false);
    const isPwdHide = ref<boolean>(true);
    const isForgotPassword = ref<boolean>(false);
    let dismissNoti: any = null;
    const showNotif = (message: string, type: string, timeout: number) => {
      if (dismissNoti) {
        dismissNoti();
      }
      dismissNoti = $q.notify({
        position: "top",
        type: type,
        message: message,
        timeout: timeout
      });
    };
    const onLoginBtnClick = () => {
      isLoading.value = true;
      const account: { email: string; password: string } = {
        email: email.value,
        password: password.value
      };
      store.dispatch("user/loginApi", {
        account,
        onSuccess: () => {
          isLoading.value = false;
          showNotif("Đăng nhập thành công", "positive", 500);
        },
        onFailure: (error: any) => {
          isLoading.value = false;
          showNotif(
            `Message: ${error.data.errors} (Type: ${error.data.type})`,
            "negative",
            5000
          );
        },
        router
      });
    };
    const handleShowForgotPassword = () => {
      isForgotPassword.value = true;
    };
    const handleCloseDialog = () => {
      isForgotPassword.value = false;
    };
    return {
      email,
      password,
      isPwdHide,
      onLoginBtnClick,
      isLoading,
      isForgotPassword,
      handleCloseDialog,
      handleShowForgotPassword
    };
  }
});
</script>
<style lang="scss" scoped>
.alignCenter {
  align-items: center;
  display: flex;
  justify-content: center;
}

.container {
  height: 100vh;

  .error {
    color: red;
    text-align: center;
  }

  .my-card {
    width: 450px;

    .logo {
      width: 70px;
      height: 70px;
    }

    .forgot-password {
      text-align: center;
      text-decoration: none;
      color: black;
      cursor: pointer;
    }
  }

  .q-field__control {
    color: #1c2b54 !important;
  }
}
</style>
