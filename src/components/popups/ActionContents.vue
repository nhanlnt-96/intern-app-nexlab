<template>
  <div class="row">
    <div class="q-pa-xs col-xs-2 col-sm-2 col-md-2 col-lg-2">
      <q-img
        class="img__avatar"
        width="30px"
        src="https://yt3.ggpht.com/ytc/AKedOLQJdy3qZkOyik7EV9l1oi9x5QeyDk9Jd6YryCqnVA=s900-c-k-c0x00ffffff-no-rj"
      ></q-img>
    </div>
    <div class="q-pa-xs col-xs-5 col-sm-5 col-md-4 col-lg-4">
      <div class="div--username">{{ actionProp.name }}</div>
      <div style="font-size: 12px">{{ actionProp.action }}</div>
    </div>
    <div class="q-pa-xs col-xs-5 col-sm-5 col-md-4 col-lg-4 div--time">
      {{ actionProp.time }}
    </div>
  </div>
</template>
<script>
const actionProp = {
  id: 1,
  name: "Aaron alamron",
  action: "Đổi tên thư mục",
  time: "Vài giây trước",
};
export default {
  name: "ActionContent",
  // props: ["actionProp"],
  setup() {
    return {
      actionProp,
    };
  },
};
</script>
<style lang="scss" scoped>
.row {
  margin: 10px auto;
  .img__avatar {
    margin-right: auto;
    border-radius: 50px;
  }

  .div--username {
    font-weight: 600;
  }

  .div--time {
    color: rgb(200, 200, 200);
    font-size: 12px;
  }
}
</style>
