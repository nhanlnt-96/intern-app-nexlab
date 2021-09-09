import { api } from "../boot/axios";

export const getAllUsers = async () => {
  const response = await api.get("/users?sortBy=createdAt:desc&limit=1000");
  return response.data.result.data;
};
