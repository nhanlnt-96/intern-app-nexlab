import { UserStateInterface } from "src/store/module-user/state";
import { FileStateInterface } from "./module-file/state";

export interface AppState {
  user: UserStateInterface;
  file: FileStateInterface;
}
