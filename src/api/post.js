import api from "./axios";

export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);

  return response.data.data;
};

export const createPost = async (data) => {
  const response = await api.post(`/posts`, data);

  return response.data;
};

export const getPostDetail = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data.data;
};

export const getPostComments = async (id) => {
  const response = await api.get(`/posts/${id}/comments`);

  return response.data.data;
};

export const createComment = async (data) => {
  const response = await api.post(`/comments`, data);

  return response.data;
};

export const like = async (id) => {
  const response = await api.post(`/posts/${id}/like`);

  return response.data;
};

export const dislike = async (id) => {
  const response = await api.delete(`/posts/${id}/unlike`);

  return response.data;
};
