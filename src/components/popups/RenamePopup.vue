<template>
  <q-card style="width: 450px">
    <q-card-section style="padding: 10px 20px !important">
      <div
        style="
          font-size: 14px;
          font-weight: 600;
          margin: auto;
          padding-top: 12px;
        "
      >
        Đổi tên
        <q-btn
          class="btn--close"
          flat
          color="white"
          size="10px"
          icon="close"
          v-close-popup
        ></q-btn>
      </div>
    </q-card-section>

    <q-card-section class="input--link" style="padding: 0 10px">
      <q-input
        v-model="data.name"
        @keyup="notifyTextChange"
        dense
        outlined
      ></q-input>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-10" style="text-align: right; padding-right: 8px">
          <q-btn
            :disable="!textChange || data.name === ''"
            v-close-popup="closePopup()"
            @click="handleRename"
            class="btn--confirm"
            >Xong</q-btn
          >
        </div>
        <div class="col-2" style="text-align: right">
          <q-btn v-close-popup flat class="btn--cancel">Hủy</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { ref } from "vue";
import { useAppStore } from "src/store";
import { useQuasar } from "quasar";
export default {
  name: "RenamePopup",
  props: {
    id: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  setup(props: any) {
    const $q = useQuasar();
    const closeRename = ref(true);
    const store = useAppStore();
    const notificationMessage = ref("");
    const notificationType = ref("");
    const textChange = ref(false);
    const data = ref<any>({
      id: props.id,
      name: props.fileName,
    });
    const oldName = data.value.name;
    const closePopup = () => {
      return closeRename.value;
    };
    const notifyTextChange = () => {
      if (data.value.name.trim() !== oldName) {
        textChange.value = true;
      } else {
        textChange.value = false;
      }
    };
    const notityRenameSuccess = () => {
      $q.notify({
        type: notificationType.value,
        position: "top",
        message: notificationMessage.value,
      });
    };

    const handleRename = () => {
      if (props.fileName !== data.value.name) {
        store.dispatch("file/rename", {
          fileOrFolderId: data.value.id,
          data: {
            name: data.value.name,
          },
          onSuccess: () => {
            notificationType.value = "positive";
            notificationMessage.value = `Đã đổi "${props.fileName}" thành "${data.value.name}".`;
            notityRenameSuccess();
            closeRename.value = true;
            store.commit("file/setReloadToTrue");
          },
          onFailure: (err: any) => {
            notificationType.value = "negative";
            if (err.response.data.errors[0].indexOf("name") !== -1) {
              notificationMessage.value = `Tên "${data.value.name}" đã tồn tại.`;
            } else {
              notificationMessage.value =
                "Bạn không được phép đổi tên đổi tên thư muc này";
            }
            closeRename.value = true;
            notityRenameSuccess();
          },
        });
      } else {
        closeRename.value = true;
      }
    };

    return {
      textChange,
      notifyTextChange,
      closeRename,
      data,
      handleRename,
      closePopup,
    };
  },
};
</script>
<style lang="scss" scoped>
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
.input--link {
  margin: auto;
  padding: 10px 15px !important;

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
.btn--close {
  color: #b4b4b4 !important;
  float: right;
  padding: 0;
}
</style>
