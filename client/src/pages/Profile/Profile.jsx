import React, { useCallback, useEffect, useState } from "react";

import {

  User,

  Mail,

  ShieldCheck,

  LogOut,

  Camera,

  Trophy,

  CheckCircle,

  Activity,

  BarChart3,

  Users,

  Calendar,

  Sparkles,

  Pencil,

  Save,

  X,

} from "lucide-react";

import API from "../../api/axios";

import { motion } from "framer-motion";

import socket from "../../socket";

import {

  ResponsiveContainer,

  BarChart,

  Bar,

  XAxis,

  YAxis,

  Tooltip,

  CartesianGrid,

} from "recharts";

const initialStats = {

  decisionsCreated: 0,

  completedDecisions: 0,

  pollsCreated: 0,

  votesCast: 0,

  communitiesJoined: 0,

  successRate: 0,

};

function Profile() {

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState(initialStats);

  const [communityData, setCommunityData] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  const [achievements, setAchievements] = useState([]);

  const [heatmap, setHeatmap] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [previewImage, setPreviewImage] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogout = useCallback(() => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.replace("/login");

  }, []);

  const fetchProfile = useCallback(async () => {

    const token = localStorage.getItem("token");

    if (!token) {

      handleLogout();

      return;

    }

    try {

      setErrorMessage("");

      // API is the shared Axios instance; its interceptor sends the token.

      // This endpoint must return the authenticated user's profile from the DB.

      const response = await API.get("/users/profile");

      const data = response.data;

      // Support the current { user: ... } response and common wrapped responses.

      const profile =

        data?.user ??

        data?.profile ??

        data?.data?.user ??

        (data?._id || data?.id || data?.email ? data : null);

      if (!profile || typeof profile !== "object") {

        throw new Error(

          "The profile API did not return a user. Check GET /users/profile on the backend."

        );

      }

      // Do not replace server data with stale localStorage profile values.

      setUser(profile);

      setStats({

        ...initialStats,

        ...(data?.stats && typeof data.stats === "object" ? data.stats : {}),

      });

      setCommunityData(Array.isArray(data?.communityData) ? data.communityData : []);

      setRecentActivities(

        Array.isArray(data?.recentActivities) ? data.recentActivities : []

      );

      setAchievements(Array.isArray(data?.achievements) ? data.achievements : []);

      setHeatmap(Array.isArray(data?.heatmap) ? data.heatmap : []);

      setPreviewImage(typeof profile.avatar === "string" ? profile.avatar : "");

      setImageFile(null);

    } catch (error) {

      console.error(

        "Profile request failed:",

        error.response?.status,

        error.response?.data || error.message

      );

      const status = error.response?.status;

      if (status === 401 || status === 403) {

        handleLogout();

        return;

      }

      setErrorMessage(

        error.response?.data?.message ||

          error.message ||

          "Unable to load your profile. Please try again."

      );

      // Never show stale or fabricated account details when the DB request fails.

      setUser(null);

    } finally {

      setLoading(false);

    }

  }, [handleLogout]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!editName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let avatar = user.avatar || "";
      if (imageFile) {
        // The backend stores avatar as a string. Send a data URL so the image
        // is persisted, rather than saving a temporary blob URL.
        avatar = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Could not read the selected photo."));
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await API.put("/users/profile", {
        name: editName.trim(),
        ...(imageFile ? { avatar } : {}),
      });
      const data = response.data;
      const updatedUser = data?.user ?? data?.profile ?? data?.data?.user ?? data?.data ?? null;

      if (updatedUser && typeof updatedUser === "object") {
        setUser((previous) => ({ ...previous, ...updatedUser }));
        setEditName(updatedUser.name || editName.trim());
        if (typeof updatedUser.avatar === "string") setPreviewImage(updatedUser.avatar);
      } else {
        // Some APIs return only a success message; refresh from the database.
        await fetchProfile();
      }

      setImageFile(null);
      setIsEditing(false);
      setSuccessMessage(data?.message || "Profile changes saved successfully.");
    } catch (error) {
      console.error("Profile update failed:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to save profile changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(user?.name || "");
    setImageFile(null);
    setPreviewImage(typeof user?.avatar === "string" ? user.avatar : "");
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {

    fetchProfile();

    const onProfileUpdated = () => {

      fetchProfile();

    };

    const onStatsUpdated = (newStats) => {

      setStats((previous) => ({ ...previous, ...newStats }));

    };

    const onActivityAdded = (activity) => {

      setRecentActivities((previous) => [activity, ...previous]);

    };

    socket.on("profileUpdated", onProfileUpdated);

    socket.on("statsUpdated", onStatsUpdated);

    socket.on("activityAdded", onActivityAdded);

    const interval = setInterval(fetchProfile, 30000);

    return () => {

      socket.off("profileUpdated", onProfileUpdated);

      socket.off("statsUpdated", onStatsUpdated);

      socket.off("activityAdded", onActivityAdded);

      clearInterval(interval);

    };

  }, [fetchProfile]);

  const handleImageChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

      setErrorMessage("Please select a valid image file.");

      return;

    }

    if (file.size > 5 * 1024 * 1024) {

      setErrorMessage("Please select an image smaller than 5 MB.");

      return;

    }

    setErrorMessage("");

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage((previous) => {

      if (previous?.startsWith("blob:")) {

        URL.revokeObjectURL(previous);

      }

      return imageUrl;

    });

  };

  // Selecting a photo only previews it. Uploading and saving it

  // requires a backend endpoint, which is not assumed here.

  useEffect(() => {

    return () => {

      if (previewImage?.startsWith("blob:")) {

        URL.revokeObjectURL(previewImage);

      }

    };

  }, [previewImage]);

  if (loading) {

    return (

      <>

        <div style={styles.loadingContainer}>

          <div className="spinner" style={styles.spinner} />

          <h2 style={{ color: "#fff", marginTop: 15 }}>

            Loading Profile...

          </h2>

        </div>

      </>

    );

  }

  if (!user) {

    return (

      <>

        <div style={styles.page}>

          <div style={styles.errorCard}>

            <h2 style={{ color: "#fff" }}>Unable to load profile</h2>

            <p style={{ color: "#cbd5e1" }}>

              {errorMessage || "Your profile could not be loaded."}

            </p>

            <div style={styles.errorActions}>

              <button

                style={styles.retryButton}

                onClick={() => {

                  setLoading(true);

                  fetchProfile();

                }}

              >

                Try Again

              </button>

              <button style={styles.logoutButton} onClick={handleLogout}>

                <LogOut size={16} />

                Logout

              </button>

            </div>

          </div>

        </div>

      </>

    );

  }

  const completion =

    [

      user.name,

      user.email,

      previewImage || user.avatar,

      user.isVerified,

    ].filter(Boolean).length * 25;

  return (

    <>

      <div style={styles.page}>

        <motion.div

          initial={{ opacity: 0, y: 15 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.4 }}

          style={styles.card}

        >

          {errorMessage && (
            <div role="alert" style={styles.errorNotice}>{errorMessage}</div>
          )}
          {successMessage && (
            <div role="status" style={styles.successNotice}>{successMessage}</div>
          )}

          {/* Profile header */}

          <div style={styles.profileHeader}>

            <div style={styles.avatarSection}>

              <div style={styles.avatarRing}>

                {previewImage ? (

                  <img

                    src={previewImage}

                    alt="Profile"

                    style={styles.profileImage}

                    onError={(e) => {

                      e.currentTarget.style.display = "none";

                      setPreviewImage("");

                    }}

                  />

                ) : (

                  <div style={styles.avatarLarge}>

                    {user.name?.charAt(0)?.toUpperCase() || "U"}

                  </div>

                )}

              </div>

              <label style={styles.uploadButton}>

                <Camera size={13} />

                Change Photo

                <input

                  type="file"

                  accept="image/*"

                  hidden

                  onChange={handleImageChange}

                />

              </label>

              {imageFile && (
                <span style={{ color: "#fbbf24", fontSize: 11 }}>
                  Photo selected — click Save Changes to apply
                </span>
              )}

            </div>

            <div style={styles.headerInfo}>

              <div style={styles.titleRow}>

                {isEditing ? (
                  <input
                    style={styles.editNameInput}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    maxLength={100}
                    aria-label="Profile name"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h1 style={styles.title}>{user.name || "User"}</h1>
                )}

                {user.isVerified && (

                  <span style={styles.verifyBadge}>

                    <CheckCircle size={13} /> Verified

                  </span>

                )}

              </div>

              <p style={styles.emailText}>{user.email || "No email available"}</p>

              <div style={styles.badges}>

                <span style={styles.roleBadge}>

                  {(user.role || "user").toUpperCase()}

                </span>

                <span style={styles.joinBadge}>

                  <Calendar size={13} />

                  Joined{" "}

                  {user.createdAt

                    ? new Date(user.createdAt).toLocaleDateString()

                    : "Unknown"}

                </span>

              </div>

            </div>

            <div style={styles.headerActions}>
              {isEditing ? (
                <form onSubmit={handleSaveProfile} style={styles.editActions}>
                  <button type="submit" style={styles.saveButton} disabled={saving}>
                    <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" style={styles.cancelButton} onClick={handleCancelEdit} disabled={saving}>
                    <X size={15} /> Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  style={styles.editButton}
                  onClick={() => { setEditName(user.name || ""); setIsEditing(true); setErrorMessage(""); setSuccessMessage(""); }}
                >
                  <Pencil size={15} /> Edit Profile
                </button>
              )}
              <motion.button

              whileHover={{ scale: 1.05 }}

              whileTap={{ scale: 0.95 }}

              style={styles.logoutButton}

              onClick={handleLogout}

            >

              <LogOut size={16} />

              Logout

              </motion.button>
            </div>

          </div>

          {/* Profile completion */}

          <div style={styles.completionContainer}>

            <div style={styles.completionHeader}>

              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>

                <Sparkles size={15} color="#38bdf8" />

                Profile Completion Strength

              </span>

              <span style={{ color: "#38bdf8", fontWeight: 700 }}>

                {completion}%

              </span>

            </div>

            <div style={styles.progressBarBg}>

              <motion.div

                initial={{ width: 0 }}

                animate={{ width: `${completion}%` }}

                transition={{ duration: 0.8, ease: "easeOut" }}

                style={styles.progressBarFill}

              />

            </div>

          </div>

          {/* Statistics */}

          <div style={styles.statsGrid}>

            <StatCard

              icon={<Trophy size={20} />}

              color="#f59e0b"

              value={stats.decisionsCreated}

              label="Decisions Created"

            />

            <StatCard

              icon={<CheckCircle size={20} />}

              color="#10b981"

              value={stats.pollsCreated}

              label="Polls Created"

            />

            <StatCard

              icon={<Activity size={20} />}

              color="#38bdf8"

              value={stats.votesCast}

              label="Votes Cast"

            />

            <StatCard

              icon={<Users size={20} />}

              color="#8b5cf6"

              value={stats.communitiesJoined}

              label="Communities Joined"

            />

            <StatCard

              icon={<Sparkles size={20} />}

              color="#ec4899"

              value={`${stats.successRate}%`}

              label="Success Rate"

            />

          </div>

          {/* Community and activity charts */}

          <div style={styles.dashboardGridTwoCol}>

            <div style={styles.sectionBox}>

              <h3 style={styles.sectionTitle}>

                <BarChart3 size={18} color="#8b5cf6" />

                Community Engagement

              </h3>

              <div style={{ width: "100%", height: 260 }}>

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={communityData}>

                    <CartesianGrid

                      stroke="#1e293b"

                      strokeDasharray="3 3"

                      vertical={false}

                    />

                    <XAxis

                      dataKey="name"

                      stroke="#64748b"

                      tick={{ fontSize: 12 }}

                    />

                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />

                    <Tooltip contentStyle={styles.tooltipStyle} />

                    <Bar

                      dataKey="members"

                      fill="#8b5cf6"

                      radius={[6, 6, 0, 0]}

                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            <div style={styles.sectionBox}>

              <h3 style={styles.sectionTitle}>

                <Activity size={18} color="#10b981" />

                Activity Heatmap

              </h3>

              <div style={styles.heatmapWrapper}>

                <p style={styles.heatmapSubText}>

                  Activity breakdown

                </p>

                <div style={styles.heatmapGridContainer}>

                  {heatmap.map((dayItem, index) => (

                    <div

                      key={dayItem.day || index}

                      style={styles.heatmapDayColumn}

                    >

                      <span style={styles.heatmapCount}>

                        {dayItem.count}

                      </span>

                      <div

                        style={{

                          ...styles.heatmapBar,

                          height: `${Math.min(

                            (Number(dayItem.count) || 0) * 18,

                            120

                          )}px`,

                        }}

                      />

                      <span style={styles.heatmapDayLabel}>

                        {dayItem.day}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* Recent activities and achievements */}

          <div style={styles.dashboardGridTwoCol}>

            <div style={styles.sectionBox}>

              <h3 style={styles.sectionTitle}>Recent Activity Timeline</h3>

              <div style={styles.timelineList}>

                {recentActivities.length ? (

                  recentActivities.map((activity, index) => (

                    <div

                      key={activity._id || index}

                      style={styles.timelineItem}

                    >

                      <div

                        style={{

                          ...styles.timelineDot,

                          background:

                            index % 2 === 0 ? "#10b981" : "#8b5cf6",

                        }}

                      />

                      <div style={styles.activityContent}>

                        <div>

                          <p style={styles.timelineText}>

                            {activity.action || "Activity"}

                          </p>

                          <span style={styles.timelineTitleSpan}>

                            {activity.title || ""}

                          </span>

                        </div>

                        <span style={styles.timelineTime}>

                          {activity.createdAt

                            ? new Date(activity.createdAt).toLocaleDateString()

                            : ""}

                        </span>

                      </div>

                    </div>

                  ))

                ) : (

                  <p style={styles.emptyText}>No recent activities yet.</p>

                )}

              </div>

            </div>

            <div style={styles.sectionBox}>

              <h3 style={styles.sectionTitle}>Achievements &amp; Badges</h3>

              <div style={styles.achievementGrid}>

                {achievements.length ? (

                  achievements.map((badge, index) => (

                    <div

                      key={badge._id || index}

                      style={styles.achievementBadge}

                    >

                      {badge.icon || "🏆"} {badge.title || "Achievement"}

                    </div>

                  ))

                ) : (

                  <p style={styles.emptyText}>No achievements yet.</p>

                )}

              </div>

            </div>

          </div>

          {/* Account information */}

          <div style={styles.sectionBox}>

            <h3 style={styles.sectionTitle}>Account Information</h3>

            <div style={styles.infoGrid}>

              <InfoBox

                icon={<User size={18} color="#8b5cf6" />}

                label="User ID"

                value={user._id || "Unavailable"}

              />

              <InfoBox

                icon={<Mail size={18} color="#38bdf8" />}

                label="Email Address"

                value={user.email || "Unavailable"}

              />

              <InfoBox

                icon={<ShieldCheck size={18} color="#34d399" />}

                label="Role"

                value={(user.role || "user").toUpperCase()}

              />

              <InfoBox

                icon={<CheckCircle size={18} color="#f59e0b" />}

                label="Verification Status"

                value={user.isVerified ? "Verified Account" : "Not Verified"}

              />

            </div>

          </div>

        </motion.div>

      </div>

    </>

  );

}

function StatCard({ icon, color, value, label }) {

  return (

    <motion.div

      whileHover={{ scale: 1.03, y: -5 }}

      style={styles.statCard}

    >

      <div

        style={{

          ...styles.statIconBg,

          background: `${color}26`,

          color,

        }}

      >

        {icon}

      </div>

      <div>

        <h2 style={styles.statNumber}>{value ?? 0}</h2>

        <p style={styles.statLabel}>{label}</p>

      </div>

    </motion.div>

  );

}

function InfoBox({ icon, label, value }) {

  return (

    <div style={styles.infoBox}>

      {icon}

      <div style={{ minWidth: 0 }}>

        <span style={styles.label}>{label}</span>

        <p style={styles.value}>{value}</p>

      </div>

    </div>

  );

}

const styles = {

  page: {

    minHeight: "100vh",

    padding: "30px 40px",

    background: "radial-gradient(circle at top left, #1e3a8a, #020617)",

    fontFamily: "Inter, sans-serif",

    display: "flex",

    justifyContent: "center",

  },

  loadingContainer: {

    textAlign: "center",

    marginTop: 100,

  },

  spinner: {

    width: 40,

    height: 40,

    border: "4px solid rgba(255,255,255,0.1)",

    borderLeftColor: "#38bdf8",

    borderRadius: "50%",

    animation: "spin 1s linear infinite",

    margin: "0 auto",

  },

  card: {

    width: "100%",

    maxWidth: 1800,

    background: "rgba(255,255,255,0.04)",

    backdropFilter: "blur(25px)",

    border: "1px solid rgba(255,255,255,0.08)",

    borderRadius: 28,

    padding: 40,

    boxShadow: "0 30px 60px rgba(0,0,0,0.6)",

  },

  errorCard: {

    width: "100%",

    maxWidth: 600,

    alignSelf: "flex-start",

    margin: "80px auto",

    padding: 32,

    background: "rgba(255,255,255,0.05)",

    border: "1px solid rgba(255,255,255,0.1)",

    borderRadius: 20,

    textAlign: "center",

  },

  errorActions: {

    display: "flex",

    justifyContent: "center",

    gap: 12,

    flexWrap: "wrap",

    marginTop: 20,

  },

  retryButton: {

    background: "#0284c7",

    border: 0,

    color: "#fff",

    padding: "10px 20px",

    borderRadius: 12,

    cursor: "pointer",

    fontWeight: 600,

  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  editActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  editButton: {
    display: "flex", alignItems: "center", gap: 7,
    background: "rgba(56,189,248,0.12)", color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.35)", borderRadius: 10,
    padding: "10px 14px", cursor: "pointer", fontWeight: 600,
  },
  saveButton: {
    display: "flex", alignItems: "center", gap: 7,
    background: "linear-gradient(135deg,#06b6d4,#6366f1)", color: "#fff",
    border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700,
  },
  cancelButton: {
    display: "flex", alignItems: "center", gap: 7,
    background: "rgba(148,163,184,0.12)", color: "#cbd5e1",
    border: "1px solid rgba(148,163,184,0.25)", borderRadius: 10,
    padding: "10px 14px", cursor: "pointer", fontWeight: 600,
  },
  editNameInput: {
    background: "rgba(15,23,42,0.7)", color: "#fff",
    border: "1px solid #38bdf8", borderRadius: 8,
    padding: "8px 10px", fontSize: 24, fontWeight: 700,
    maxWidth: "100%", width: 300,
  },
  errorNotice: {
    marginBottom: 16, padding: "12px 14px", borderRadius: 10,
    color: "#fecaca", background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  successNotice: {
    marginBottom: 16, padding: "12px 14px", borderRadius: 10,
    color: "#a7f3d0", background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.3)",
  },

  profileHeader: {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 30,

    marginBottom: 30,

    flexWrap: "wrap",

    borderBottom: "1px solid rgba(255,255,255,0.06)",

    paddingBottom: 25,

  },

  avatarSection: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    gap: 12,

  },

  avatarRing: {

    padding: 4,

    borderRadius: "50%",

    background: "linear-gradient(135deg,#06b6d4,#8b5cf6)",

    boxShadow: "0 0 20px rgba(139,92,246,0.4)",

  },

  avatarLarge: {

    width: 100,

    height: 100,

    borderRadius: "50%",

    background: "#0f172a",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: 40,

    fontWeight: "bold",

    color: "#fff",

  },

  profileImage: {

    width: 100,

    height: 100,

    borderRadius: "50%",

    objectFit: "cover",

    display: "block",

  },

  uploadButton: {

    display: "flex",

    alignItems: "center",

    gap: 6,

    background: "rgba(14,165,233,0.15)",

    border: "1px solid rgba(14,165,233,0.4)",

    color: "#38bdf8",

    padding: "6px 12px",

    borderRadius: 8,

    cursor: "pointer",

    fontSize: 11,

    fontWeight: 600,

  },

  headerInfo: {

    flex: 1,

    minWidth: 200,

  },

  titleRow: {

    display: "flex",

    alignItems: "center",

    gap: 12,

    marginBottom: 4,

    flexWrap: "wrap",

  },

  title: {

    fontSize: 32,

    color: "#fff",

    fontWeight: 700,

    margin: 0,

  },

  emailText: {

    color: "#94a3b8",

    fontSize: 15,

    marginBottom: 14,

  },

  badges: {

    display: "flex",

    gap: 10,

    flexWrap: "wrap",

    alignItems: "center",

  },

  roleBadge: {

    background: "rgba(29,78,216,0.25)",

    border: "1px solid rgba(29,78,216,0.5)",

    color: "#60a5fa",

    padding: "5px 12px",

    borderRadius: 20,

    fontSize: 11,

    fontWeight: 600,

  },

  verifyBadge: {

    background: "rgba(16,185,129,0.2)",

    border: "1px solid rgba(16,185,129,0.4)",

    color: "#34d399",

    padding: "4px 10px",

    borderRadius: 20,

    display: "flex",

    alignItems: "center",

    gap: 5,

    fontSize: 11,

    fontWeight: 600,

  },

  joinBadge: {

    background: "rgba(255,255,255,0.05)",

    border: "1px solid rgba(255,255,255,0.08)",

    color: "#cbd5e1",

    padding: "5px 12px",

    borderRadius: 20,

    display: "flex",

    alignItems: "center",

    gap: 6,

    fontSize: 11,

  },

  logoutButton: {

    background: "rgba(239,68,68,0.15)",

    border: "1px solid rgba(239,68,68,0.4)",

    color: "#f87171",

    padding: "10px 20px",

    borderRadius: 12,

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    gap: 8,

    fontWeight: 600,

    fontSize: 13,

  },

  completionContainer: {

    marginBottom: 30,

    background: "rgba(2,6,23,0.5)",

    padding: "18px 22px",

    borderRadius: 16,

    border: "1px solid rgba(255,255,255,0.06)",

  },

  completionHeader: {

    display: "flex",

    justifyContent: "space-between",

    fontSize: 14,

    color: "#cbd5e1",

    marginBottom: 10,

    gap: 10,

  },

  progressBarBg: {

    width: "100%",

    height: 10,

    background: "#1e293b",

    borderRadius: 5,

    overflow: "hidden",

  },

  progressBarFill: {

    height: "100%",

    background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",

    borderRadius: 5,

  },

  statsGrid: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

    gap: 20,

    marginBottom: 30,

  },

  statCard: {

    background: "rgba(255,255,255,0.03)",

    border: "1px solid rgba(255,255,255,0.07)",

    borderRadius: 18,

    padding: 22,

    display: "flex",

    alignItems: "center",

    gap: 16,

    color: "#fff",

  },

  statIconBg: {

    width: 48,

    height: 48,

    flexShrink: 0,

    borderRadius: 12,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

  },

  statNumber: {

    fontSize: 24,

    fontWeight: 700,

    color: "#fff",

    marginBottom: 2,

  },

  statLabel: {

    fontSize: 12,

    color: "#94a3b8",

  },

  dashboardGridTwoCol: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",

    gap: 25,

    marginBottom: 30,

  },

  sectionBox: {

    minWidth: 0,

    background: "rgba(2,6,23,0.5)",

    border: "1px solid rgba(255,255,255,0.06)",

    borderRadius: 20,

    padding: 24,

  },

  sectionTitle: {

    fontSize: 17,

    color: "#f8fafc",

    marginBottom: 18,

    display: "flex",

    alignItems: "center",

    gap: 10,

    fontWeight: 600,

  },

  heatmapWrapper: {

    display: "flex",

    flexDirection: "column",

    gap: 12,

    minHeight: 226,

    justifyContent: "center",

  },

  heatmapSubText: {

    fontSize: 12,

    color: "#64748b",

    marginBottom: 5,

  },

  heatmapGridContainer: {

    display: "flex",

    justifyContent: "space-around",

    alignItems: "flex-end",

    minHeight: 160,

    paddingTop: 10,

    gap: 5,

  },

  heatmapDayColumn: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    gap: 8,

  },

  heatmapBar: {

    width: 16,

    background: "linear-gradient(180deg,#10b981,#06b6d4)",

    borderRadius: 4,

  },

  heatmapCount: {

    fontSize: 10,

    color: "#94a3b8",

  },

  heatmapDayLabel: {

    fontSize: 12,

    color: "#cbd5e1",

    fontWeight: 600,

  },

  timelineList: {

    display: "flex",

    flexDirection: "column",

    gap: 16,

    minHeight: 100,

    maxHeight: 300,

    overflowY: "auto",

  },

  timelineItem: {

    display: "flex",

    alignItems: "center",

    gap: 14,

    fontSize: 13,

  },

  activityContent: {

    display: "flex",

    justifyContent: "space-between",

    width: "100%",

    alignItems: "center",

    gap: 10,

    minWidth: 0,

  },

  timelineDot: {

    width: 10,

    height: 10,

    flexShrink: 0,

    borderRadius: "50%",

  },

  timelineText: {

    color: "#e2e8f0",

    fontWeight: 600,

    marginBottom: 2,

  },

  timelineTitleSpan: {

    color: "#94a3b8",

    fontSize: 12,

  },

  timelineTime: {

    fontSize: 11,

    color: "#64748b",

    flexShrink: 0,

  },

  achievementGrid: {

    display: "flex",

    gap: 12,

    flexWrap: "wrap",

    minHeight: 100,

    alignContent: "center",

  },

  achievementBadge: {

    background: "rgba(139,92,246,0.12)",

    border: "1px solid rgba(139,92,246,0.3)",

    color: "#c084fc",

    padding: "10px 16px",

    borderRadius: 12,

    fontSize: 13,

    fontWeight: 600,

    display: "flex",

    alignItems: "center",

    gap: 8,

  },

  infoGrid: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

    gap: 16,

  },

  infoBox: {

    display: "flex",

    alignItems: "center",

    gap: 14,

    minWidth: 0,

    background: "rgba(15,23,42,0.7)",

    border: "1px solid rgba(255,255,255,0.05)",

    padding: 16,

    borderRadius: 14,

  },

  label: {

    fontSize: 11,

    color: "#94a3b8",

  },

  value: {

    color: "#fff",

    fontSize: 13,

    fontWeight: 600,

    marginTop: 2,

    overflowWrap: "anywhere",

  },

  emptyText: {

    color: "#94a3b8",

    fontSize: 13,

  },

  tooltipStyle: {

    background: "#0f172a",

    border: "1px solid rgba(255,255,255,0.1)",

    borderRadius: 10,

    color: "#fff",

    fontSize: 12,

    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",

  },

};

export default Profile;
