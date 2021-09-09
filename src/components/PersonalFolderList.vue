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
import { onUpdated, ref } from "vue";
export default {
  name: "PersonalFolderList",
  components: { ContainerLayout },
  setup() {
    const router = useRouter();
    const pageName = ref(router.currentRoute.value.name);

    onUpdated(() => {
      pageName.value = router.currentRoute.value.name;
    });
    return {
      pageName,
    };
  },
};
</script>
<style scoped lang="scss">
.q-page {
  margin: 20px;
}
</style>
