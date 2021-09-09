<template>
  <!-- <div class="div--title">{{ pageName }}</div> -->
  <div class="row">
    <div class="col-10">Danh sách thư mục</div>
    <div class="col-2">
      <div class="row create-upload-btn">
        <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-12"
             style="padding-right: 0">
          <CreateUploadFileButton />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CreateUploadFileButton from "../CreateUploadFileButton.vue";

export default {
  name: "ContainerLayout",
  components: { CreateUploadFileButton }
};
</script>

<style scoped lang="scss">
.row {
  width: 100%;
  margin-bottom: 15px;
}

.create-upload-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.col-2 {
  .row {
    div {
      text-align: right;
    }
  }
}

.q-btn {
  background: rgb(210, 210, 210);
  color: rgb(150, 150, 150);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background: rgb(28, 42, 83);
    color: white;
  }
}

.col-10 {
  font-size: 21px;
  font-weight: 600;
}

.div--title {
  color: rgb(190, 190, 190);
  font-weight: 400;
  font-size: 14px;
}
</style>
