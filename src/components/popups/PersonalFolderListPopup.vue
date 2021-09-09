<template>
  <q-item class="div--title">
    <div class="row">
      <div class="col-11" style="font-weight: 600; margin: auto">
        Thư mục cá nhân
      </div>
      <div class="col-1">
        <q-btn
          class="btn--close"
          flat
          color="white"
          size="10px"
          icon="close"
          v-close-popup
        ></q-btn>
      </div>
    </div>
  </q-item>
  <q-scroll-area style="height: 230px; padding: 10px 0">
    <q-item
      v-for="folder in personalFolderList"
      :key="folder.id"
      dense
      clickable
    >
      <q-item-section style="padding: 5px 0">
        <div class="row">
          <div class="col-2">
            <q-img
              class="img__folder"
              width="20px"
              src="../../assets/greyfolder.png"
            ></q-img>
          </div>
          <div class="col-10" style="margin: auto; font-size: 12px">
            {{ folder.fileName }}
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-scroll-area>
  <q-item class="div--footer">
    <q-item-section> </q-item-section>
    <q-item-section>
      <q-btn @click="openConfirm" flat dense class="btn--add">Thêm</q-btn>
    </q-item-section>
  </q-item>
  <q-dialog
    persistent
    v-model="confirm"
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card style="width: 650px">
      <q-card-section>
        <div style="font-size: 16px; font-weight: 600; margin: auto">
          Thêm vào thư mục cá nhân?
        </div>
      </q-card-section>

      <q-card-section style="padding: 0 10px">
        <q-btn flat color="orange" size="10px" :icon="'info'"></q-btn> Bạn có
        chắc muốn thêm vào thư mục mà bạn đã chọn không ?
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-10" style="text-align: right">
            <q-btn flat class="btn--confirm">Xác nhận</q-btn>
          </div>
          <div class="col-2" style="text-align: right">
            <q-btn flat class="btn--cancel">Hủy</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
const personalFolderList = [
  {
    id: 1,
    fileName: "Phòng Maketing",
  },
  {
    id: 2,
    fileName: "Phòng Sản Xuất",
  },
  {
    id: 3,
    fileName: "Phòng Nghiên Cứu Phát Triển",
  },
  {
    id: 4,
    fileName: "Phòng Kinh Doanh",
  },
  {
    id: 5,
    fileName: "Phòng Nhân Sự",
  },
  {
    id: 6,
    fileName: "Phòng bảo vệ",
  },
  {
    id: 7,
    fileName: "Phòng Thực Nghiệm",
  },
  {
    id: 8,
    fileName: "Phòng 8",
  },
  {
    id: 9,
    fileName: "Phòng 9",
  },
  {
    id: 10,
    fileName: "Phòng 10",
  },
];
import { ref } from "vue";
export default {
  name: "PersonalFolderPopup",
  setup() {
    const confirm = ref(false);
    const openConfirm = () => {
      confirm.value = true;
    };
    const closeConfirm = () => {
      confirm.value = false;
    };
    return {
      personalFolderList,
      confirm,
      closeConfirm,
      openConfirm,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-item {
  width: 250px;
  .row {
    width: 100%;
  }
  .btn--add {
    height: 35px;
    width: 80px;
    border-radius: 5px;
    text-transform: none;
    color: white;
    background: rgb(28, 43, 84);
    font-size: 12px;
  }
}
.btn--close {
  color: #b4b4b4 !important;
  float: right;
  padding: 0;
}
.div--title {
  border-bottom: 1px solid rgb(200, 200, 200);
}
.div--footer {
  border-top: 1px solid rgb(200, 200, 200);
}
.btn--cancel {
  width: 70px;
  font-size: 10px;
  background: rgb(240, 240, 240);
  color: rgb(180, 180, 180);
}
</style>
