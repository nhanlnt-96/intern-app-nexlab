import { IFile } from "@model";

export interface FileStateInterface {
  allFiles: IFile[];
  reload: boolean;
  personalFolderId: string;
  sharedFolderId: string;
  isViewGrid: boolean;
  currentSubFolder: any[];
  currentFolder: any[];
  isOwnFile: boolean;
}

function state(): FileStateInterface {
  return {
    allFiles: [],
    reload: false,
    personalFolderId: "",
    sharedFolderId: "",
    isViewGrid: false,
    currentSubFolder: [],
    currentFolder: [],
    isOwnFile: true
  };
}

export default state;
