import { Module } from "vuex";
import state, { UserStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { AppState } from "../types";

const userModule: Module<UserStateInterface, AppState> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default userModule;
