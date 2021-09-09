import { ActionTree } from "vuex";
import { AppState } from "../index";
import { UserStateInterface } from "src/store/module-user/state";
import { api } from "src/boot/axios";
import { IToken, setToken } from "../../boot/cookies";
import { get } from "lodash";
import { GET_ALL_USERS_SUCCESS } from "src/store/module-user/actionTypes";
import { Cookies } from "quasar";
import { IUserProfile } from "src/model";
import moment from "moment";
import firebase from "firebase";
import { getAllUsers } from "../../services";

const actions: ActionTree<UserStateInterface, AppState> = {
  async loginApi({}, data: any) {
    try {
      const response = await api.post("/auth/login", data.account);
      data.onSuccess();
      const { id, firstName, lastName, role, avatarUrl } =
        response.data.result.user;
      const user: IUserProfile = {
        id,
        firstName,
        lastName,
        role,
        avatarUrl
      };
      const token: IToken = {
        accessToken: get(response, "data.result.tokens.access"),
        refreshToken: get(response, "data.result.tokens.refresh"),
        userProfile: user
      };
      setToken(token);

      data.router.push("/");
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async getAllUsersData({ commit }) {
    const data = await getAllUsers();
    return commit(GET_ALL_USERS_SUCCESS, data);
  },
  async searchUser({ commit }, searchKeyword) {
    const searchByUser = await api
      .get(`/users?q=${searchKeyword}&sortBy=createdAt:desc&limit=1000`)
      .then((res) => {
        return res.data.result.data;
      });
    return commit(GET_ALL_USERS_SUCCESS, searchByUser);
  },
  async createNewUser({ dispatch }, input) {
    const time = moment().format("HHMMss");
    const createUser = async () => {
      try {
        await api.post("/users", input.userinfo);
        input.onSuccess();
        dispatch("getAllUsersData");
      } catch (err) {
        input.onFailure(err.response);
      }
    };
    const typeofUrl = typeof input.userinfo.avatarUrl;
    if (typeofUrl === "object") {
      const storageRef = firebase
        .storage()
        .ref(`${time}_${input.name}`)
        .put(input.userinfo.avatarUrl);
      storageRef.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            input.userinfo.avatarUrl = url;
            return createUser();
          });
        }
      );
    } else {
      input.userinfo.avatarUrl =
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
      return createUser();
    }
  },
  async getUser({}, input) {
    try {
      const res = await api.get("/users/" + input.id);
      input.onSuccess(res);
    } catch (err) {
      input.onFailure(err.response);
    }
  },
  async updateUser({ dispatch }, input) {
    const time = moment().format("HHMMss");
    const updateuser = async () => {
      try {
        const response = await api.patch("/users/" + input.id, input.userinfo);
        void dispatch("getAllUsersData");
        const {
          id,
          firstName,
          lastName,
          role,
          avatarUrl
        } = response.data.result;
        const userUpdated: IUserProfile = {
          id,
          firstName,
          lastName,
          role,
          avatarUrl
        };
        Cookies.set("user_profile", JSON.stringify(userUpdated));
        input.onSuccess();
      } catch (err) {
        input.onFailure(err.response);
      }
    };
    const typeofUrl = typeof input.userinfo.avatarUrl;
    if (typeofUrl === "object") {
      console.log("object");
      const storageRef = firebase
        .storage()
        .ref(`${time}_${input.userinfo.avatarUrl.name}`)
        .put(input.userinfo.avatarUrl);
      storageRef.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            input.userinfo.avatarUrl = url;
            return updateuser();
          });
        }
      );
    } else {
      return updateuser();
    }
  },
  async handleVerifyEmail({}, data: any) {
    try {
      await api.post("auth/forgot-password", data.account);
      data.onSuccess();
    } catch (error) {
      data.onFailure(error.response);
    }
  },
  async handleResetPassword({}, data: any) {
    try {
      await api.post("auth/reset-password", data.account);
      data.onSuccess();
    } catch (error) {
      data.onFailure(error.response);
    }
  }
};

export default actions;
