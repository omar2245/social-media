import api from "./api";

export const getUserLists = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};
