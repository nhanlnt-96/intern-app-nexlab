<template>
  <q-card style="width: 650px">
    <q-card-section style="padding: 10px 20px !important">
      <div style="font-size: 16px; font-weight: 400; margin: auto">
        Tạo mới
        <q-btn
          v-close-popup
          class="btn--close"
          flat
          color="white"
          size="10px"
          icon="close"
        ></q-btn>
      </div>
    </q-card-section>

    <q-card-section style="padding: 10px 20px; font-size: 13px">
      Vui lòng nhập tên thư mục
    </q-card-section>

    <q-card-section style="padding: 0 10px">
      <q-input outlined dense v-model="folderName" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-btn v-close-popup flat outline class="btn--cancel">Cancel</q-btn>
      <q-btn
        v-close-popup
        flat
        class="btn--confirm"
        @click="onCreateFolder"
        :disable="!folderName"
        >OK
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { api } from "../../boot/axios";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useAppStore } from "src/store";
import { useQuasar } from "quasar";
import { get } from "lodash";

export default {
  name: "CreateFolderPopup",
  emits: ["create-success"],
  props: {
    subfolderId: String,
  },
  setup(props: any, context: any) {
    onMounted(() => {
      if (typeof props.subfolderId === "undefined") {
        const currentPath = route.currentRoute.value.path;
        if (!route.currentRoute.value.params.id) {
          store.dispatch("file/getRootFolderId", {
            path: getCurrentUrl(currentPath),
            onSuccess: (res: any) => {
              folderId.value = res;
            },
            onFailure: (err: any) => {
              alert(err);
            },
          });
        } else {
          folderId.value = get(route, "currentRoute.value.params.id");
        }
      } else {
        switch (props.subfolderId) {
          case "personal":
            folderId.value = store.state.file.personalFolderId;
            break;
          case "public":
            folderId.value = store.state.file.sharedFolderId;
            break;
          default:
            folderId.value = props.subfolderId;
            break;
        }
      }
    });
    const getCurrentUrl = (currentPath: string) => {
      switch (currentPath) {
        case "/folder-deleted":
          return "trash-drive";
          break;
        case "/organization":
          return "public-drive";
          break;
        default:
          return "my-drive";
      }
    };
    const $q = useQuasar();
    const store = useAppStore();
    const route = useRouter();
    const folderId = ref<any>("");
    let folderName = ref<string>("");
    const notificationMessage = ref("");
    const notificationType = ref("");
    const notityRenameSuccess = () => {
      $q.notify({
        type: notificationType.value,
        position: "top",
        message: notificationMessage.value,
      });
    };
    const onCreateFolder = async () => {
      await api
        .post("/files", {
          name: folderName.value,
          folderId: folderId.value,
        })
        .then(() => {
          notificationType.value = "positive";
          notificationMessage.value = `Tạo thư mục "${folderName.value}" thành công.`;
          notityRenameSuccess();
          context.emit("create-success");
          store.commit("file/setReloadToTrue");
        })
        .catch(() => {
          notificationType.value = "negative";
          notificationMessage.value = "Đã có lỗi xảy ra.";
          notityRenameSuccess();
        });
    };
    return {
      folderName,
      onCreateFolder,
      getCurrentUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-pt-none {
  display: flex;
  justify-content: flex-end;
  text-transform: none;
  padding: 20px 15px;
  border-top: 1px;
}

.btn--confirm {
  font-size: 12px;
  background: rgb(28, 42, 83);
  color: white;
  text-transform: none !important;
}

.btn--close {
  color: #b4b4b4 !important;
  float: right;
  padding: 0;
}

.btn--cancel {
  font-size: 12px;
  color: rgb(180, 180, 180);
  text-transform: none !important;
  margin-right: 10px;
  border: 1px solid #b4b4b4;
}
</style>
