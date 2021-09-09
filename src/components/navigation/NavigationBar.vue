<template>
  <q-bar :class="`header-bar--container ${!isLogged && 'btn-login-position'}`">
    <div v-if="isLogged" class="header-gadget">
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="eva-home-outline" class="q-ml-md" label="Trang chủ"
               @click="onGoToHomeBtnClick"></q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="eva-inbox-outline" class="q-ml-md" label="Hộp thư">
          <q-badge color="green" floating style="left: -8px">12</q-badge>
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="edit_calendar" class="q-ml-md" label="Kế hoạch">
          <q-badge color="blue" rounded class="q-mr-sm" floating />
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="ti-menu-alt" class="q-ml-md" label="Công việc">
          <q-badge color="blue" rounded class="q-mr-sm" floating />
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="eva-file-outline" class="q-ml-md" label="Quản lý dữ liệu"></q-btn>
      </div>
      <q-space />
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="bookmark_border" class="q-ml-md"></q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="eva-message-circle-outline" class="q-ml-md">
          <q-badge color="green" floating style="left: -8px">20</q-badge>
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="calendar_today" class="q-ml-md">
          <q-badge color="orange" floating style="left: -8px">12</q-badge>
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item">
        <q-btn dense flat icon="eva-bell-outline" class="q-ml-md">
          <q-badge color="red" floating style="left: -8px">12</q-badge>
        </q-btn>
      </div>
      <div class="cursor-pointer header-menu--item account-btn">
        <user-menu></user-menu>
      </div>
    </div>
    <LoginHeaderBtn v-else />
  </q-bar>
</template>

<script>
import LoginHeaderBtn from "./LoginHeaderBtn";
import UserMenu from "./UserMenu";

export default {
  name: "NavigationBar",
  components: {
    LoginHeaderBtn,
    UserMenu
  },
  data() {
    return {
      isLogged: this.$store.state.user.isLogged
    };
  },
  methods: {
    onGoToHomeBtnClick() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.header-bar--container {
  background-color: transparent;
  width: 100%;
}

.btn-login-position {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-gadget {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-menu--item {
  color: #99989e;

  .q-btn {
    font-weight: 600;
    font-size: 13px;
    text-transform: inherit;

    .q-badge--floating {
      top: 0;
      right: unset;
      left: 0;
    }
  }
}
</style>
