import { MutationTree } from "vuex";
import { UserStateInterface } from "./state";
import { Cookies } from "quasar";
import { IStaffApiData } from "@model";

const mutation: MutationTree<UserStateInterface> = {
  getAllUsersSuccess(state, data) {
    return (state.allUsers = data);
  },
  getUserAuth(state) {
    const userIsLogged: IStaffApiData = Cookies.get("user_profile");
    return userIsLogged ? state.isLogged = true : state.isLogged = false;
  }
};

export default mutation;
