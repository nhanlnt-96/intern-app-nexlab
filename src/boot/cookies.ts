import { Cookies } from "quasar";
import { Config } from "src/shared/config";
import { api } from "./axios";
import { get } from "lodash";
import { IUserProfile } from "@model";

export interface IToken {
  accessToken: {
    token: string;
    expires: string;
  };
  refreshToken: {
    token: string;
    expires: string;
  };
  userProfile?: IUserProfile;
}
export const setToken = (token: IToken) => {
  const expireAccessToken: string = new Date(
    Date.parse(token.accessToken.expires)
  ).toString();
  const expireRefreshToken: string = new Date(
    Date.parse(token.refreshToken.expires)
  ).toString();

  Cookies.set("access_token", token.accessToken.token, {
    expires: expireAccessToken,
  });
  Cookies.set("refresh_token", token.refreshToken.token, {
    expires: expireRefreshToken,
  });
  if (token.userProfile) {
    Cookies.set("user_profile", JSON.stringify(token.userProfile), {
      expires: expireRefreshToken
    });
  } else {
    Cookies.set("user_profile", Cookies.get("user_profile"), {
      expires: expireRefreshToken
    });
  }
};

export const removeToken = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_profile");
};

export async function getRefreshToken() {
  const refreshToken: string = Cookies.get("refresh_token");
  if (refreshToken) {
    await api
      .post(Config.apiHost + "/auth/refresh-token", {
        refreshToken: refreshToken,
      })
      .then((res) => {
        const token: IToken = {
          accessToken: get(res, "data.result.tokens.access"),
          refreshToken: get(res, "data.result.tokens.refresh"),
        };
        setToken(token);
      });
  }
  // use to check : null => fail | !null => success
  return Cookies.get("access_token");
}
