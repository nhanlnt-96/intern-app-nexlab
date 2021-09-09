<template>
  <q-card class="container-dialog">
    <div style="justify-content: flex-end" class="q-pr-md q-pt-md">
      <q-btn
        class="btn--close"
        flat
        color="black"
        size="10px"
        icon="close"
        v-close-popup
      ></q-btn>
    </div>
    <q-stepper
      v-model="step"
      header-nav
      ref="stepper"
      color="primary"
      animated
      alternative-labels
      class="container-dialog"
    >
      <div style="justify-content: flex-end" class="q-ma-md">
        <q-btn
          class="btn--close"
          flat
          color="black"
          size="10px"
          icon="close"
          v-close-popup
        ></q-btn>
      </div>
      <q-step
        :name="1"
        title="Xác thực"
        icon="verified_user"
        :done="step > 1"
        :header-nav="step > 1"
      >
        <div class="content">
          <span class="q-my-md"> Nhập email để xác thực tài khoản </span>
          <q-form @submit.prevent="handleVerifyEmail">
            <q-input
              outlined
              v-model="email"
              type="email"
              label="Email"
              dense
              :rules="[
                (val) => !!val || 'Vui lòng nhập Email',
                (val) =>
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                  'Email không hợp lệ',
              ]"
            />
            <q-btn
              color="primary"
              label="Tiếp tục"
              type="submit"
              :loading="isLoading"
            />
          </q-form>
        </div>
      </q-step>
      <q-step
        :name="2"
        title="Đặt lại mật khẩu"
        icon="password"
        :done="step > 2"
        :header-nav="step > 2"
      >
        <div class="content">
          <span class="q-my-md"
            >Vui lòng nhập mã trong email của bạn. Mã này gồm 6 chữ số
          </span>
          <q-form @submit.prevent="handleResetPassword">
            <q-input
              outlined
              v-model="code"
              label="Code"
              dense
              mask="######"
              :rules="[
                (val) => !!val || 'Vui lòng nhập mã Code',
                (val) => val.length === 6 || 'Vui lòng nhập mã đủ 6 chữ số',
              ]"
            />
            <q-input
              outlined
              v-model="password"
              label="Mật khẩu mới"
              dense
              :type="isPwdShow ? 'text' : 'password'"
              :rules="[
                (val) => !!val || 'Vui lòng nhập mật khẩu',
                (val) =>
                  /(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(val) ||
                  'Mật khẩu phải có ít nhất 8 kí tự, bao gồm các chữ cái và số ',
              ]"
            >
              <template #append>
                <q-icon
                  :name="isPwdShow ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="isPwdShow = !isPwdShow"
                />
              </template>
            </q-input>
            <q-btn
              color="primary"
              label="Tiếp tục"
              type="submit"
              :loading="isLoading"
              class="btn-hi"
            />
            <q-btn
              flat
              color="primary"
              label="Trở lại"
              class="q-ml-sm"
              @click="handleBack"
            />
          </q-form>
        </div>
      </q-step>
      <q-step
        :name="3"
        title="Hoàn thành "
        icon="done"
        :header-nav="step > 3"
        class="container-success"
      >
        <div class="content">
          <div class="container-success">
            <span> Thay đổi mật khẩu thành công </span>
            <q-icon name="check" class="icon_success" />
          </div>
        </div>
      </q-step>
    </q-stepper>
  </q-card>
</template>
<script lang="ts">
import { useAppStore } from "src/store";
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
export default defineComponent({
  emits: ["closeDialog"],
  setup(props, context) {
    const $q = useQuasar();
    const store = useAppStore();
    const email = ref<string>("");
    const code = ref<string>("");
    const password = ref<string>("");
    const step = ref<number>(1);
    const isLoading = ref<boolean>(false);
    const isPwdShow = ref<boolean>(false);
    let dismissNoti: any = null;
    const showNotif = (message: string, type: string, timeout: number) => {
      if (dismissNoti) {
        dismissNoti();
      }
      dismissNoti = $q.notify({
        position: "top",
        type: type,
        message: message,
        timeout: timeout,
      });
    };
    const handleVerifyEmail = () => {
      isLoading.value = true;
      const account: { email: string } = {
        email: email.value,
      };
      store.dispatch("user/handleVerifyEmail", {
        account,
        onSuccess: () => {
          step.value = 2;
          isLoading.value = false;
        },
        onFailure: (error: any) => {
          isLoading.value = false;
          showNotif(
            `Message: ${error.data.errors} (Type: ${error.data.type})`,
            "negative",
            3000
          );
        },
      });
    };
    const handleResetPassword = () => {
      isLoading.value = true;
      const account: { email: string; code: string; password: string } = {
        email: email.value,
        code: code.value,
        password: password.value,
      };
      store.dispatch("user/handleResetPassword", {
        account,
        onSuccess: () => {
          isLoading.value = false;
          step.value = 3;
          setTimeout(() => {
            context.emit("closeDialog");
          }, 2000);
        },
        onFailure: (error: any) => {
          isLoading.value = false;
          showNotif(
            `Message: ${error.data.errors} (Type: ${error.data.type})`,
            "negative",
            3000
          );
        },
      });
    };
    const handleBack = () => {
      step.value = 1;
    };
    return {
      step,
      email,
      password,
      code,
      handleBack,
      handleVerifyEmail,
      handleResetPassword,
      isLoading,
      isPwdShow,
    };
  },
});
</script>
<style lang="scss" scoped>
.container-dialog {
  max-width: 100%;
  display: inline-block;
  width: 50vw;
  .content {
    display: grid;
  }
  .container-success {
    display: grid;
    justify-items: center;
    width: 100%;
    .icon_success {
      font-size: 4rem;
      border-radius: 50%;
      padding: 2rem;
      border-width: medium;
      border: solid #52c41a;
      border-width: 2px;
      margin: 1rem;
      transition: transform 0.2s;
      animation-name: change-color;
      animation-duration: 2s;
    }
  }
  .btn--close {
    color: #b4b4b4;
    float: right;
    padding: 0;
  }
}
@keyframes change-color {
  from {
    color: $primary;
    border-color: $primary;
  }
  to {
    color: #52c41a;
    border-color: #52c41a;
  }
}
</style>
