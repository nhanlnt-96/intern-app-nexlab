import { api } from "../boot/axios";

export const sharePublicFileFolder = async (fileOrFolderId: string) => {
  return await api.post("/files/shares", {
    fileOrFolderId
  });
};

export const shareFileFolderToUser = async (fileOrFolderId: string, partnerId: string) => {
  return await api.post("/files/shares", {
    fileOrFolderId,
    partnerId
  });
};

export const unShareFilFolder = async (fileOrFolderId: string, partnerId: string) => {
  return await api.post("/files/un-shares", {
    fileOrFolderId,
    partnerId
  });
};

export const getFileFolder = async (parentFolderId: string) => {
  return await api.get(`/files/folders/${parentFolderId}`);
};
