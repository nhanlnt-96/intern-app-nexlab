import { Cookies } from "quasar";
import { IUserProfile } from "@model";

const userProfile: IUserProfile = Cookies.get("user_profile");
export function getMessageError(
  input: any,
  name: string,
  rootId: string
): string {
  const error = input.split(" ").reverse();
  let pageName = "";
  switch (rootId) {
    case "public":
      pageName = "Thư mục chung";
      break;
    case "personal":
      pageName = "Thư mục cá nhân";
      break;
    default:
      pageName = "Thư mục của tổ chức";
      break;
  }
  switch (error[0]) {
    case "first":
      return `Thư mục/tệp "${name}" đã tồn tại trong thư mục "${pageName}". Vui lòng đổi tên hoặc chọn thư mục khác.`;
    case "folder":
      return `Thư mục/tệp "${name}" không thể di chuyển vào chính nó hoặc thư mục con của nó. Vui lòng chọn thư mục khác.`;
    default:
      return `Bạn không được phép di chuyển vào thư mục "${pageName}".`;
  }
}
export function getListSubFolders(input: any[]): any[] {
  const output: any[] = input.filter((subFolder: any) => {
    return subFolder.User.id === userProfile.id;
  });
  return output;
}
