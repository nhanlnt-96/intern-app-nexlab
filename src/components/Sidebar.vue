<template>
  <q-list>
    <q-item-label header class="text-white row q-gutter-md">
      <div class="logo">
        <q-img class="custom-logo" src="../assets/logo-cgogroup.jpg" />
      </div>
      <div class="content column justify-around">
        <span>Hệ Thống Quản Lý</span>
        <span style="font-weight: 800">GCO GROUP</span>
      </div>
    </q-item-label>
    <q-separator
      style="background-color: #3e5081"
      size="2px"
      inset
      spaced="1rem"
    />
    <q-list>
      <q-expansion-item
        v-for="(item, index) in listItem"
        :icon="item.icon"
        :label="item.title"
        :key="index"
        :header-class="{ parrentItem: expansionItems.includes(index) }"
        :to="item.path"
        active-class="current-item"
        @click="handleClick(index,item.path)"
        @show="handleShow(index)"
        @hide="handleHide"
      >
        <q-item
          clickable
          v-ripple
          v-for="(child, indexChild) in item.child"
          :key="indexChild"
          @click="handleChildItem(index)"
          :to="child.path"
          active-class="current-item"
        >
          <q-item-section style="padding-left: 3.5rem">
            {{ child.title }}
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </q-list>
</template>
<script lang="ts">
import { ISideBarType } from "@model";

const linksList: ISideBarType[] = [
  {
    title: "Nhân sự",
    icon: "eva-people",
    path: "/staff-list",
    child: []
  },
  {
    title: "File và dữ liệu",
    icon: "fas fa-folder-minus",
    path: "",
    child: [
      { title: "Thư mục cá nhân", path: "/personal-folder" },
      { title: "Tổ chức", path: "/organization" },
      { title: "Thư mục chia sẻ", path: "/folder-shared" },
      { title: "Thư mục đã xóa", path: "/folder-deleted" }
    ]
  },
  {
    title: "Kế hoạch và tiến độ",
    icon: "fas fa-calendar-check",
    path: "/plan",
    child: []
  },
  {
    title: "Quản lý dự án",
    icon: "fas fa-clipboard-check",
    path: "/project",
    child: []
  },
  {
    title: "Hệ thống tin nhắn",
    icon: "fas fa-envelope",
    path: "/message",
    child: []
  },
  {
    title: "Báo cáo & Trích xuất",
    icon: "eva-pie-chart",
    path: "/report",
    child: []
  },
  {
    title: "Cấu hình",
    icon: "fas fa-cog",
    path: "/config",
    child: []
  }
];
import { ref } from "vue";

export default {
  name: "Sidebar",
  setup() {
    const expansionItems = ref<number[]>([]); // to highlight expansion-items
    const handleShow = (index: number) => {
      expansionItems.value.push(index);
    };
    const handleChildItem = (parrentIndex: number) => {
      expansionItems.value = []; // clear all expansion-items
      expansionItems.value.push(parrentIndex); // hightlight current expansion-item
    };
    const handleHide = () => {
      // remove expansion-item
      expansionItems.value = [];
    };
    const handleClick = (index: number, path: string) => {
      if (path !== "") {
        expansionItems.value = [];
        expansionItems.value.push(index);
      }
    };
    return {
      expansionItems,
      listItem: linksList,
      handleShow,
      handleChildItem,
      handleHide,
      handleClick
    };
  }
};
</script>
<style lang="scss">
.custom-logo {
  border-radius: 6px;
  width: 3rem;
  height: 3rem;
}

.logo {
  display: flex;
}

.current-item {
  color: white;
  background: #172644;
}

.parrentItem {
  color: white;
}
</style>
