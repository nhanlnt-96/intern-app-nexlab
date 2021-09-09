<template>
  <q-page>
    <div class="div--title">{{ pageName }}</div>
    <ContainerLayout />
    <router-view />
  </q-page>
</template>
<script>
import ContainerLayout from "./layouts/ContainerLayout.vue";
import { useRouter } from "vue-router";

export default {
  name: "OrganizationList",
  components: { ContainerLayout },
  setup() {
    const router = useRouter();
    return {
      pageName: router.currentRoute.value.name
    };
  }
};
</script>
<style scoped lang="scss">
.q-page {
  margin: 20px;
}
</style>
