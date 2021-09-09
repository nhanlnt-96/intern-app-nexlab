<template>
  <q-card class="dialog--crop-iamge">
    <q-card-section class="dialog__header--crop">
      Đổi ảnh đại diện
      <q-icon
        class="btn--close"
        color="grey"
        size="20px"
        name="close"
        v-close-popup
      />
    </q-card-section>
    <q-card-section>
      <div v-if="!isNewAvatar" style="text-align: center">
        <div>Ảnh đại diện hiện tại</div>
        <img
          :src="image"
          alt="orginalImage"
          style="width: 350px; height: 350px"
        />
      </div>

      <div v-show="isNewAvatar" id="crop-image"></div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-10" style="text-align: right">
          <q-btn :disable="!isCropped" class="btn--confirm" @click="handleCrop">
            Lưu
          </q-btn>
        </div>
        <div class="col-2" style="text-align: right; flex-direction: 'row'">
          <q-btn class="btn--confirm">
            Tải lên
            <input
              accept=".png, .jpg, .jpeg"
              label="Chọn"
              @change="upLoad"
              type="file"
              class="file-picker"
            />
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { onMounted, ref, watch } from "vue";
import Croppie from "croppie/croppie";
export default {
  name: "CropImage",
  emits: ["crop-success"],
  props: {
    imageUrl: {
      type: String,
      default:
        "https://i.pinimg.com/280x280_RS/1e/d9/41/1ed9419c783a0398efc0f5c378eb0daf.jpg",
    },
  },
  setup(props, { emit }) {
    onMounted(() => {
      crop = new Croppie(document.getElementById("crop-image"), {
        viewport: { width: 250, height: 250 },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
      });
    });
    const isNewAvatar = ref(false);
    const image = ref(props.imageUrl);
    watch(image, () => {
      if (image.value !== null) {
        crop.bind({
          url: image.value,
          orientation: 4,
        });
      }
    });
    var crop = null;
    var imageBlob = null;
    var imageCrop = null;
    var isCropped = ref(false);
    const upLoad = (e) => {
      isCropped.value = true;
      var reader,
        files = e.target.files;
      if (files.length === 0) {
        console.log("empty");
      } else {
        reader = new FileReader();
        reader.onload = (e) => {
          image.value = e.target?.result;
        };
        isNewAvatar.value = true;
        reader.readAsDataURL(files[0]);
      }
    };
    const handleCrop = () => {
      crop
        .result({ type: "blob", format: "png", circle: "false" })
        .then((blob) => {
          imageBlob = blob;
          crop
            .result({ type: "base64", format: "png", circle: "false" })
            .then((base64) => {
              imageCrop = base64;
              emit("crop-success", { imageBlob, imageCrop });
            });
        });
    };
    return { handleCrop, upLoad, isNewAvatar, image, isCropped };
  },
};
</script>
<style lang="scss">
@import "croppie";
.dialog--crop-iamge {
  height: 550px;
  width: 750px;
}
.btn--close {
  color: #b4b4b4 !important;
  float: right;
  padding: 0;
}
.btn--confirm {
  height: 30px;
  width: 70px;
  font-size: 12px;
  background: rgb(28, 42, 83);
  color: white;
  text-transform: none !important;
}
.file-picker {
  overflow: hidden;
  z-index: 2;
  height: 10px;
  opacity: 0;
  position: absolute;
  margin-top: 4px;
  height: 30px;
  width: 70px !important;
}
.dialog__header--crop {
  background: rgb(28, 42, 83);
  height: 50px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 28px;
}
</style>
