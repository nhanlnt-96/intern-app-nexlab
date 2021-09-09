<template>
  <q-card style="width: 650px">
    <q-card-section style="padding: 10px 20px !important">
      <div style="font-size: 16px; font-weight: 400; margin: auto">
        Tập tin tải lên
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

    <q-card-section
      v-for="(file, index) in files"
      :key="index"
      class="upload-preview"
    >
      <div class="row">
        <div class="col-2 upload-preview--icon">
          <q-icon
            :name="handleIcon(file.value.type)"
            size="50px"
            style="color: #5db082"
          />
        </div>
        <div class="col-9 upload-preview--title">
          <q-input
            @keyup.enter="handleRename"
            @keyup.esc="cancelRename(index)"
            @blur="cancelRename(index)"
            dense
            outlined
            v-model="file.value.name"
            v-if="index === fileEdited && isRenamed"
          >
            <template #append>
              <q-icon @click="handleRename" :size="'xs'" name="edit"></q-icon>
            </template>
          </q-input>
          <div
            v-if="index !== fileEdited"
            @dblclick="changeName(index, file.value.name)"
            style="
              font-size: 16px;
              font-weight: 600;
              margin: auto;
              height: 30px;
            "
          >
            {{ handleFileName(file.value.name) }}
          </div>
          <span v-if="progresses[index] === 1">Tải lên thành công</span>
        </div>
        <div class="col-1">
          <q-btn
            class="btn--close"
            flat
            color="white"
            size="10px"
            icon="close"
            @click="onDeleteFileUpload(index)"
          ></q-btn>
        </div>
      </div>
      <div v-if="progresses[index] >= 0" class="row upload-preview--progress">
        <q-icon
          v-if="progresses[index] === 1"
          name="check_circle"
          color="green"
        ></q-icon>
        <q-linear-progress
          rounded
          size="7px"
          :value="progresses[index]"
          class="item--color"
        />
      </div>
    </q-card-section>

    <q-card-section class="upload--section" style="padding: 0 10px">
      <label for="upload">Chọn tệp tải lên</label>
      <input
        multiple
        type="file"
        name="upload"
        id="upload"
        @change="onFileHandleChange"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-btn @click="upload" flat outline class="btn--done">Xong</q-btn>
      <q-btn v-close-popup flat outline class="btn--cancel">Hủy</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from "vue";
import moment from "moment";
import firebase from "../../boot/firebase";
import { useAppStore } from "src/store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { get } from "lodash";

export default {
  name: "UploadFilePopup",
  emits: ["upload-file"],
  setup(props: any, context: any) {
    onMounted(() => {
      const currentPath = router.currentRoute.value.path;
      if (!router.currentRoute.value.params.id) {
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
        folderId.value = get(router, "currentRoute.value.params.id");
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
    const progresses = ref<any>([]);
    const fileUploaded = ref<any>([]);
    const router = useRouter();
    const folderId = ref<string>("");
    const notificationMessage = ref("");
    const notificationType = ref("");
    const isRenamed = ref(false);
    const fileEdited = ref(1000);
    const oldName = ref("");
    const subFolders = ref<any>([]);
    const changeName = (index: any, name: any) => {
      oldName.value = name;
      fileEdited.value = index;
      isRenamed.value = true;
    };
    const cancelRename = (index: any) => {
      files.value[index].value.name = oldName.value;
      isRenamed.value = false;
      fileEdited.value = 1000;
    };
    const handleRename = () => {
      isRenamed.value = false;
      fileEdited.value = 1000;
    };
    const getType = (extension: string) => {
      const type = extension.split("/");
      switch (type[0]) {
        case "image":
          return "photo";
        case "text":
          return "doc";
        default:
          return "application";
      }
    };
    const files = ref<any>([]);
    const checkExistFile = (name: any) => {
      if (files.value.length !== 0) {
        const list = files.value.filter((element: any) => {
          return element.value.name === name;
        });
        return list.length < 1;
      } else {
        return true;
      }
    };
    const onFileHandleChange = (e: any) => {
      Object.keys(e.target.files).forEach((element) => {
        if (e.target.files[element] !== 1) {
          if (checkExistFile(e.target.files[element].name)) {
            fileUploaded.value.push(e.target.files[element]);
            const file = ref({
              name: "",
              folderId,
              storageUrl: "",
              type: "",
              extension: "",
              size: 96,
            });
            file.value.name = e.target.files[element].name;
            file.value.size = e.target.files[element].size;
            file.value.extension = e.target.files[element].type;
            file.value.type = getType(e.target.files[element].type);
            files.value.push(file);
            progresses.value.push(-1);
          }
        }
      });
    };
    const notityRenameSuccess = () => {
      $q.notify({
        type: notificationType.value,
        position: "top",
        message: notificationMessage.value,
      });
    };
    const onDeleteFileUpload = (key: any) => {
      files.value = files.value.filter((element: any, index: any) => {
        return index !== key;
      });
      progresses.value = progresses.value.filter((element: any, index: any) => {
        return index !== key;
      });
    };
    const changeSameName = (name: any) => {
      let newName = name;
      let list = subFolders.value.filter((element: any) => {
        return element.name === name;
      });
      let index = 1;
      while (list.length > 0) {
        list = subFolders.value.filter((element: any) => {
          return element.name === name + ` (${index})`;
        });
        newName = name + ` (${index})`;
        index++;
      }
      return newName;
    };
    const apiUpload = (element: any) => {
      element.value.name = changeSameName(element.value.name);
      store.dispatch("file/uploadFile", {
        file: element,
        onSuccess: () => {
          notificationType.value = "positive";
          notificationMessage.value = `Tải file "${element.value.name}" thành công.`;
          notityRenameSuccess();
          context.emit("upload-file");
          store.commit("file/setReloadToTrue");
        },
        onFailure: () => {
          notificationType.value = "negative";
          notificationMessage.value = "Đã xảy ra lỗi.";
          notityRenameSuccess();
        },
      });
    };
    const handleFileName = (fileName: any) => {
      let name = "";
      if (fileName.length > 30) {
        name = fileName.slice(0, 30) + "...";
      } else name = fileName;
      return name;
    };
    const handleIcon = (type: any) => {
      switch (type) {
        case "photo":
          return "fas fa-file-image";
        case "doc":
          return "description";
        default:
          return "source";
      }
    };
    // getFolder
    const upload = () => {
      if (files.value.length > 0) {
        files.value.forEach((element: any, index: any) => {
          const currentDate = moment().format("HHmmss");
          const storageRef = firebase
            .storage()
            .ref(`file-${currentDate}-${element.value.name}`)
            .put(fileUploaded.value[index]);

          storageRef.on(
            "state_changed",
            (snapshot) => {
              progresses.value[index] =
                snapshot.bytesTransferred / snapshot.totalBytes;
            },
            (error) => {
              console.log(error);
            },
            () => {
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                element.value.storageUrl = url;
                apiUpload(element);
                files.value = files.value.filter((file: any, key: any) => {
                  return key !== index;
                });
              });
            }
          );
        });
      } else {
        context.emit("upload-file");
      }
    };

    return {
      handleRename,
      cancelRename,
      fileEdited,
      isRenamed,
      changeName,
      handleIcon,
      handleFileName,
      onDeleteFileUpload,
      upload,
      onFileHandleChange,
      files,
      progresses,
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

.upload-preview {
  padding: 10px 10px;
  margin-inline: 10%;
  margin-block: 12px;
  border-radius: 4px !important;
  background: #eee;

  &:hover {
    background: #ddd;
  }

  .row {
    padding-block: 8px;

    .btn--close {
      color: #b4b4b4 !important;
      float: right;
      padding: 0;
      margin-top: -10px;
    }

    .upload-preview--icon {
      display: flex;
      justify-content: center;
      align-content: center;
    }

    .upload-preview--title span {
      font-size: 15px;
      color: #718093;
    }
  }

  .upload-preview--progress {
    display: flex;
    justify-content: flex-end;

    .item--color {
      color: #7ebf4f;
    }

    i {
      font-size: 16px;
      margin-bottom: 2px;
    }
  }
}

.upload--section {
  margin: 20px 10px;

  input[type="file"] {
    display: none;
  }

  label {
    cursor: pointer;
    padding: 10px;
    background-color: #1c2b54;
    border-radius: 4px;
    color: white;
  }
}

.btn--close {
  color: #b4b4b4 !important;
  float: right;
  padding: 0;
}

.btn--cancel {
  font-size: 12px;
  color: #718093;
  text-transform: none !important;
  margin-right: 10px;
  border: 1px solid #b4b4b4;
}
.btn--done {
  font-size: 12px;
  color: #fff;
  text-transform: none !important;
  margin-right: 10px;
  background: rgb(28, 42, 83);
}
</style>
