<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <q-btn
          v-if="isLogged"
          flat
          dense
          round
          icon="eva-arrowhead-left-outline"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="btn-customize"
          :class="!leftDrawerOpen && 'btn-rotate'"
        />
        <navigation></navigation>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="custom-drawer"
      :width="256"
      v-if="isLogged"
      disable
    >
      <Sidebar />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Sidebar from "components/Sidebar.vue";
import Navigation from "components/navigation/index.vue";
import { defineComponent, ref } from "vue";
import { useAppStore } from "../../store";

export default defineComponent({
  name: "MainLayout",
  components: {
    Sidebar,
    Navigation
  },
  setup() {
    const store = useAppStore();
    store.commit("user/getUserAuth");
    const leftDrawerOpen = ref<boolean>(false);
    const isLogged = store.state.user.isLogged;
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      isLogged
    };
  }
});
</script>
<style lang="scss">
.custom-drawer {
  background-color: #1c2b54;
  color: #8d9abd;
}

.btn-customize {
  color: black;
  transition: .2s ease-in;
}

.btn-rotate {
  transform: rotate(180deg);
}
</style>
