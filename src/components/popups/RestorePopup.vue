<template>
  <q-card class="container">
    <q-card-section style="border-radius: 2px">
      <div class="dp-flex justify-between align-items-center">
        <span style="font-weight: 600; font-size: 16px"> Khôi phục </span>
        <q-btn
          class="btn--close"
          flat
          color="white"
          size="10px"
          icon="close"
          v-close-popup
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="ct-text-gray content" size="20px">
      <span style="word-wrap: break-word">
        Bạn có muốn khôi phục "{{ $props.fileData.name }}" ?
      </span>
    </q-card-section>
    <q-card-section>
      <div class="row q-gutter-md" style="justify-content: flex-end">
        <q-btn
          style=""
          v-close-popup
          flat
          class="btn--delete"
          no-caps
          @click="handleRestore"
        >
          Khôi phục
        </q-btn>
        <q-btn v-close-popup outline class="btn--cancel" no-caps> Thoát </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { useQuasar } from "quasar";
import { useAppStore } from "src/store";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    fileData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const store = useAppStore();
    const handleRestore = () => {
      store.dispatch("file/restoreFile", {
        id: props.fileData.id,
        onSuccess: () => {
          $q.notify({
            type: "positive",
            message: "Khôi phục thành công",
            position: "top",
            timeout: 500,
          });
          store.commit("file/setReloadToTrue");
        },
        onFailure: (error: any) => {
          $q.notify({
            type: "negative",
            message: error,
            position: "top",
            timeout: 5000,
          });
        },
      });
    };
    return { handleRestore };
  },
});
</script>
<style lang="scss" scoped>
.container {
  max-width: 100%;
  width: 50vw;
  border-radius: 2px;
  .content {
    color: #474747;
    font-weight: 400;
  }
  .btn--delete {
    background-color: #e57470;
    color: #fff;
  }
  .btn--cancel {
    background: #fff;
    color: #474747;
    border: 1px solid #efefef;
  }
  .q-btn--outline::before {
    border-color: #e8e9ed;
  }
  .btn--close {
    color: #b4b4b4 !important;
    float: right;
    padding: 0;
  }
}
</style>
