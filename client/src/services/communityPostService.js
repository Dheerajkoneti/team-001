const __DECISIONHUB_API_ORIGIN__ = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://decisionhub-api.vercel.app/api"
).replace(/\/api\/?$/i, "");
import axios from "axios";

const API =
  `${__DECISIONHUB_API_ORIGIN__}/api/community-posts`;

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getPosts = (communityId) =>
  axios.get(
    `${API}/${communityId}/posts`,
    getToken()
  );

export const createPost = (
  communityId,
  formData
) =>
  axios.post(
    `${API}/${communityId}/post`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

export const likePost = (postId) =>
  axios.put(
    `${API}/like/${postId}`,
    {},
    getToken()
  );

export const deletePost = (postId) =>
  axios.delete(
    `${API}/${postId}`,
    getToken()
  );

export const getLeaderboard = (
  communityId
) =>
  axios.get(
    `${API}/leaderboard/${communityId}`,
    getToken()
  );

/* ==========================
   PIN POST
========================== */
export const pinPost = (postId) =>
  axios.put(
    `${API}/pin/${postId}`,
    {},
    getToken()
  );

/* ==========================
   ANNOUNCEMENT
========================== */
export const makeAnnouncement = (
  postId
) =>
  axios.put(
    `${API}/announcement/${postId}`,
    {},
    getToken()
  );

/* ==========================
   EDIT POST
========================== */
export const editPost = (postId, content) =>
  axios.put(
    `${API}/edit/${postId}`,
    { content },
    getToken()
  );