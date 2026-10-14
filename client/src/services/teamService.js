const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import axios from "axios";

const API =
`${__DECISIONHUB_API_ORIGIN__}/api`;

const getToken = () =>
localStorage.getItem("token");

export const getTeams = () =>
  axios.get(`${API}/teams`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

export const getTeamById = (id) =>
  axios.get(`${API}/teams/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

export const createTeam = (data) =>
  axios.post(
    `${API}/teams/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const joinTeam = (id) =>
  axios.put(
    `${API}/teams/${id}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const leaveTeam = (id) =>
  axios.put(
    `${API}/teams/${id}/leave`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const getMessages = (teamId) =>
  axios.get(
    `${API}/team-chat/${teamId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const sendMessage = (
  teamId,
  message
) =>
  axios.post(
    `${API}/team-chat/${teamId}/send`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );