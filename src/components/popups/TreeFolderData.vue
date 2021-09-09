<template>
  <q-card flat bordered>
    <q-inner-loading :showing="isLoading">
      <q-spinner-puff size="50px" color="grey"></q-spinner-puff>
    </q-inner-loading>
    <div v-if="folderId === 'root'">
      <q-card-section>
        <q-item
          @click="enterFolder(folder)"
          clickable
          class="row"
          v-for="folder in rootFolder"
          :key="folder.id"
        >
          <div class="col-1">
            <q-icon name="folder" size="sm" color="yellow" />
          </div>
          <div class="col-10">{{ folder.name }}</div>

          <div class="col-1">
            <q-icon name="ti-angle-right" size="12px" />
          </div>
        </q-item>
      </q-card-section>
    </div>

    <div v-else>
      <q-card-section>
        <q-scroll-area
          :bar-style="barStyle"
          :thumb-style="thumbStyle"
          style="height: 300px"
        >
          <q-item
            @click="enterFolder(folder)"
            clickable
            class="row"
            v-for="folder in listSubFolder"
            :key="folder.id"
          >
            <div class="col-1">
              <q-icon
                :name="getIcon(folder.type)"
                size="sm"
                :color="getColor(folder.type)"
              />
            </div>
            <div class="col-10">{{ handleCurrentPageName(folder.name) }}</div>

            <div class="col-1">
              <q-icon
                v-if="folder.type === 'folder'"
                name="ti-angle-right"
                size="12px"
              />
            </div>
          </q-item>
        </q-scroll-area>
      </q-card-section>
    </div>
  </q-card>
</template>
<script lang="ts">
import { onBeforeUpdate, ref } from "vue";
import { useAppStore } from "src/store";
import { getListSubFolders } from "../../mocks/moveFileOrFolderValidation";
export default {
  name: "TreeFolderData",
  emits: ["enter-folder", "choose-folder", "update-success"],
  props: {
    currentPage: {
      type: String,
      required: true,
    },
    isReload: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: any, context: any) {
    onBeforeUpdate(() => {
      folderId.value = props.currentPage;
      getFolder(folderId.value);
      if (props.isReload) {
        getFolder(folderId.value);
        context.emit("update-success");
      }
    });
    const store = useAppStore();
    const apiUrl = ref("");
    const isLoading = ref(false);
    const folderId = ref(props.currentPage);
    const listSubFolder = ref<any>([]);
    const rootFolderId = ref<string>("");
    const getFolder = (id: string) => {
      switch (id) {
        case "personal":
          apiUrl.value = "file/getPersonalFolders";
          rootFolderId.value = id;
          getRootFolder(apiUrl.value);
          break;
        case "public":
          apiUrl.value = "file/getPublicFolder";
          rootFolderId.value = id;
          getRootFolder(apiUrl.value);
          break;
        case "root":
          break;
        default:
          getSubFolder(id);
          break;
      }
    };
    const handleCurrentPageName = (name: string) => {
      let nameAfterHandle = "";
      if (name.length > 35) {
        nameAfterHandle = name.slice(0, 35) + "...";
      } else nameAfterHandle = name;
      return nameAfterHandle;
    };
    const getRootFolder = (url: string) => {
      isLoading.value = true;
      store.dispatch(url, {
        onSuccess: (res: any) => {
          isLoading.value = false;
          if (url.indexOf("Personal") > 0) {
            store.commit("file/setPersonalFolderId", res.currentFolder.id);
          } else {
            store.commit("file/setSharedFolderId", res.currentFolder.id);
          }
          listSubFolder.value = getListSubFolders(res.subFolders);
        },
        onFailure: (err: any) => {
          alert(err.response.data);
          isLoading.value = false;
        },
      });
    };
    const getSubFolder = (id: string) => {
      isLoading.value = true;
      store.dispatch("file/getFolders", {
        currentFolderId: { value: id },
        onSuccess: (res: any) => {
          isLoading.value = false;
          listSubFolder.value = res.data.result.data.subFolders;
        },
        onFailure: (err: any) => {
          alert(err.response.data);
          isLoading.value = false;
        },
      });
    };

    const getIcon = (type: string) => {
      switch (type) {
        case "folder":
          return "folder";
        case "photo":
          return "image";
        case "application":
          return "archive";
        default:
          return "file";
      }
    };

    const getColor = (type: string) => {
      switch (type) {
        case "folder":
          return "yellow";
        case "photo":
          return "green";
        case "application":
          return "black";
        default:
          return "grey";
      }
    };

    const enterFolder = (folder: any) => {
      if (
        folder.type === "folder" ||
        folder.id === "personal" ||
        folder.id === "public"
      ) {
        context.emit("enter-folder", {
          id: folder.id,
          name: folder.name,
          rootFolderId: rootFolderId.value,
        });
      }
    };
    return {
      handleCurrentPageName,
      getColor,
      getIcon,
      isLoading,
      enterFolder,
      folderId,
      listSubFolder,
      rootFolder: [
        { name: "Thư mục cá nhân", id: "personal" },
        { name: "Thư mục chung", id: "public" },
      ],
      thumbStyle: {
        width: "0px",
      },

      barStyle: {
        width: "0px",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.q-item {
  height: 32px;
  padding: 0px 5px;
  .col-1 {
    padding: 10px;
  }
  .col-10 {
    padding: 12px;
  }
}
.row {
  margin: auto;
}
</style>
