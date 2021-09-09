import { IStaffApiData } from "@model";

export interface UserStateInterface {
  allUsers: IStaffApiData[];
  isLogged: boolean;
}

function state(): UserStateInterface {
  return {
    allUsers: [],
    isLogged: false
  };
}

export default state;
