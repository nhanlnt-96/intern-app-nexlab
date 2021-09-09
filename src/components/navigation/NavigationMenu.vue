<template>
  <q-btn v-if="isLogged" icon="menu" class="before-disable navigation-container--menu">
    <q-menu>
      <q-list style="min-width: 320px">
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn
              dense
              flat
              icon="eva-home-outline"
              class="btn-customize"
              label="Trang chủ"
              @click="onGoToHomeBtnClick"
            ></q-btn>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn
              dense
              flat
              icon="eva-inbox-outline"
              class="btn-customize"
              label="Hộp thư"
            >
              <q-badge color="green" floating style="left: -8px">12</q-badge>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn
              dense
              flat
              icon="edit_calendar"
              class="btn-customize"
              label="Kế hoạch"
            >
              <q-badge color="blue" rounded class="q-mr-sm" floating />
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn
              dense
              flat
              icon="ti-menu-alt"
              class="btn-customize"
              label="Công việc"
            >
              <q-badge color="blue" rounded class="q-mr-sm" floating />
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn
              dense
              flat
              icon="eva-file-outline"
              class="btn-customize"
              label="Quản lý dữ liệu"
            ></q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-close-popup>
          <q-item-section style="display: flex; flex-direction: row">
            <q-btn dense flat icon="bookmark_border" class="q-ml-md"></q-btn>
            <q-btn dense flat icon="eva-message-circle-outline" class="q-ml-md">
              <q-badge
                color="green"
                floating
                style="left: -8px; width: fit-content"
              >20
              </q-badge>
            </q-btn>
            <q-btn dense flat icon="calendar_today" class="q-ml-md">
              <q-badge
                color="orange"
                floating
                style="left: -8px; width: fit-content"
              >12
              </q-badge>
            </q-btn>
            <q-btn dense flat icon="eva-bell-outline" class="q-ml-md">
              <q-badge
                color="red"
                floating
                style="left: -8px; width: fit-content"
              >12
              </q-badge>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-close-popup class="no-padding justify-center">
          <div class="row no-wrap" style="padding: 10px 10px">
            <div class="column">
              <q-btn
                dense
                flat
                class="text-transform"
                label="Trang cá nhân 1"
              ></q-btn>
              <q-btn
                dense
                flat
                class="text-transform"
                label="Trang cá nhân 2"
              ></q-btn>
              <q-btn
                dense
                flat
                class="text-transform"
                label="Trang cá nhân 3"
              ></q-btn>
            </div>
            <q-separator vertical inset spaced="20px" />
            <div class="column items-center">
              <q-avatar v-if="userProfile.avatarUrl" style="margin-left: 10px">
                <img :src="userProfile.avatarUrl" alt="user-avatar" />
              </q-avatar>
              <q-avatar
                v-else
                style="margin-left: 10px"
                color="primary"
                text-color="white"
              >
                {{ userProfile.firstName.substring(0, 1).toUpperCase() }}
              </q-avatar>
              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ `${userProfile.firstName} ${userProfile.lastName}` }}
              </div>
              <q-btn
                color="primary"
                label="Đăng xuất"
                push
                size="sm"
                v-close-popup
                @click="onLogoutBtnClick"
              />
            </div>
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <LoginHeaderBtn v-else class="navigation-container--menu " />
  <q-dialog v-model="showLogOutPopup" persistent>
    <LogOutConfirm />
  </q-dialog>
</template>

<script lang="ts">
import { Cookies } from "quasar";
import LogOutConfirm from "../popups/LogOutConfirm.vue";
import LoginHeaderBtn from "./LoginHeaderBtn.vue";

export default {
  name: "NavigationMenu",
  components: { LoginHeaderBtn, LogOutConfirm },
  data() {
    return {
      userProfile: {},
      showLogOutPopup: false as boolean,
      isLogged: this.$store.state.user.isLogged
    };
  },
  methods: {
    onLogoutBtnClick() {
      this.showLogOutPopup = true;
    },
    onLoginBtnClick() {
      this.$router.push("/log-in");
    },
    onGoToHomeBtnClick() {
      this.$router.push("/");
    }
  },
  created() {
    this.userProfile = Cookies.get("user_profile");
  },
  beforeUpdate() {
    this.userProfile = Cookies.get("user_profile");
  }
};
</script>

<style lang="scss" scoped>
.navigation-container--menu {
  padding: 10px 10px;
}

.before-disable {
  color: black;

  &:before {
    content: none;
  }
}

.q-item__section {
  display: unset;

  .btn-customize {
    text-transform: inherit;
    pointer-events: none;
    margin-left: 0;

    .q-icon {
      font-size: 20px;
    }
  }

  .q-badge--floating {
    right: unset;
    left: 0;
    top: 0;
    width: fit-content;
  }
}

.text-transform {
  text-transform: inherit;
  font-size: 13px;
}

.login-btn {
  padding: 5px 5px;
}
</style>
