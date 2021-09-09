export const roles: any[] = [
  { label: "Super Admin", value: "admin" },
  { label: "Quản lý", value: "manager" },
  { label: "Nhân viên", value: "user" },
];
export const status: any[] = [
  { label: "Đang hoạt động", value: "active" },
  { label: "Đã xóa", value: "blocked" },
];
export const gender: any[] = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];
export const religions: any[] = [
  "Phật giáo",
  "Kito giáo",
  "Công giáo",
  "Tin lành",
  "Hòa Hảo",
  "Cao Đài",
  "Khác",
  "Không",
];
export const education: any[] = ["Trung cấp", "Cao đẳng", "Đại học"];
export const major: any[] = [
  { label: "Khoa học máy tính", value: "KHMT" },
  { label: "Công nghệ thông tin", value: "CNTT" },
  { label: "Mạng máy tính và truyền thông dữ liệu", value: "MMT&TTDL" },
  { label: "Kỹ thuật máy tính", value: "KTMT" },
  { label: "Công nghệ Phần mềm", value: "CNPM" },
  { label: "Hệ thống Thông tin Quản lý", value: "HTTTQL" },
  { label: "Big Data & Machine Learning", value: "BD&ML" },
  { label: "Thiết kế Đồ họa", value: "TKDH" },
];
export const emptyInfo: any = {
  firstName: "",
  lastName: "",
  status: "",
  email: "",
  role: "",
  cardId: "",
  sex: "",
  dob: "",
  religion: "",
  education: "",
  majorIn: "",
  address: "",
  homeTown: "",
  password: "",
  phone: "",
  description: "",
  emailNotify: "",
  avatarUrl:
    "https://i.pinimg.com/280x280_RS/fd/f5/2e/fdf52e82a450b1202c2d2aec3134d33c.jpg",
  onboardDate: "",
};

export const emptySuperInfo: any = {
  createAt: "",
  createBy: "",
  updateAt: "",
  updateBy: "",
};
export function getEmptyInfo(): any {
  return {
    firstName: "",
    lastName: "",
    status: "",
    email: "",
    role: "",
    cardId: "",
    sex: "",
    dob: "",
    religion: "",
    education: "",
    majorIn: "",
    address: "",
    homeTown: "",
    password: "",
    phone: "",
    description: "",
    emailNotify: "",
    avatarUrl:
      "https://i.pinimg.com/280x280_RS/fd/f5/2e/fdf52e82a450b1202c2d2aec3134d33c.jpg",
    onboardDate: "",
  };
}
export const optionData: any = {
  roles,
  status,
  gender,
  major,
  religions,
  education,
  emptyInfo,
  emptySuperInfo,
  getEmptyInfo,
};
