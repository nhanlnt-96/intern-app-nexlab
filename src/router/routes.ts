import { RouteRecordRaw } from "vue-router";
// import OrganizationList from "components/OrganizationList.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("components/layouts/MainLayout.vue"),
    redirect: "/staff-list",
    meta: {
      auth: true
    },
    children: [
      {
        path: "/organization/",
        name: "Tổ chức",
        component: () => import("components/OrganizationList.vue"),
        children: [
          {
            path: "",
            name: "Thư mục tổ chức",
            component: () => import("components/DataPage.vue"),
          },
          {
            path: ":id",
            name: "Quản lý dữ liệu tổ chức",
            component: () =>
              import("components/viewFileFolder/ViewFolderComponent.vue")
          }
        ]
      },
      {
        path: "/staff-list",
        name: "Nhân Sự",
        component: () => import("pages/StaffList.vue")
      },
      {
        path: "/personal-folder/",
        name: "Thư mục cá nhân",
        component: () => import("components/PersonalFolderList.vue"),
        children: [
          {
            path: "",
            name: "Thư mục cá nhân",
            component: () => import("components/DataPage.vue"),
          },
          {
            path: ":id",
            name: "Quản lý dữ liệu cá nhân",
            component: () =>
              import("components/viewFileFolder/ViewFolderComponent.vue")
          }
        ]
      },
      {
        path: "/folder-shared",
        name: "Thư mục chia sẻ",
        component: () => import("components/SharedFolderList.vue"),
        children: [
          {
            path: "",
            name: "Thư mục chia sẻ",
            component: () => import("components/DataPage.vue"),
          },
          {
            path: ":id",
            name: "Quản lý dữ liệu chia sẻ",
            component: () =>
              import("components/viewFileFolder/ViewFolderComponent.vue")
          }
        ]
      },
      {
        path: "/folder-deleted",
        name: "Thư mục đã xóa",
        component: () => import("pages/DeletedFolderPage.vue"),
      },
      {
        path: "/plan",
        component: () => import("pages/Index.vue"), //change component directory when component is created
      },
      {
        path: "/project",
        component: () => import("pages/Index.vue")
      },
      {
        path: "/message",
        component: () => import("pages/Index.vue")
      },
      {
        path: "/report",
        component: () => import("pages/Index.vue")
      },
      {
        path: "/config",
        component: () => import("pages/Index.vue")
      },
      {
        path: "/public-link/",
        name: "Được chia sẻ",
        component: () => import("components/ShareFileByPublicLink.vue"),
        meta: {
          auth: false
        },
        children: [
          {
            path: ":id",
            name: "Được chia sẻ",
            component: () =>
              import("components/viewFileFolder/ViewFolderComponent.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/log-in",
    component: () => import("pages/Login.vue")
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
