import api from "./axios";

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const getUserPosts = async (id) => {
  const response = await api.get(`/users/${id}/posts`);
  return response.data;
};

export const createPost = async (data) => {
  const response = await api.post(`/posts`, data);

  return response.data;
};
