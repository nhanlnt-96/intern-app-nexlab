<template>
  <q-menu
    v-if="!optionRestore"
    transition-show="jump-down"
    transition-hide="jump-up"
  >
    <q-list style="min-width: 230px">
      <q-item clickable @click="handleOpenFolder">
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="ti-eye"></q-icon>
          </div>
          <div class="col-8">Xem</div>
        </div>
      </q-item>
      <q-item
        @click="showPersonalFolders"
        v-close-popup
        v-if="false && isPersonalFolder !== -1"
        clickable
      >
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="fas fa-folder-plus"></q-icon>
          </div>
          <div class="col-9">Thêm vào thư mục cá nhân</div>
          <div class="col-1">
            <q-icon style="font-size: 12px" name="ti-angle-right"></q-icon>
          </div>
        </div>
      </q-item>

      <q-item
        v-if="isPersonalFolder !== -1 || isOrganizationFolder !== -1 || !isFileOwner"
        clickable
        v-close-popup
        @click="showTreeFolderPopup"
      >
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="ti-arrow-right"></q-icon>
          </div>
          <div class="col-8">Di chuyển</div>
        </div>
      </q-item>
      <q-item clickable v-close-popup @click="showAccessPopup" v-if="isSharedFolder === -1 || !isFileOwner">
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="fas fa-link"></q-icon>
          </div>
          <div class="col-8">Nhận đường liên kết</div>
        </div>
      </q-item>
      <q-item
        v-if="isPersonalFolder !== -1 || isOrganizationFolder !== -1"
        @click="showRenamePopup"
        clickable
        v-close-popup
      >
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="ti-pencil"></q-icon>
          </div>
          <div class="col-8">Đổi tên</div>
        </div>
      </q-item>
      <q-item v-if="isPersonalFolder !== -1 || isSharedFolder === -1 || !isFileOwner" clickable>
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="fas fa-share"></q-icon>
          </div>
          <div class="col-9">Chia sẻ</div>
          <div class="col-1">
            <q-icon style="font-size: 12px" name="ti-angle-right"></q-icon>
          </div>
        </div>
        <q-menu
          self="bottom right"
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <q-list>
            <q-item clickable v-close-popup @click="shareFolder = true">
              <div class="row">
                <div class="col-4">
                  <q-icon style="font-size: 14px" name="fas fa-user"></q-icon>
                </div>
                <div class="col-8">Cá nhân</div>
              </div>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
      <q-separator></q-separator>
      <q-item clickable v-close-popup @click="showDetail">
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="las la-info"></q-icon>
          </div>
          <div class="col-8">Chi tiết</div>
        </div>
      </q-item>
      <q-item
        v-if="isSharedFolder !== -1"
        clickable
        v-close-popup
        @click="handleDownload"
      >
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="save_alt"></q-icon>
          </div>
          <div class="col-8">Tải xuống</div>
        </div>
      </q-item>
      <q-separator></q-separator>
      <q-item v-if="isLogged" clickable v-close-popup @click="showDelete">
        <div class="row">
          <div class="col-2">
            <q-icon style="font-size: 14px" name="ti-trash"></q-icon>
          </div>
          <div class="col-8 text-delete">Xóa</div>
        </div>
      </q-item>
    </q-list>
  </q-menu>
  <q-menu v-else transition-show="jump-down" transition-hide="jump-up">
    <q-item
      clickable
      v-close-popup
      @click="showRestore"
      style="min-width: 230px"
    >
      <div class="row">
        <div class="col-2">
          <q-icon style="font-size: 14px" name="restore"></q-icon>
        </div>
        <div class="col-8">Khôi phục</div>
      </div>
    </q-item>
  </q-menu>
  <q-dialog
    v-model="accessLink"
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
  >
    <AccessLinkPopup :link-to-share="linkToShare" />
  </q-dialog>
  <q-dialog
    v-model="isRenamed"
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
  >
    <RenamePopup :id="$props.fileData.id" :file-name="$props.fileData.name" />
  </q-dialog>
  <q-dialog
    v-model="shareFolder"
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
  >
    <ShareListPopup :option="shareOption" :file-id="fileData.id" />
  </q-dialog>
  <q-dialog
    v-model="treeFolder"
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
  >
    <TreeFolderPopup
      @close-move-popup="showTreeFolderPopup"
      :id="fileData.id"
      :name="fileData.name"
    />
  </q-dialog>
  <q-dialog v-model="openDelete">
    <DeletePopup :file-data="fileData" />
  </q-dialog>
  <q-dialog v-model="openRestore">
    <RestorePopup :file-data="fileData" />
  </q-dialog>
</template>

<script>
import { sharePublicFileFolder } from "../../services";
import AccessLinkPopup from "./AccessLinkPopup.vue";
import ShareListPopup from "./ShareListPopup.vue";
import DeletePopup from "./DeletePopup.vue";
import RenamePopup from "./RenamePopup.vue";
import RestorePopup from "./RestorePopup.vue";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { get } from "lodash";
import TreeFolderPopup from "./TreeFolderPopup.vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/store";

export default {
  name: "OptionsPopup",
  components: {
    RenamePopup,
    AccessLinkPopup,
    ShareListPopup,
    DeletePopup,
    RestorePopup,
    TreeFolderPopup
  },
  props: {
    currentPage: {
      type: String,
      required: true
    },
    fileData: {
      type: Object,
      required: true
    }
  },
  emits: ["show-detail", "handleOpenFolder", , "show-peronal-folders"],
  setup(props, context) {
    const isRenamed = ref(false);
    const accessLink = ref(false);
    const shareFolder = ref(false);
    const treeFolder = ref(false);
    const shareOption = ref("personal");
    const openDelete = ref(false);
    const openRestore = ref(false);
    const isPersonalFolder = props.currentPage.indexOf("/personal-folder");
    const isSharedFolder = props.currentPage.indexOf("/folder-shared");
    const isOrganizationFolder = props.currentPage.indexOf("/organization");
    const linkToShare = ref("");
    const router = useRouter();
    const store = useAppStore();
    const $q = useQuasar();
    let dismissNoti = null;
    const isLogged = store.state.user.isLogged;
    const isFileOwner = computed(() => {
      return store.state.file.isOwnFile;
    });

    function showDetail() {
      context.emit("show-detail", props.fileData.id);
    }

    const closePopup = () => {
      accessLink.value = false;
      shareFolder.value = false;
    };
    const showPersonalPopup = () => {
      shareOption.value = "personal";
      shareFolder.value = true;
    };
    const showOrganizationPopup = () => {
      shareOption.value = "organization";
      shareFolder.value = true;
    };
    const showAccessPopup = () => {
      const baseUrl = "https://internship-august-2021.web.app";
      return sharePublicFileFolder(props.fileData.id).then(async (res) => {
        if (res.data.success) {
          const response = await sharePublicFileFolder(props.fileData.id);
          if (response.data.success) {
            accessLink.value = true;
            return (linkToShare.value = `${baseUrl}/public-link/${props.fileData.id}`);
          }
        }
      }).catch(() => {
        accessLink.value = true;
        return (linkToShare.value = `${baseUrl}/public-link/${props.fileData.id}`);
      });
    };
    const showRenamePopup = () => {
      isRenamed.value = true;
    };
    const showTreeFolderPopup = () => {
      treeFolder.value = !treeFolder.value;
    };
    const showDelete = () => {
      openDelete.value = true;
    };
    const showRestore = () => {
      openRestore.value = true;
    };
    const handleOpenFolder = () => {
      context.emit("handleOpenFolder", true);
    };
    const showPersonalFolders = () => {
      context.emit("show-peronal-folders");
    };
    const optionRestore = computed(() => {
      if (get(router, "currentRoute.value.path") === "/folder-deleted") {
        return true;
      }
      return false;
    });

    const showNotif = (message, type, timeout) => {
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
    const handleDownload = () => {
      showNotif("Đang nén tệp", "ongoing", 5000);
      store.dispatch("file/getDownloadFileorFolder", {
        fileId: props.fileData.id,
        fileName: props.fileData.name,
        size: props.fileData.size,
        onSuccess: () => {
          dismissNoti();
        },
        onFailure: (err) => {
          const message = `${err.errors} (Type: ${err.type}})`;
          showNotif(message, "negative", 5000);
        }
      });
    };

    return {
      isOrganizationFolder,
      isSharedFolder,
      isPersonalFolder,
      showPersonalFolders,
      isRenamed,
      showDetail,
      openDelete,
      accessLink,
      showRenamePopup,
      showAccessPopup,
      showOrganizationPopup,
      showPersonalPopup,
      showTreeFolderPopup,
      closePopup,
      treeFolder,
      shareFolder,
      shareOption,
      showDelete,
      handleOpenFolder,
      linkToShare,
      optionRestore,
      openRestore,
      showRestore,
      handleDownload,
      isLogged,
      isFileOwner
    };
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  margin: auto;
}

.q-item {
  font-size: 12px;
  height: 35px;
  min-height: 20px;
  min-width: 120px;
  padding: 5px 10px;

  .col-4 {
    color: rgb(190, 190, 190);
  }

  .col-2 {
    text-align: center;
    color: rgb(190, 190, 190);
  }

  .text-delete {
    color: rgba(230, 20, 0, 0.9);
  }

  .col-1 {
    text-align: right;
    color: rgb(100, 100, 100);
  }
}

div.q-card__section {
  margin-left: 10px;
  padding: 20px 10px;
}
</style>
