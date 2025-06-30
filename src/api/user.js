import api from "./axios";

export const getUserLists = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/user/${id}`);

  return response.data.data;
};

export const getMe = async () => {
  const response = await api.get(`/user/me`);

  return response.data.data;
};

export const getUserPosts = async (id) => {
  const response = await api.get(`/user/${id}/posts`);

  return response.data.data;
};

export const getUserFollowStat = async (id) => {
  const response = await api.get(`/user/${id}/follows/stat`);

  return response.data.data;
};

export const getUserFollower = async (id) => {
  const response = await api.get(`/user/${id}/follower`);

  return response.data.data;
};

export const getUserFollowing = async (id) => {
  const response = await api.get(`/user/${id}/following`);

  return response.data.data;
};

export const followUser = async (id) => {
  const response = await api.post(`/user/${id}/follow`);

  return response.data.data;
};
export const unfollowUser = async (id) => {
  const response = await api.delete(`/user/${id}/unfollow`);

  return response.data.data;
};

export const isFollowingUser = async (id) => {
  const response = await api.get(`/user/${id}/is_following`);

  return response.data.data;
};
