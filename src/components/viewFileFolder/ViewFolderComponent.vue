<template>
  <!-- current folder info -->
  <div v-if="showInfo">
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
    <!-- Info -->
    <div class="q-px-lg q-mb-xl dp-flex">
      <div class="q-pr-lg align-items-center dp-flex" style="cursor: pointer">
        <q-icon name="ti-arrow-left" size="30px" @click="handleGoBack"></q-icon>
      </div>
      <q-img
        src="../../assets/yellowfolder.png"
        spinner-color="white"
        style="height: 90px; max-width: 120px"
      />
      <div class="column q-pl-md">
        <div class="col text-h5 text-weight-bold ellipsis" style="width: 70vw">
          {{ currentFolderInfo.name }}
        </div>
        <div class="col ct-text-gray">
          <span class="q-mr-xl"
          >{{ calcFileNumber().totalFile }} và
            {{ calcFileNumber().totalFolder }}</span
          >
          <span
          >Tổng dung lượng Folder
            {{ convertDataSize(currentFolderInfo.size, true) }}</span
          >
        </div>
      </div>
    </div>
  </div>
  <!-- datatable -->
  <div>
    <!-- btn -->
    <q-tabs
      v-model="tab"
      class="text-black"
      active-color="primary"
      indicator-color="primary"
      no-caps
      align="left"
      narrow-indicator
    >
      <q-tab name="doc" label="Tài liệu" />
      <q-space />
      <q-btn
        class="btn--grid"
        flat
        dense
        size="18"
        @click="changePresentList()"
        :icon="isGrid ? 'view_list' : 'window'"
      >
      </q-btn>
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="doc">
        <div class="row">
          <div
            :class="
              detailPopup
                ? 'q-pa-xs col-xs-8 col-sm-8 col-md-8 col-lg-9'
                : 'col-12'
            "
          >
            <q-table
              :grid="isGrid"
              v-model="isGrid"
              flat
              no-data-label="Không có dữ liệu."
              :rows="dataTable"
              :columns="columns"
              :loading="loading"
              row-key="name"
              :hide-bottom="dataTable.length > 0"
              :pagination="pagination"
            >
              <template #body="{ row }">
                <q-tr @dblclick="handleOpenFolder(row)">
                  <q-td width="70%" key="filename" style="max-width: 600px">
                    <div class="row file-name">
                      <div class="icon q-pr-sm" style="width: 3rem">
                        <img
                          style="height: 1.5rem"
                          :src="require(`../../assets/${row.type}.svg`)"
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
                    <UserAvatar :avatar-url="row.User.avatarUrl"
                                :first-name="row.User.firstName" />
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
                        :src="require(`../../assets/${row.type}.svg`)"
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
                              :current-page="currentPage"
                              @show-detail="showDetail"
                              @handle-open-folder="handleOpenFolder(row)"
                              @show-peronal-folders="
                                showPersonalFolders(row.id)
                              "
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
          <div
            class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-3"
            v-if="detailPopup"
          >
            <DetailPopup
              @closeDetail="closeDetailPopup"
              :data-view-detail="dataViewDetail"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <q-menu
    v-if="isPersonalFoldersShown"
    :target="id"
    v-model="isPersonalFoldersShown"
  >
    <PersonalFolderPopup></PersonalFolderPopup>
  </q-menu>
</template>
<script lang="ts">
import { IFile } from "@model";
import PersonalFolderPopup from "../popups/PersonalFolderListPopup.vue";
import { defineComponent } from "vue";
import { ref, onMounted, computed, watch } from "vue";
import OptionsPopup from "../popups/OptionsPopup.vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useAppStore } from "src/store";
import { convertBytes } from "src/store/module-file/actions";
import moment from "moment";
import { get } from "lodash";
import { useQuasar } from "quasar";
import { column } from "../../configs/fileDataTableColumn";
import DetailPopup from "../popups/DetailPopup.vue";
import UserAvatar from "../UserAvatar.vue";

export default defineComponent({
  components: {
    UserAvatar,
    OptionsPopup,
    PersonalFolderPopup,
    DetailPopup
  },
  setup() {
    const $q = useQuasar();
    const isPersonalFoldersShown = ref(true);
    const detailPopup = ref<boolean>(false);
    const router = useRouter();
    const route = useRoute();
    const folderId = route.params.id;
    const store = useAppStore();
    const rows = ref<any>([]);
    const currentFolderInfo = ref<any>({});
    const loading = ref<boolean>(true);
    const id = ref("");
    const searchKeyword = ref<string>("");
    const dataTable = ref<any>([]);
    const dataViewDetail = ref({});
    const showInfo = ref<boolean>(false);
    const isGrid = computed(() => {
      return get(store, "state.file.isViewGrid");
    });
    const showPersonalFolders = (idrow: any) => {
      id.value = "#btn--option--" + idrow;
      isPersonalFoldersShown.value = true;
    };
    const showDetail = (fileId: string) => {
      console.log("showDetail");
      dataViewDetail.value = rows.value.find((item: any) => item.id === fileId);
      detailPopup.value = true;
    };
    const handleOpenFolder = (rowData: IFile) => {
      switch (rowData.type) {
        case "folder":
          router.push({
            path: rowData.id
          });
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
    const calcFileNumber = () => {
      const filesInCurrentFolder = rows.value.filter(
        (val: { type: string }) => val.type !== "folder"
      );
      let totalFile: any = filesInCurrentFolder.length;
      let totalFolder: any = rows.value.length - totalFile;
      totalFile = totalFile > 1 ? `${totalFile} Files` : `${totalFile} File`;
      totalFolder =
        totalFolder > 1 ? `${totalFolder} Folders` : `${totalFolder} Folder`;
      return {
        totalFile,
        totalFolder
      };
    };
    const convertDateTime = (date: any) => {
      return moment(date).format("HH:mm DD/MM/YYYY");
    };
    const convertDataSize = (data: any, isCurrentFolder?: boolean) => {
      return convertBytes(parseInt(data), isCurrentFolder);
    };
    const changePresentList = () => {
      store.commit("file/handleViewGrid");
    };
    const getSubFolder = (folderId: string | string[]) => {
      detailPopup.value = false;
      loading.value = true;
      store.dispatch("file/getDataViewSubFolder", {
        parentFolderId: folderId,
        onSuccess: (res: any) => {
          loading.value = false;
          currentFolderInfo.value = res.currentFolder;
          rows.value = res.dataTable;
          dataTable.value = res.dataTable;
          showInfo.value = res.currentFolder && true;
        },
        onFailure: (error: any) => {
          // user enter wrong id : bad request
          if (error.status === 400) {
            router.push("/not-found");
          } else {
            $q.notify({
              position: "top",
              type: "negative",
              message: `Message: ${error.data.errors} (Type: ${error.data.type})`,
              timeout: 5000
            });
          }
          loading.value = false;
        }
      });
    };
    const handleSearch = () => {
      if (searchKeyword.value === "") {
        dataTable.value = rows.value;
      } else {
        dataTable.value = rows.value.filter((val: any) =>
          val.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
      }
    };
    onMounted(() => {
      getSubFolder(folderId);
    });
    const reload = computed(() => {
      return store.state.file.reload;
    });
    watch(reload, () => {
      if (reload.value) {
        store.commit("file/setReloadToFalse");
        getSubFolder(route.params.id);
      }
    });
    onBeforeRouteUpdate((to, from, next) => {
      getSubFolder(to.params.id);
      next();
    });
    const closePopup = () => {
      return detailPopup.value;
    };
    const closeDetailPopup = () => {
      detailPopup.value = false;
    };
    return {
      id,
      showPersonalFolders,
      isPersonalFoldersShown,
      tab: ref<string>("doc"),
      folderId,
      currentFolderInfo,
      loading,
      columns: column,
      isGrid,
      showDetail,
      detailPopup,
      currentPage: router.currentRoute.value.path,
      handleOpenFolder,
      handleGoBack: () => {
        router.go(-1);
      },
      calcFileNumber,
      convertDateTime,
      convertDataSize,
      getSubFolder,
      changePresentList,
      reload,
      pagination: {
        rowsPerPage: 0
      },
      handleSearch,
      searchKeyword,
      dataTable,
      closePopup,
      closeDetailPopup,
      dataViewDetail,
      showInfo
    };
  }
});
</script>

<style lang="scss" scoped>
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

.file-name {
  align-items: center;
  display: flex;
}

.row.file-info {
  color: rgb(200, 200, 200);
}

.file-name-grid {
  word-break: break-word;
}

.td-size {
  text-align: center;
}

.col-11 {
  padding: 5px 0;
}

.col-1 {
  text-align: right;
  padding-right: 5px;
}
</style>
