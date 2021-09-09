<template>
  <q-card class="container">
    <q-card-section style="border-radius: 2px">
      <div class="dp-flex justify-between align-items-center">
        <span style="font-weight: 600; font-size: 16px"> {{ title }} </span>
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
    <q-card-section class="col-10 ct-text-gray content" size="20px">
      <span style="word-wrap: break-word"
        >Bạn có muốn xóa "{{ $props.fileData.name }}" ?</span
      >
    </q-card-section>
    <q-card-section>
      <div class="row q-gutter-md" style="justify-content: flex-end">
        <q-btn
          style=""
          v-close-popup
          flat
          class="btn--delete"
          no-caps
          @click="hanldeDelete"
        >
          Xóa
        </q-btn>
        <q-btn v-close-popup outline class="btn--cancel" no-caps> Thoát </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { useQuasar } from "quasar";
import { useAppStore } from "src/store";
import { defineComponent, computed } from "vue";
import { get } from "lodash";
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
    const title = computed(() => {
      if (props.fileData.type === "folder") {
        return "Xóa thư mục";
      }
      return "Xóa tệp tin";
    });
    const hanldeDelete = () => {
      store.dispatch("file/deleteFile", {
        fileId: get(props, "fileData.id"),
        url: get(props, "fileData.storageUrl"),
        type: get(props, "fileData.type"),
        onSuccess: () => {
          store.commit("file/setReloadToTrue");
          $q.notify({
            type: "positive",
            message: "Xóa thành công",
            timeout: 500,
            position: "top",
          });
        },
        onFailure: (error: any) => {
          $q.notify({
            type: "negative",
            message: `Message: ${error.data.errors} (Type: ${error.data.type})`,
            timeout: 5000,
            position: "top",
          });
        },
      });
    };
    return {
      hanldeDelete,
      title,
    };
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
