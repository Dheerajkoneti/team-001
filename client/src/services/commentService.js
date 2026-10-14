const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import axios from "axios";

const API = `${__DECISIONHUB_API_ORIGIN__}/api/comments`;

export const getComments = (pollId) =>
  axios.get(`${API}/${pollId}`);

export const addComment = (data) =>
  axios.post(`${API}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const updateComment = (id, text) =>
  axios.put(
    `${API}/${id}`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

export const deleteComment = (id) =>
  axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });