import { MutationTree } from "vuex";
import { FileStateInterface } from "./state";
import { Cookies } from "quasar";
import { IUserProfile } from "@model";

const mutation: MutationTree<FileStateInterface> = {
  getAllFilersSuccess(state, data) {
    return (state.allFiles = data);
  },
  setReloadToFalse(state) {
    state.reload = false;
  },
  setReloadToTrue(state) {
    state.reload = true;
  },
  setCurrentSubFolder(state, data) {
    state.currentSubFolder = data;
  },
  setPersonalFolderId(state, personalFolderId) {
    state.personalFolderId = personalFolderId;
  },
  setSharedFolderId(state, sharedFolderId) {
    state.sharedFolderId = sharedFolderId;
  },
  handleViewGrid(state) {
    state.isViewGrid = !state.isViewGrid;
  },
  setFileOwner(state, ownerUserId) {
    const userIsLogged: IUserProfile = Cookies.get("user_profile");
    if (userIsLogged.id === ownerUserId) {
      return state.isOwnFile = true;
    } else {
      return state.isOwnFile = false;
    }
  },
  unSetFileOwner(state) {
    return state.isOwnFile = true;
  }
};

export default mutation;
