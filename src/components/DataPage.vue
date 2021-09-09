<template>
  <!-- Search -->
  <div class="q-pb-md text-weight-bold row" style="justify-content: flex-end">
    <q-input
      outlined
      v-model="searchKeyword"
      placeholder="Tìm kiếm theo tên"
      class="bg-grey-3"
      dense
      @keyup="handleSearch"
    >
      <template #prepend>
        <q-icon name="eva-search-outline" />
      </template>
    </q-input>
  </div>
  <div class="row link">
    <div class="col-11">Tất cả</div>
    <div class="col-1">
      <q-btn
        class="btn--grid"
        flat
        dense
        :size="'18'"
        @click="changePresentList()"
        :icon="isGrid ? 'view_list' : 'window'"
      >
      </q-btn>
    </div>
  </div>
  <div class="row">
    <div
      :class="
        detailPopup ? 'q-pa-xs col-xs-8 col-sm-8 col-md-8 col-lg-9' : 'col-12'
      "
    >
      <q-table
        :grid="isGrid"
        v-model="isGrid"
        flat
        :rows="dataTable"
        :columns="columns"
        row-key="name"
        :pagination="pagination"
        :loading="loading"
        no-data-label="Không có dữ liệu."
        :hide-bottom="dataTable.length > 0"
      >
        <template #body="{ row }">
          <q-tr @dblclick="handleOpenFolder(row)">
            <q-td width="70%" key="filename" style="max-width: 600px">
              <div class="row file-name">
                <div class="col-2 q-pr-sm" style="width: 3rem">
                  <img
                    style="height: 1.5rem"
                    :src="require(`./../assets/${row.type}.svg`)"
                    :alt="row.type"
                  />
                </div>
                <div class="col ellipsis">
                  {{ row.name }}
                </div>
              </div>
            </q-td>
            <q-td key="uploaddate">
              {{ convertDateTime(row.createdAt) }}
            </q-td>
            <q-td key="size" class="td-size">
              {{ convertDataSize(row.size) }}
            </q-td>
            <q-td key="uploader">
              <UserAvatar :avatar-url="row.User.avatarUrl" :first-name="row.User.firstName" />
              {{ row.User.lastName }} {{ row.User.firstName }}
            </q-td>
            <q-td width="2%" key="uploader">
              <q-btn
                class="btn--option"
                :id="'btn--option--' + row.id"
                flat
                dense
                size="sm"
                icon="more_vert"
              >
                <OptionsPopup
                  :file-data="row"
                  :current-page="currentPage"
                  @show-detail="showDetail"
                  @handle-open-folder="handleOpenFolder(row)"
                  @show-peronal-folders="showPersonalFolders(row.id)"
                />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template #item="{ row }">
          <div
            :class="
              detailPopup
                ? `q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4`
                : `q-pa-xs col-xs-3 col-sm-3 col-md-3 col-lg-3`
            "
          >
            <q-card @dblclick="handleOpenFolder(row)">
              <q-card-section class="text-center">
                <q-img
                  height="100px"
                  width="100px"
                  :src="require(`./../assets/${row.type}.svg`)"
                  :alt="row.type"
                />
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-11 ellipsis">
                    {{ row.name }}
                  </div>
                  <div class="col-1">
                    <q-btn flat dense size="sm" icon="more_horiz">
                      <OptionsPopup
                        :file-data="row"
                        :currentpage="currentPage"
                        @show-detail="showDetail"
                        @handle-open-folder="handleOpenFolder(row)"
                        @show-peronal-folders="showPersonalFolders(row.id)"
                      />
                    </q-btn>
                  </div>
                </div>
                <div class="row file-info">
                  <div class="col-4">
                    Size
                    {{ convertDataSize(row.size) }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-3" v-if="detailPopup">
      <DetailPopup
        @closeDetail="closeDetailPopup"
        :data-view-detail="dataViewDetail"
      />
    </div>
  </div>
  <q-menu
    v-if="isPersonalFoldersShown"
    :target="id"
    v-model="isPersonalFoldersShown"
  >
    <PersonalFolderPopup></PersonalFolderPopup>
  </q-menu>
  <q-dialog v-model="openRestore">
    <RestorePopup :file-data="fileData" />
  </q-dialog>
</template>
<script>
import { column } from "../configs/fileDataTableColumn";
import { convertBytes } from "../store/module-file/actions";
import PersonalFolderPopup from "./popups/PersonalFolderListPopup.vue";
import { ref, computed, watch, onMounted } from "vue";
import OptionsPopup from "./popups/OptionsPopup.vue";
import DetailPopup from "./popups/DetailPopup.vue";
import { useRouter } from "vue-router";
import { useAppStore } from "src/store";
import moment from "moment";
import { get } from "lodash";
import { useQuasar } from "quasar";
import UserAvatar from "./UserAvatar";
import RestorePopup from "./popups/RestorePopup.vue";

export default {
  name: "DataPageContent",
  components: { UserAvatar, OptionsPopup, DetailPopup, PersonalFolderPopup, RestorePopup },
  setup() {
    const $q = useQuasar();
    const isPersonalFoldersShown = ref(true);
    const detailPopup = ref(false);
    const router = useRouter();
    const store = useAppStore();
    const rows = ref([]);
    const loading = ref(true);
    const id = ref("");
    const searchKeyword = ref("");
    const dataTable = ref([]);
    const openRestore = ref(false);
    const dataViewDetail = ref({});
    const currentPath = get(router, "currentRoute.value.path");
    const fileData = ref({});
    const apiUrl = () => {
      switch (currentPath) {
        case "/folder-deleted":
          return "trash-drive";
          break;
        case "/organization":
          return "public-drive";
          break;
        case "/folder-shared":
          return "share-with-me-drive";
          break;
        default:
          return "my-drive";
      }
    };
    const isGrid = computed(() => {
      return get(store, "state.file.isViewGrid");
    });
    const showPersonalFolders = (idrow) => {
      id.value = "#btn--option--" + idrow;
      isPersonalFoldersShown.value = true;
    };
    const closeDetailPopup = () => {
      detailPopup.value = false;
    };
    const closePopup = () => {
      return detailPopup.value;
    };
    const showDetail = (fileId) => {
      dataViewDetail.value = rows.value.find((item) => item.id === fileId);
      detailPopup.value = true;
    };
    const changePresentList = () => {
      store.commit("file/handleViewGrid");
    };
    const handleOpenFolder = (rowData) => {
      if (currentPath === "/folder-deleted") {
        fileData.value = rowData;
        return openRestore.value = true;
      }
      switch (rowData.type) {
        case "folder":
          router.push(`${currentPath}/${rowData.id}`);
          break;
        case "photo":
          //display image not working on Google Doc Viewer
          window.open(rowData.storageUrl);
          break;
        case "application":
        case "doc":
          window.open(
            `https://drive.google.com/viewerng/viewer?url=${rowData.storageUrl}?alt=3Dmedia?pid=explorer&efh=false&a=v&chrome=false&embedded=true`
          );
          break;
      }
    };
    const convertDateTime = (date) => {
      return moment(date).format("HH:mm DD/MM/YYYY");
    };
    const convertDataSize = (data) => {
      return convertBytes(parseInt(data));
    };
    const getSubFolder = () => {
      loading.value = true;
      store.dispatch("file/getFilesBasedOnUrl", {
        apiUrl: apiUrl(),
        onSuccess: (res) => {
          loading.value = false;
          rows.value = res;
          dataTable.value = res;
        },
        onFailure: (error) => {
          $q.notify({
            position: "top",
            type: "negative",
            message: `Message: ${error.data.errors} (Type: ${error.data.type})`,
            timeout: 5000
          });
          loading.value = false;
        }
      });
    };
    const handleSearch = () => {
      if (searchKeyword.value === "") {
        dataTable.value = rows.value;
      } else {
        dataTable.value = rows.value.filter((val) =>
          val.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
      }
    };
    onMounted(() => {
      getSubFolder();
    });
    const reload = computed(() => {
      return store.state.file.reload;
    });
    watch(reload, () => {
      // to reload table after adding new folder or file
      if (reload.value === true) {
        store.commit("file/setReloadToFalse");
        getSubFolder();
      }
    });

    return {
      showPersonalFolders,
      id,
      isPersonalFoldersShown,
      pagination: {
        rowsPerPage: 0
      },
      columns: column,
      rows,
      isGrid,
      changePresentList,
      showDetail,
      detailPopup,
      closeDetailPopup,
      currentPage: router.currentRoute.value.path,
      closePopup,
      handleOpenFolder,
      loading,
      convertDateTime,
      convertDataSize,
      getSubFolder,
      handleSearch,
      searchKeyword,
      dataTable,
      openRestore,
      fileData,
      dataViewDetail
    };
  }
};
</script>

<style lang="scss" scoped>
.q-card__section .q-btn {
  background: none;

  &:hover {
    background: none;
    color: rgb(28, 42, 83);
  }
}

.file-name {
  align-items: center;
  display: flex;
}

.row.file-info {
  color: rgb(200, 200, 200);
}

.row.link {
  border-bottom: 1px solid rgb(210, 210, 210);
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgb(190, 190, 190);
  font-weight: 500;
}

.col-11 {
  padding: 5px 0;
}

.col-1 {
  text-align: right;
  padding-right: 5px;
}

.btn--grid {
  background: rgb(210, 210, 210);
  color: rgb(150, 150, 150);
  padding: 5px 4px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background: rgb(28, 42, 83);
    color: white;
  }
}

.td-size {
  text-align: center;
}
</style>
