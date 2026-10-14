const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import axios from "axios";

const API = `${__DECISIONHUB_API_ORIGIN__}/api/communities`;

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getCommunities = () =>
  axios.get(API, getToken());

export const getCommunityById = (id) =>
  axios.get(`${API}/${id}`, getToken());

export const createCommunity = (data) =>
  axios.post(`${API}/create`, data, getToken());

export const joinCommunity = (id) =>
  axios.post(`${API}/${id}/join`, {}, getToken());

export const leaveCommunity = (id) =>
  axios.post(`${API}/${id}/leave`, {}, getToken());

export const deleteCommunity = (id) =>
  axios.delete(`${API}/${id}`, getToken());