<template>
  <div class="row container-title">
    <div class="div--title">{{ pageName }}</div>
    <div class="col-12">Danh sách nhân viên</div>
  </div>
  <div class="q-pa-md">
    <div class="add-search-staff">
      <q-btn
        @click="show('create')"
        icon-right="add"
        no-caps
        flat
        dense
        class="bg-btn"
        text-color="white"
        :disable="!isAdmin"
      />
      <q-input
        outlined
        placeholder="Tìm kiếm theo tên"
        class="bg-grey-3"
        dense
        @keyup="onSearchUser"
      >
        <template #prepend>
          <q-icon name="eva-search-outline" />
        </template>
      </q-input>
    </div>
    <q-table
      flat
      :columns="columns"
      :rows="allUsersData"
      row-key="name"
      color="primary"
      :loading="loading"
      :pagination="pagination"
      no-data-label="I didn't find anything for you"
    >
      <template #body="{ row }">
        <q-tr>
          <q-td>{{ allUsersData.indexOf(row) + 1 }}</q-td>
          <q-td class="name-column">
            <UserAvatar :avatar-url="row.avatarUrl" :first-name="row.firstName" />
            {{ row.lastName }} {{ row.firstName }}
          </q-td>
          <q-td>{{ row.email }}</q-td>
          <q-td>{{ row.role }}</q-td>
          <q-td>{{ dateFormat(row.dob) }}</q-td>
          <q-td>{{ row.phone ? row.phone : "-" }}</q-td>
          <q-td>
            <q-btn
              icon-right="more_horiz"
              no-caps
              flat
              dense
              class="bg-grey-3"
              text-color="black"
            >
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 230px">
                  <q-item @click="show('edit', row.id)" v-close-popup clickable>
                    <div class="row btn-dropdown">
                      <div class="col-2">
                        <q-icon style="font-size: 14px" name="ti-pencil"></q-icon>
                      </div>
                      <div class="col-8">
                        {{ isAdmin ? "Chỉnh sửa thông tin" : "Xem" }}
                      </div>
                    </div>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template #bottom="scope">
        <div class="absolute-bottom-right">
          <q-pagination
            v-model="scope.pagination.page"
            :max="scope.pagesNumber"
            direction-links
            flat
            active-color="grey-10"
            color="grey-13"
          />
        </div>
      </template>
    </q-table>
  </div>
  <q-dialog
    class="scroll"
    v-model="showCreatePopup"
    transition-show="fade"
    transition-hide="fade"
    persistent
  >
    <CreateUserPopup
      :action="action"
      :admin="isAdmin"
      :owner-info="editOwnerInfo"
      :id="userId"
      @create-succeed="close"
    />
  </q-dialog>
</template>

<script lang="ts">
import { IColumn, IUserProfile } from "@model";
import CreateUserPopup from "../components/popups/CreateUserPopup.vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "src/store";
import { Cookies, debounce } from "quasar";
import { onMounted } from "vue";
import { trim } from "lodash";
import moment from "moment";
import UserAvatar from "../components/UserAvatar.vue";

const columns: IColumn[] = [
  {
    name: "index",
    label: "#",
    align: "left",
    field: "index",
  },
  {
    name: "name",
    required: true,
    label: "Họ và tên",
    align: "left",
    field: (row: { firstName: any }) => row.firstName,
    sortable: true,
  },
  {
    name: "email",
    align: "left",
    label: "Email",
    field: "email",
  },
  {
    name: "role",
    align: "left",
    label: "Vai trò",
    field: "role",
  },
  {
    name: "title",
    align: "left",
    label: "Ngày sinh",
    field: "title"
  },
  {
    name: "dept",
    align: "left",
    label: "Số điện thoại",
    field: "dept"
  },
  {
    name: "action",
    label: "",
    field: "action",
  },
];

export default {
  name: "StaffList",
  components: { UserAvatar, CreateUserPopup },
  setup() {
    const store = useAppStore();
    onMounted(() => {
      store
        .dispatch("user/getAllUsersData")
        .then(() => (loading.value = false));
      if (userProfile.value.role === "admin") {
        isAdmin.value = true;
      } else {
        isAdmin.value;
      }
    });
    const allUsersData = computed(() => {
      return store.state.user.allUsers;
    });
    const onSearchUser = debounce((e) => {
      loading.value = true;
      const searchKeyword = trim(e.target.value.toLocaleLowerCase());
      if (searchKeyword) {
        store
          .dispatch("user/searchUser", searchKeyword)
          .then(() => (loading.value = false));
      } else {
        store.dispatch("user/getAllUsersData").then(() => (loading.value = false));
      }
    });
    const userId = ref<string>("");
    const loading = ref<boolean>(true);
    const editOwnerInfo = ref<boolean>(false);
    const pagination = ref<any>({
      rowsPerPage: 10,
    });
    const isAdmin = ref<boolean>(false);
    const userProfile = ref<IUserProfile>(Cookies.get("user_profile"));
    const action = ref<string>("");
    const showCreatePopup = ref(false);
    const show = (actionType: string, id?: string) => {
      if (id) {
        userId.value = id;
        editOwnerInfo.value = userProfile.value.id === id ? true : false;
      }
      showCreatePopup.value = true;
      action.value = actionType;
    };
    const close = () => {
      showCreatePopup.value = false;
    };
    const router = useRouter();
    const dateFormat = (date: string) => {
      const checkFormat = moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
      if (checkFormat === date) {
        return date;
      }
      const result = moment(date).format("DD/MM/YYYY");
      return result !== "Invalid date" ? result : "-";
    };

    return {
      allUsersData,
      onSearchUser,
      userId,
      loading,
      pagination,
      isAdmin,
      userProfile,
      action,
      close,
      columns,
      showCreatePopup,
      show,
      pageName: router.currentRoute.value.name,
      editOwnerInfo,
      dateFormat
    };
  },
};
</script>

<style lang="scss" scoped>
.bg-btn {
  background-color: #1c2b54;
}

.container-title {
  margin: 20px;

  div:last-child {
    font-size: 21px;
    font-weight: 600;
  }
}

.add-search-staff {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 15px;

  label {
    width: 300px;
  }

  button {
    margin-bottom: 15px;
  }
}

.name-column {
  display: flex;
  align-items: center;

  .q-avatar {
    margin-right: 10px;

    .q-badge {
      top: unset;
      bottom: 0;
    }
  }
}

.btn-dropdown {
  width: 100%;
  margin: auto;

  .col-4 {
    color: rgb(190, 190, 190);
  }

  .col-2 {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(190, 190, 190);
  }
}
</style>
