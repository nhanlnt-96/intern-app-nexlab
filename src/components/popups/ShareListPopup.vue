<template>
  <q-card>
    <q-bar>
      <q-btn dense flat v-close-popup> Hủy</q-btn>
      <q-space></q-space>
      {{ title() }}
      <q-space></q-space>

      <q-btn dense flat v-close-popup> Xong</q-btn>
    </q-bar>

    <q-card-section style="padding-block: 10px; margin-top: 10px">
      <q-input dense outlined @keyup="onSearchUser">
        <template #prepend>
          <q-icon :size="'xs'" name="ti-search"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="flex justify-center align-items-center" style="padding-top: 0">
      <q-scroll-area style="height: 400px; width: 100%" loading>
        <div
          style="padding: 15px 10px; border-bottom: 0.5px solid rgb(250, 250, 250)"
          v-for="user in allUsersData"
          :key="user.id"
        >
          <div class="row">
            <div class="col-11">
              <UserAvatar :avatar-url="user.avatarUrl" :first-name="user.firstName" />
              {{ user.lastName }} {{ user.firstName }}
            </div>
            <div class="col-1">
              <input
                type="checkbox"
                :value="user.id"
                @click="onShareBtnClick(user, $event)"
                :checked="!!checkFileIsShared(user.id)"
              />
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { Cookies, debounce, useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { IUserProfile } from "@model";
import { api } from "../../boot/axios";
import { shareFileFolderToUser, unShareFilFolder } from "../../services";
import { trim } from "lodash";
import { useAppStore } from "../../store";
import UserAvatar from "../UserAvatar.vue";

export default {
  name: "ShareListPopup",
  components: { UserAvatar },
  props: {
    option: {
      type: String,
    },
    fileId: {
      type: String,
    },
  },
  setup(props: any) {
    const $q = useQuasar();
    const userIsLogged: IUserProfile = Cookies.get("user_profile");
    const onShareUserSelect = ref("");
    const fileIsShared = ref([]);
    const store = useAppStore();
    onMounted(async () => {
      const getAllFileIsShared = await api.get(`/files/shares/${props.fileId}`);
      fileIsShared.value = getAllFileIsShared.data.result.data;
    });
    const allUsersData = computed(() => {
      return store.state.user.allUsers.filter(
        (val) => val.id !== userIsLogged.id
      );
    });
    const onSearchUser = debounce((e) => {
      const searchKeyword = trim(e.target.value.toLocaleLowerCase());
      if (searchKeyword) {
        store.dispatch("user/searchUser", searchKeyword);
      } else {
        store.dispatch("user/getAllUsersData");
      }
    });
    const checkFileIsShared = (userId: string) => {
      return fileIsShared.value.find((val: { partnerUserId: string }) => val.partnerUserId === userId);
    };
    const onShareBtnClick = async (
      userInfo: { id: string; firstName: string; lastName: string },
      e: any
    ) => {
      const { id, firstName, lastName } = userInfo;
      if (e.target.checked) {
        return await shareFileFolderToUser(props.fileId, id).then((res) => {
          if (res.data.success) {
            $q.notify({
              type: "positive",
              position: "top",
              message: `Đã chia sẻ thành công đến ${lastName} ${firstName}.`,
              timeout: 2000
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: `Chia sẻ đến ${firstName} ${lastName} không thành công.`,
              timeout: 2000,
            });
          }
        });
      } else {
        await unShareFilFolder(props.fileId, id).then((res) => {
          if (res.data.success) {
            $q.notify({
              type: "positive",
              position: "top",
              message: `Đã huỷ chia sẻ đến ${firstName} ${lastName}.`,
              timeout: 2000,
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: `Huỷ chia sẻ đến ${firstName} ${lastName} không thành công.`,
              timeout: 2000,
            });
          }
        });
      }
    };
    const title = () => {
      if (props.option === "personal") return "Danh sách thành viên";
      else return "Danh sách phòng ban";
    };
    return {
      title,
      allUsersData,
      onShareUserSelect,
      onShareBtnClick,
      checkFileIsShared,
      onSearchUser,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-card {
  width: 350px;

  .q-bar {
    background: rgb(28, 43, 84);
    padding: 10px;
    height: 40px;
    font-size: 14px;
    color: white;
    font-weight: 500;

    .q-btn {
      background: rgb(91, 102, 132);
      color: white;
      padding: 1px 3px;
      margin: auto;
      width: 40px;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      font-size: 10px;
      text-transform: none;
    }
  }
}
</style>
