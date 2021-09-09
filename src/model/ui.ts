export interface ISideBarType {
  title: string;
  icon: string;
  path: string;
  child: ISideBarChildrenType[];
}

export interface ISideBarChildrenType {
  title: string;
  path: string;
}
