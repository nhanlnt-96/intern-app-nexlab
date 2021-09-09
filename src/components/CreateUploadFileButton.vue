<template>
  <q-btn
    flat
    dense
    :size="'xs'"
    class="btn--custom"
    icon="ti-plus"
    :disable="btnIsDisable()"
  >
    <q-menu
      transition-show="jump-down"
      transition-hide="jump-up"
      style="padding: 10px 0"
    >
      <q-list style="min-width: 200px">
        <q-item
          clickable
          @click="onCreateUploadBtnClick('upload')"
          v-close-popup
        >
          <q-item-section class="menu--item">
            <q-icon name="fas fa-upload" />
            Tải tệp tin lên
          </q-item-section>
        </q-item>
        <q-item
          clickable
          @click="onCreateUploadBtnClick('create')"
          v-close-popup
        >
          <q-item-section class="menu--item">
            <q-icon name="fas fa-folder-plus" />
            Tạo thư mục mới
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-dialog
      v-model="isCreateFolderPopUp"
      transition-show="fade"
      transition-hide="fade"
      persistent
    >
      <CreateFolderPopup />
    </q-dialog>
    <q-dialog
      v-model="uploadFilePopUp"
      transition-show="fade"
      transition-hide="fade"
      persistent
    >
      <UploadFilePopup @upload-file="closePopup('upload')" />
    </q-dialog>
  </q-btn>
</template>

<script lang="ts">
import CreateFolderPopup from "components/popups/CreateFolderPopup.vue";
import UploadFilePopup from "../components/popups/UploadFilePopup.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "src/store";

export default {
  name: "CreateUploadFileButton",
  components: { UploadFilePopup, CreateFolderPopup },
  setup() {
    onMounted(() => {
      btnIsDisable();
    });
    const store = useAppStore();
    const isFileOwner = computed(() => {
      return store.state.file.isOwnFile;
    });
    const uploadFilePopUp = ref(false);
    const isCreateFolderPopUp = ref(false);
    const router = useRouter();
    const isLogged = store.state.user.isLogged;
    const currentRoutePath = ref(router.currentRoute.value.path);
    const closePopup = (type: any) => {
      if (type === "upload") {
        uploadFilePopUp.value = false;
      } else {
        isCreateFolderPopUp.value = false;
      }
    };
    const onCreateUploadBtnClick = (type: any) => {
      if (type === "upload") {
        uploadFilePopUp.value = true;
      } else {
        isCreateFolderPopUp.value = true;
      }
    };
    const btnIsDisable = () => {
      if (!isLogged || currentRoutePath.value === "/folder-shared" || !isFileOwner.value) {
        return true;
      }
      return false;
    };
    return {
      onCreateUploadBtnClick,
      uploadFilePopUp,
      isCreateFolderPopUp,
      closePopup,
      btnIsDisable,
      isFileOwner
    };
  }
};
</script>

<style lang="scss" scoped>
.btn--custom {
  background-color: #1c2b54 !important;
  color: white !important;
}

.q-item:hover {
  background-color: rgba(135, 202, 255, 0.3);
}

.menu--item {
  justify-content: unset;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  font-size: 16px;
  font-weight: 400;

  i {
    margin-right: 10px;
    font-size: 18px;
  }
}
</style>
