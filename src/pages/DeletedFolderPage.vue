<template>
  <q-page>
    <div class="div--title">{{ pageName }}</div>
    <div class="col-10">Danh sách thư mục</div>
    <DataPage />
  </q-page>
</template>
<script lang="ts">
import { ref, defineComponent, onUpdated } from "vue";
import { useRouter } from "vue-router";
import DataPage from "../components/DataPage.vue";

export default defineComponent({
  components: {
    DataPage
  },
  setup() {
    const router = useRouter();
    const pageName = ref(router.currentRoute.value.name);

    onUpdated(() => {
      pageName.value = router.currentRoute.value.name;
    });
    return {
      pageName
    };
  }
});
</script>
<style lang="scss" scoped>
.q-page {
  margin: 20px;
}

.col-10 {
  font-size: 21px;
  font-weight: 600;
}
</style>
