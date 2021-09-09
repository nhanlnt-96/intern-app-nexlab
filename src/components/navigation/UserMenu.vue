<template>
  <q-btn
    :label="`${userProfile.lastName} ${userProfile.firstName}`"
    style="font-weight: bold; text-transform: capitalize; font-size: 13px"
  >
    <UserAvatar style="margin-left: 10px"
                :avatar-url="userProfile.avatarUrl"
                :first-name="userProfile.firstName" />
    <q-menu>
      <q-list style="min-width: 180px">
        <q-item clickable v-close-popup>
          <q-item-section @click="show('edit')">
            Chỉnh sửa thông tin
          </q-item-section
          >
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section @click="onLogoutBtnClick">Đăng xuất</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <q-dialog
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
  <q-dialog v-model="showLogOutPopup" persistent>
    <LogOutConfirm />
  </q-dialog>
</template>

<script lang="ts">
import { Cookies } from "quasar";
import { useAppStore } from "src/store";
import CreateUserPopup from "../popups/CreateUserPopup.vue";
import { IUserProfile } from "@model";
import { ref } from "vue";
import LogOutConfirm from "../popups/LogOutConfirm.vue";
import UserAvatar from "../UserAvatar.vue";

export default {
  name: "UserMenu",
  components: { UserAvatar, LogOutConfirm, CreateUserPopup },
  data() {
    return {
      isAdmin: false as boolean,
      showLogOutPopup: false as boolean
    };
  },
  setup() {
    const userProfile: any = Cookies.get("user_profile");
    const action = ref<string>("");
    const userId = ref<string>("");
    const editOwnerInfo = true;
    const showCreatePopup = ref(false);
    const show = (actionType: string) => {
      userId.value = userProfile.id;
      showCreatePopup.value = true;
      action.value = actionType;
    };
    const close = () => {
      showCreatePopup.value = false;
    };
    return {
      userId,
      userProfile,
      action,
      showCreatePopup,
      editOwnerInfo,
      show,
      close
    };
  },
  methods: {
    onLogoutBtnClick() {
      return (this.showLogOutPopup = true);
    }
  },
  created() {
    const store = useAppStore();
    const userProfile: IUserProfile = Cookies.get("user_profile");
    // get user logged in infor
    this.userProfile = Cookies.get("user_profile");
    // get all users data
    store.dispatch("user/getAllUsersData").then(() => {
      return (this.loading = false);
    });
    // check role to use create user button
    if (userProfile.role === "admin") {
      return (this.isAdmin = true);
    } else {
      return this.isAdmin;
    }
  },
  beforeUpdate() {
    this.userProfile = Cookies.get("user_profile");
  }
};
</script>

<style lang="scss" scoped>
button {
  color: black;

  &:before {
    content: none;
  }
}
</style>
