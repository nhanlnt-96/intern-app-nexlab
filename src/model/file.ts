export interface IFileType {
  id: number;
  fileName: string;
  uploadDate: string;
  size: string;
  uploader: string;
  type: string;
  uploaderImg: string;
}

export interface IFile {
  id: string;
  name: string;
  folderId: string;
  extension?: string;
  type?: string;
  size?: number;
  storageUrl?: string;
  createdBy?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    avatarUrl: string;
    firstName: string;
    lastName: string;
  };
}
export interface ICurrentFolder {
  id: string;
  name: string;
  totalSize: string | number;
  fileCount: number;
  folderCount: number;
}
