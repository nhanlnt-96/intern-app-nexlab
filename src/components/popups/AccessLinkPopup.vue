<template>
  <q-card style="width: 650px">
    <q-card-section style="padding: 10px 20px !important">
      <div style="font-size: 14px; font-weight: 600; margin: auto">
        <q-btn
          class="icon--title"
          flat
          color="white"
          size="10px"
          :icon="'fas fa-link'"
        ></q-btn
        >
        Nhận đường liên kết
      </div>
    </q-card-section>

    <q-card-section class="input--link" style="padding: 0 10px">
      <div class="row">
        <div class="col-7">
          <input type="text" :value="linkToShare" />
        </div>
        <div class="col-5">
          <q-btn class="btn--save-link" @click="onCopyBtnClick" flat>Sao chép đường liên kết</q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section
      style="
        padding: 10px 20px;
        font-size: 12px;
        color: rgb(210, 210, 210);
        margin-bottom: 20px;
      "
    >
      Bất kỳ ai có ai kết nối internet và có đường liên kết này đều có thể tải
      xuống
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-10" style="text-align: right">
          <q-btn v-close-popup flat class="btn--confirm">Xong</q-btn>
        </div>
        <div class="col-2" style="text-align: right">
          <q-btn v-close-popup flat class="btn--cancel">Hủy</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { copyToClipboard } from "quasar";

export default {
  name: "AccessLinkPopup",
  props: {
    linkToShare: {
      type: String
    }
  },
  methods: {
    onCopyBtnClick() {
      copyToClipboard(this.linkToShare)
        .then(() => {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "Sao chép thành công.",
            timeout: 2000
          });
        })
        .catch(() => {
          this.$q.notify({
            position: "top",
            message: "Sao chép không thành công.",
            timeout: 2000
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.icon--title {
  padding: 10px 10px;
  margin-right: 10px;
  background: rgb(28, 43, 84);
  border-radius: 50px;
}

.q-pt-none {
  text-transform: none;
  padding: 20px 30px;
  border-top: 1px;
}

.btn--confirm {
  height: 30px;
  width: 70px;
  font-size: 12px;
  background: rgb(28, 42, 83);
  color: white;
  text-transform: none !important;
}

.btn--cancel {
  width: 70px;
  font-size: 12px;
  background: rgb(240, 240, 240);
  color: rgb(180, 180, 180);
  text-transform: none !important;
}

.btn--save-link {
  background: rgb(242, 246, 255);
  color: rgb(26, 41, 84);
  text-transform: none !important;
}

.input--link {
  margin: auto;
  padding: 10px 15px !important;

  .col-7 {
    width: 60%;
    margin: auto;

    input {
      width: 100%;
      padding: 7px 20px;
      border-radius: 5px;
      margin: auto;
      background: rgb(217, 229, 255);
      color: rgb(142, 152, 254);
      border: none;
    }
  }

  .col-5 {
    width: 40%;
    padding: 5px 5px;
    text-align: right;

    .btn--save-link {
      text-align: right;
      border-radius: 5px;
      font-size: 14px;
      padding: 4px 15px !important;
      font-weight: 550;
    }
  }
}
</style>
