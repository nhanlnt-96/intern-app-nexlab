<template>
  <div class="row">
    <div class="col-6 div--title">Chủ sở hữu</div>
    <div class="col-6 div--content row">
      <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3 col-lg-4">
        <q-img
          class="img__avatar"
          width="30px"
          src="https://yt3.ggpht.com/ytc/AKedOLQJdy3qZkOyik7EV9l1oi9x5QeyDk9Jd6YryCqnVA=s900-c-k-c0x00ffffff-no-rj"
        ></q-img>
      </div>
      <div
        class="q-pa-xs col-xs-6 col-sm-8 col-md-9 col-lg-8"
        style="margin: auto"
      >
        {{ detailProp.name }}
      </div>
    </div>
  </div>
  <div class="row" style="margin: 10px auto; height: 38px">
    <div class="col-6 div--title">Loại dữ liệu</div>
    <div class="col-6 div--content">
      {{ detailProp.folderType }}
    </div>
  </div>
  <div class="row" style="margin: 10px auto; height: 38px">
    <div class="col-6 div--title">Lần cập nhật gần đây nhất</div>
    <div class="col-6 div--content">
      {{ detailProp.lastestUpdate }}
    </div>
  </div>
</template>
<script>
const detailProp = {
  id: 1,
  name: "Aaron alamron",
  folderType: "Thư mục",
  lastestUpdate: "Vài giây trước",
};
export default {
  name: "DetailContent",
  // props: ["detailProp"],
  setup() {
    return {
      detailProp,
    };
  },
};
</script>
<style lang="scss" scoped>
.row {
  .div--title {
    color: rgb(190, 190, 190);
    font-size: 12px;
    margin: auto;
  }
  .div--content {
    text-align: right;
  }
  .img__avatar {
    margin-right: auto;
    border-radius: 50px;
  }
}

.col-6 .row {
  margin: 0;
  text-align: right;
}
</style>
