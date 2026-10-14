const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");

import axios from "axios";

const API = `${
  import.meta.env.VITE_API_BASE_URL || `${__DECISIONHUB_API_ORIGIN__}/api`
}/option-comparison`;

const getConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createComparison = (data) =>
  axios.post(API, data, getConfig());

export const getComparison = (decisionId) =>
  axios.get(
    `${API}/${encodeURIComponent(decisionId)}`,
    getConfig()
  );

export const getAllComparisons = () =>
  axios.get(API, getConfig());

export const updateComparison = (id, data) =>
  axios.put(`${API}/${id}`, data, getConfig());

export const deleteComparison = (id) =>
  axios.delete(`${API}/${id}`, getConfig());
