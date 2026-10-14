const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import axios from "axios";

const API =
`${__DECISIONHUB_API_ORIGIN__}/api/notifications`;

export const getNotifications =
() =>
axios.get(API, {
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`
  }
});

export const markAsRead =
(id) =>
axios.put(
  `${API}/${id}/read`,
  {},
  {
    headers: {
      Authorization:
      `Bearer ${localStorage.getItem("token")}`
    }
  }
);

export const deleteNotification =
(id) =>
axios.delete(
  `${API}/${id}`,
  {
    headers: {
      Authorization:
      `Bearer ${localStorage.getItem("token")}`
    }
  }
);