import { IColumn } from "@model";

export const column: IColumn[] = [
  {
    name: "filename",
    required: true,
    label: "Tên tài liệu",
    align: "left",
    field: (row: any) => row.fileName,
    format: (val: any) => `${val}`,
    sortable: true,
    style: "height:70px"
  },
  {
    name: "uploaddate",
    align: "left",
    label: "Ngày tải lên",
    field: (row: any) => row.uploadDate,
    sortable: true
  },
  {
    name: "size",
    align: "center",
    label: "Size",
    field: (row: any) => row.size
  },
  {
    name: "uploader",
    align: "center",
    label: "Người tải lên",
    field: (row: any) => row.uploader
  },
  {
    name: "more",
    align: "center",
    label: ""
  }
];
