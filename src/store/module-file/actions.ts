import { ActionTree } from "vuex";
import { AppState } from "../index";
import { FileStateInterface } from "src/store/module-file/state";
import { api } from "src/boot/axios";
import { get } from "lodash";
import { getFileFolder } from "../../services";

const actions: ActionTree<FileStateInterface, AppState> = {
  async uploadFile({}, input) {
    try {
      const res = await api.post("/files", input.file.value);
      input.onSuccess(res);
    } catch (err) {
      input.onFailure(err);
    }
  },
  async createFolder({}, input) {
    try {
      const res = await api.post("/files", {
        name: input.folderName,
        folderId: input.id
      });
      input.onSuccess(res);
    } catch (err) {
      input.onFailure(err);
    }
  },
  async rename({}, input) {
    try {
      await api.patch(`/files/${input.fileOrFolderId}`, input.data);
      input.onSuccess();
    } catch (err) {
      input.onFailure(err);
    }
  },
  async move({}, input) {
    try {
      await api.patch(`/files/${input.fileOrFolderId}`, input.data);
      input.onSuccess();
    } catch (err) {
      input.onFailure(err);
    }
  },
  async getSharedFolder({}, data) {
    try {
      const res = await api.get("files/share-with-me-drive?limit=100");
      const currentFolder = get(res, "data.result.data.currentFolder");
      const subFolders = get(res, "data.result.data.subFolders");
      data.onSuccess({ currentFolder, subFolders });
    } catch (err) {
      data.onFailure(err);
    }
  },
  async getPersonalFolder({}, data) {
    try {
      const res = await api.get("files/my-drive?limit=100");
      const currentFolder = get(res, "data.result.data.currentFolder");
      const subFolders = get(res, "data.result.data.subFolders");
      data.onSuccess({ currentFolder, subFolders });
    } catch (err) {
      data.onFailure(err);
    }
  },
  async getPublicFolder({}, data) {
    try {
      const res = await api.get(
        "/files/public-drive?limit=100&sortBy=name:desc&page=1"
      );
      const currentFolder = get(res, "data.result.data.currentFolder");
      const subFolders = get(res, "data.result.data.subFolders");
      data.onSuccess({ currentFolder, subFolders });
    } catch (err) {
      data.onFailure(err);
    }
  },
  async getFolders({}, input) {
    try {
      const res = await api.get(
        `/files/folders/${input.currentFolderId.value}`
      );
      input.onSuccess(res);
    } catch (err) {
      input.onFailure(err);
    }
  },
  async getDataViewSubFolder({ commit }, data) {
    try {
      const res = await getFileFolder(data.parentFolderId);
      const dataTable = get(res, "data.result.data.subFolders");
      const currentFolder = get(res, "data.result.data.currentFolder");
      data.onSuccess({ dataTable, currentFolder });
      commit("setCurrentSubFolder", dataTable);
      commit("setFileOwner", currentFolder.ownerUserId);
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async getPersonalFolders({}, data) {
    try {
      const res = await api.get("/files/my-drive?limit=100");
      const currentFolder = get(res, "data.result.data.currentFolder");
      const subFolders = get(res, "data.result.data.subFolders");
      data.onSuccess({ currentFolder, subFolders });
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async getRootFolderId({}, data) {
    try {
      const res = await api.get(`/files/${data.path}`);
      data.onSuccess(get(res, "data.result.data.currentFolder.id"));
    } catch (error) {
      data.onFailure(error);
    }
  },
  async getFilesBasedOnUrl({ commit }, data) {
    try {
      const res = await api.get(`/files/${data.apiUrl}?limit=100`);
      const subFolders = get(res, "data.result.data.subFolders");
      commit("unSetFileOwner");
      commit("setCurrentSubFolder", subFolders);
      data.onSuccess(subFolders);
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async restoreFile({}, data) {
    const param = {
      fileOrFolderId: data.id
    };
    try {
      await api.post("/files/restores", param);
      data.onSuccess();
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async deleteFile({}, data) {
    try {
      await api.delete(`/files/${data.fileId}`);
      data.onSuccess();
    } catch (error) {
      data.onFailure(error);
    }
  },
  async getDownloadFileorFolder({}, data) {
    try {
      const link = document.createElement("a");
      // if size > 10MB
      if (data.size > 10000000) {
        const res = await api.get(`/files/${data.fileId}/downloads`);
        link.href = get(res, "data.result.link");
      } else {
        const res = await api.get(`/files/${data.fileId}/downloads`, {
          responseType: "blob"
        });
        const headers = res.headers;
        const blob = new Blob([res.data], { type: headers["content-type"] });
        link.href = window.URL.createObjectURL(blob);
      }
      link.download = data.fileName;
      link.click();
      link.remove();
      data.onSuccess();
    } catch (err) {
      data.onFailure(err.response.data);
    }
  }
};
export default actions;

export function convertBytes(bytes: number, isCurrentFolder?: boolean) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (isCurrentFolder && bytes == 0) {
    return "0 Bytes";
  }
  if (!bytes) {
    return "-";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  if (i == 0) {
    return bytes + " " + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
