<template>
  <div style="max-width: 100%; width: 100%">
    <q-card style="max-width: 80%; width: 1250px; margin: auto">
      <q-card-section style="padding: 10px 20px !important; width: 100%">
        <div class="row">
          <div class="col-11 dialog--title">
            {{ isEdit ? "Nhân viên" : "Khởi tạo nhân viên mới" }}
          </div>
          <div class="col-1">
            <q-icon
              name="close"
              class="btn--close"
              color="grey"
              :size="'xs'"
              clickable
              v-close-popup
            >
            </q-icon>
          </div>
        </div>
      </q-card-section>
      <q-form @submit.prevent="createUser">
        <q-card-section class="input--link" style="padding: 0 20px">
          <div class="row">
            <div class="col-6">
              <div
                style="
                  font-size: 16px;
                  font-weight: bold;
                  color: rgb(35, 54, 105);
                "
              >
                Chi tiết tài khoản
              </div>
              <div class="label-title">Vai trò</div>
              <q-select
                :disable="isEdit && !isAdmin"
                lazy-rules
                :rules="[(val) => val.length >= 1 || 'Hãy chọn vai trò']"
                dense
                outlined
                options-dense
                :options="optionData.roles"
                v-model="user.role"
                emit-value
                map-options
                :size="'xs'"
                dropdown-icon="expand_more"
              >
                <template #prepend>
                  <span
                    style="font-size: 14px; color: grey"
                    v-if="user.role === ''"
                    >Select</span
                  >
                </template>
              </q-select>
              <div class="label-title">Mô tả</div>
              <q-input
                :disable="!isAdmin && !ownerInfo"
                outlined
                type="textarea"
                lazy-rules
                :rules="[(val) => !!val || 'Hãy nhập mô tả']"
                v-model="user.description"
              />
              <div class="label-title">Email</div>
              <q-input
                :disable="isEdit"
                lazy-rules
                :rules="[
                  (val) =>
                    /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}$/.test(val) ||
                    'Hãy nhập email hợp lệ',
                ]"
                v-model="user.email"
                dense
                outlined
              />
              <div class="label-title">Điện thoại</div>
              <q-input
                :disable="!isAdmin && !ownerInfo"
                lazy-rules
                :rules="[
                  (val) =>
                    /^(0)+([0-9]{9})$/.test(val) ||
                    'Hãy nhập số điện thoại( chỉ bao gồm số)',
                ]"
                v-model="user.phone"
                dense
                outlined
              />
              <div v-if="!isEdit">
                <div class="label-title">Mật khẩu</div>
                <q-input
                  :type="passwordType"
                  v-model="user.password"
                  lazy-rules
                  :rules="[
                    (val) =>
                      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(val) ||
                      'Mật khẩu phải có ít nhất 8 kí tự, bao gồm các chữ cái và số ',
                  ]"
                  dense
                  outlined
                >
                  <template #prepend>
                    <q-btn
                      @click="hidePassword"
                      dense
                      flat
                      size="xs"
                      icon="ti-eye"
                    >
                    </q-btn>
                  </template>
                </q-input>
              </div>

              <div class="label-title">Ngày gia nhập</div>
              <q-input
                :disable="!isAdmin && !ownerInfo"
                lazy-rules
                :rules="[
                  (val) =>
                    /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val) ||
                    'Hãy nhập ngày gia nhập theo mẫu dd/mm/yyyy',
                ]"
                v-model="user.onboardDate"
                dense
                outlined
              >
                <template #prepend>
                  <q-btn dense flat icon="las la-calendar">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="user.onboardDate"
                        mask="DD/MM/YYYY"
                        today-btn
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Hủy" flat v-close-popup></q-btn>
                          <q-btn label="OK" flat v-close-popup></q-btn>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </q-input>
              <div class="label-title">Trạng thái</div>
              <q-select
                :disable="!isAdmin"
                lazy-rules
                :rules="[(val) => val.length >= 1 || 'Hãy chọn trạng thái']"
                dense
                outlined
                options-dense
                :options="optionData.status"
                emit-value
                map-options
                v-model="user.status"
                :size="'xs'"
                dropdown-icon="expand_more"
              >
                <template #prepend>
                  <span
                    style="font-size: 14px; color: grey"
                    v-if="user.status === ''"
                    >Select</span
                  >
                </template>
              </q-select>
              <div v-if="isEdit">
                <div class="label-title">Siêu dữ kiện</div>
                <div class="row">
                  <div class="col-4 metadata-title">
                    <div style="border-block: 1px solid rgb(255, 255, 255)">
                      Tạo bởi
                    </div>
                    <div>Tạo lúc</div>
                    <div>Cập nhật bởi</div>
                    <div>Cập nhật lúc</div>
                  </div>
                  <div class="col-8 metadata-content">
                    <div style="border-block: 1px solid rgb(240, 240, 240)">
                      {{ superInfo.createBy }}
                    </div>
                    <div>{{ superInfo.createAt }}</div>
                    <div>{{ superInfo.updateBy }}</div>
                    <div>{{ superInfo.updateAt }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div
                style="
                  font-size: 16px;
                  font-weight: bold;
                  color: rgb(35, 54, 105);
                "
              >
                Thông tin cá nhân
              </div>
              <div class="avatar">
                <q-avatar size="90px">
                  <img :src="avatar" alt="user-avatar" />
                </q-avatar>
                <div @click="isCropImage" class="image-picker">
                  Đổi ảnh đại diện
                </div>
              </div>
              <div>
                <div class="label-title">Họ</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      reunicode.test(val.trim()) || 'Hãy nhập họ của bạn',
                  ]"
                  v-model="user.lastName"
                  dense
                  outlined
                />
                <div class="label-title">Tên</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      reunicode.test(val.trim()) || 'Hãy nhập tên của bạn',
                  ]"
                  v-model="user.firstName"
                  dense
                  outlined
                />
                <div class="label-title">CMND</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (/([0-9])$/.test(val) &&
                        (val.length === 9 || val.length === 12)) ||
                      'Hãy nhập CMND(cmnd phải là một dãy gồm 9 hoặc 12 số)',
                  ]"
                  v-model="user.cardId"
                  dense
                  outlined
                />
                <div class="label-title">Giới tính</div>
                <q-select
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[(val) => val.length >= 1 || 'Hãy nhập giới tính']"
                  dense
                  outlined
                  options-dense
                  emit-value
                  map-options
                  :options="optionData.gender"
                  v-model="user.sex"
                  :size="'xs'"
                  dropdown-icon="expand_more"
                >
                  <template #prepend>
                    <span
                      style="font-size: 14px; color: grey"
                      v-if="user.sex === ''"
                      >Select</span
                    >
                  </template>
                </q-select>
                <div class="label-title">Ngày sinh</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val) &&
                        dobValidation(val)) ||
                      'Hãy nhập ngày sinh theo mẫu dd/mm/yyyy(Ngày sinh không được lơn hơn ngày hiện tại)',
                  ]"
                  v-model="user.dob"
                  dense
                  outlined
                >
                  <template #prepend>
                    <q-btn dense flat icon="las la-calendar">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="user.dob" mask="DD/MM/YYYY" today-btn>
                          <div class="row items-center justify-end q-gutter-sm">
                            <q-btn label="Hủy" flat v-close-popup></q-btn>
                            <q-btn label="OK" flat v-close-popup></q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-btn>
                  </template>
                </q-input>
                <div class="label-title">Tôn giáo</div>
                <q-select
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) => val.length >= 1 || 'Hãy chọn tôn giáo của bạn',
                  ]"
                  dense
                  outlined
                  options-dense
                  :options="optionData.religions"
                  v-model="user.religion"
                  :size="'xs'"
                  dropdown-icon="expand_more"
                >
                  <template #prepend>
                    <span
                      style="font-size: 14px; color: grey"
                      v-if="user.religion === ''"
                      >Select</span
                    >
                  </template>
                </q-select>
                <div class="label-title">Trình độ học vấn</div>
                <q-select
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) => val.length >= 1 || 'Hãy chọn học vấn của bạn',
                  ]"
                  dense
                  outlined
                  options-dense
                  :options="optionData.education"
                  v-model="user.education"
                  :size="'xs'"
                  dropdown-icon="expand_more"
                >
                  <template #prepend>
                    <span
                      style="font-size: 14px; color: grey"
                      v-if="user.education === ''"
                      >Select</span
                    >
                  </template>
                </q-select>
                <div class="label-title">Chuyên ngành</div>
                <q-select
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) => val.length >= 1 || 'Hãy chọn chuyên ngành của bạn',
                  ]"
                  dense
                  outlined
                  options-dense
                  emit-value
                  map-options
                  :options="optionData.major"
                  v-model="user.majorIn"
                  :size="'xs'"
                  dropdown-icon="expand_more"
                >
                  <template #prepend>
                    <span
                      style="font-size: 14px; color: grey"
                      v-if="user.majorIn === ''"
                      >Select</span
                    >
                  </template>
                </q-select>
                <div class="label-title">Địa chỉ</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) => val.length >= 1 || 'Hãy nhập địa chỉ của bạn',
                  ]"
                  v-model="user.address"
                  dense
                  outlined
                />
                <div class="label-title">Quê quán</div>
                <q-input
                  :disable="!isAdmin && !ownerInfo"
                  lazy-rules
                  :rules="[
                    (val) => val.length >= 1 || 'Hãy nhập quê quán của bạn',
                  ]"
                  v-model="user.homeTown"
                  dense
                  outlined
                />
                <div class="label-title">Email nhận thông tin</div>
                <q-input
                  :disable="isEdit"
                  v-model="user.emailNotify"
                  dense
                  outlined
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-11" style="text-align: right">
              <q-btn
                v-if="isAdmin || ownerInfo"
                type="submit"
                :disabled="isCalling"
                flat
                :loading="loading"
                class="btn--confirm"
                :label="isEdit ? 'Cập nhật' : 'Khởi tạo'"
              ></q-btn>
            </div>
            <div class="col-1" style="text-align: right">
              <q-btn v-close-popup flat class="btn--cancel">{{
                isAdmin || ownerInfo ? "Hủy" : "Đóng"
              }}</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
  <q-dialog v-model="isCrop" transition-show="fade" transition-hide="fade"
    ><CropImage @crop-success="cropImage" :image-url="avatar" />
  </q-dialog>
</template>

<script lang="ts">
import { ref } from "vue";
import CropImage from "./cropImage/CropImage.vue";
import { useAppStore } from "../../store";
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import { handleValidation } from "../../mocks/formValidation";
import { optionData } from "../../mocks/optionData";
export default {
  name: "CreateUserPopup",
  emits: ["create-succeed"],
  components: { CropImage },
  props: {
    action: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
    },
    id: {
      type: String,
    },
    ownerInfo: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, context: any) {
    onMounted(() => {
      if (props.action === "edit") {
        isEdit.value = true;
        void store.dispatch("user/getUser", {
          id: props.id,
          onSuccess: (res: any) => {
            user.value = res.data.result;
            user.value.onboardDate =
              user.value.onboardDate === ""
                ? ""
                : handleValidation.handleDate(user.value.onboardDate);
            user.value.dob =
              user.value.dob === ""
                ? ""
                : handleValidation.handleDate(user.value.dob);
            getUserName(res.data.result.createdBy, "createdBy");
            superInfo.value.createAt = handleValidation.handleSuperInfoDate(
              res.data.result.createdAt
            );
            getUserName(res.data.result.updatedBy, "updatedBy");
            superInfo.value.updateAt = handleValidation.handleSuperInfoDate(
              res.data.result.updatedAt
            );
            avatar.value = res.data.result.avatarUrl;
          },
          onFailure: (err: any) => {
            console.log(err);
          },
        });
      } else {
        isEdit.value = false;
      }
    });
    const $q = useQuasar();
    const notificationMessage = ref("");
    const notificationType = ref("");
    const isEdit = ref<boolean>(false);
    const isCrop = ref<boolean>(false);
    const store = useAppStore();
    const loading = ref(false);
    const passwordType = ref("text");
    const superInfo = ref(optionData.emptySuperInfo);
    const user = ref(optionData.getEmptyInfo());
    const avatarName = ref("");
    let dissmissNotify: any = null;
    const getUserName = (userid: any, type: string) => {
      if (userid) {
        store.dispatch("user/getUser", {
          id: userid,
          onSuccess: (res: any) => {
            if (type === "createdBy") {
              superInfo.value.createBy =
                res.data.result.firstName + res.data.result.lastName;
            } else {
              superInfo.value.updateBy =
                res.data.result.firstName + res.data.result.lastName;
            }
          },
          onFailure: (err: any) => {
            console.log(err);
          },
        });
      } else {
        type === "createdBy"
          ? (superInfo.value.createBy = "Hong biết")
          : (superInfo.value.updateBy = "Chưa cập nhật");
      }
    };
    const hidePassword = () => {
      passwordType.value =
        passwordType.value === "password" ? "text" : "password";
    };
    const dobValidation = handleValidation.compareNowDate;
    const notityRenameSuccess = () => {
      if (dissmissNotify) {
        dissmissNotify();
      }
      dissmissNotify = $q.notify({
        type: notificationType.value,
        position: "top",
        message: notificationMessage.value,
      });
    };

    const cropImage = (e: any) => {
      isCrop.value = false;
      user.value.avatarUrl = e.imageBlob;
      avatar.value = e.imageCrop;
    };
    const isCalling = ref(false);
    const isCropImage = () => {
      if (props.ownerInfo || props.admin) {
        isCrop.value = !isCrop.value;
      } else {
        isCrop.value = false;
      }
    };
    const createUser = () => {
      loading.value = true;
      isCalling.value = true;
      const apiUrl = ref("");
      let userinfo = {};
      if (isEdit.value) {
        apiUrl.value = "user/updateUser";
        userinfo = {
          role: user.value.role,
          firstName: user.value.firstName.trim(),
          lastName: user.value.lastName.trim(),
          description: user.value.description,
          address: user.value.address,
          phone: user.value.phone,
          education: user.value.education,
          majorIn: user.value.majorIn,
          religion: user.value.religion,
          cardId: user.value.cardId,
          onboardDate: handleValidation.unHandleDate(user.value.onboardDate),
          dob: handleValidation.unHandleDate(user.value.dob),
          homeTown: user.value.homeTown,
          avatarUrl: user.value.avatarUrl,
        };
      } else {
        apiUrl.value = "user/createNewUser";
        userinfo = {
          ...user.value,
          firstName: user.value.firstName.trim(),
          lastName: user.value.lastName.trim(),
          onboardDate: handleValidation.unHandleDate(user.value.onboardDate),
          dob: handleValidation.unHandleDate(user.value.dob),
        };
      }
      void store.dispatch(apiUrl.value, {
        id: props.id,
        name: avatarName.value,
        userinfo: userinfo,
        onSuccess: () => {
          loading.value = false;
          isCalling.value = false;
          notificationType.value = "positive";
          notificationMessage.value = isEdit.value
            ? "Cập nhật tài khoản thành công"
            : "Tạo tài khoản thành công";
          notityRenameSuccess();
          context.emit("create-succeed");
        },
        onFailure: (err: any) => {
          loading.value = false;
          isCalling.value = false;
          notificationType.value = "negative";
          notificationMessage.value = handleValidation.getMessageError(
            err.data.errors[0]
          );
          notityRenameSuccess();
        },
      });
    };
    const avatar = ref<any>(
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    );
    return {
      checkFileType: (files: any) => {
        return files.filter(
          (file: any) =>
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        );
      },
      cropImage,
      isCrop,
      superInfo,
      hidePassword,
      passwordType,
      dobValidation,
      reunicode: handleValidation.reunicode,
      isAdmin: props.admin,
      isCropImage,
      isEdit,
      loading,
      isCalling,
      optionData,
      user,
      createUser,
      avatar,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin metadata {
  padding-block: 12px;
  font-size: 13px;
  font-weight: 900;
}
.metadata-title {
  width: 30%;

  div {
    color: #6a6f7a;
    border-bottom: 1px solid white;
    text-align: right;
    padding-right: 8px;
    @include metadata();
  }
}
.metadata-content {
  div {
    color: #212a45;
    border-bottom: 1px solid rgb(240, 240, 240);
    @include metadata();
  }
}
.image-picker {
  margin-top: 10px;
  width: 150px !important;
  text-align: center;
  cursor: pointer;
}

.icon--title {
  padding: 10px 10px;
  margin-right: 14px;
  background: rgb(28, 43, 84);
  border-radius: 50px;
}

.avatar {
  color: blue;
  display: flex;
  flex-direction: column;
  height: 170px;
  align-items: center;
  padding-top: 40px;

  input {
    width: 50px;
  }
}

.input--description {
  width: 100%;
  border: 1px solid rgb(180, 180, 180);
  height: 150px;
  border-radius: 5px;
}

.btn--confirm {
  height: 30px;
  width: 90px;
  font-size: 12px;
  background: rgb(28, 42, 83);
  color: white;
  text-transform: none !important;
}

.btn--cancel {
  width: 50px;
  font-size: 12px;
  background: rgb(240, 240, 240);
  color: rgb(180, 180, 180);
  text-transform: none !important;
}

.q-pt-none {
  margin-top: 20px;
  padding-top: 30px;
  margin-inline: 20px;
  border-top: 1px solid rgb(240, 240, 240);
}

.col-1 {
  text-align: right;
}

.dialog--title {
  padding: 10px 30px 0 10px;
  font-size: 18px;
  font-weight: bold;
  height: 70px;
  color: rgb(35, 54, 105);
}

.col-6 {
  padding: 0 10px;
}

.label-title {
  margin: 12px 0;
  font-weight: bold;
  color: rgb(35, 54, 105);
}
img {
  object-fit: cover;
  object-position: 50% 50%;
}
</style>
