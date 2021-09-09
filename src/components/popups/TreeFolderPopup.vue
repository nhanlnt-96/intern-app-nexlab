<template>
  <q-card style="width: 100%">
    <q-card-section class="dialog--title">
      <div style="font-size: 14px; font-weight: 600; margin: auto">
        Danh sách thư mục
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
    <q-card-section style="margin: 8px; padding: 8px">
      <q-btn
        @click="backPreviousFolder"
        clickable
        v-if="currentPage.id !== 'root'"
        icon="ti-angle-left"
        size="8px"
        dense
        flat
      />
      {{ handleCurrentPageName() }}
    </q-card-section>
    <q-card-section style="padding: 0 10px">
      <TreeFolderData
        @enter-folder="enterSubFolder"
        :current-page="currentPage.id"
        :is-reload="isReload"
        @update-success="updateSuccess"
      />
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-1" style="text-align: right; padding-right: 8px">
          <q-icon
            v-if="currentPage.id !== 'root'"
            @click="addFolder"
            size="35px"
            color="grey"
            name="create_new_folder"
          />
        </div>
        <div class="col-11" style="text-align: right; margin: auto">
          <q-btn @click="handleMove" class="btn--confirm"
            >Di chuyển đến đây</q-btn
          >
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="isCreateFolderPopUp"
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
  >
    <CreateFolderPopup
      :subfolder-id="currentPage.id"
      @create-success="handleReload"
    />
  </q-dialog>
</template>
<script lang="ts">
import { ref } from "vue";
import TreeFolderData from "./TreeFolderData.vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/store";
import CreateFolderPopup from "components/popups/CreateFolderPopup.vue";
import { getMessageError } from "../../mocks/moveFileOrFolderValidation";
export default {
  name: "TreeFolderPopup",
  components: { TreeFolderData, CreateFolderPopup },
  emits: ["close-move-popup"],
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
  },
  setup(props: any, context: any) {
    const $q = useQuasar();
    const listpage = ref<any[]>([
      {
        name: "",
        id: "root",
      },
    ]);
    const currentPage = ref<any>({
      name: "",
      id: "root",
    });
    const isCreateFolderPopUp = ref(false);
    const store = useAppStore();
    const notificationMessage = ref("");
    const notificationType = ref("");
    const rootFolderId = ref("");
    const isReload = ref(false);
    const handleCurrentPageName = () => {
      let name = "";
      if (currentPage.value.name.length > 50) {
        name = currentPage.value.name.slice(0, 50) + "...";
      } else name = currentPage.value.name;
      return name;
    };
    const handleReload = () => {
      isReload.value = true;
    };
    const updateSuccess = () => {
      isReload.value = false;
    };
    const addFolder = () => {
      isCreateFolderPopUp.value = !isCreateFolderPopUp.value;
    };
    const enterSubFolder = (folder: any) => {
      rootFolderId.value = folder.rootFolderId;
      if (
        listpage.value.filter((element) => {
          return element.id === folder.id;
        }).length === 0
      ) {
        listpage.value.push(folder);
      }
      currentPage.value.id = listpage.value[listpage.value.length - 1].id;
      currentPage.value.name = listpage.value[listpage.value.length - 1].name;
    };
    const backPreviousFolder = () => {
      listpage.value.pop();
      currentPage.value.id = listpage.value[listpage.value.length - 1].id;
      currentPage.value.name = listpage.value[listpage.value.length - 1].name;
    };
    const notityRenameSuccess = () => {
      $q.notify({
        type: notificationType.value,
        position: "top",
        message: notificationMessage.value,
      });
    };
    const move = (folderId: string) => {
      void store.dispatch("file/move", {
        fileOrFolderId: props.id,
        data: {
          folderId: folderId,
        },
        onSuccess: () => {
          notificationType.value = "positive";
          notificationMessage.value = `Đã đi chuyển thư mục "${props.name}" đến thư mục "${currentPage.value.name}".`;
          notityRenameSuccess();
          store.commit("file/setReloadToTrue");
          context.emit("close-move-popup");
        },
        onFailure: (err: any) => {
          notificationType.value = "negative";
          notificationMessage.value = getMessageError(
            err.response.data.errors[0],
            props.name,
            rootFolderId.value
          );
          notityRenameSuccess();
        },
      });
    };
    const handleMove = () => {
      switch (currentPage.value.id) {
        case "root":
          notificationType.value = "warning";
          notificationMessage.value = "Vui lòng chọn thư mục muốn chuyển đến.";
          notityRenameSuccess();
          break;
        case "personal":
          move(store.state.file.personalFolderId);
          break;
        case "shared":
          move(store.state.file.sharedFolderId);
          break;
        case "group":
          move(store.state.file.personalFolderId);
          break;
        default:
          move(currentPage.value.id);
          break;
      }
    };
    return {
      updateSuccess,
      isReload,
      handleReload,
      isCreateFolderPopUp,
      addFolder,
      backPreviousFolder,
      enterSubFolder,
      handleCurrentPageName,
      currentPage,
      handleMove,
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
  width: 170px;
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
.dialog--title {
  background: rgb(28, 42, 83);
  color: white;
  text-transform: none !important;
}
::-webkit-scrollbar {
  display: none;
}
</style>
