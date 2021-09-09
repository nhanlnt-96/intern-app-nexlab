export interface IColumn {
  name: string;
  label: string;
  align?: string;
  required?: boolean;
  sortable?: boolean;
  field?: string | any;
  format?: any;
  style?: any;
}
