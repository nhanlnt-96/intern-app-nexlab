<template>
  <q-card>
    <div class="q-px-md q-pt-md" style="align-items: center">
      <div class="row flex-child">
        <div class="col-1">
          <img
            style="height: 1.5rem"
            :src="require(`../../assets/${info.img}.svg`)"
            :alt="info.img"
          />
        </div>
        <div class="col-10 q-px-xs long-and-truncated">
          {{ info.fileName }}
        </div>
        <div class="">
          <q-btn
            flat
            dense
            icon="close"
            class="btn--close"
            @click="closeDetail()"
          ></q-btn>
        </div>
      </div>
    </div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="actions">Hoạt động</q-tab>
      <q-tab name="detail">Chi tiết</q-tab>
    </q-tabs>

    <q-separator></q-separator>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="actions">
        <!-- <ActionContent v-for="action in actions" :key="action.id" /> -->
      </q-tab-panel>

      <q-tab-panel name="detail">
        <!-- <DetailContent /> -->
        <div class="row">
          <div class="col-6 div--title">Chủ sở hữu</div>
          <div class="col-6 div--content row">
            <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3 col-lg-4">
              <UserAvatar :avatar-url="info.avatar" :first-name="info.firstName" />
            </div>
            <div
              class="q-pa-xs col-xs-6 col-sm-8 col-md-9 col-lg-8"
              style="margin: auto"
            >
              {{ info.userName }}
            </div>
          </div>
        </div>
        <div class="row" style="margin: 10px auto; height: 38px">
          <div class="col-6 div--title">Loại dữ liệu</div>
          <div class="col-6 div--content">
            {{ info.type }}
          </div>
        </div>
        <div class="row" style="margin: 10px auto; height: 38px">
          <div class="col-6 div--title">Lần cập nhật gần đây nhất</div>
          <div class="col-6 div--content">
            {{ info.createdAt }}
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import { get } from "lodash";
import moment from "moment";
import UserAvatar from "../UserAvatar";

const actions = [
  {
    id: 1,
    name: "Aaron alamron",
    action: "Đổi tên thư mục",
    time: "Vài giây trước"
  },
  {
    id: 2,
    name: "Aaron alamron",
    action: "Đã tải lên",
    time: "Vài giây trước"
  }
];

const detail = {
  id: 1,
  name: "Aaron alamron",
  folderType: "Thư mục",
  lastestUpdate: "Vài giây trước"
};
export default {
  name: "DetailPopup",
  components: { UserAvatar },
  emits: ["closeDetail"],
  props: {
    dataViewDetail: {
      type: Object,
      required: true
    }
  },
  setup(props, context) {
    function closeDetail() {
      context.emit("closeDetail");
    }

    const info = computed(() => {
      const type =
        props.dataViewDetail.type === "folder" ? "Thư mục" : "Tập tin";
      return {
        type: type,
        fileName: props.dataViewDetail.name,
        avatar: get(props, "dataViewDetail.User.avatarUrl"),
        createdAt: moment(props.dataViewDetail.createdAt).format(
          "HH:mm DD/MM/YYYY"
        ),
        firstName: get(props, "dataViewDetail.User.firstName"),
        userName:
          get(props, "dataViewDetail.User.lastName") +
          " " +
          get(props, "dataViewDetail.User.firstName"),
        img: props.dataViewDetail.type
      };
    });
    onMounted(() => {
      console.log("props", props.dataViewDetail);
    });
    return {
      tab: ref("actions"),
      actions,
      detail,
      closeDetail,
      info
    };
  }
};
</script>
<style lang="scss" scoped>
.row {
  font-size: 14px;

  .btn--close {
    color: rgb(210, 210, 210);
    font-size: 12px;
  }

  .col-11 {
    margin: auto;
  }
}

.q-card {
  margin-left: 10px;
  max-width: 650px;
}

.q-tabs {
  .q-tab {
    text-transform: none;
    font-weight: 0;
    font-size: 14px;
  }
}

.img__folder {
  margin-right: 5px;
}

.q-tab-panel {
  padding: 10px 10px;

  .row {
    padding: 0;
  }
}
</style>
