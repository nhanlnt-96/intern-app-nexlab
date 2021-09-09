import { Module } from "vuex";
import state, { FileStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { AppState } from "../types";

const fileModule: Module<FileStateInterface, AppState> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default fileModule;
